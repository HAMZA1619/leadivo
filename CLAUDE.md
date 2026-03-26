# CLAUDE.md — Leadivo Project Rules

## Documentation Sync Rule

**MANDATORY:** Whenever a feature is added, modified, or removed in this project, this CLAUDE.md file MUST be updated to reflect the change. This includes:

- Adding a new feature → add it to the relevant section below.
- Modifying an existing feature → update the description in this file.
- Removing a feature → remove it from this file.
- Adding a new API endpoint → add it to the API Endpoints section.
- Adding a new data model/table → add it to the Data Models section.
- Adding a new integration → add it to the Integrations section.
- Changing business logic rules → update the Business Logic section.

This file is the single source of truth for the project's feature set. Keeping it in sync prevents knowledge drift between conversations.

### User-Facing Documentation Sync

When a feature visible to end users is added, changed, or removed, the user-facing docs in `lib/docs/content.ts` MUST also be updated:

- **New user-facing feature** → add a new `DocArticle` (or append steps to an existing one) in `ARTICLES`, with `faqs` array for SEO.
- **Modified feature** → update the relevant article steps and FAQs.
- **Removed feature** → remove or update the corresponding article.
- **New integration** → add a new article under the `integrations` category.
- Every article must include a `faqs` array with at least 2 FAQ items (trilingual: en/ar/fr) for SEO (rendered as FAQ JSON-LD schema).
- If a new category is needed, add it to the `CATEGORIES` array.
- Keep article descriptions action-oriented and user-friendly (not developer-facing).

### Documentation Content Rules

These rules apply to **ALL user-facing text** across the entire codebase — not just `lib/docs/content.ts`. This includes: UI labels, error messages, API error responses, toast notifications, placeholder text, locale/translation files, AI chat prompts, marketing copy, landing pages, blog content, and any string a user or customer could see.

- **Never lie or fabricate information** — every claim must match the actual app behavior. If unsure, verify in the codebase before writing.
- **Tone: positive and helpful** — focus on what the platform CAN do. Avoid words like "unfortunately", "cannot", "can't", "not available", "not possible", "limitation", "missing", "lack". Frame everything as a benefit or a feature. For error messages, explain what the user can do to resolve the situation rather than just stating what went wrong.
- **Pricing model: 14-day free trial + Pro plan** — there is NO free plan. New users get a 14-day free trial of all features, then must subscribe to the Pro plan to continue. Never mention "free plan", "free tier", or "free tier limit" anywhere in the codebase — use "your current plan", "trial", or just "limit" instead.
- **Never promise features that don't exist** — only document what is actually implemented in the codebase.
- **Avoid comparisons with competitors** — in docs, FAQs, and general content, keep focused on Leadivo's own capabilities. Never use phrases like "you won't find on other platforms" or "unlike competitors". **Exception**: dedicated `/compare/[platform]` pages may name competitors but must stay respectful and positive — acknowledge what they're good at, then highlight what Leadivo brings (never bash or trash-talk).
- **Legal pages (Terms & Privacy) tone** — even legal text should stay positive where possible. Avoid fear-based language ("if you don't...", "your store will be paused"). Frame consequences as benefits (e.g., "your data is safely retained" instead of "if you don't subscribe, your store is paused"). Keep standard legal disclaimers (limitation of liability, "as is") but remove unnecessary negative examples (e.g., "failed deliveries, outages").
- **Consistency across languages** — when fixing tone in English text, always apply the same fix to the corresponding Arabic and French translations (and all storefront locales if the key is storefront-facing).

## Project Overview

Multi-tenant e-commerce platform built with Next.js 16, React 19, TypeScript, Supabase, and Tailwind CSS 4.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript (strict mode)
- **Database & Auth:** Supabase (RLS, SSR client)
- **State Management:** Zustand (persisted cart store)
- **Styling:** Tailwind CSS 4 + shadcn/ui (new-york style)
- **Forms:** React Hook Form + Zod 4
- **Icons:** Lucide React
- **Notifications:** Sonner

## Project Structure

```
app/
  (auth)/          # Login, signup, OAuth callback
  (dashboard)/     # Protected dashboard routes
  (storefront)/    # Public customer-facing store ([slug])
  api/             # API routes
components/
  ui/              # shadcn/ui primitives
  dashboard/       # Dashboard-specific components
  forms/           # Form components
  layout/          # Layout components (headers, sidebars, footers)
  store/           # Storefront components
  marketing/       # Landing page components
lib/
  supabase/        # Supabase clients (client, server, admin, middleware)
  integrations/    # Integration registry, handlers, and app definitions
  store/           # Zustand stores
  hooks/           # Custom React hooks (use-pixel, use-store-currency, etc.)
  validations/     # Zod schemas
  constants.ts     # App-wide constants (cities, currencies, etc.)
  utils.ts         # Utility functions (cn, formatPrice, slugify, etc.)
supabase/
  migrations/      # Single schema file: 001_initial_schema.sql
```

