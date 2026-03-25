# Infobip Integration Plan — Fake Order Prevention

## Goal

Verify customer phone numbers at checkout using Infobip Flash Call (missed call) + SMS OTP fallback to eliminate fake COD orders.

## Architecture

- **Platform-level**: Infobip API credentials stored as environment variables (`INFOBIP_API_KEY`, `INFOBIP_BASE_URL`). Not per-store.
- **Store-level**: Merchants toggle verification methods from the **Preferences** tab in the Design Builder (where CAPTCHA already lives).
- **Flat config keys**: `requireFlashCall`, `requireSmsOtp` alongside existing `requireCaptcha` in `design_settings`.

## Store Settings (flat keys in `stores.design_settings`)

```json
{
  "requireCaptcha": true,
  "requireFlashCall": false,
  "requireSmsOtp": false
}
```

---

## Verification Flow

```
Customer clicks submit → handleSubmit intercepts (before captcha)
  → if requireFlashCall or requireSmsOtp → open verification sheet
  → POST /api/verify-phone (Flash Call or SMS OTP)
  → Customer enters code → POST /api/verify-phone/confirm → token stored in state
  → sheet closes → handleSubmit resumes → captcha (if enabled) → POST /api/orders with verification_token
```

---

## Phase 1: Core Client + Database Schema

| Action | File | Description |
|--------|------|-------------|
| CREATE | `lib/integrations/infobip/client.ts` | HTTP client: `sendFlashCall(phone)`, `sendSmsOtp(phone, code)` using env vars. Imports `normalizePhone()` from `lib/integrations/apps/whatsapp.ts` (already exported there, shared with WhatsApp handler) |
| CREATE | `lib/integrations/infobip/verification.ts` | `initiateVerification()`, `confirmVerification()`, `generateVerificationToken()`, `validateVerificationToken()` |
| MODIFY | `supabase/migrations/001_initial_schema.sql` | Add `phone_verifications` table |

### phone_verifications Table

```sql
CREATE TABLE phone_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('flash_call', 'sms_otp')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'expired')),
  attempts INT DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE phone_verifications ENABLE ROW LEVEL SECURITY;
-- No user-facing policies — accessed only via service role (admin client) in API routes

CREATE INDEX idx_phone_verifications_lookup ON phone_verifications (store_id, phone, status);

-- Cleanup: delete expired/verified rows older than 24 hours (run via pg_cron daily)
-- SELECT cron.schedule('cleanup-phone-verifications', '0 3 * * *',
--   $$DELETE FROM phone_verifications WHERE created_at < now() - interval '24 hours'$$
-- );
```

### ALTER SQL (run in Supabase SQL Editor)

```sql
CREATE TABLE phone_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('flash_call', 'sms_otp')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'expired')),
  attempts INT DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE phone_verifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_phone_verifications_lookup ON phone_verifications (store_id, phone, status);

SELECT cron.schedule('cleanup-phone-verifications', '0 3 * * *',
  $$DELETE FROM phone_verifications WHERE created_at < now() - interval '24 hours'$$
);
```

---

## Phase 2: Verification API

| Action | File | Description |
|--------|------|-------------|
| CREATE | `app/api/verify-phone/route.ts` | `POST`: initiate flash call or SMS OTP based on store's `design_settings` (rate-limited: 3/phone/10min). Uses admin client (service role) for `phone_verifications` table. |
| CREATE | `app/api/verify-phone/confirm/route.ts` | `POST`: confirm code, return signed verification token. Uses admin client. |

### API: POST /api/verify-phone

**Request:**
```json
{ "slug": "my-store", "phone": "+213555123456" }
```

**Response:**
```json
{ "method": "flash_call", "expires_in": 120 }
```

Logic:
1. Look up store by slug, read `design_settings` for `requireFlashCall` / `requireSmsOtp`
2. Rate limit: count recent rows in `phone_verifications` for this phone + store (max 3 per 10 min)
3. If `requireFlashCall` → try flash call first via `sendFlashCall()`
4. If flash call fails and `requireSmsOtp` → fallback to SMS OTP via `sendSmsOtp()`
5. If only `requireSmsOtp` → send SMS OTP directly
6. Insert row into `phone_verifications` with code_hash and expiry (2 min)

### API: POST /api/verify-phone/confirm

**Request:**
```json
{ "slug": "my-store", "phone": "+213555123456", "code": "1234" }
```

**Response:**
```json
{ "verified": true, "token": "signed-hmac-token" }
```

