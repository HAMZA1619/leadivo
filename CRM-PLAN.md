# Customer Database / Basic CRM — Implementation Plan

## Overview

Auto-build customer profiles from orders (zero manual entry). Customers are identified by phone number and appear automatically when they place orders. Store owners can tag, add notes, filter segments, export CSV, and message via WhatsApp.

**Key Decision:** Lightweight `customers` table + database trigger (not a materialized view) because:
- Materialized views can't have RLS policies (breaks Supabase pattern)
- Triggers update instantly on order insert (no stale data)
- Table supports writable fields (tags, notes)

---

## 1. Database Schema

Add to `supabase/migrations/001_initial_schema.sql`:

### Customers Table

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_phone TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_city TEXT,
  customer_country TEXT,
  customer_address TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  currency TEXT,
  total_spent DECIMAL(10,2) NOT NULL DEFAULT 0,
  order_count INTEGER NOT NULL DEFAULT 0,
  first_order_at TIMESTAMPTZ,
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(store_id, customer_phone)
);

CREATE INDEX idx_customers_store ON customers(store_id);
CREATE INDEX idx_customers_store_phone ON customers(store_id, customer_phone);
CREATE INDEX idx_customers_store_name ON customers(store_id, customer_name);
CREATE INDEX idx_customers_total_spent ON customers(store_id, total_spent DESC);
CREATE INDEX idx_customers_order_count ON customers(store_id, order_count DESC);
CREATE INDEX idx_customers_last_order ON customers(store_id, last_order_at DESC);
CREATE INDEX idx_customers_tags ON customers USING GIN(tags);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

**Functional index on orders** (for efficient customer→orders lookup using normalized phone):

```sql
CREATE INDEX idx_orders_norm_phone ON orders(store_id, (public.normalize_phone(customer_phone, customer_country)));
```

This allows the customer detail page to efficiently query orders for a customer:
```sql
SELECT * FROM orders
WHERE store_id = $1 AND public.normalize_phone(customer_phone, customer_country) = $2
ORDER BY created_at DESC;
```

Without this index, every customer→orders join would require a full table scan with function evaluation on every row.

**NOTE:** This index must be created AFTER the `normalize_phone()` function (step 3 in ALTER SQL order).

### Phone Normalization Function

Normalizes phone numbers to E.164-like format. Handles MENA formats: local (`0555...`), international (`+213...`), double-zero (`00213...`). This ensures the same customer isn't duplicated across different phone formats.

**IMPORTANT:** The `customer_country` field in the orders table stores **country names** (e.g. "Algeria", "Morocco"), not ISO codes. The normalization function must handle both formats.