## Coding Conventions

### Imports

- Always use the `@/` path alias (e.g., `import { cn } from "@/lib/utils"`).
- Never use relative imports like `../../`.

### File Naming

- Components: `kebab-case.tsx` (e.g., `product-form.tsx`)
- Hooks: `use-<name>.ts` (e.g., `use-store-currency.ts`)
- Pages: `page.tsx` inside route directories
- Utilities/libs: `kebab-case.ts`

### Components

- Use `"use client"` directive only when the component needs client-side interactivity.
- Default to React Server Components where possible.
- Style with Tailwind utility classes — no CSS modules.
- Use shadcn/ui components from `@/components/ui/`.

### State Management

- Server data: fetch in Server Components or API routes using Supabase server client.
- Client state: Zustand stores in `lib/store/`.
- Form state: React Hook Form + Zod validation schemas from `lib/validations/`.

### Database / Supabase

- Three Supabase clients exist — use the right one:
  - `lib/supabase/client.ts` — browser/client-side
  - `lib/supabase/server.ts` — Server Components and API routes
  - `lib/supabase/admin.ts` — admin operations (service role key)
- All tables have RLS enabled. Wrap `auth.uid()` in `(select auth.uid())` for performance.
- Keep all schema in a single migration file: `supabase/migrations/001_initial_schema.sql`.

### API Routes

- Located in `app/api/`.
- Use `createClient` from `@/lib/supabase/server` for auth-aware queries.
- Return `NextResponse.json()` with appropriate status codes.

### Validation

- Define Zod schemas in `lib/validations/`.
- Validate on both client (forms) and server (API routes).

### Styling

- Tailwind CSS 4 with CSS custom properties (OKLch color space).
- Dark mode supported via `next-themes` and `.dark` class.
- Use `cn()` from `@/lib/utils` to merge class names.

## Database Change Workflow

When a database schema change is needed:

1. **Update the single schema file** — edit `supabase/migrations/001_initial_schema.sql` to reflect the new state (add columns, tables, policies, etc. inline).
2. **Provide an ALTER SQL block** — after updating the schema file, always output a separate SQL snippet (ALTER TABLE, DROP/CREATE POLICY, etc.) that the user can copy-paste and run in the Supabase SQL Editor to apply the change to the live database.
3. **Never create new migration files** — all schema lives in `001_initial_schema.sql`.

## Integrations System

Third-party integrations are managed via the `store_integrations` table and a registry pattern.

### Architecture

```
lib/integrations/
  registry.ts        # AppDefinition interface + APPS registry
  handlers.ts        # Event dispatcher (e.g. order.created → handler)
  apps/
    whatsapp.ts      # WhatsApp notification app definition + handler
    meta-capi.ts     # Meta Conversions API app definition + handler
components/dashboard/
  integration-manager.tsx              # Install/uninstall + toggle UI
  integrations/
    whatsapp-setup.tsx                 # WhatsApp config dialog
    meta-capi-setup.tsx                # Meta CAPI config dialog
app/api/integrations/
  route.ts                             # CRUD for store_integrations
  whatsapp/connect/route.ts            # WhatsApp OAuth connect
  whatsapp/disconnect/route.ts         # WhatsApp disconnect
  whatsapp/status/route.ts             # WhatsApp status check
```

### Adding a New Integration

1. Create an app definition in `lib/integrations/apps/<name>.ts` implementing `AppDefinition`.
2. Register it in `lib/integrations/registry.ts` → `APPS`.
3. If `hasCustomSetup: true`, create a setup component in `components/dashboard/integrations/`.
4. Add event handler logic in `lib/integrations/handlers.ts` if it reacts to events.

### Meta CAPI / Facebook Pixel

- **Pixel ID lives in `store_integrations` config** (not the `stores` table).
- The storefront layout (`app/(storefront)/[slug]/layout.tsx`) queries `store_integrations` for `meta-capi` config to load the pixel.
- Config shape: `{ pixel_id, access_token, test_event_code?, test_mode }`.
- `test_mode` is auto-set to `true` when `test_event_code` is provided on save, `false` when removed.

### Client-Side Pixel Tracking

- `lib/hooks/use-pixel.ts` — `usePixel()` hook returns a `track(eventName, data)` function that safely calls `window.fbq()`.
- Supported client-side events:
  - **ViewContent** — fired on product page load (`components/store/pixel-view-content.tsx`)
  - **AddToCart** — fired in `add-to-cart-button.tsx` and `variant-selector.tsx`
  - **InitiateCheckout** — fired on cart page load (`app/(storefront)/[slug]/cart/page.tsx`)
