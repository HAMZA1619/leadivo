# SEO & Content Plan

Global SaaS SEO strategy. Homepage targets worldwide. Country pages (`/dz`, `/ma`, etc.) handle local SEO.
Content + community + social = free traffic flywheel.

---

## URL Architecture

```
/              → English, global (no country mentions)
/fr            → French, global (targets Francophone world)
/ar            → Arabic, global (targets Arabic-speaking world)
/dz            → Algeria-specific (French default, local keywords, local ecosystem)
/ma            → Morocco-specific
/tn            → Tunisia-specific
/sa            → Saudi Arabia-specific
/eg            → Egypt-specific
/ae            → UAE-specific
/compare/*     → Competitor comparison pages
/blog/*        → Content marketing
/docs/*        → Knowledge base (already exists)
/customers     → Testimonials & success stories (planned)
/changelog     → Public changelog (planned)
```

**How `hreflang` connects them:**
```
/    → hreflang="en"           (English, any country)
/fr  → hreflang="fr"           (French, any country)
/ar  → hreflang="ar"           (Arabic, any country)
/dz  → hreflang="fr-DZ"        (French, Algeria specifically)
/ma  → hreflang="fr-MA"        (French, Morocco specifically)
/sa  → hreflang="ar-SA"        (Arabic, Saudi specifically)
```

Google uses this to serve the right page: a French user in Canada sees `/fr`, a French user in Algeria sees `/dz`.

---

## Current SEO Audit — What's Already Done

- [x] Root metadata (title template, description, keywords, OG, Twitter cards)
- [x] JSON-LD on homepage (SoftwareApplication, Organization, FAQPage)
- [x] Dynamic sitemap.ts (homepage, docs, blog, comparison pages, legal pages)
- [x] robots.ts (blocks /dashboard, /api, /auth + AI bot rules)
- [x] Canonical URLs on all pages
- [x] Security headers in next.config.ts
- [x] Dynamic per-store metadata (title, description, OG image)
- [x] Dynamic per-product metadata (title, images, OG)
- [x] Dashboard excluded from indexing (noindex, nofollow)
- [x] Docs system with 50+ articles, category/article structure, FAQs
- [x] Blog system with 22 posts (8 global + 14 country-specific), trilingual
- [x] 11 comparison pages (Shopify, WooCommerce, YouCan, Salla, ExpandCart, Ecwid, Wix, BigCommerce, EcoMadina, Instagram Selling, Facebook Marketplace)
- [x] 7 country landing pages with JSON-LD and hreflang
- [x] RSS feed at /blog/feed.xml
- [x] PWA manifest configured
- [x] Per-store sitemaps for merchant storefronts
- [x] llms.txt for LLM indexing
- [x] security.txt in .well-known
- [x] 20-language support with RTL
- [x] Analytics: GA4, Facebook Pixel, TikTok Pixel, Meta CAPI integration

---

## High Priority

### 1. Homepage Copy — Global Positioning

The homepage must feel like a **worldwide SaaS** — no mention of any specific country, region, or local ecosystem.
Country-specific SEO lives on dedicated pages (`/dz`, `/ma`, `/sa`, etc.).

**Global keywords for homepage:**
- Primary: "online store builder", "create online store free", "ecommerce platform"
- Secondary: "link in bio store", "social media store", "no-code ecommerce"
- Long-tail: "sell on Instagram without website", "WhatsApp order store", "COD ecommerce platform"
- Social commerce: "sell on TikTok", "sell on Instagram", "social selling platform"

**What to highlight on homepage (global appeal):**
- [ ] Social-to-store value prop (turn followers into customers)
- [ ] No coding, free to start, instant setup
- [ ] WhatsApp orders + COD support (as a global feature, not region-specific)
- [ ] Multi-language stores (20+ languages — show as a feature, not a region)
- [ ] Trust signals: "Used by sellers in X+ countries"
- [ ] Mobile-first storefront design
- [ ] Built-in analytics (COD tracking, order insights)

**What NOT to put on homepage:**
- No country names (Algeria, Morocco, Saudi, etc.)
- No local ecosystem names (delivery companies, local payment providers)
- No "Arabic-first" messaging (say "multi-language" instead)
- No MENA/Africa/region references — keep it universal

### 2. Language Landing Pages (`/fr` + `/ar`)

These are **translated versions of the global homepage** — same universal messaging, different language. No country-specific content.