```sql
CREATE OR REPLACE FUNCTION public.normalize_phone(phone TEXT, country TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  cleaned TEXT;
  -- Maps both ISO codes AND country names to dial codes
  code_map JSONB := '{
    "DZ": "213", "Algeria": "213",
    "MA": "212", "Morocco": "212",
    "TN": "216", "Tunisia": "216",
    "EG": "20",  "Egypt": "20",
    "SA": "966", "Saudi Arabia": "966",
    "AE": "971", "United Arab Emirates": "971",
    "KW": "965", "Kuwait": "965",
    "QA": "974", "Qatar": "974",
    "BH": "973", "Bahrain": "973",
    "OM": "968", "Oman": "968",
    "JO": "962", "Jordan": "962",
    "IQ": "964", "Iraq": "964",
    "LB": "961", "Lebanon": "961",
    "LY": "218", "Libya": "218",
    "SD": "249", "Sudan": "249",
    "YE": "967", "Yemen": "967",
    "TR": "90",  "Turkey": "90", "Türkiye": "90",
    "FR": "33",  "France": "33",
    "US": "1",   "United States": "1",
    "GB": "44",  "United Kingdom": "44",
    "DE": "49",  "Germany": "49",
    "ES": "34",  "Spain": "34",
    "IT": "39",  "Italy": "39",
    "NL": "31",  "Netherlands": "31",
    "PL": "48",  "Poland": "48",
    "PT": "351", "Portugal": "351",
    "SE": "46",  "Sweden": "46",
    "IN": "91",  "India": "91",
    "PK": "92",  "Pakistan": "92",
    "ID": "62",  "Indonesia": "62",
    "MY": "60",  "Malaysia": "60",
    "TH": "66",  "Thailand": "66",
    "VN": "84",  "Vietnam": "84"
  }'::JSONB;
  cc TEXT;
BEGIN
  IF phone IS NULL OR phone = '' THEN RETURN ''; END IF;

  -- Strip all non-digit characters except leading +
  cleaned := regexp_replace(phone, '[^0-9+]', '', 'g');

  -- Already has + prefix → strip + and return digits
  IF cleaned LIKE '+%' THEN
    RETURN regexp_replace(cleaned, '^\+', '');
  END IF;

  -- Starts with 00 → international format, strip 00
  IF cleaned LIKE '00%' THEN
    RETURN substring(cleaned FROM 3);
  END IF;

  -- Starts with 0 → local format, needs country code
  IF cleaned LIKE '0%' AND country IS NOT NULL THEN
    -- Try exact match first (handles both "DZ" and "Algeria")
    cc := code_map ->> country;
    -- Try uppercase (for ISO codes like "dz")
    IF cc IS NULL THEN cc := code_map ->> upper(country); END IF;
    IF cc IS NOT NULL THEN
      RETURN cc || substring(cleaned FROM 2);
    END IF;
  END IF;

  -- No leading 0 but short number with known country → might be missing country code
  -- e.g. "555123456" from Algeria should become "213555123456"
  IF length(cleaned) >= 7 AND length(cleaned) <= 10 AND country IS NOT NULL THEN
    cc := code_map ->> country;
    IF cc IS NULL THEN cc := code_map ->> upper(country); END IF;
    IF cc IS NOT NULL AND NOT cleaned LIKE (cc || '%') THEN
      RETURN cc || cleaned;
    END IF;
  END IF;

  -- Fallback: return cleaned digits as-is (already looks international)
  RETURN cleaned;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### Trigger: Auto-upsert customer on order creation

Uses `normalize_phone()` to ensure consistent phone matching. The normalized phone is stored in `customer_phone` so the unique constraint works correctly across formats.

```sql
CREATE OR REPLACE FUNCTION public.upsert_customer_from_order()
RETURNS TRIGGER AS $$
DECLARE
  norm_phone TEXT;
BEGIN
  norm_phone := public.normalize_phone(NEW.customer_phone, NEW.customer_country);

  INSERT INTO public.customers (
    store_id, customer_phone, customer_name, customer_email,
    customer_city, customer_country, customer_address,
    currency, total_spent, order_count, first_order_at, last_order_at
  ) VALUES (
    NEW.store_id, norm_phone, NEW.customer_name, NEW.customer_email,
    NEW.customer_city, NEW.customer_country, NEW.customer_address,
    NEW.currency, NEW.total, 1, NEW.created_at, NEW.created_at
  )
  ON CONFLICT (store_id, customer_phone) DO UPDATE SET
    customer_name = EXCLUDED.customer_name,
    customer_email = COALESCE(EXCLUDED.customer_email, customers.customer_email),
    customer_city = COALESCE(EXCLUDED.customer_city, customers.customer_city),
    customer_country = COALESCE(EXCLUDED.customer_country, customers.customer_country),
    customer_address = COALESCE(EXCLUDED.customer_address, customers.customer_address),
    currency = COALESCE(EXCLUDED.currency, customers.currency),
    total_spent = customers.total_spent + EXCLUDED.total_spent,
    order_count = customers.order_count + 1,
    last_order_at = GREATEST(customers.last_order_at, EXCLUDED.last_order_at),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_order_created_upsert_customer
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION public.upsert_customer_from_order();
```

### Trigger: Incremental update on order status change (cancellations/returns)

Uses O(1) incremental math instead of full SUM/COUNT recalculation. When an order transitions TO canceled/returned, subtract its total and decrement count. When transitioning FROM canceled/returned (e.g. un-canceling), add it back.

```sql
CREATE OR REPLACE FUNCTION public.update_customer_on_order_status()
RETURNS TRIGGER AS $$
DECLARE
  cancel_statuses TEXT[] := ARRAY['canceled', 'returned'];
  norm_phone TEXT;
  was_canceled BOOLEAN;
  now_canceled BOOLEAN;
