# Product Reviews & Ratings — Implementation Plan

## Overview

Customers leave star ratings (1-5), text comments, and up to 3 images per product. Reviews require a delivered order (verified purchase). Store owners moderate reviews from the dashboard. Review display style is customizable via the design builder with live preview.

---

## 1. Database Schema

Add to `supabase/migrations/001_initial_schema.sql`:

**DEPENDENCY:** Requires `normalize_phone()` function from CRM-PLAN.md. Deploy that first.

```sql
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT CHECK (comment IS NULL OR length(comment) <= 1000),
  image_urls TEXT[] DEFAULT '{}' CHECK (array_length(image_urls, 1) IS NULL OR array_length(image_urls, 1) <= 3),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_verified_purchase BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- customer_phone is stored NORMALIZED (via normalize_phone from CRM plan)
-- This prevents the same customer reviewing twice with different phone formats
CREATE UNIQUE INDEX idx_reviews_customer_product ON product_reviews(product_id, customer_phone);
CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_reviews_store ON product_reviews(store_id);
CREATE INDEX idx_reviews_status ON product_reviews(store_id, status);
CREATE INDEX idx_reviews_product_approved ON product_reviews(product_id, status) WHERE status = 'approved';

CREATE TRIGGER set_updated_at BEFORE UPDATE ON product_reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

**RLS Policies:**

```sql
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved reviews" ON product_reviews FOR SELECT
  USING (status = 'approved' AND EXISTS (
    SELECT 1 FROM stores WHERE stores.id = product_reviews.store_id AND stores.is_published = true
  ));

CREATE POLICY "Owners can view own store reviews" ON product_reviews FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = product_reviews.store_id AND stores.owner_id = (select auth.uid())
  ));

CREATE POLICY "Owners can update reviews" ON product_reviews FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = product_reviews.store_id AND stores.owner_id = (select auth.uid())
  ));

CREATE POLICY "Owners can delete reviews" ON product_reviews FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = product_reviews.store_id AND stores.owner_id = (select auth.uid())
  ));
```

No INSERT policy — inserts go through admin client (same pattern as orders).

**ALTER SQL for live database:**

```sql
-- PREREQUISITE: normalize_phone() from CRM-PLAN.md must be deployed first.
-- Run this in Supabase SQL Editor to apply to the live database.
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  image_urls TEXT[] DEFAULT '{}' CHECK (array_length(image_urls, 1) IS NULL OR array_length(image_urls, 1) <= 3),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_verified_purchase BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_reviews_customer_product ON product_reviews(product_id, customer_phone);
CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_reviews_store ON product_reviews(store_id);
CREATE INDEX idx_reviews_status ON product_reviews(store_id, status);
CREATE INDEX idx_reviews_product_approved ON product_reviews(product_id, status) WHERE status = 'approved';

CREATE TRIGGER set_updated_at BEFORE UPDATE ON product_reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved reviews" ON product_reviews FOR SELECT
  USING (status = 'approved' AND EXISTS (
    SELECT 1 FROM stores WHERE stores.id = product_reviews.store_id AND stores.is_published = true
  ));

CREATE POLICY "Owners can view own store reviews" ON product_reviews FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = product_reviews.store_id AND stores.owner_id = (select auth.uid())
  ));

CREATE POLICY "Owners can update reviews" ON product_reviews FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = product_reviews.store_id AND stores.owner_id = (select auth.uid())
  ));

CREATE POLICY "Owners can delete reviews" ON product_reviews FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = product_reviews.store_id AND stores.owner_id = (select auth.uid())
  ));
```

---

## 2. Design Builder Settings

Add 4 fields to `DesignState` interface in `components/dashboard/design-preview.tsx`:

```typescript
showReviews: boolean              // default: true
reviewCardStyle: "minimal" | "card" | "bubble"  // default: "card"
showReviewImages: boolean         // default: true
showVerifiedBadge: boolean        // default: true
```

Add defaults in `parseDesignSettings` in `lib/utils.ts`:

```typescript
showReviews: typeof raw.showReviews === "boolean" ? raw.showReviews : true,
reviewCardStyle: (raw.reviewCardStyle as DesignState["reviewCardStyle"]) || "card",
showReviewImages: typeof raw.showReviewImages === "boolean" ? raw.showReviewImages : true,
showVerifiedBadge: typeof raw.showVerifiedBadge === "boolean" ? raw.showVerifiedBadge : true,
```

---

## 3. Validation Schema

Create `lib/validations/review.ts`:

```typescript
import { z } from "zod"