- **Purchase** — server-side only via Meta Conversions API (`lib/integrations/apps/meta-capi.ts`), triggered by `order.created` event.

## Integration Sync Rule

When adding or modifying order-related fields (columns on the `orders` table, payload fields in the `handle_order_created` trigger), always check and update the integrations that consume order data:

- **Google Sheets** (`lib/integrations/apps/google-sheets.ts`) — add the new field to `AVAILABLE_FIELDS`, `EventPayload`, and the `getOrderFieldValue` switch so users can optionally include it in their spreadsheet.
- **WhatsApp** (`lib/integrations/apps/whatsapp.ts`) — update `EventPayload`, the AI prompt context string, and the fallback `buildWhatsAppMessage` function so the new data appears in customer notifications when relevant.
- **Meta CAPI** (`lib/integrations/apps/meta-capi.ts`) — update `EventPayload` if the field is relevant to Facebook conversion tracking (e.g. value, currency, content data).

In short: any new order field must flow end-to-end — schema → trigger payload → integration `EventPayload` → handler logic.

## Responsive UI

- All UI must work on mobile (320px) first, then scale up — use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`).
- Use `flex-wrap` on rows that contain multiple actions (buttons, badges) so they stack instead of overflowing.
- Avoid fixed widths — prefer `w-full`, `max-w-*`, `min-w-0`, and `flex-1`.
- Use responsive font sizes when needed (e.g., `text-xl sm:text-2xl`).
- Long text (URLs, labels) must truncate or wrap — use `truncate`, `break-all`, or `line-clamp-*`.
- Grids should adapt: e.g., `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, never hardcode 3+ columns without a mobile fallback.
- Fixed/sticky floating elements (buttons, toasts) must not overlap each other — offset them vertically.
- Test storefront components at 320px (mobile preview) since that's the primary target.

## Internationalization (i18n)

- **Dashboard translations** (keys like `"limits"`, `"dashboard"`, etc.) are only added to the three main locale files: `en.json`, `ar.json`, and `fr.json`.
- **Storefront translations** (keys like `"storefront"`, `"search"`, `"language"`) are translated in **all** locale files.
- In short: `en`, `ar`, `fr` get both dashboard + storefront keys. All other locales (`es`, `pt`, `de`, `it`, `nl`, `tr`, `ru`, `zh`, `ja`, `ko`, `hi`, `id`, `ms`, `pl`, `sv`, `th`, `vi`) get storefront keys only.

## SEO Rules

- **Page titles must be under 60 characters** (before the `| Leadivo` suffix). The root layout appends `" | Leadivo"` (10 chars) via the `template: "%s | Leadivo"` setting, so the final rendered title must stay under 70 characters total. This applies to all `metaTitle`, `title`, and `metadata.title` values across the codebase.
- **Meta descriptions must be under 160 characters.**

## Don'ts

- Don't create new migration files — modify the single `001_initial_schema.sql`.
- Don't use bare `auth.uid()` in RLS policies — always use `(select auth.uid())`.
- Don't install new dependencies without asking first.
- Don't add comments, docstrings, or type annotations to code you didn't change.
- Don't over-engineer — keep changes minimal and focused on what was asked.
- Don't add dashboard translation keys to storefront-only locale files (see Internationalization section).
- Don't make changes to features without updating this CLAUDE.md file to reflect those changes.

## App Features

### Authentication & Accounts
- Email/password signup and login via Supabase Auth.
- Google OAuth integration (`app/(auth)/`).
- Password reset and forgot password flow (`app/api/recover/[token]/`).
- Protected dashboard routes via Supabase middleware.

### Dashboard — Store Management
- **Store Setup**: name, slug, currency, language, description.
- **Store Publishing**: toggle `is_published` to show/hide storefront.
- **Custom Domain**: connect a custom domain, verify ownership (`app/api/store/domain/`).
- **Store Analytics**: sales metrics, order counts, revenue overview.

### Dashboard — Product Management
- Full CRUD for products (`app/api/products/`).
- Product fields: name, SKU, description, price, compare-at price, stock (0–1000), status (active/draft), availability toggle, FAQs (question/answer pairs).
- Multiple image upload with gallery management (`app/api/upload-images/`).
- Product search by name/SKU.
- CSV import: Shopify-compatible CSV format, bulk product creation with variant support, image URL upload, collection matching, tier limit enforcement, downloadable template (`app/api/products/import/`, `components/dashboard/csv-import-dialog.tsx`).
- Bulk operations: bulk delete, bulk status updates.