BEGIN
  -- Only act when status actually changed
  IF OLD.status = NEW.status THEN RETURN NEW; END IF;

  norm_phone := public.normalize_phone(NEW.customer_phone, NEW.customer_country);
  was_canceled := OLD.status = ANY(cancel_statuses);
  now_canceled := NEW.status = ANY(cancel_statuses);

  -- No change in canceled/active state → nothing to update
  IF was_canceled = now_canceled THEN RETURN NEW; END IF;

  IF now_canceled AND NOT was_canceled THEN
    -- Order just got canceled/returned → subtract
    UPDATE public.customers SET
      total_spent = GREATEST(total_spent - NEW.total, 0),
      order_count = GREATEST(order_count - 1, 0),
      updated_at = now()
    WHERE store_id = NEW.store_id AND customer_phone = norm_phone;
  ELSIF was_canceled AND NOT now_canceled THEN
    -- Order was un-canceled (rare but possible) → add back
    UPDATE public.customers SET
      total_spent = total_spent + NEW.total,
      order_count = order_count + 1,
      updated_at = now()
    WHERE store_id = NEW.store_id AND customer_phone = norm_phone;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_order_status_update_customer
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION public.update_customer_on_order_status();
```

### RLS Policies

```sql
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own customers" ON customers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = customers.store_id AND stores.owner_id = (select auth.uid())
  ));

CREATE POLICY "Owners can update own customers" ON customers FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = customers.store_id AND stores.owner_id = (select auth.uid())
  ));
```

No INSERT or DELETE policies — inserts happen via SECURITY DEFINER trigger, customers should not be manually deleted.

### Backfill Function (one-time, for existing orders)

```sql
CREATE OR REPLACE FUNCTION public.backfill_customers()
RETURNS INTEGER AS $$
DECLARE
  row_count INTEGER;
BEGIN
  INSERT INTO public.customers (
    store_id, customer_phone, customer_name, customer_email,
    customer_city, customer_country, customer_address,
    currency, total_spent, order_count, first_order_at, last_order_at
  )
  SELECT
    store_id,
    public.normalize_phone(customer_phone, customer_country),
    (array_agg(customer_name ORDER BY created_at DESC))[1],
    (array_agg(customer_email ORDER BY created_at DESC) FILTER (WHERE customer_email IS NOT NULL))[1],
    (array_agg(customer_city ORDER BY created_at DESC) FILTER (WHERE customer_city IS NOT NULL))[1],
    (array_agg(customer_country ORDER BY created_at DESC) FILTER (WHERE customer_country IS NOT NULL AND customer_country != 'Unknown'))[1],
    (array_agg(customer_address ORDER BY created_at DESC))[1],
    (array_agg(currency ORDER BY created_at DESC) FILTER (WHERE currency IS NOT NULL))[1],
    COALESCE(SUM(total) FILTER (WHERE status NOT IN ('canceled', 'returned')), 0),
    COUNT(*) FILTER (WHERE status NOT IN ('canceled', 'returned')),
    MIN(created_at),
    MAX(created_at)
  FROM public.orders
  GROUP BY store_id, public.normalize_phone(customer_phone, customer_country)
  ON CONFLICT (store_id, customer_phone) DO NOTHING;

  GET DIAGNOSTICS row_count = ROW_COUNT;
  RETURN row_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Run once after deploying: SELECT backfill_customers();
