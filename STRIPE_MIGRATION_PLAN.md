# Polar → Stripe Migration Plan

## Prerequisites

- [ ] Create Stripe account and get API keys (test + live)
- [ ] Create a Stripe Product + Price matching your Pro plan
- [ ] Set up Stripe webhook endpoint in Stripe Dashboard
- [ ] Install Stripe SDK: `npm install stripe`

## Environment Variables

Replace in `.env.local`:

```env
# Remove these
POLAR_ACCESS_TOKEN=...
POLAR_WEBHOOK_SECRET=...
NEXT_PUBLIC_POLAR_PRODUCT_ID=...
POLAR_API_URL=...

# Add these
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...
```

---

## Step 1: Update `lib/billing.ts` (single file change)

This is the only file that contains Polar API calls. Rewrite its internals to use Stripe:

### `createCheckoutUrl(userId, email)`

```ts
import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createCheckoutUrl(userId: string, email: string): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
    line_items: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    metadata: { user_id: userId },
  })
  return session.url!
}
```

### `cancelSubscription(subscriptionId)`

```ts
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
}
```

### `getInvoices(customerId)`

```ts
export async function getInvoices(customerId: string): Promise<Invoice[]> {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit: 50,
  })
  return invoices.data.map((inv) => ({
    id: inv.id,
    created_at: new Date(inv.created * 1000).toISOString(),
    amount: inv.amount_paid,
    currency: inv.currency,
    status: inv.status ?? "unknown",
    billing_reason: inv.billing_reason ?? "",
  }))
}
```

### `validateWebhookEvent(body, headers)`

```ts
export function validateWebhookEvent(body: string, headers: Record<string, string>): BillingEvent {
  const sig = headers["stripe-signature"]
  const secret = process.env.STRIPE_WEBHOOK_SECRET!
  const event = stripe.webhooks.constructEvent(body, sig, secret)

  // Map Stripe events → BillingEvent
  switch (event.type) {
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription
      const status = sub.status // "active", "past_due", "canceled", "unpaid"
      return {
        type: status === "active" ? "subscription.active"
            : status === "past_due" ? "subscription.past_due"
            : "subscription.canceled",
        subscriptionId: sub.id,
        customerId: sub.customer as string,
        metadata: sub.metadata as Record<string, string>,
      }
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      return {
        type: "subscription.revoked",
        subscriptionId: sub.id,
        customerId: sub.customer as string,
        metadata: sub.metadata as Record<string, string>,
      }
    }
    case "invoice.paid": {
      const inv = event.data.object as Stripe.Invoice
      return {
        type: "subscription.active",
        subscriptionId: inv.subscription as string,
        customerId: inv.customer as string,
        metadata: {},
        // Store invoice data for local copy
        invoiceData: {
          provider_invoice_id: inv.id,
          amount: inv.amount_paid,
          currency: inv.currency,
          billing_reason: inv.billing_reason ?? "subscription_cycle",
        },
      }
    }
    default:
      throw new Error(`Unhandled event: ${event.type}`)
  }
}
```

### Remove

- `@polar-sh/sdk` import
- All `POLAR_*` env references
- `WebhookVerificationError` import from Polar

---

## Step 2: Add Stripe webhook route

Create `app/api/webhooks/stripe/route.ts` — copy the logic from `app/api/webhooks/polar/route.ts` (it already uses the abstracted `validateWebhookEvent`). The only change is the route path.

Then update Stripe Dashboard webhook URL to point to `https://yourdomain.com/api/webhooks/stripe`.

Keep the old `app/api/webhooks/polar/route.ts` alive during the transition period (see Step 4).

---

## Step 3: Migrate existing users (zero downtime, no double charges)

### Core principle: Users must NEVER lose access or pay twice

The migration follows a strict rule: **a user's Polar subscription runs until it naturally ends, then they seamlessly move to Stripe with free days to bridge the gap.** At no point does a user lose Pro access or get charged on both platforms.