### Dashboard — Product Variants
- Define custom options per product (e.g., Size, Color).
- Per-variant: price, compare-at price, SKU, stock, availability toggle.

### Dashboard — Collections
- Create, edit, delete collections.
- Assign products to collections.
- Collection name, auto-generated slug, sort order, product assignment.

### Dashboard — Discounts & Coupons
- Discount types: percentage or fixed amount.
- Custom coupon codes.
- Rules: minimum order amount, max uses (global), max uses per customer, date range (starts_at / ends_at), active/inactive toggle.
- Market-specific discounts (apply to selected markets only).
- Validation endpoint (`app/api/discounts/validate/`).

### Dashboard — Markets & Multi-Currency
- Create markets by country/currency.
- Pricing modes: **fixed** (manual prices per market) or **auto** (exchange rate + adjustment %).
- Exchange rate fetching (`app/api/markets/exchange-rate/`).
- Price adjustment percentage per market.
- Rounding rules: none, 0.99, 0.95, 0.00, nearest_5.
- City exclusions with custom rates (`app/api/markets/exclusions/`).
- Default market fallback for unmapped countries.
- Market pricing editor per product/variant.

### Dashboard — Shipping
- Shipping zones by country.
- Default rate per zone, free shipping threshold, active/inactive.
- City-level rate overrides and city exclusions.
- **CSV import for city rates**: per-zone CSV upload (City, Rate, Excluded columns), client-side parsing, preview with error summary, uses existing bulk upsert API. Downloadable template included.
- Shipping lookup API (`app/api/shipping/lookup/`).

### Dashboard — Order Management
- Order listing with filtering (`app/api/orders/list/`).
- Order details: customer info, items, totals, delivery fee, discount.
- Status workflow: pending → confirmed → shipped → delivered. Additional: returned, canceled.
- Terminal statuses (delivered/canceled) prevent further transitions.
- Bulk status updates (`app/api/orders/bulk-status/`).
- Order status timeline (visual history).
- IP-based country detection on orders.
- **CSV Export**: export filtered orders as CSV with sanitized cells (CSV injection prevention), rate-limited (5/hour via Redis), capped at 10,000 rows, streamed response, Pro/trialing only. Excludes sensitive fields (ip_address, detected_country). BOM prefix for Excel/Arabic support.

### Dashboard — Customer Database (CRM)
- Auto-populated customer profiles from orders via database trigger.
- Phone normalization (E.164-like) handles MENA formats: local (`0555`), international (`+213555`), double-zero (`00213555`). Covers 30+ countries.
- Customer list with search (name/phone/email), country filter, sortable columns (total spent, order count, last order, name).
- Customer detail page: contact info, order history, statistics (total spent, order count, avg order value), WhatsApp deep link.
- Tags editor: inline pill editor with autocomplete from previously used tags. Presets: VIP, Wholesale, Loyal, New.
- Notes editor: auto-save textarea with debounce.
- Stats cards: total customers, new this month, repeat rate, avg order value.
- CSV export: streaming, rate-limited (5/hour via Redis), sanitized cells, BOM for Excel/Arabic, Pro/trialing only.
- Incremental O(1) stats updates on order status changes (cancel/return subtracts, un-cancel adds back).
- Backfill function for existing orders: `SELECT backfill_customers()`.
- RLS: owners can view/update own customers. No INSERT/DELETE policies (trigger-managed).

### Dashboard — Product Reviews
- Review moderation: approve, reject, delete reviews.
- Bulk moderation: select multiple reviews for batch approve/reject/delete.
- Filter tabs: All, Pending, Approved, Rejected (with counts).
- Review details: customer name, rating (1-5 stars), comment, images, verified purchase badge.

### Dashboard — Abandoned Checkout Recovery
- Track checkout sessions that expire without completing (`app/api/checkout-sessions/`).
- Dashboard view of abandoned carts with customer info and cart value.
- Cron job for recovery processing (`app/api/cron/abandoned-checkouts/`).

### Dashboard — Store Design Builder
- 20+ color presets (Classic Store, Trust Green, Soft Rose, Warm Amber, Ocean Teal, Coral Pop, Lavender Chic, Forest Natural, Midnight Luxe, Slate Minimal, etc.).
- Custom colors: primary, accent, background, text, button text.
- 50+ Google Fonts.
- Border radius: none, sm, md, lg, xl.
- Button styles: filled, outline, pill. Button sizes: small, medium, large.
- Card shadow intensity. Product image ratio: square, portrait, landscape.
- Layout spacing: compact, normal, spacious.
- Product page controls: variant selector style (buttons or dropdown), FAQ display style (cards or collapsible accordion), show/hide SKU, show/hide stock availability badge.
- Review settings: show/hide reviews, card style (minimal/card/bubble), show review images, show verified badge.
- Security tab: CAPTCHA verification, SMS OTP verification — checkout protection settings.
- Live preview with 4 tabs: Store, Product, Checkout, Thank You.
- Dark mode support.