```

### ALTER SQL for Live Database

```sql
-- Run in Supabase SQL Editor in this order:
-- 1. Create normalize_phone() function (from "Phone Normalization Function" section above)
-- 2. Create customers table + indexes (from "Customers Table" section above)
-- 3. Create functional index on orders: idx_orders_norm_phone
-- 4. Create set_updated_at trigger on customers
-- 5. Create upsert_customer_from_order() trigger function + trigger
-- 6. Create update_customer_on_order_status() trigger function + trigger
-- 7. Create RLS policies
-- 8. Create backfill_customers() function
-- 9. Run: SELECT backfill_customers();
--
-- The backfill merges existing orders into customer profiles using normalized phones.
-- Future orders auto-populate via trigger.
```

---

## 2. API Endpoints

### `GET /api/customers/list` — Paginated customer list

File: `app/api/customers/list/route.ts`

Params:
- `page` — pagination (20 per page)
- `search` — name or phone (ilike). **Phone searches must be normalized** before querying: call `normalize_phone()` server-side on the search input (strip non-digits, apply same logic) so searching "0555123456" matches the stored "213555123456". Use OR: `customer_name.ilike.%search% OR customer_phone.ilike.%normalized_search%`.
- `sort` — `total_spent` | `order_count` | `last_order_at` | `created_at` | `customer_name`
- `order` — `asc` | `desc` (default: desc)
- `country` — filter by country
- `city` — filter by city
- `tag` — filter by tag (array contains)
- `minSpent` / `maxSpent` — spent range
- `minOrders` / `maxOrders` — order count range
- `lastOrderAfter` / `lastOrderBefore` — activity window

Returns: `{ customers, hasMore }`

### `GET /api/customers/[customerId]` — Customer detail

File: `app/api/customers/[customerId]/route.ts`

Returns: customer record + their orders (joined from orders table, ordered by created_at DESC)

### `PATCH /api/customers/[customerId]` — Update tags/notes

File: same as above

Body: `{ tags?, notes? }`

Only updates `tags` and `notes` fields (the manually-editable fields).

### `GET /api/customers/stats` — Aggregate stats

File: `app/api/customers/stats/route.ts`

Params: `from`, `to` (date range for "new this period")

Returns:
```json
{
  "totalCustomers": 245,
  "newThisPeriod": 18,
  "repeatRate": 34.5,
  "avgOrderValue": 1250.00,
  "topCustomers": [
    { "id": "...", "customer_name": "...", "total_spent": 15000, "order_count": 12 }
  ]
}
```

### `GET /api/customers/tags` — Distinct tags (for autocomplete)

File: `app/api/customers/tags/route.ts`

Returns: `{ tags: ["VIP", "Wholesale", "Returns Often", ...] }`

### `GET /api/customers/export` — CSV export (streaming)

File: `app/api/customers/export/route.ts`

Same pattern as `/api/orders/export/route.ts`:
- Auth + subscription gate (active/trialing only)
- Redis rate limiting (5/hour)
- Streaming response with BOM for Excel/Arabic
- CSV injection sanitization
- Max 10,000 rows

Columns: Name, Phone, Email, City, Country, Tags, Currency, Total Spent, Order Count, First Order, Last Order, Notes

---

## 3. Dashboard Pages

### Customer List Page

File: `app/(dashboard)/dashboard/customers/page.tsx`

Server component:
- Fetches initial customers (first 20), store, profile (for export permission)
- Fetches stats (total customers, repeat rate, new this month, avg order value)
- Renders stats cards row + `<CustomersTable>` component

### Customer Detail Page

File: `app/(dashboard)/dashboard/customers/[customerId]/page.tsx`

Server component with two-column layout:

**Left column (wide):**
- Order history table (all orders for this customer)
- Each row: order number, status badge, total, date
- Click row → navigate to order detail

**Right column (sidebar):**
- Contact info card (name, phone, email, city, country, address)
- WhatsApp button (deep link: `https://wa.me/{phone}`)
- Stats card (total spent, order count, avg order value, first/last order)
- Tags editor (inline pill editor with autocomplete)
- Notes editor (auto-save textarea)