Logic:
1. Look up pending `phone_verifications` row for this phone + store
2. Increment `attempts`, check max 5
3. Hash submitted code and compare with `code_hash`
4. If match → set status to `verified`, return HMAC token (signed with store_id + phone + timestamp)
5. If no match → return error, if attempts >= 5 → set status to `expired`

---

## Phase 3: Checkout Integration

| Action | File | Description |
|--------|------|-------------|
| INSTALL | `vaul` npm package | Dependency for shadcn Drawer component |
| CREATE | `components/ui/drawer.tsx` | Install shadcn Drawer component (requires `vaul` npm package) |
| CREATE | `components/store/phone-verification-sheet.tsx` | Bottom sheet (mobile) / dialog (desktop) with OTP input |
| MODIFY | `app/(storefront)/[slug]/cart/page.tsx` | Intercept handleSubmit: if phone not verified and verification required → open sheet instead of proceeding. After verification → resume submit with token. Add `verification_token` to POST /api/orders body. |
| MODIFY | `app/api/orders/route.ts` | After existing captcha check (line 97), add verification token validation using same `ds` variable pattern: `const requireFlashCall = typeof ds.requireFlashCall === "boolean" ? ds.requireFlashCall : false` |

### UX: Bottom Sheet only (storefront is mobile-first)

The storefront renders inside a `DesktopPhoneFrame` on desktop when `mobileOnly` is true (common case). Even when `mobileOnly` is false, the storefront is mobile-first (320px+). Therefore: **always use Drawer (bottom sheet)**, not Dialog. Simpler code, consistent UX.

```
┌──────────────────────────────┐
│  [Checkout form — dimmed]     │
│                               │
├───────────────────────────────┤  ← Bottom sheet slides up
│                               │
│  Verify your phone number     │
│  Code sent to +213 5**XX      │
│  [Change number]              │
│                               │
│  [ 1 ] [ 2 ] [ _ ] [ _ ]     │
│                               │
│  Resend code in 0:45          │
│                               │
│  ─── or ───                   │
│  Try via SMS instead          │  ← shown during flash call
│                               │
└───────────────────────────────┘
```

### OTP Input Spec

- **4 digits** — sufficient for COD fake-order prevention
- **Segmented boxes**: one input per digit, `inputmode="numeric"`, `pattern="[0-9]"`
- **Auto-focus** first box on mount, auto-advance on input, backspace goes to previous
- **Auto-submit** when all 4 digits filled (no manual "Verify" button needed, show one as fallback)
- **Auto-fill**: `autocomplete="one-time-code"` for iOS, Web OTP API for Android auto-read from SMS
- **SMS format** for Web OTP API: `Your verification code is 1234\n\n@leadivo.app #1234`

### Cart Page handleSubmit Modification

Current flow (lines 390-441 in cart/page.tsx):
```
handleSubmit → validate fields → captcha → POST /api/orders
```

New flow:
```
handleSubmit → validate fields → check if verification needed & not yet verified
  → YES: open sheet, return early (don't proceed to captcha/order)
  → NO (already verified or not required): captcha → POST /api/orders with verification_token
```

Key: verification happens BEFORE captcha. The `verificationToken` is stored in a `useRef` so it persists across the sheet open/close cycle. After the sheet closes on success, `handleSubmit` is re-triggered automatically with the token available.

### Orders API Modification

Insert after line 97 in `app/api/orders/route.ts`, following the exact captcha pattern:
```typescript
const requireFlashCall = typeof ds.requireFlashCall === "boolean" ? ds.requireFlashCall : false
const requireSmsOtp = typeof ds.requireSmsOtp === "boolean" ? ds.requireSmsOtp : false
if ((requireFlashCall || requireSmsOtp) && (!verification_token || !(await validateVerificationToken(verification_token, customer_phone, store.id)))) {
  return NextResponse.json({ error: "Phone verification required" }, { status: 400 })
}
```

### Verification Flow States

1. **Phone filled + submit clicked** → sheet opens, request sent to `/api/verify-phone`
2. **Waiting for call** (flash call) → "You'll receive a missed call. Enter the last 4 digits of the calling number." + spinner + "Try via SMS instead" link
3. **Waiting for code** (SMS OTP) → "Enter the code sent to your phone." + 60s countdown timer
4. **Auto-fallback** → if flash call doesn't connect in 30s, auto-switch to SMS OTP (if enabled)
5. **Code entered** → auto-submit, validate via `/api/verify-phone/confirm`
6. **Success** → checkmark animation, sheet auto-closes after 800ms, order submits automatically
7. **Failure** → shake input boxes, "Invalid code. Try again." Focus returns to first box
8. **Expired** → "Code expired." + "Resend" button
9. **Too many attempts** → "Too many attempts. Try again in a few minutes." Sheet closes