### Dashboard — AI Chat Assistant
- Floating chat widget for store management help.
- Streaming responses via `app/api/ai/chat/`.
- Chat history (last 10 messages), clear chat.

### Dashboard — Billing & Subscription
- Two-tier pricing: Free and Pro.
- **Provider-agnostic billing abstraction** (`lib/billing.ts`) — all payment provider API calls go through this single module. Currently backed by Polar; to switch providers (e.g. Stripe), only this file needs to change.
- Polar webhook for payment processing (`app/api/webhooks/polar/`).
- Subscription statuses: trialing, active, past_due, expired, canceled.
- Trial period management.
- Cancel subscription endpoint (`app/api/subscription/cancel/`).
- Invoice history (`app/api/billing/invoices/`) — serves from local `billing_invoices` table first, falls back to provider API.
- Local invoice storage (`billing_invoices` table) — provider-safe copy of payment history.

### Dashboard — Settings
- Profile management (full_name, avatar_url).
- Dashboard language selection (en, ar, fr).
- Light/dark theme toggle.

---

### Storefront — Pages
- **Home page**: product grid with collection tab filtering.
- **Product page**: image gallery, variant selector, reviews, add-to-cart, FAQ accordion (with FAQPage JSON-LD schema for SEO).
- **Collection page**: products filtered by collection (`app/(storefront)/[slug]/collections/[collectionSlug]/`).
- **Cart page**: quantity management, coupon input, shipping/discount/total summary.
- **Order confirmation page**: order details, QR code, copy order number.

### Storefront — Shopping Cart
- Zustand-persisted cart (localStorage).
- Cross-store isolation (clears when switching stores).
- Add/remove items, quantity adjustment.
- Floating cart button.
- Cart repricing when market changes.

### Storefront — Checkout
- Customer form: name, phone, email, address, city, country, note.
- Client + server Zod validation.
- Payment: COD (Cash on Delivery).
- hCaptcha protection.
- Phone verification via Infobip SMS OTP (4-digit code).
  - Verification sheet (Drawer/bottom sheet) with segmented OTP input, auto-submit, auto-advance, paste support.
  - Rate-limited: max 3 requests per phone per 10 minutes, max 5 code attempts.
  - HMAC-signed verification token passed to order creation API.
  - Settings: `requireSmsOtp` toggle in Design Builder → Security tab.
- Order creation via `app/api/checkout/`.

### Storefront — Market & Currency
- Market/currency picker UI.
- Auto-detection via IP geolocation (ipapi.co).
- Fallback to default market.
- Prices displayed in selected market currency with exchange rate conversion.

### Storefront — Discounts (Customer-Facing)
- Coupon code input on cart.
- Real-time validation against discount rules.
- Applied discount display (amount + type).
- Dynamic total recalculation.

### Storefront — Shipping (Customer-Facing)
- Auto-detect shipping zone from customer location.
- City selection during checkout.
- Dynamic shipping rate calculation.
- Free shipping when threshold met.

### Storefront — Product Reviews
- Star ratings on product cards (home page + collection pages).
- Full reviews section on product pages: average rating, star breakdown, review cards.
- Three review card styles: Minimal, Card, Bubble (customizable via design builder).
- Client-side review sorting: Newest, Oldest, Highest Rated, Lowest Rated.
- Review submission page: HMAC-signed links sent via WhatsApp after delivery.
- Image upload: up to 3 images per review, compressed to WebP.
- Verified purchase badge for reviews from delivered orders.

### Storefront — Search
- Product search by name/description.
- Collection filtering via tabs.

### Storefront — Language
- 20 languages supported (en, ar, fr, es, pt, de, it, nl, tr, ru, zh, ja, ko, hi, id, ms, pl, sv, th, vi).
- RTL support for Arabic.
- Dynamic language switching with persistence.

### Storefront — Visual
- Store branding applied (colors, fonts, styles from design builder).
- Announcement bar with countdown timer.
- Desktop phone frame for mobile preview.
- Dark mode support.
- Responsive mobile-first layout (320px+).

---