---

## 4. Components

### `components/dashboard/customers-table.tsx` (new, Client Component)

Mirrors `orders-table.tsx` pattern:
- Search input (name/phone, 400ms debounce)
- Filter controls: country select, tag select, spent range, order count range
- Sort dropdown (total spent, order count, last order, name)
- Export CSV button (if canExport)
- Table columns: Name, Phone, Country, Orders, Total Spent, Last Order, Tags
- Tags displayed as colored pills (truncated if many)
- Click row → navigate to customer detail
- Pagination (Load More button)

### `components/dashboard/customer-stats-cards.tsx` (new)

4 stat cards in responsive grid:
- Total Customers (Users icon)
- New This Month (UserPlus icon)
- Repeat Rate (Repeat icon, percentage)
- Avg Order Value (DollarSign icon)

### `components/dashboard/customer-tags-editor.tsx` (new, Client Component)

- Existing tags as removable pills
- Text input with autocomplete dropdown (fetches from `/api/customers/tags`)
- Preset suggestions: VIP, Wholesale, Returns Often, New, Loyal, Blocked
- Enter/click to add tag → PATCH to API
- X button on pill to remove tag → PATCH to API
- Debounced save

### `components/dashboard/customer-notes-editor.tsx` (new, Client Component)

- Textarea with placeholder
- Auto-save on blur or after 1s debounce
- "Saved" indicator with timestamp
- PATCH to API

---

## 5. Sidebar Navigation

File: `components/layout/dashboard-sidebar.tsx`

Add after the Orders/Checkouts group:

```typescript
{ href: "/dashboard/customers", labelKey: "nav.customers", icon: Users }
```

Import `Users` from `lucide-react`.

---

## 6. WhatsApp Deep Link

On customer detail page, a button that opens WhatsApp chat:

```typescript
const whatsappUrl = `https://wa.me/${customer.customer_phone.replace(/[^0-9]/g, '')}`
```

Uses `MessageSquare` icon. Works on mobile and desktop. No API integration needed — just opens the chat.

---

## 7. Translation Keys

### Dashboard keys (en.json, ar.json, fr.json only)

```
nav.customers

customers.title
customers.search
customers.empty
customers.emptySearch

customers.columns.name
customers.columns.phone
customers.columns.country
customers.columns.orders
customers.columns.totalSpent
customers.columns.lastOrder
customers.columns.tags

customers.stats.totalCustomers
customers.stats.newThisMonth
customers.stats.repeatRate
customers.stats.avgOrderValue

customers.detail.contactInfo
customers.detail.orderHistory
customers.detail.statistics
customers.detail.totalSpent
customers.detail.orderCount
customers.detail.avgOrder
customers.detail.firstOrder
customers.detail.lastOrder
customers.detail.tags
customers.detail.notes
customers.detail.notesPlaceholder
customers.detail.notesSaved
customers.detail.tagAdded
customers.detail.tagRemoved
customers.detail.messageOnWhatsApp
customers.detail.noOrders

customers.filters.country
customers.filters.tag
customers.filters.minSpent
customers.filters.maxSpent
customers.filters.minOrders
customers.filters.maxOrders
customers.filters.lastOrderAfter
customers.filters.lastOrderBefore
customers.filters.clearFilters

customers.sort.totalSpent
customers.sort.orderCount
customers.sort.lastOrder
customers.sort.name