export const reviewSchema = z.object({
  store_slug: z.string().min(1),
  product_id: z.string().uuid(),
  order_id: z.string().uuid(),
  customer_phone: z.string().min(5),
  token: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional().transform((val) => {
    if (!val) return val
    // Strip HTML tags and excessive whitespace
    return val.replace(/<[^>]*>/g, "").replace(/\s{3,}/g, " ").trim()
  }),
  image_urls: z.array(z.string().url()).max(3).optional(),
})

export const reviewModerationSchema = z.object({
  review_id: z.string().uuid(),
  status: z.enum(["approved", "rejected"]),
})
```

---

## 4. API Endpoints

### `POST /api/reviews` — Submit a review (public, no auth)

File: `app/api/reviews/route.ts`

Body: `{ store_slug, product_id, order_id, customer_phone, token, rating, comment?, image_urls? }`

Logic:
1. **Validate HMAC token** — `token = HMAC-SHA256(order_id + product_id + customer_phone, REVIEW_SECRET)`. This prevents URL tampering. The token is generated server-side when building the review link (e.g. in WhatsApp notification or order confirmation page).
2. Look up store by slug, verify `is_published`
3. **Normalize phone** — call `normalize_phone()` equivalent in TypeScript (same logic as DB function) before querying
4. Verify order exists with matching `store_id`, normalized phone, `status = 'delivered'`
5. Verify order contains an `order_item` for `product_id`
6. Check uniqueness: no existing review for `(product_id, normalized_phone)`
7. **Sanitize comment** — strip HTML tags, limit to 1000 chars, reject if it contains more than 3 URLs (spam indicator)
8. Validate `image_urls` (max 3, must be valid storage paths under `{store_id}/reviews/`)
9. Insert via admin client with **normalized phone** (no RLS INSERT policy)
10. Invalidate cache: `revalidateTag('reviews:${product_id}')`
11. Return created review (status: `pending`)

**Rate limiting:** Redis, keyed by `review-submit:{normalized_phone}`, max 5 reviews per hour across all stores.

### `GET /api/reviews?product_id={id}` — Get approved reviews (public)

File: same `app/api/reviews/route.ts`

Returns: `{ reviews, stats: { average, count, breakdown: { 5: n, 4: n, ... } } }`

### `GET /api/reviews/list` — Dashboard moderation list

File: `app/api/reviews/list/route.ts`

Auth required. Paginated. Filterable by `status` (pending/approved/rejected/all). Joins product name.

### `PATCH /api/reviews` — Approve/reject

File: same `app/api/reviews/route.ts`

Body: `{ review_id, status }` — must be `approved` or `rejected`

### `DELETE /api/reviews?id={id}` — Delete review + images

File: same `app/api/reviews/route.ts`

### `POST /api/reviews/upload-images` — Upload review images

File: `app/api/reviews/upload-images/route.ts`

No auth. Validated by `store_slug + order_id + customer_phone + token` (same HMAC token as review submission). Max 3 images per request. Max file size: 5MB per image. Stored under `{store_id}/reviews/`. Uses sharp for compression (same pattern as `app/api/upload-images/`).

**Rate limiting:** Redis, keyed by `review-upload:{IP}`, max 10 uploads per hour. Prevents storage abuse from unauthenticated endpoint.

---

## 5. Cache Layer

Add to `lib/storefront/cache.ts`:

```typescript
export function getProductReviews(productId: string) {
  return unstable_cache(
    async () => {
      const supabase = createStaticClient()
      const { data } = await supabase
        .from("product_reviews")
        .select("id, customer_name, rating, comment, image_urls, is_verified_purchase, created_at")
        .eq("product_id", productId)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(50)
      return data || []
    },
    [`reviews-${productId}`],
    { tags: [`reviews:${productId}`], revalidate: 300 },
  )()
}