### Resend Rules

- **60-second countdown** before resend is available (MENA SMS delivery can lag)
- **Max 3 resends** per session, then "Too many attempts"
- Resend resets the countdown timer
- User can switch method (flash call ↔ SMS) on resend if both are enabled

---

## Phase 4: Dashboard — Preferences Tab Update

| Action | File | Description |
|--------|------|-------------|
| MODIFY | `components/dashboard/design-controls.tsx` | Add Flash Call and SMS OTP toggles after `requireCaptcha` toggle (line 1058), before `mobileOnly` toggle (line 1060). Follow exact same pattern: `<Switch checked={state.requireFlashCall} onCheckedChange={(v) => onChange({ requireFlashCall: v })} />` |
| MODIFY | `lib/utils.ts` | Add to `parseDesignSettings()` following existing pattern (line ~123): `requireFlashCall: typeof raw.requireFlashCall === "boolean" ? raw.requireFlashCall : false` |
| MODIFY | `lib/store/store-config.tsx` | Add `requireFlashCall: boolean` and `requireSmsOtp: boolean` to `StoreConfig` interface (after `requireCaptcha` on line 16) |
| MODIFY | `app/(storefront)/[slug]/layout.tsx` | Add to StoreConfigProvider config object (after line 268): `requireFlashCall: ds.requireFlashCall === true, requireSmsOtp: ds.requireSmsOtp === true` |
| MODIFY | `components/dashboard/design-preview.tsx` | Add `requireFlashCall: boolean` and `requireSmsOtp: boolean` to `DesignState` interface |

### Preferences Tab Additions (between CAPTCHA and mobileOnly toggles)

Follow exact pattern from `requireCaptcha` (lines 1048-1058):

- **Flash Call Verification** — toggle `requireFlashCall`
  - Label: `t("design.requireFlashCall")`
  - Hint: `t("design.requireFlashCallHint")`
- **SMS OTP Verification** — toggle `requireSmsOtp`
  - Label: `t("design.requireSmsOtp")`
  - Hint: `t("design.requireSmsOtpHint")`

---

## Phase 5: Localization + Documentation

| Action | File | Description |
|--------|------|-------------|
| MODIFY | `lib/i18n/locales/en.json`, `ar.json`, `fr.json` | Dashboard: add keys under `design` object next to existing `requireCaptcha`/`requireCaptchaHint` keys |
| MODIFY | All 20 storefront locale files | Verification UI strings under `storefront.verification` |
| MODIFY | `lib/docs/content.ts` | Add phone verification `DocArticle` under appropriate category with `faqs` array (min 2 FAQs, trilingual en/ar/fr) |
| MODIFY | `CLAUDE.md` | Add phone verification feature, `phone_verifications` model, new API endpoints, env vars |

### Translation Keys (Dashboard — en/ar/fr only, under `design` object)

```json
"requireFlashCall": "Flash call verification",
"requireFlashCallHint": "Verify phone numbers via missed call before order placement",
"requireSmsOtp": "SMS OTP verification",
"requireSmsOtpHint": "Send a one-time code via SMS to verify phone numbers"
```

### Translation Keys (Storefront — all 20 locales, under `storefront` object)

```json
"verification": {
  "calling": "We're calling your phone...",
  "enterCode": "Enter the code sent to your phone",
  "enterDigits": "Enter the last 4 digits of the calling number",
  "verified": "Phone verified",
  "resend": "Resend code",
  "expiresIn": "Expires in {seconds}s",
  "tooManyAttempts": "Too many attempts. Try again in a few minutes.",
  "invalidCode": "Invalid code. Try again.",
  "codeExpired": "Code expired.",
  "changeNumber": "Change number",
  "orTrySms": "Try via SMS instead",
  "verifyPhone": "Verify your phone number"
}
```

---

## Summary

| Phase | New Files | Modified Files |
|-------|-----------|----------------|
| 1: Core client + schema | 2 | 1 |
| 2: Verification API | 2 | 0 |
| 3: Checkout integration (+ vaul install + drawer) | 2 | 2 |
| 4: Preferences tab + config plumbing | 0 | 5 |
| 5: Localization + docs | 0 | 24 |
| **Total** | **6** | **32** |

## Environment Variables (Platform-Level)

```env
INFOBIP_API_KEY=your-api-key
INFOBIP_BASE_URL=https://xxxxx.api.infobip.com
```

## Dependencies to Install

```bash
npm install vaul
```
