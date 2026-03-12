# Open Up Payment Method Foundation

## Context
Payment is hardcoded to COD-only everywhere. We want to remove the rigid locks so a store can support multiple payment methods in the future. No UI changes, no specific gateway — just open the constraints and plumbing. Behavior stays identical (COD default everywhere).

This plan is safe to execute at any time — with 0 users or millions of orders. All changes are backwards-compatible.

## Changes

### 1. Database Schema — `supabase/migrations/001_initial_schema.sql`

- **`stores.payment_methods`** (line 26): Remove strict CHECK, keep default:
  ```sql
  payment_methods TEXT[] DEFAULT '{cod}'
  ```

- **`orders.payment_method`** (line 158): Remove COD-only CHECK, keep default:
  ```sql
  payment_method TEXT NOT NULL DEFAULT 'cod'
  ```

- **Add `payment_status` column** to `orders` (after `payment_method`):
  ```sql
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','failed','refunded'))
  ```

- **`handle_order_created` trigger** (~line 727): Add to payload:
  ```sql
  'payment_method', NEW.payment_method,
  'payment_status', NEW.payment_status
  ```

- **Provide ALTER SQL block** for user to run on live DB.

### 2. Zod Validations

- **`lib/validations/order.ts`** line 9: `z.literal("cod")` → `z.string().default("cod")`
- **`lib/validations/store.ts`** line 14: `z.array(z.literal("cod"))` → `z.array(z.string()).default(["cod"])`

### 3. Store Form Type — `components/forms/store-form.tsx`

- **Line 36**: Change type from `("cod")[]` to `string[]` to match the opened Zod schema. No UI change — just the TypeScript type.

### 4. Order API — `app/api/orders/route.ts`

- **Line 82**: Add `payment_methods` to the store select query
- Accept `payment_method` from request body, default to `"cod"`
- Validate the submitted method exists in the store's `payment_methods` array → 400 if not
- **Line 390**: Use the submitted method instead of hardcoded `"cod"`
- Set `payment_status: "unpaid"` on insert

### 5. Order Confirmation — `app/(storefront)/[slug]/order-confirmed/page.tsx`

- **Line 33**: Add `payment_status` to `ORDER_FIELDS` select string

### 6. Integration EventPayload Types

Add `payment_method?: string` and `payment_status?: string` to EventPayload in:
- `lib/integrations/apps/whatsapp.ts`
- `lib/integrations/apps/meta-capi.ts`
- `lib/integrations/apps/tiktok-eapi.ts`
- `lib/integrations/apps/google-sheets.ts` — also add to `AVAILABLE_FIELDS` array and `getOrderFieldValue` switch

### 7. Dashboard Orders — `components/dashboard/orders-table.tsx`

- **Line 20**: Add `payment_method?: string` and `payment_status?: string` to the Order interface so the data is typed even if not displayed yet

### 8. Orders List API — `app/api/orders/list/route.ts`

- **Line 35**: Add `payment_method, payment_status` to the SELECT fields

## NOT Changing (intentional)
- **Checkout UI** — no payment selector, still sends `"cod"`
- **Dashboard UI** — no new columns/badges displayed
- **WhatsApp `cod_confirmation_enabled`** — leave as-is, rename later when adding a gateway
- **Abandoned checkouts** — don't track payment method yet (only matters when there's a selector)
- **Store settings UI** — no multi-payment selector yet

## Files to Modify
1. `supabase/migrations/001_initial_schema.sql`
2. `lib/validations/order.ts`
3. `lib/validations/store.ts`
4. `components/forms/store-form.tsx` (type only)
5. `app/api/orders/route.ts`
6. `app/(storefront)/[slug]/order-confirmed/page.tsx`
7. `lib/integrations/apps/whatsapp.ts`
8. `lib/integrations/apps/meta-capi.ts`
9. `lib/integrations/apps/tiktok-eapi.ts`
10. `lib/integrations/apps/google-sheets.ts`
11. `components/dashboard/orders-table.tsx`
12. `app/api/orders/list/route.ts`

## Verification
- `npm run build` passes
- Place a test COD order — works identically
- New orders have `payment_method: "cod"` and `payment_status: "unpaid"` in DB