**`/fr` — French Global Landing Page:**
- [x] Full French translation of homepage (not machine-translated)
- [x] Meta title: "Créez votre boutique en ligne gratuitement | Leadivo"
- [x] Meta description targeting French global keywords: "créer boutique en ligne", "plateforme e-commerce sans code"
- [x] Mirror all JSON-LD structured data in French
- [x] Add to sitemap with priority 0.9
- [x] `hreflang="fr"` (French, no country restriction)

**`/ar` — Arabic Global Landing Page:**
- [x] Full Arabic translation of homepage with RTL layout
- [x] Meta title: "أنشئ متجرك الإلكتروني مجاناً | Leadivo"
- [x] Meta description targeting Arabic global keywords: "إنشاء متجر إلكتروني", "منصة تجارة إلكترونية"
- [x] Mirror all JSON-LD structured data in Arabic
- [x] Add to sitemap with priority 0.9
- [x] `hreflang="ar"` (Arabic, no country restriction)

**Add `hreflang` alternates in root layout metadata:**
```ts
alternates: {
  languages: {
    'en': '/',
    'fr': '/fr',
    'ar': '/ar',
  }
}
```

### 3. Country Landing Pages — Where Local SEO Lives

This is where all country-specific keywords and copy go.
These pages rank for "[country] + ecommerce" searches while the homepage ranks globally.

**Routes (priority order — start with `/dz`):**
- [x] `/dz` — Algeria
- [x] `/ma` — Morocco
- [x] `/tn` — Tunisia
- [x] `/sa` — Saudi Arabia
- [x] `/eg` — Egypt
- [x] `/ae` — UAE

**Each country page should include:**
- Hero with country name: "Create Your Online Store in [Country]"
- Country-specific keywords in meta title/description
- How Leadivo solves problems specific to that market
- Local success stories / testimonials (when available)
- Localized pricing display (local currency)
- Language toggle (EN/FR for `/dz`, EN/AR for `/sa`)
- `hreflang` linking between country variants + global pages
- JSON-LD with `areaServed` for the specific country
- Add to sitemap with priority 0.8

**`/dz` Algeria — Full Keyword Plan (your strongest niche):**

Target keywords:
- EN: "create online store Algeria", "ecommerce platform Algeria", "best online store builder Algeria"
- FR: "créer boutique en ligne Algérie", "plateforme e-commerce Algérie", "vendre en ligne Algérie"
- AR: "إنشاء متجر إلكتروني الجزائر", "أفضل منصة متجر إلكتروني الجزائر"
- Long-tail: "how to sell online in Algeria", "comment vendre en ligne en Algérie"
- COD-specific: "reduce failed deliveries Algeria", "COD analytics Algeria"

Content to include on `/dz`:
- [x] Hero: "Create Your Online Store in Algeria" / "Créez votre boutique en ligne en Algérie"
- [x] Highlight COD analytics ("reduce failed deliveries", "track return rates")
- [x] Mention local delivery ecosystem (Yalidine, EcoTrack, ZR Express, etc.)
- [x] French is the default language (most Algerians search in French)
- [x] Meta title (FR): "Créer une boutique en ligne en Algérie | Leadivo"
- [x] Meta title (EN): "Create Your Online Store in Algeria | Leadivo"
- [x] FAQ section targeting "how to sell online in Algeria" queries
- [x] `hreflang="fr-DZ"` so Google serves this to Algerian users instead of `/fr`

### 4. Web App Manifest (PWA)

**Why:** Improves mobile experience signals, enables "Add to Home Screen", and Google considers PWA signals.

**Action items:**
- [x] Create `public/manifest.json`
- [x] Link manifest in root layout metadata
- [ ] Add `theme-color` meta tag

### 5. Technical SEO Fixes

**Performance (Core Web Vitals):**
- [ ] Audit with Lighthouse — target 90+ on all metrics
- [x] Ensure all images use Next.js `<Image>` with proper `width`, `height`, and `priority` on LCP images
- [ ] Add `fetchPriority="high"` to hero images
- [ ] Lazy load below-fold images and components
- [ ] Preload critical fonts: `<link rel="preload" as="font">`
- [ ] Minimize client-side JS — audit `"use client"` directives, move logic to server where possible
- [x] Enable Next.js `optimizePackageImports` for large libraries (lucide-react, etc.)

**Crawlability:**
- [x] Add `BreadcrumbList` JSON-LD to docs pages for rich navigation snippets
- [x] Add `Product` JSON-LD to storefront product pages (price, availability, images)
- [ ] Ensure all internal links use `<Link>` (not `<a>`) for client-side navigation
- [x] Add `alt` text to every image — audit all `<Image>` components
- [ ] Fix any orphan pages (pages with no internal links pointing to them)