### How it works (step by step)

#### Phase A: Prepare (before touching anything)

1. **Get a list of all active Polar subscribers and their next billing date:**
   ```sql
   SELECT id, email, billing_subscription_id, subscription_status
   FROM profiles
   WHERE subscription_status IN ('active', 'past_due')
   AND billing_subscription_id IS NOT NULL;
   ```
2. **For each user, check their Polar billing cycle end date** via Polar API — note when each subscription renews next. This tells you exactly when each user's Polar access ends.

#### Phase B: Cut off new Polar charges (no one gets double-billed)

3. **Cancel ALL Polar subscriptions at period end** — this is critical. Every active Polar sub gets `cancel_at_period_end: true`. This means:
   - Users keep full access until their current paid period ends
   - Polar will NOT charge them again
   - When the period ends, Polar fires `subscription.revoked` → your webhook sets them to "expired"
   ```
   For each user:
     PATCH https://api.polar.sh/v1/subscriptions/{billing_subscription_id}
     Body: { "cancel_at_period_end": true }
   ```

4. **Switch `lib/billing.ts` to Stripe** — from this moment, the "Subscribe" button creates a Stripe checkout instead of Polar.

5. **Deploy with both webhook routes running:**
   - `/api/webhooks/polar` — still handles Polar's `subscription.revoked` events as subs expire
   - `/api/webhooks/stripe` — handles new Stripe subscriptions

#### Phase C: Bridge the gap (users never lose access)

6. **When a Polar sub expires**, the user's status becomes "expired". But instead of cutting them off immediately, **grant them a free bridge period** so they have time to re-subscribe on Stripe without losing a single day of access:
   ```sql
   -- Run this right after canceling all Polar subs (or do it in the webhook handler)
   -- Give users 14 days of free access after their Polar sub ends
   -- This runs ONCE, not repeatedly
   UPDATE profiles
   SET subscription_status = 'trialing',
       trial_ends_at = trial_ends_at_value  -- set to: Polar period end + 14 days
   WHERE subscription_status = 'expired'
   AND billing_subscription_id NOT LIKE 'sub_%';
   ```

   Or better — handle it automatically in the Polar webhook handler. When `subscription.revoked` fires:
   ```ts
   // Instead of setting status to "expired", give them a bridge period
   await supabase.from("profiles").update({
     subscription_status: "trialing",
     trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
   }).eq("billing_subscription_id", subId)
   ```

7. **Show a migration banner** in the dashboard for users in this bridge period:
   > "We've upgraded our payment system. Your access continues — please update your payment method to keep your Pro plan."
   > [Update Payment Method] → opens Stripe checkout

8. **Send an email** to each migrating user explaining:
   - "We moved to a new payment provider for better service"
   - "Your current subscription is active until [date]"
   - "You have 14 extra days to update your payment — you won't be charged twice"
   - "Click here to update: [Stripe checkout link]"

#### Phase D: Track progress

9. **Monitor who has migrated and who hasn't:**
   ```sql
   -- Already on Stripe (migrated successfully)
   SELECT count(*) FROM profiles
   WHERE subscription_status = 'active'
   AND billing_subscription_id LIKE 'sub_%';

   -- Still in bridge period (needs to re-subscribe)
   SELECT count(*) FROM profiles
   WHERE subscription_status = 'trialing'
   AND billing_subscription_id NOT LIKE 'sub_%';

   -- Bridge expired (lost access — follow up with these users)
   SELECT id, email FROM profiles
   WHERE subscription_status = 'expired'
   AND billing_subscription_id NOT LIKE 'sub_%';
   ```

10. **For users whose bridge period is about to expire**, send a reminder email 3 days before.

11. **For users whose bridge expired**, send a final email with a direct Stripe checkout link. Consider extending their bridge if they respond.

### What happens from the user's perspective