### Public Pages & SEO
- **Landing page**: marketing page with CTAs, feature grid (15 features including order protection), pricing with 12 feature bullets, 12 FAQs, SEO schemas (FAQ, Organization, SoftwareApplication JSON-LD), OpenGraph + Twitter cards.
- **Blog**: MDX-based posts, categories (Getting Started, Growth, Social Commerce, Country Guides), featured posts with FadeIn animations, reading time, RSS/XML feed, related posts. Auto-generated table of contents from h2/h3 headings (no manual TOC in MDX files — the `TableOfContents` component handles it). Shell: sticky header with auth buttons + backdrop blur (matches compare/docs/landing style). Components in `components/blog/`, pages in `app/blog/`.
- **Documentation pages**: categories with icon badges, nested articles, step-by-step cards with screenshots, FAQ accordions, prev/next navigation, FadeIn animations, search. Arabic versions at `/ar/docs/` and French at `/fr/docs/` with localized metadata, JSON-LD (BreadcrumbList, FAQPage, HowTo), and hreflang linking across all 3 languages. Shell: `DocsShell` in `components/docs/docs-shell.tsx` accepts optional `locale` prop. Reusable page components in `components/docs/docs-home.tsx`, `docs-category.tsx`, `docs-article.tsx` accept `linkPrefix` prop.
- **Privacy Policy** and **Terms of Service**: available in EN (`/privacy`, `/terms`), AR (`/ar/privacy`, `/ar/terms`), and FR (`/fr/privacy`, `/fr/terms`) with localized metadata and hreflang linking. Components in `components/marketing/privacy-page.tsx` and `terms-page.tsx` (accept optional `locale` prop).
- **Comparison pages**: `/compare` index + `/compare/[platform]` pages (Shopify, WooCommerce, YouCan, Salla, ExpandCart, Ecwid, Wix, BigCommerce, EcoMadina, Instagram Selling, Facebook Marketplace). AR at `/ar/compare/`, FR at `/fr/compare/` — all with localized metadata, JSON-LD, and hreflang linking (en/ar/fr). Config in `lib/compare.ts`, components in `components/marketing/compare-page.tsx` and `compare-index.tsx` (accept optional `locale` prop). Translation keys in `compare.*` (en/ar/fr only).
- **Apps Store landing pages**: `/apps` index + `/apps/[slug]` pages (WhatsApp, Facebook Pixel, Google Sheets, TikTok Pixel, Google Analytics). AR at `/ar/apps/`, FR at `/fr/apps/` — all with localized metadata, SoftwareApplication + FAQPage + BreadcrumbList JSON-LD, and hreflang linking (en/ar/fr). Config in `lib/apps.ts`, components in `components/marketing/apps-index.tsx` and `apps-page.tsx` (accept optional `locale` prop). Translation keys in `apps.*` (en/ar/fr only).
- **Country redirect pages**: /dz, /ae, /ar, /eg, /ma, /sa, /tn.
- **Sitemap**: dynamic sitemap generation (per-store sitemaps at `app/(storefront)/[slug]/sitemap.ts`).
- **Robots.txt**: search engine crawler directives.

---

## API Endpoints

### Store
- `POST/GET /api/store/domain` — manage custom domain.
- `POST /api/store/domain/verify` — verify domain ownership.

### Products
- `POST/GET/PATCH/DELETE /api/products` — product CRUD.
- `GET /api/products/list` — list with pagination.
- `POST /api/products/reprice` — bulk reprice for market changes.
- `POST /api/products/import` — CSV bulk import (Shopify-compatible format).

### Orders
- `POST /api/orders` — create order.
- `GET /api/orders/list` — list with filters.
- `POST /api/orders/bulk-status` — bulk status update.
- `GET /api/orders/[id]` — order details.
- `GET /api/orders/export` — export filtered orders as CSV (streamed, rate-limited, Pro only).

### Customers
- `GET /api/customers/list` — paginated list with search, sort, country/tag/spent/order filters.
- `GET /api/customers/[customerId]` — customer detail + their orders.
- `PATCH /api/customers/[customerId]` — update tags/notes.
- `GET /api/customers/stats` — aggregate stats (total, new, repeat rate, avg value, top 5).
- `GET /api/customers/tags` — distinct tags for autocomplete.
- `GET /api/customers/export` — CSV export (streamed, rate-limited, Pro only).

### Discounts
- `POST/GET/PATCH/DELETE /api/discounts` — discount CRUD.
- `GET /api/discounts/validate` — validate coupon code.

### Markets
- `POST/GET/PATCH/DELETE /api/markets` — market CRUD.
- `GET /api/markets/route` — get market by request.
- `POST /api/markets/pricing` — get market pricing.
- `GET /api/markets/exchange-rate` — get exchange rates.
- `POST /api/markets/exclusions` — manage city exclusions.

### Shipping
- `POST/GET/PATCH/DELETE /api/shipping` — shipping zone CRUD.
- `GET /api/shipping/cities` — cities by country.
- `POST /api/shipping/lookup` — calculate shipping cost.