export function getProductReviewStats(productId: string) {
  // Returns { average, count, breakdown: { 5: n, 4: n, 3: n, 2: n, 1: n } }
}
```

Invalidate with `revalidateTag(`reviews:${productId}`)` on submit/moderate/delete.

---

## 6. Storefront Components

### `components/store/star-rating.tsx` (new)

Reusable star component. Two modes:
- **Display:** static stars with fill based on rating value
- **Interactive:** clickable stars for the review form

### `components/store/review-image-gallery.tsx` (new)

Thumbnail grid with lightbox on click. Max 3 images per review.

### `components/store/product-reviews.tsx` (new, Server Component)

Renders the full reviews section on product page:
- Average rating with large star display
- Star breakdown bar chart (5→1 with count + percentage bar)
- List of review cards (respects `reviewCardStyle` setting)
- "Write a Review" button

### `components/store/review-form.tsx` (new, Client Component)

Review submission form:
- Interactive star picker (required)
- Comment textarea (optional, max 1000 chars)
- Image upload area (optional, max 3)
- Zod validation
- Submits to `POST /api/reviews`
- Success: "Your review has been submitted and is pending approval"

### Review Card Styles

**Minimal:** Name + stars inline, text below. No borders, compact.

**Card:** Bordered card with:
- Avatar initial circle + name + date
- Star rating
- Comment text
- Image thumbnails
- Verified purchase badge

**Bubble:** Chat-bubble style with rounded background, slight shadow, quote-like.

---

## 7. Product Page Integration

File: `app/(storefront)/[slug]/products/[productId]/page.tsx`

After the FAQ section, add:

```tsx
{ds.showReviews && (
  <ProductReviews
    productId={product.id}
    storeSlug={slug}
    designSettings={{
      reviewCardStyle: ds.reviewCardStyle,
      showReviewImages: ds.showReviewImages,
      showVerifiedBadge: ds.showVerifiedBadge,
    }}
    lang={store.language || "en"}
  />
)}
```

**JSON-LD `aggregateRating`** added to product schema when reviews exist:

```typescript
...(reviewStats && reviewStats.count > 0 ? {
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: reviewStats.average.toFixed(1),
    reviewCount: reviewStats.count,
    bestRating: 5,
    worstRating: 1,
  },
} : {}),
```

---

## 8. Review Submission Page

File: `app/(storefront)/[slug]/products/[productId]/review/page.tsx` (new)

URL: `/{slug}/products/{productId}/review?order={order_id}&phone={phone}&token={hmac_token}`

The `token` is an HMAC-SHA256 of `order_id + product_id + phone` using `REVIEW_SECRET` env var. This prevents:
- URL guessing (UUID alone is not enough — phone is exposed)
- Tampering (changing the phone/order/product in URL invalidates the token)

Logic:
1. Validate HMAC token — reject with generic "invalid link" if mismatch
2. Server-side validates order/phone/product combination
3. If valid → renders `ReviewForm` (passes token as hidden field for the submit API)
4. If already reviewed → shows "already reviewed" message
5. If order not delivered → shows "order must be delivered" message

**How the link is generated:**
- In WhatsApp order notification (after delivery status): the integration handler generates the review link with HMAC token
- On the order confirmation page: if order status is `delivered`, show "Leave a Review" button with the tokenized link
- Add a helper function `generateReviewToken(orderId, productId, phone)` in `lib/utils.ts`

---

## 9. Design Builder

### Controls (`components/dashboard/design-controls.tsx`)

Add in the "Product page" section, after existing toggles:

**Reviews sub-section:**
- Toggle: **Show Reviews** (`showReviews`)
- Visual picker: **Review Card Style** — 3 options: Minimal, Card, Bubble (same pattern as `variantStyle` selector)
- Toggle: **Show Review Images** (`showReviewImages`)
- Toggle: **Show Verified Badge** (`showVerifiedBadge`)

### Preview (`components/dashboard/design-preview.tsx`)

In `ProductPreview`, after FAQs section, add mock reviews:

```typescript
const MOCK_REVIEWS = [
  { name: "Sarah M.", rating: 5, comment: "Excellent quality! Exactly as described.", verified: true, hasImage: true },
  { name: "Ahmed K.", rating: 4, comment: "Great product, fast delivery.", verified: true, hasImage: false },
  { name: "Fatima L.", rating: 5, comment: "Love it! Will order again.", verified: true, hasImage: true },
]
```

Renders: average rating display + mock review cards using the selected `reviewCardStyle`.

---

## 10. Dashboard Reviews Page

### `app/(dashboard)/dashboard/reviews/page.tsx` (new)

Server component. Fetches initial reviews + counts by status.

### `components/dashboard/reviews-list.tsx` (new, Client Component)

- Filter tabs: All | Pending | Approved | Rejected (with counts)
- Table columns: Product, Customer, Rating (stars), Comment (truncated), Status (badge), Date
- Actions per row: Approve (green), Reject (red), Delete (destructive)
- Expand row to see full comment + images
- Pagination (Load More)

### Sidebar Navigation

Add to `components/layout/dashboard-sidebar.tsx`:

```typescript
{ href: "/dashboard/reviews", labelKey: "nav.reviews", icon: Star }
```

Place after Products in the nav order.

---

## 11. Translations

### Dashboard keys (en.json, ar.json, fr.json only)

```
nav.reviews
reviews.title, reviews.pending, reviews.approved, reviews.rejected
reviews.approve, reviews.reject, reviews.delete
reviews.noReviews, reviews.confirmDelete
reviews.reviewApproved, reviews.reviewRejected, reviews.reviewDeleted
reviews.verifiedPurchase, reviews.filterAll
reviews.product, reviews.customer, reviews.rating, reviews.date, reviews.status
design.showReviews, design.showReviewsHint
design.reviewCardStyle, design.reviewStyleMinimal, design.reviewStyleCard, design.reviewStyleBubble
design.showReviewImages, design.showVerifiedBadge
```

### Storefront keys (ALL 20 locale files)

```
storefront.reviews, storefront.writeReview, storefront.noReviews
storefront.verifiedPurchase, storefront.reviewSubmitted
storefront.reviewRating, storefront.reviewComment, storefront.reviewCommentPlaceholder
storefront.reviewImages, storefront.submitReview
storefront.reviewAlreadyExists, storefront.reviewOrderRequired
storefront.stars, storefront.outOf5, storefront.basedOnReviews
```

---

## 12. Implementation Order

| # | Task | New/Modify | Files |
|---|---|---|---|
| 1 | Database schema + ALTER SQL | Modify | `001_initial_schema.sql` |
| 2 | Design state (4 fields + defaults) | Modify | `design-preview.tsx`, `utils.ts` |
| 3 | Validation schema | New | `lib/validations/review.ts` |
| 4 | API: submit + get reviews | New | `app/api/reviews/route.ts` |
| 5 | API: dashboard list | New | `app/api/reviews/list/route.ts` |
| 6 | API: upload review images | New | `app/api/reviews/upload-images/route.ts` |
| 7 | Cache layer | Modify | `lib/storefront/cache.ts` |
| 8 | Star rating component | New | `components/store/star-rating.tsx` |
| 9 | Review image gallery | New | `components/store/review-image-gallery.tsx` |
| 10 | Product reviews display | New | `components/store/product-reviews.tsx` |
| 11 | Review form | New | `components/store/review-form.tsx` |
| 12 | Product page integration + JSON-LD | Modify | `app/(storefront)/[slug]/products/[productId]/page.tsx` |
| 13 | Review submission page | New | `app/(storefront)/[slug]/products/[productId]/review/page.tsx` |
| 14 | Design builder controls | Modify | `design-controls.tsx` |
| 15 | Design builder preview | Modify | `design-preview.tsx` |
| 16 | Dashboard reviews page | New | `app/(dashboard)/dashboard/reviews/page.tsx` |
| 17 | Dashboard reviews list | New | `components/dashboard/reviews-list.tsx` |
| 18 | Sidebar nav | Modify | `dashboard-sidebar.tsx` |
| 19 | Translations (dashboard) | Modify | `en.json`, `ar.json`, `fr.json` |
| 20 | Translations (storefront) | Modify | All 20 locale files |
| 21 | Docs | Modify | `lib/docs/content.ts` |
| 22 | CLAUDE.md | Modify | `CLAUDE.md` |

---

## 13. Key Decisions

- **No auth for reviewers** — validated by `order_id + customer_phone + product_id + HMAC token`
- **HMAC-signed review links** — prevents URL tampering and unauthorized submissions. Token = `HMAC-SHA256(order_id + product_id + phone, REVIEW_SECRET)`. Required on both the review page and the submit/upload APIs.
- **Phone normalization** — uses `normalize_phone()` from CRM plan before storing. Prevents same customer reviewing twice with different phone formats (`0555...` vs `+213555...`).
- **Moderation by default** — reviews start as `pending`, need owner approval
- **No tier gating** — reviews on all plans (drives conversion for all sellers)
- **One review per customer per product** — unique index on `(product_id, customer_phone)` where phone is normalized
- **Comment sanitization** — HTML tags stripped, max 1000 chars (enforced in both Zod schema and DB CHECK constraint)
- **Rate limiting on public endpoints** — submit: 5/hour per phone; upload: 10/hour per IP
- **Images in existing storage bucket** — path: `{store_id}/reviews/{uuid}.webp`, max 5MB per image
- **Cache invalidation** — tag-based `reviews:{productId}` on submit/moderate/delete
- **Admin client for inserts** — reviewers are not Supabase auth users
- **New env var required** — `REVIEW_SECRET` for HMAC token generation/validation