| Day | What the user sees |
|-----|-------------------|
| Day 0 | Nothing changes. Pro access works normally. |
| Day X (Polar period ends) | Still has Pro access (bridge period started). Sees a banner asking to update payment. Gets an email. |
| Day X+1 to X+14 | Full Pro access continues. Banner remains. |
| User clicks "Update Payment" | Stripe checkout opens. They pay. Seamless transition. Banner disappears. |
| Day X+14 (if they didn't act) | Bridge expires. Access downgrades to free. They can re-subscribe anytime via Stripe. |

### Safety guarantees

- **No double billing**: Polar subs are canceled at period end BEFORE Stripe goes live. A user cannot be charged on both platforms simultaneously.
- **No access gap**: The bridge period (14 days of free trialing) starts the moment their Polar sub ends. They keep Pro access the entire time.
- **No data loss**: Local `billing_invoices` table has their Polar payment history. Stripe invoices are stored going forward.
- **Automatic ID update**: When a user subscribes via Stripe, the webhook overwrites `billing_customer_id` and `billing_subscription_id` with Stripe IDs. No manual DB work needed.

---

## Step 4: Transition period checklist

During the period where both Polar and Stripe are active:

- [ ] All Polar subs canceled at period end (no future Polar charges)
- [ ] `lib/billing.ts` → points to Stripe (new checkouts go to Stripe)
- [ ] `app/api/webhooks/polar/route.ts` → still running (handles Polar expiry events + grants bridge period)
- [ ] `app/api/webhooks/stripe/route.ts` → new route (handles new Stripe subs)
- [ ] Both webhook routes write to the same `profiles` table columns
- [ ] Migration banner shown to users in bridge period
- [ ] Emails sent to all migrating users with Stripe checkout link
- [ ] Reminder emails scheduled for 3 days before bridge expiry
- [ ] Monitor daily: `SELECT subscription_status, count(*) FROM profiles GROUP BY 1;`

---

## Step 5: Cleanup (after all users migrated to Stripe or bridge expired)

- [ ] Delete `app/api/webhooks/polar/route.ts`
- [ ] Remove `@polar-sh/sdk` from `package.json`
- [ ] Remove `POLAR_*` env vars from `.env.local` and `.env.example`
- [ ] Update `CLAUDE.md` to reference Stripe instead of Polar
- [ ] Remove Polar webhook from Polar Dashboard

---

## Files that change

| File | Action |
|------|--------|
| `lib/billing.ts` | Rewrite internals (Polar → Stripe) |
| `app/api/webhooks/stripe/route.ts` | New file (copy from polar route) |
| `app/api/webhooks/polar/route.ts` | Keep during transition, delete after |
| `.env.local` / `.env.example` | Swap env vars |
| `package.json` | Add `stripe`, eventually remove `@polar-sh/sdk` |
| `CLAUDE.md` | Update docs |

## Files that DON'T change

| File | Why |
|------|-----|
| `app/api/checkout/route.ts` | Uses `createCheckoutUrl()` — already abstracted |
| `app/api/subscription/cancel/route.ts` | Uses `cancelSubscription()` — already abstracted |
| `app/api/billing/invoices/route.ts` | Uses `getInvoices()` — already abstracted |
| `lib/subscription.ts` | Provider-agnostic |
| `lib/check-limit.ts` | Provider-agnostic |
| `components/dashboard/billing-section.tsx` | Calls API routes only |
| `supabase/migrations/001_initial_schema.sql` | Columns are already provider-agnostic |

---

## Timeline estimate

| Phase | Duration |
|-------|----------|
| Set up Stripe + rewrite `lib/billing.ts` | 1 session |
| Test with Stripe test mode | 1–2 days |
| Cancel all Polar subs at period end | 1 hour |
| Go live + send migration emails | Same day |
| Bridge period (users migrate at their pace) | 2–6 weeks |
| Follow up with remaining users | 1 week |
| Cleanup (remove Polar code) | 1 session |