### Reviews
- `POST/GET/PATCH/DELETE /api/reviews` — review CRUD + public submission.
- `GET /api/reviews/list` — dashboard moderation list with filters.
- `PATCH /api/reviews/bulk` — bulk approve/reject/delete.
- `POST /api/reviews/upload-images` — public review image upload.

### Checkout
- `POST /api/checkout` — create checkout/order.
- `GET/POST /api/checkout-sessions` — manage checkout sessions.
- `GET /api/abandoned-checkouts/list` — list abandoned carts.
- `POST /api/cron/abandoned-checkouts` — cron recovery processing.

### Phone Verification
- `POST /api/verify-phone` — initiate SMS OTP verification.
- `POST /api/verify-phone/confirm` — confirm OTP code, return signed verification token.

### Integrations
- `POST/GET/PATCH/DELETE /api/integrations` — integration CRUD.
- `POST /api/integrations/events` — log integration events.
- WhatsApp: `connect`, `disconnect`, `status` routes.
- Google Sheets: `connect`, `disconnect`, `spreadsheets`, `sync`, `callback` routes.

### Media
- `POST /api/upload-images` — upload product images.
- `POST /api/scrape-url` — scrape URL for metadata/images.

### Auth
- `POST /api/auth/callback` — OAuth callback.
- `POST /api/recover/[token]` — password recovery.

### Webhooks
- `POST /api/webhooks/integrations` — integration event webhook.
- `POST /api/webhooks/whatsapp` — WhatsApp incoming messages.
- `POST /api/webhooks/polar` — Polar subscription webhook.

### Other
- `POST /api/ai/chat` — AI chat streaming.
- `POST /api/views` — track product views.
- `GET /api/billing/invoices` — invoice history.
- `POST /api/subscription/cancel` — cancel subscription.

---

## Data Models

### stores
- `id`, `owner_id`, `name`, `slug`, `description`, `currency`, `language`.
- `is_published`, `custom_domain`, `domain_verified`.
- `design_settings` (JSON — colors, font, border radius, button style, spacing, etc.).

### products
- `id`, `store_id`, `collection_id`, `slug` (auto-generated from name on INSERT via DB trigger, unique per store, immutable after creation), `name`, `description`, `price`, `compare_at_price`, `sku`, `stock` (0–1000).
- `status` (active/draft), `is_available`, `faqs` (JSONB array of `{ question, answer }`).

### product_images
- `id`, `product_id`, `url`, `position`.

### product_variants
- `id`, `product_id`, `options` (JSON), `price`, `compare_at_price`, `sku`, `stock`, `is_available`.

### collections
- `id`, `store_id`, `name`, `slug`, `sort_order`.