**Indexing:**
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Request indexing for key pages manually after launch
- [ ] Monitor "Coverage" report in GSC for crawl errors
- [ ] Add dynamic store pages to sitemap (top stores by traffic)

**Security headers to add:**
- [x] `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HSTS)
- [ ] Review Content-Security-Policy for any blocked resources

---

## Medium Priority

### 6. Comparison Pages — Expand & Localize

**Already done:**
- [x] `/compare` — overview page
- [x] `/compare/shopify` — Leadivo vs Shopify
- [x] `/compare/woocommerce` — Leadivo vs WooCommerce
- [x] `/compare/youcan` — Leadivo vs YouCan
- [x] `/compare/salla` — Leadivo vs Salla
- [x] FAQPage JSON-LD on each comparison page
- [x] In sitemap with priority 0.7

**New comparison pages to create:**
- [x] `/compare/expandcart` — Leadivo vs Expandcart (popular in Egypt)
- [x] `/compare/ecwid` — Leadivo vs Ecwid
- [x] `/compare/wix` — Leadivo vs Wix
- [x] `/compare/bigcommerce` — Leadivo vs BigCommerce
- [x] `/compare/ecomadina` — Leadivo vs EcoMadina (MENA competitor)
- [x] `/compare/instagram-selling` — Leadivo vs selling on Instagram directly (your real competitor for social sellers)
- [x] `/compare/facebook-marketplace` — Leadivo vs Facebook Marketplace selling

**Arabic comparison pages (huge opportunity — almost zero competition):**
- [x] Arabic versions targeting: `ليديفو مقابل يوكان`, `ليديفو مقابل سلة`, `ليديفو مقابل شوبيفاي` — all 11 platforms at `/ar/compare/[platform]`
- [x] Target keywords: `[competitor] alternative` / `بديل [competitor]` / `بديل شوبيفاي عربي` — included in Arabic meta keywords
- [x] Target keywords: `[competitor] pricing` / `اسعار [competitor]` — included in Arabic meta keywords

**"Alternative" keyword pages:**
- [ ] Create pages targeting `[competitor] alternative` for each competitor
- [ ] Both English and Arabic versions
- [ ] These have high commercial intent and low competition in Arabic

### 7. Blog / Content Section

**Route:** `/blog`

**Technical setup (all done):**
- [x] MDX blog system with trilingual support (en/ar/fr)
- [x] Dynamic metadata per post (title, description, OG image, author)
- [x] Article + FAQPage + HowTo + BreadcrumbList JSON-LD
- [x] Blog index page with category filtering
- [x] Category/tag system (Getting Started, Growth, Social Commerce, Country Guides)
- [x] Add blog posts to sitemap dynamically
- [x] RSS feed at `/blog/feed.xml`
- [x] Auto-generated table of contents from h2/h3 headings
- [x] Related posts (3 per article)
- [x] 22 posts published (8 global + 14 country-specific)

**Published articles:**
- [x] How to Start Selling Online
- [x] Reduce COD Return Rates
- [x] Instagram to Store
- [x] WhatsApp Commerce Guide
- [x] COD vs Online Payment
- [x] Product Page That Converts
- [x] TikTok to Store
- [x] Pricing for COD Markets
- [x] Country guides: DZ, MA, SA, EG, TN, AE, NG (×2 each)

**Next wave — "Fake Orders" content angle (YOUR UNFAIR ADVANTAGE):**

Fake orders are the #1 pain point for COD sellers in MENA. You have actual solutions (SMS OTP, hCaptcha). Almost zero competition for this content.

| # | Title | Target Keyword | Language | Priority |
|---|-------|----------------|----------|----------|
| 1 | How to Reduce Fake COD Orders by 80% | "fake orders COD", "الطلبات الوهمية" | EN + AR + FR | **Critical** |
| 2 | The Real Cost of Fake Orders in Algeria/Morocco | "تكلفة الطلبات الوهمية" | FR + AR | High |
| 3 | Phone Verification for E-commerce: Complete Guide | "SMS verification ecommerce" | EN | High |
| 4 | How to Protect Your COD Store from Fraud | "COD fraud prevention" | EN + AR | High |

**Programmatic SEO — "Category × Country" pages (350+ pages):**

Generate template-based pages at scale:

| Template | Example | Volume |
|----------|---------|--------|
| "How to sell [category] online in [country]" | "How to sell clothing online in Algeria" | 50 categories × 7 countries = 350 pages |
| "Best [category] store examples" | "Best fashion store examples" | 50 pages |
| "[City] e-commerce guide" | "Algiers e-commerce guide" | 20+ pages |

**Arabic e-commerce glossary (programmatic SEO):**
- [ ] Create glossary pages for e-commerce terms in Arabic
- [ ] Target: `ما هو الدروبشيبينغ`, `ما معنى COD`, `ما هو معدل التحويل`
- [ ] Many Arabic speakers search for translations of e-commerce concepts
- [ ] Each term gets its own page — excellent for long-tail SEO

**Integration-specific landing pages:**
- [x] "WhatsApp Integration for E-commerce Stores" — `/apps/whatsapp` + `/ar/apps/whatsapp`
- [x] "Facebook Pixel for COD Stores" — `/apps/facebook-pixel` + `/ar/apps/facebook-pixel`
- [x] "Google Sheets Order Tracking for E-commerce" — `/apps/google-sheets` + `/ar/apps/google-sheets`
- [x] "TikTok Pixel Setup for Online Stores" — `/apps/tiktok-pixel` + `/ar/apps/tiktok-pixel`
- [x] Google Analytics for Online Stores — `/apps/google-analytics` + `/ar/apps/google-analytics`
- [x] Target: "[integration] + e-commerce" keywords — included in EN + AR metadata

**Content guidelines:**
- Global articles in English only (unless high-volume French/Arabic keyword exists)
- Regional articles in English + local language (FR for Algeria, AR for Saudi)
- **Arabic content has dramatically less competition than English** — a well-written Arabic blog post can rank page 1 in weeks
- 1500–2500 words per article
- Include at least 2 internal links to product features or docs
- Include a CTA at the end ("Start your free trial on Leadivo")
- Add table of contents for articles over 1500 words
- Regional blog posts should link to corresponding country page (`/dz`, `/ma`, etc.)
- Embed YouTube tutorials in relevant blog posts (when created)

### 8. Docs SEO Enhancements

**Action items:**
- [x] Add `BreadcrumbList` JSON-LD to all doc pages
- [x] Add `HowTo` JSON-LD to step-by-step guides (EN, AR, FR)
- [x] Ensure docs have unique meta descriptions (not auto-generated)
- [x] Arabic docs at `/ar/docs/` with Arabic metadata, BreadcrumbList, FAQPage, HowTo JSON-LD
- [x] French docs at `/fr/docs/` with French metadata, BreadcrumbList, FAQPage, HowTo JSON-LD
- [x] `hreflang` linking between EN, AR, FR docs (all pages)
- [x] All AR/FR docs URLs added to sitemap
- [ ] Add search-friendly headings with keywords
- [ ] Internal link from blog articles to relevant docs
- [ ] Add `dateModified` to doc metadata for freshness signals

### 9. Open Graph Image Generation

**Why:** Custom OG images dramatically improve CTR from social shares and search.

**Action items:**
- [ ] Create dynamic OG image generation using `next/og` (ImageResponse API)
- [ ] Route: `app/api/og/route.tsx`
- [ ] Generate branded images with: page title, Leadivo logo, gradient background
- [ ] Use for: homepage, blog posts, comparison pages, docs
- [ ] Template variants:
  - Blog post: title + author + reading time
  - Comparison: "Leadivo vs X" with both logos
  - Docs: category icon + article title

---

## Low Priority

### 10. Social Proof & Conversion (CRITICAL GAP)

Your landing page has zero social proof. This kills conversion for visitors who find you via SEO.

**Landing page social proof (add immediately):**
- [ ] Add user/store count: "X+ stores created" or "Trusted by X+ sellers"
- [ ] Add 3-5 merchant testimonials with real photos and store names
- [ ] Add trust badges (SSL, secure, etc.)
- [ ] Add "Store of the week" showcase section
- [ ] Add country flags showing where sellers are active

**Testimonials / Case Studies page:**
- [ ] Create `/customers` or `/success-stories` route
- [ ] Collect 5-10 real testimonials from active stores
- [ ] Include: store name, niche, results (orders, revenue growth)
- [ ] Add `Review` JSON-LD schema with aggregate rating
- [ ] Add video testimonials if possible (YouTube embeds)

**Public changelog:**
- [ ] Create `/changelog` page showing recent updates
- [ ] Prospects can see the platform is actively developed
- [ ] Good for SEO (fresh content, regular updates)

### 11. Email & Newsletter Capture (CRITICAL GAP)

You're losing every visitor who isn't ready to sign up today.

- [ ] Add email capture to landing page (e.g., "Get free e-commerce tips" or "Free COD selling guide")
- [ ] Add email capture to blog sidebar/footer
- [ ] Create a lead magnet: "Free Guide: How to Start Selling Online in [Country]" (PDF)
- [ ] Set up email drip sequence for captured leads
- [ ] Add exit-intent popup with offer (optional)

### 12. Link Building Strategy

**Free directory listings (do this week):**
- [ ] AlternativeTo.net — list as alternative to Shopify, YouCan, Salla
- [ ] G2 — create profile, ask early users for reviews
- [ ] Capterra — create profile
- [ ] TrustPilot — create profile
- [ ] Product Hunt — launch (see Section 16)
- [ ] SaaSHub, BetaList, SideProjectors
- [ ] Arabic tech/startup directories

**Ongoing link building:**
- [ ] Submit to ecommerce/tech blogs for reviews
- [ ] Guest post on business/tech blogs in target markets
- [ ] Create a "Made with Leadivo" badge that links back (for storefronts)
- [ ] Create shareable resources (infographics about COD ecommerce, fake order stats)
- [ ] Answer Quora Arabic (كورا بالعربي) questions about ecommerce
- [ ] Answer Reddit questions (r/arabs, country-specific subreddits)

**Technical content for backlinks (Dev.to / Hashnode):**
- [ ] "How we handle 20 languages with RTL support in Next.js"
- [ ] "Building a multi-tenant e-commerce platform with Supabase RLS"
- [ ] "Implementing phone verification for COD markets"
- [ ] These generate high-quality backlinks from developer communities

### 13. Local SEO

**Action items:**
- [ ] Create Google Business Profile (if applicable)
- [ ] Add `Organization` JSON-LD with address
- [ ] Ensure NAP (Name, Address, Phone) consistency across all listings

---

## Free Traffic & Brand Awareness

### 14. YouTube Strategy (Arabic E-commerce YouTube is Exploding)

Arabic e-commerce tutorials get 50k-500k views with low competition. YouTube is the #2 search engine.

**Videos to create (priority order):**

| # | Title | Target Keyword | Language | Priority |
|---|-------|----------------|----------|----------|
| 1 | How to create an online store in 10 minutes | "انشاء متجر الكتروني" | Arabic | **Critical** |
| 2 | How to stop fake COD orders | "الطلبات الوهمية" | Arabic | High |
| 3 | Best way to sell online in Algeria 2026 | "البيع اونلاين في الجزائر" | Arabic + French | High |
| 4 | Shopify vs Leadivo for Arab sellers | "شوبيفاي مقابل ليديفو" | Arabic | High |
| 5 | How to set up shipping zones | "اعداد مناطق الشحن" | Arabic | Medium |
| 6 | Design your store in 5 minutes (design builder) | "تصميم متجر الكتروني" | Arabic | Medium |
| 7 | How to sell online in Morocco/Tunisia/Saudi | country-specific | Arabic + FR | Medium |
| 8 | WhatsApp selling tips for beginners | "البيع عبر واتساب" | Arabic | Medium |

**YouTube SEO:**
- Arabic titles, tags, descriptions, and timestamps
- End screens linking to signup
- Embed videos on landing page, blog posts, and docs
- Create a branded intro/outro

**Content format:**
- Screen recordings with Arabic voiceover
- 5-15 minutes per video
- Thumbnail with Arabic text (high CTR in MENA)

### 15. Social Media Organic Growth

**Facebook Groups (WHERE YOUR USERS LIVE — #1 free channel for MENA):**
- [ ] Join 10-15 Arabic e-commerce Facebook Groups:
  - Algerian: التجارة الالكترونية في الجزائر (50k-200k members)
  - Moroccan: dropshipping/e-commerce groups
  - Tunisian: entrepreneur groups
  - Saudi/UAE: small business groups
  - Generic: Arabic e-commerce groups
- [ ] Post educational content (NOT links) — pricing tips, fake order prevention, shipping advice
- [ ] Answer questions, link to blog when relevant
- [ ] Share case studies of stores built on Leadivo
- [ ] Create "challenges": "Build your store in 30 minutes — here's how"
- **This is exactly how YouCan grew in Morocco**

**TikTok (organic reach still high in MENA):**
- [ ] 30-second store creation timelapses
- [ ] "POV: You just got a fake order" → show SMS verification feature
- [ ] Before/after: ugly generic store → beautiful Leadivo store
- [ ] "Things Shopify sellers in MENA wish they knew" → COD, local currencies, Arabic RTL
- [ ] Cross-post all content to Instagram Reels

**Instagram:**
- [ ] Post merchant store showcases: "Store of the week"
- [ ] Before/after design builder transformations
- [ ] Carousel posts: "5 features that help you sell more"
- [ ] Reels: same content as TikTok, cross-posted

**Twitter/X (Arabic tech/business community):**
- [ ] Build in public: share feature launches, user milestones
- [ ] Engage with Arabic startup/e-commerce accounts
- [ ] Thread format: "10 things I learned building an e-commerce platform for Arab sellers"
- [ ] Tag and engage with other indie makers

### 16. Community Building

**WhatsApp (dominant messaging platform in MENA):**
- [ ] Create a WhatsApp Channel (broadcast) for tips and product updates
- [ ] Create country-specific WhatsApp groups (Algeria sellers, Morocco sellers, etc.)
- [ ] These become self-sustaining communities where sellers help each other

**Facebook Group (position as community, not product group):**
- [ ] Create "Arab E-Commerce Sellers" group (NOT "Leadivo Users")
- [ ] Weekly tips thread
- [ ] Monthly "share your store" thread
- [ ] Q&A sessions
- [ ] Guest expert sessions with successful MENA sellers

**Telegram:**
- [ ] Create a Telegram channel for updates
- [ ] Create a group for community discussion
- [ ] Cross-post blog content and tips

### 17. Product Hunt & Maker Community Launch

**Product Hunt launch:**
- [ ] Positioning: "The e-commerce platform built for COD markets"
- [ ] Tagline: "E-commerce platform for markets where cash is king"
- [ ] Best day: Tuesday or Wednesday
- [ ] Prepare: hunter, 5+ makers, pre-written social posts
- [ ] Email existing users asking for support
- [ ] The MENA/COD angle is genuinely interesting to Western tech audiences

**Indie Hackers:**
- [ ] Create product page
- [ ] Post: "I built an e-commerce platform for a $50B market that Shopify ignores"
- [ ] Share revenue milestones (gets shared widely)

**Hacker News:**
- [ ] "Show HN" post with the MENA/COD story
- [ ] Technical angle: multi-tenant Next.js, 20-language support, Supabase RLS

### 18. Referral & Ambassador Program

- [ ] Create referral link system for existing users
- [ ] Reward: extended trial or feature perks for referrals
- [ ] Identify most active early users as ambassadors
- [ ] Many MENA social sellers have their own audiences — they bring other sellers
- [ ] "Made with Leadivo" badge on storefronts linking back

### 19. Arabic Press & Podcasts

**Arabic tech media (free PR):**
- [ ] Pitch story to: Wamda, Magnitt, Arabnet, Unlimit Tech
- [ ] Angle: "Algerian/Moroccan founder builds e-commerce platform for MENA"
- [ ] The local founder angle gets coverage that generic pitches don't

**Arabic podcast guesting:**
- [ ] Target: Swalif Business (سوالف بزنس), Podeo Arabic shows, Finyal Arabic business podcasts
- [ ] Pitch: "The reality of e-commerce in North Africa" or "Why COD still dominates Arab e-commerce"
- [ ] Arabic business/tech podcasts have fewer guests available — easier to get booked

**University & startup ecosystem:**
- [ ] Offer free workshops at incubators: Flat6Labs, Startupbootcamp MENA, TPME (Algeria)
- [ ] University entrepreneurship clubs: "Launch your store in 1 hour"
- [ ] Young sellers are your ICP — these relationships generate loyal early adopters

### 20. Enriched Country Pages

Current country pages need real content, not just redirects. Each should be a comprehensive local guide.

**Content to add to each country page:**
- [ ] Local success stories / merchant testimonials
- [ ] Local delivery ecosystem details (Yalidine, EcoTrack for Algeria, etc.)
- [ ] Local payment context (COD dominance stats, mobile money)
- [ ] Local e-commerce market size and growth stats
- [ ] Common challenges in that market + how Leadivo solves them
- [ ] Local language keywords in meta tags

**Arabic keyword targets per country:**
| Country | High-Value Arabic Keywords |
|---------|--------------------------|
| Algeria | `إنشاء متجر إلكتروني الجزائر`, `أفضل منصة متجر الجزائر`, `البيع اونلاين الجزائر` |
| Morocco | `إنشاء متجر إلكتروني المغرب`, `أفضل منصة بيع المغرب` |
| Saudi | `إنشاء متجر إلكتروني السعودية`, `بديل سلة`, `منصة تجارة الكترونية` |
| Egypt | `إنشاء متجر إلكتروني مصر`, `أفضل منصة بيع مصر` |
| Tunisia | `créer boutique en ligne Tunisie`, `منصة تجارة تونس` |
| UAE | `إنشاء متجر إلكتروني الامارات`, `منصة بيع اونلاين دبي` |

---

## Ongoing SEO Practices

### Monthly Tasks
- [ ] Review Google Search Console for new keyword opportunities
- [ ] Check for crawl errors and fix broken links
- [ ] Update sitemap if new pages added
- [ ] Publish at least 2 blog posts
- [ ] Monitor Core Web Vitals and fix regressions
- [ ] Check competitor rankings for target keywords

### Quarterly Tasks
- [ ] Full Lighthouse audit on key pages
- [ ] Update comparison pages with new features
- [ ] Refresh outdated content (update dates, stats, screenshots)
- [ ] Review and update JSON-LD schemas
- [ ] Analyze top-performing content and create similar topics
- [ ] A/B test meta titles/descriptions for CTR improvement

### Tools to Set Up
- [ ] **Google Search Console** — indexing, keywords, errors
- [ ] **Google Analytics 4** — traffic, conversions, user behavior
- [ ] **Bing Webmaster Tools** — secondary search engine coverage
- [ ] **Ahrefs or Semrush** (free tier) — keyword tracking, backlink monitoring
- [ ] **PageSpeed Insights** — Core Web Vitals monitoring
- [ ] **Schema Markup Validator** — test all JSON-LD regularly

---

## Key Differentiators to Push in All Content

| Differentiator | Why It Matters | Competitors Lacking This |
|---------------|---------------|------------------------|
| Fake Order Protection | SMS OTP + hCaptcha — #1 pain point for COD sellers | No competitor has built-in phone verification |
| COD Analytics | Reduce failed deliveries, track return rates | Shopify, Wix, BigCommerce |
| Multi-language Stores | 20+ languages in one store, RTL native | Most support 1-2 languages |
| Mobile-first Storefront | Optimized for mobile shoppers worldwide | Most platforms are desktop-first |
| Social-to-Store | Turn Instagram/TikTok followers into buyers | Requires plugins on competitors |
| No Coding Required | Instant setup, drag-and-drop | WooCommerce requires dev skills |
| WhatsApp Integration | Native order notifications via WhatsApp | Most require third-party tools |
| Multi-Market Pricing | Auto exchange rates, rounding rules, city-level shipping | Shopify requires apps for this |
| Customer Database (CRM) | Auto-populated from orders, tags, notes, phone normalization | Shopify requires separate CRM |
| 14-day Free Trial | Try all features before paying | Shopify charges from day 1 |

---

## Keyword Research Summary

### Global Keywords (Homepage + `/fr` + `/ar`)
| Keyword | Language | Monthly Volume (est.) | Competition |
|---------|----------|----------------------|-------------|
| online store builder | EN | 50K-100K | High |
| create online store free | EN | 10K-50K | Medium |
| sell on Instagram without website | EN | 5K-10K | Low |
| link in bio store | EN | 5K-10K | Medium |
| no-code ecommerce | EN | 1K-5K | Low |
| WhatsApp order store | EN | 1K-5K | Very Low |
| COD ecommerce platform | EN | 1K-5K | Very Low |
| créer boutique en ligne | FR | 10K-50K | Medium |
| إنشاء متجر إلكتروني | AR | 5K-10K | Medium |
| Shopify alternative | EN | 10K-50K | Medium |

### Algeria Keywords (for `/dz` page + blog only)
| Keyword | Language | Monthly Volume (est.) | Competition |
|---------|----------|----------------------|-------------|
| create online store Algeria | EN | 500-1K | Low |
| créer boutique en ligne Algérie | FR | 1K-5K | Low |
| إنشاء متجر إلكتروني الجزائر | AR | 1K-5K | Low |
| best ecommerce platform Algeria | EN | 100-500 | Low |
| how to sell online in Algeria | EN | 500-1K | Low |
| comment vendre en ligne en Algérie | FR | 500-1K | Low |
| ecommerce Algeria 2026 | EN | 500-1K | Low |

### Brand Keywords (Monitor)
| Keyword | Purpose |
|---------|---------|
| Leadivo | Brand searches — should rank #1 |
| Leadivo reviews | Reputation — needs testimonials page |
| Leadivo vs Shopify | Comparison — needs comparison page |
| is Leadivo legit | Trust — needs social proof |

---

## Implementation Priority Order

### Week 1 — Quick Wins (Highest ROI, Lowest Effort)
- [ ] Add social proof to landing page (store count, testimonials, trust badges)
- [ ] Add email/newsletter capture to landing page and blog
- [ ] Submit to free directories: AlternativeTo, G2, Capterra, SaaSHub, BetaList
- [ ] Create WhatsApp Channel for tips and updates
- [ ] Join 10 Arabic Facebook Groups and start observing

### Week 2 — Content Engine
- [ ] Write "How to Reduce Fake COD Orders by 80%" blog post (EN + AR + FR)
- [ ] Write 2 more Arabic-first blog posts targeting low-competition keywords
- [ ] Enrich country pages with real content, local keywords, local context
- [ ] Start contributing in Facebook Groups (educational content, not links)

### Week 3-4 — Video & Expansion
- [ ] Record first 3 Arabic YouTube tutorials (store creation, fake orders, design builder)
- [ ] Create 3 new comparison pages (Expandcart, Ecwid, Instagram selling)
- [ ] Create Arabic comparison page versions
- [ ] Start TikTok/Reels content (store creation timelapses)

### Month 2 — Community & Launch
- [ ] Launch on Product Hunt
- [ ] Post on Indie Hackers + Hacker News (Show HN)
- [ ] Create Facebook Group for Arab E-Commerce Sellers
- [ ] Write technical blog posts on Dev.to/Hashnode for backlinks
- [ ] Start programmatic SEO: first batch of "category × country" pages
- [ ] Pitch Arabic tech media (Wamda, Magnitt, Arabnet)

### Month 3 — Scale
- [ ] Arabic podcast outreach and guesting
- [ ] Set up referral/ambassador program
- [ ] Expand programmatic SEO (glossary pages, integration pages)
- [ ] University/incubator workshop outreach
- [ ] Create public changelog page
- [ ] Create `/customers` success stories page

### Ongoing
- [ ] 4 blog posts/month (2 Arabic, 1 English, 1 French)
- [ ] 2 YouTube videos/month
- [ ] 3-5 TikTok/Reels per week
- [ ] Daily Facebook Group engagement
- [ ] Weekly WhatsApp Channel tip
- [ ] Monthly GSC review + keyword opportunity analysis
- [ ] Quarterly comparison page updates + content refresh

---

## Competitor Traction Insights (What Worked for Them)

| Platform | Market | How They Grew | Key Lesson for Leadivo |
|----------|--------|---------------|----------------------|
| Shopify | Global | Owned "how to start an online store" content early, app ecosystem created evangelists | Own Arabic content for this keyword NOW |
| Salla | Saudi | Arabic-first content, WhatsApp/Twitter community, Saudi government support | Hyper-local focus + Arabic content |
| YouCan | Morocco | YouTube tutorials (AR+FR), Facebook Groups, free tier for volume | Community-first in Facebook Groups + bilingual content |
| Expandcart | Egypt | Arabic SEO content, webinars for Arab entrepreneurs, payment partnerships | Educational content in Arabic has almost no competition |

**Common pattern:** All started with geographic/linguistic focus → community before paid marketing → educational content (blog + YouTube) as primary acquisition.

---

## The #1 Insight

**Arabic-language content about e-commerce has dramatically less competition than English.**

A well-written Arabic blog post targeting `كيف تبدأ التجارة الالكترونية في الجزائر` can rank on page 1 within weeks, while the equivalent English content would take months. Your 20-language, RTL-ready infrastructure is a genuine competitive advantage — lean into it aggressively for content and SEO.

---

## Research Sources
- Google Keyword Planner — global + regional volume data
- Ahrefs/Semrush keyword explorer — competition analysis
- Google Search Console data (once set up)
- E-commerce in Algeria 2026 Guide — ecommaps.com
- E-commerce in MENA — Bain & Company
- COD Challenges in MENA — istizada.com
- Competitor analysis: Shopify, Salla, YouCan, Expandcart growth strategies
- MENA social media usage data — Facebook Groups, WhatsApp, TikTok adoption rates