customers.export
customers.exporting
customers.exportSuccess
customers.exportFailed
customers.exportRateLimit
```

---

## 8. Tier System

No tier gating needed:
- Customer profiles are auto-generated from orders (can't limit without limiting orders)
- Tags and notes are lightweight enrichment, available to all tiers
- **CSV export** requires active/trialing subscription (same as order export)

No changes to `lib/tier.ts`.

---

## 9. Implementation Order

| # | Task | New/Modify | Files |
|---|---|---|---|
| 1 | Database schema + triggers + RLS | Modify | `001_initial_schema.sql` |
| 2 | Run ALTER SQL + backfill on live DB | Manual | Supabase SQL Editor |
| 3 | API: customer list | New | `app/api/customers/list/route.ts` |
| 4 | API: customer detail + update | New | `app/api/customers/[customerId]/route.ts` |
| 5 | API: customer stats | New | `app/api/customers/stats/route.ts` |
| 6 | API: tags autocomplete | New | `app/api/customers/tags/route.ts` |
| 7 | API: CSV export | New | `app/api/customers/export/route.ts` |
| 8 | Stats cards component | New | `components/dashboard/customer-stats-cards.tsx` |
| 9 | Tags editor component | New | `components/dashboard/customer-tags-editor.tsx` |
| 10 | Notes editor component | New | `components/dashboard/customer-notes-editor.tsx` |
| 11 | Customers table component | New | `components/dashboard/customers-table.tsx` |
| 12 | Customer list page | New | `app/(dashboard)/dashboard/customers/page.tsx` |
| 13 | Customer detail page | New | `app/(dashboard)/dashboard/customers/[customerId]/page.tsx` |
| 14 | Sidebar nav item | Modify | `components/layout/dashboard-sidebar.tsx` |
| 15 | Translations (en) | Modify | `lib/i18n/locales/en.json` |
| 16 | Translations (ar) | Modify | `lib/i18n/locales/ar.json` |
| 17 | Translations (fr) | Modify | `lib/i18n/locales/fr.json` |
| 18 | Docs article | Modify | `lib/docs/content.ts` |
| 19 | CLAUDE.md | Modify | `CLAUDE.md` |
| 20 | Order detail → customer link | Modify | `app/(dashboard)/dashboard/orders/[orderId]/page.tsx` |

---

## 10. Key Design Decisions

- **Auto-populated via trigger** — store owners never manually add customers. They appear from orders.
- **Phone as unique identifier** — `UNIQUE(store_id, customer_phone)`. Same customer placing multiple orders gets one profile.
- **COALESCE on upsert** — newer order data overwrites name/address, but email/city/country only update if the new value is non-null (preserves existing data).
- **Phone normalization built-in** — `normalize_phone()` converts all formats (`0555...`, `+213555...`, `00213555...`) to a consistent digits-only international format. Covers 20 MENA/common country codes. Prevents duplicate customer profiles from different phone formats. Applied in both triggers and backfill.
- **Incremental status updates (O(1))** — when an order is canceled/returned, the trigger subtracts that order's total and decrements the count. No full SUM/COUNT recalculation. Handles the reverse case (un-canceling) too. Scales to any number of orders per customer.
- **No DELETE policy** — customers can't be deleted since they're derived from orders. Tags/notes can be cleared instead.
- **Backfill function** — one-time function to populate customers from existing orders. Run once after deploying the schema. Uses `normalize_phone()` to merge duplicates during backfill.
- **Currency tracked** — `currency` field stores the most recent order's currency. `total_spent` sums raw totals (if a customer orders in multiple currencies, the total is approximate). Most MENA sellers operate in 1-2 currencies. Individual order currencies shown on the detail page for clarity.
- **Functional index on orders** — `idx_orders_norm_phone` enables efficient customer→orders lookup by applying `normalize_phone()` at index time, avoiding full table scans.
- **Phone search normalization** — the list API normalizes the search input before querying, so searching "0555123456" matches stored "213555123456".

---

## 11. Potential Enhancements (Future)

- Customer merge UI (manually combine two profiles the auto-normalization missed)
- Lifetime value prediction
- Customer segments as saved filters
- Bulk WhatsApp messaging to segments
- Customer activity timeline (orders + reviews + interactions)
- Email marketing integration (export segments to Mailchimp/SendGrid)