### orders
- `id`, `store_id`, `order_number`, `status`, `status_history` (JSON timeline).
- Customer: `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `customer_city`, `customer_country`.
- Totals: `total`, `subtotal`, `delivery_fee`, `discount_amount`, `currency`.
- `items`, `payment_method` (cod), `note`, `market_id`, `detected_country`, `ip_address`.

### order_items
- `id`, `order_id`, `product_id`, `product_name`, `variant_label`, `product_price`, `quantity`, `variant_options`.

### discounts
- `id`, `store_id`, `code`, `label`, `discount_type` (percentage/fixed), `discount_value`.
- `minimum_order_amount`, `max_uses`, `max_uses_per_customer`, `uses`.
- `starts_at`, `ends_at`, `is_active`, `market_ids`.

### markets
- `id`, `store_id`, `name`, `slug`, `currency`, `countries` (array).
- `pricing_mode` (fixed/auto), `exchange_rate`, `price_adjustment`, `rounding_rule`, `is_default`.

### market_prices
- `id`, `market_id`, `product_id`, `variant_id`, `price`.

### shipping_zones
- `id`, `store_id`, `country_code`, `country_name`, `default_rate`, `free_shipping_threshold`, `is_active`.

### shipping_city_rates
- `id`, `shipping_zone_id`, `store_id`, `city_name`, `rate`, `is_excluded`.

### store_integrations
- `id`, `store_id`, `integration_id` (whatsapp, meta-capi, google-sheets, tiktok-eapi, google-analytics).
- `config` (JSON), `enabled`.

### integration_events
- `id`, `store_id`, `integration_id`, `event_type`, `payload`, `status` (pending/completed/failed), `retry_count`.

### checkout_sessions
- `id`, `store_id`, `items`, `customer_info`, `cart_state`, `expires_at`, `is_abandoned`.

### customers
- `id`, `store_id`, `customer_phone` (normalized E.164), `customer_name`, `customer_email`, `customer_city`, `customer_country`, `customer_address`.
- `tags` (TEXT[]), `notes` (TEXT).
- `currency`, `total_spent`, `order_count`, `first_order_at`, `last_order_at`.
- `UNIQUE(store_id, customer_phone)`.
- Auto-populated via `upsert_customer_from_order` trigger on orders INSERT.
- Incremental stats via `update_customer_on_order_status` trigger on orders UPDATE.

### product_reviews
- `id`, `store_id`, `product_id`, `order_id`, `customer_name`, `customer_phone`.
- `rating` (1-5), `comment` (max 1000 chars), `image_urls` (max 3).
- `status` (pending/approved/rejected), `is_verified_purchase`.
- `UNIQUE(product_id, customer_phone)` — one review per customer per product.

### phone_verifications
- `id`, `store_id`, `phone`, `code_hash`, `method` (sms_otp).
- `status` (pending/verified/expired), `attempts`, `expires_at`.
- Accessed only via service role (admin client) — no RLS user-facing policies.
- Cleanup: pg_cron daily job deletes rows older than 24 hours.

### profiles
- `id` (Supabase auth uid), `full_name`, `avatar_url`, `subscription_status`, `trial_ends_at`.
- `billing_customer_id`, `billing_subscription_id` — provider-agnostic billing IDs (previously `polar_*`).

### billing_invoices
- `id`, `user_id`, `provider_invoice_id`, `amount`, `currency`, `status`, `billing_reason`, `created_at`.
- Local copy of invoices for provider migration safety. RLS: users can view own invoices.

---

## Business Logic

### Order Status Workflow
- Valid transitions: pending → confirmed → shipped → delivered. Also: any non-terminal → returned, any non-terminal → canceled.
- Terminal statuses: `delivered`, `canceled` — no further transitions allowed.

### Pricing & Currency
- **Fixed mode**: store owner sets prices per product/variant per market manually.
- **Auto mode**: base price × exchange rate × (1 + price_adjustment%), then apply rounding rule.
- Rounding rules: none, 0.99, 0.95, 0.00, nearest_5.

### Inventory
- Stock tracked per product and per variant.
- Max stock cap: 1000.
- Availability flag controls product/variant visibility.

### Discount Validation
- Coupon must be active, within date range, under max uses, under per-customer limit, above minimum order amount.
- Market-specific discounts only apply in matching markets.
- Percentage capped at 100%.

### Shipping Calculation
- Look up shipping zone by customer country.
- Check city-level overrides (custom rate or excluded).
- Apply free shipping if order total meets zone threshold.

### Cart
- Persisted via Zustand + localStorage.
- Isolated per store (clears when switching stores).
- Reprices when market/currency changes.

---

## Integrations

### WhatsApp
- OAuth-based connection to WhatsApp Business Account.
- Order confirmation notifications to customers.
- Abandoned checkout recovery messages.
- AI-generated messages with order context, fallback templates.
- Phone number normalization.
- Review link generation: tokenized review links appended to delivery notifications.

### Meta Conversions API (Facebook Pixel)
- Client-side events: ViewContent, AddToCart, InitiateCheckout.
- Server-side events: Purchase via Meta CAPI.
- Test mode with test_event_code.
- Config: `{ pixel_id, access_token, test_event_code?, test_mode }`.

### Google Sheets
- OAuth connection, spreadsheet selection, column mapping.
- 20+ available order fields for mapping.
- Auto-sync on new orders, manual sync button.
- Abandoned checkout logging.
- Token refresh, revoke access.

### TikTok Event API
- Pixel/access token setup.
- Events: Purchase, ViewContent, AddToCart, InitiateCheckout.
- Test event code support.

### Google Analytics
- GA ID configuration.
- Passive event tracking on storefront.

### Event System
- Event types: `order.created`, `order.status_changed`, `checkout.abandoned`.
- `order.status_changed` payload includes product items for review link generation on delivery.
- Webhook dispatch to registered integrations.
- Retry logic with pg_cron, status tracking (pending/completed/failed), retry counter.

---

## External Services
- **Supabase** — database, auth, RLS.
- **Polar** — subscription billing (abstracted via `lib/billing.ts`).
- **WhatsApp Business API** — order notifications.
- **Meta Conversions API** — conversion tracking.
- **Google Sheets API** — order syncing.
- **Google Analytics** — analytics tracking.
- **TikTok Event API** — conversion tracking.
- **Infobip** — phone verification (SMS OTP) for fake order prevention.
- **hCaptcha** — checkout CAPTCHA protection.
- **ipapi.co** — IP geolocation for market detection.
- **Vercel** — deployment.
