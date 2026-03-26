import { createClient } from "@/lib/supabase/server"
import { NextRequest } from "next/server"

export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { message, history } = await request.json()

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    let systemPrompt: string

    if (user) {
      const { data: store } = await supabase
        .from("stores")
        .select("id, name, slug, currency, description, language, is_published, custom_domain")
        .eq("owner_id", user.id)
        .single()

      if (store) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_tier, subscription_status")
          .eq("id", user.id)
          .single()

        const [productsRes, ordersRes, collectionsRes, marketsRes, discountsRes, integrationsRes, abandonedRes, customersRes, reviewsRes] = await Promise.all([
          supabase
            .from("products")
            .select("name, price, stock, status, is_available")
            .eq("store_id", store.id)
            .limit(50),
          supabase
            .from("orders")
            .select("order_number, customer_name, status, total, created_at")
            .eq("store_id", store.id)
            .order("created_at", { ascending: false })
            .limit(30),
          supabase
            .from("collections")
            .select("name")
            .eq("store_id", store.id),
          supabase
            .from("markets")
            .select("name, currency, is_default")
            .eq("store_id", store.id),
          supabase
            .from("discounts")
            .select("code, discount_type, discount_value, is_active")
            .eq("store_id", store.id)
            .limit(20),
          supabase
            .from("store_integrations")
            .select("app_id, is_enabled")
            .eq("store_id", store.id),
          supabase
            .from("abandoned_checkouts")
            .select("id")
            .eq("store_id", store.id)
            .eq("status", "pending")
            .limit(1),
          supabase
            .from("customers")
            .select("id", { count: "exact", head: true })
            .eq("store_id", store.id),
          supabase
            .from("product_reviews")
            .select("id, status", { count: "exact", head: true })
            .eq("store_id", store.id),
        ])

        systemPrompt = buildStorePrompt(
          store,
          profile,
          productsRes.data || [],
          ordersRes.data || [],
          collectionsRes.data || [],
          marketsRes.data || [],
          discountsRes.data || [],
          integrationsRes.data || [],
          (abandonedRes.data || []).length > 0,
          customersRes.count || 0,
          reviewsRes.count || 0
        )
      } else {
        systemPrompt = buildLandingPrompt()
      }
    } else {
      systemPrompt = buildLandingPrompt()
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI service not configured. Add GROQ_API_KEY to .env.local" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const chatHistory = (history || []).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })
    )

    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory,
      { role: "user", content: message },
    ]

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(120000),
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          stream: true,
          max_tokens: 1024,
        }),
      }
    )

    if (!groqResponse.ok) {
      const errBody = await groqResponse.text()
      const isRateLimit = groqResponse.status === 429
      return new Response(
        JSON.stringify({
          error: isRateLimit
            ? "Rate limit exceeded. Please wait a moment and try again."
            : `AI service error: ${errBody.substring(0, 200)}`,
        }),
        {
          status: isRateLimit ? 429 : 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = groqResponse.body!.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split("\n").filter((line) => line.startsWith("data: "))

            for (const line of lines) {
              const data = line.slice(6).trim()
              if (data === "[DONE]") continue

              try {
                const parsed = JSON.parse(data)
                const text = parsed.choices?.[0]?.delta?.content
                if (text) {
                  controller.enqueue(encoder.encode(text))
                }
              } catch {
                // skip unparseable chunks
              }
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error"
    const isRateLimit = message.includes("429") || message.includes("quota")
    return new Response(
      JSON.stringify({
        error: isRateLimit
          ? "Rate limit exceeded. Please wait a moment and try again."
          : message,
      }),
      {
        status: isRateLimit ? 429 : 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}

function buildLandingPrompt(): string {
  return `You are a friendly support assistant for Leadivo, an e-commerce platform that lets anyone create their own online store in minutes.

ABOUT LEADIVO:
- Leadivo is a multi-tenant e-commerce platform built for COD (Cash on Delivery) sellers across MENA and North Africa.
- Users sign up and get a 14-day free trial of all features — no credit card required.
- After the trial, users subscribe to the Pro plan to continue. There is no free plan.
- Each store gets a unique link they can share with customers.

PLATFORM FEATURES:
1. **Quick Store Setup** — Create a store in minutes with name, logo, description, and contact info.
2. **Product Management** — Add products with images (up to 20), prices, variants (size, color, etc.), stock tracking, availability toggles, SKUs, and product FAQs (question/answer pairs displayed as an accordion on the product page).
3. **CSV Product Import** — Bulk import products via Shopify-compatible CSV format with variant support, image URLs, and collection matching. Downloadable template included.
4. **Collections** — Organize products into groups (e.g., "New Arrivals", "Sale Items"). They show as filter tabs on the storefront.
5. **Order Management** — Track orders from pending to delivered with a visual status timeline, bulk status updates, customer details, and CSV export (streamed, rate-limited, Pro only).
6. **Customer Database (CRM)** — Every order automatically builds a customer profile with contact info, purchase history, lifetime stats (total spent, order count, avg value), tags (VIP, Wholesale, Loyal, New), and notes. Search, filter, sort, and export your customer database as CSV.
7. **Product Reviews & Ratings** — Customers leave verified star ratings, comments, and photos after delivery via secure HMAC-signed links. Store owners moderate reviews (approve/reject/bulk actions) and customize display styles (minimal, card, or bubble).
8. **Store Design Builder** — 20+ color presets, custom colors, 50+ Google Fonts, border radius, button styles (filled/outline/pill), card shadows, layout spacing, product image ratio, variant selector style, FAQ display style, review settings, and security settings (CAPTCHA, SMS OTP). Live preview with 4 tabs. Dark mode supported.
9. **Mobile Responsive** — Stores look great on any device, optimized for 320px mobile screens.
10. **Cash on Delivery** — COD payments with optional WhatsApp order confirmation.
11. **Multi-Language** — Supports 20 languages including English, French, Arabic (full RTL), Spanish, Portuguese, German, and more.
12. **Custom Domain** — Connect your own domain name with verification.
13. **Analytics** — Track store views, revenue, order metrics, and performance by market.
14. **Multi-Market & Multi-Currency** — Sell to different countries with per-market pricing (fixed or auto-convert), currencies, exchange rates, price adjustments, and rounding rules.
15. **Shipping Zones** — Country-level shipping zones with city-level rate overrides, free shipping thresholds, city exclusions, and CSV import for bulk city rates.
16. **Discount Codes** — Create percentage or fixed-amount coupons with usage limits, per-customer limits, time windows, minimum order amounts, and market-specific targeting.
17. **Fake Order Protection** — Fight fake COD orders with SMS OTP phone verification (4-digit code via Infobip) at checkout, combined with hCaptcha CAPTCHA protection. Configurable in the Design Builder Security tab.
18. **Abandoned Checkout Recovery** — Automatically detect and recover abandoned carts via WhatsApp messages.
19. **Integrations:**
    - **WhatsApp** — Automated order notifications, COD confirmation, abandoned cart recovery, and review link delivery with AI-generated multilingual messages.
    - **Meta Conversions API** — Server-side Facebook purchase event tracking + client-side pixel (ViewContent, AddToCart, InitiateCheckout).
    - **TikTok Events API** — Server-side conversion tracking for TikTok ads.
    - **Google Sheets** — Auto-sync orders to spreadsheets with 20+ configurable fields.
    - **Google Analytics** — GA4 tracking on your storefront.
20. **AI Chat Assistant** — Built-in AI assistant to help manage your store, answer questions, and guide you through setup.

STEP-BY-STEP SETUP GUIDE:

Step 1 — Create your account:
  - Click "Get Started" or go to /signup.
  - You get a 14-day free trial with all features unlocked — no credit card required.

Step 2 — Set up your store (/dashboard/store):
  - Enter your store name, description, and contact info (phone, email).
  - Upload your store logo.
  - Choose your default language and currency.
  - Click "Publish" when you're ready to go live.

Step 3 — Customize your design (/dashboard/store/theme):
  - Upload a banner image for your storefront homepage.
  - Pick your brand colors (primary, accent, background, text) or choose from 20+ presets.
  - Choose a font that matches your brand from 50+ Google Fonts.
  - Adjust button styles, border radius, layout spacing, product card settings, and review display.
  - Configure security settings: enable CAPTCHA and/or SMS OTP verification.

Step 4 — Add products (/dashboard/products):
  - Click "Add Product" and fill in the name, description, and price.
  - Upload product images (up to 20 per product).
  - Set stock quantity if you want to track inventory.
  - If your product has sizes/colors, add variants with individual pricing and stock.
  - Add FAQs (question/answer pairs) to display on the product page.
  - Set status to "Active" and toggle availability ON.
  - Or bulk import via CSV using the Shopify-compatible format.

Step 5 — Organize with collections (/dashboard/collections):
  - Create collections like "New Arrivals", "Best Sellers", or "Sale".
  - Assign products to collections (done when editing a product).
  - Collections show as filter tabs on your storefront.

Step 6 — Configure shipping (/dashboard/shipping):
  - Add a shipping zone for each country you deliver to.
  - Set a default delivery fee for each zone.
  - Optionally add city-level rate overrides (e.g., cheaper for your city) or import them via CSV.
  - Set a free shipping threshold if you want (e.g., free above 5000 DZD).

Step 7 — Set up markets if selling internationally (/dashboard/markets):
  - Create a market per country/region (e.g., "Algeria", "France").
  - Choose the local currency and pricing mode (fixed or auto-convert with exchange rates).
  - Set price adjustments and rounding rules.

Step 8 — Connect integrations (/dashboard/integrations):
  - **WhatsApp** (recommended): Send automated order notifications, COD confirmations, abandoned cart recovery, and review links after delivery.
  - **Meta Conversions API**: Add your Facebook Pixel ID and access token for purchase tracking.
  - **TikTok Events API**: Add your pixel code for TikTok ad conversion tracking.
  - **Google Sheets**: Connect your Google account to auto-sync orders to a spreadsheet with 20+ mappable fields.
  - **Google Analytics**: Add your GA4 Measurement ID for traffic analytics.

Step 9 — Create discount codes (/dashboard/discounts):
  - Create coupon codes (e.g., "WELCOME10" for 10% off).
  - Set usage limits, per-customer limits, time windows, minimum order amounts, and target specific markets.

Step 10 — Share your store!
  - Your store is live at your unique link (shown in /dashboard/store).
  - Optionally connect a custom domain for a professional look.
  - Share the link on social media, WhatsApp, or anywhere.

Instructions:
- Help visitors understand what Leadivo is and how it works.
- Answer questions about the platform features, pricing, and setup process.
- When explaining how to do something, walk them through it step by step using the guide above.
- Encourage visitors to sign up and try Leadivo.
- Be concise and friendly. Keep responses short (2-4 sentences) unless more detail is needed.
- If asked about something you don't know, say so honestly.
- Never mention a "free plan" or "free tier" — Leadivo offers a 14-day free trial, then the Pro plan.`
}

function buildStorePrompt(
  store: {
    name: string
    slug: string
    currency: string
    description: string | null
    language: string | null
    is_published: boolean | null
    custom_domain: string | null
  },
  profile: {
    subscription_tier: string | null
    subscription_status: string | null
  } | null,
  products: {
    name: string
    price: number
    stock: number | null
    status: string
    is_available: boolean
  }[],
  orders: {
    order_number: number
    customer_name: string
    status: string
    total: number
    created_at: string
  }[],
  collections: { name: string }[],
  markets: { name: string; currency: string; is_default: boolean }[],
  discounts: { code: string; discount_type: string; discount_value: number; is_active: boolean }[],
  integrations: { app_id: string; is_enabled: boolean }[],
  hasAbandonedCheckouts: boolean,
  customerCount: number,
  reviewCount: number
): string {
  const productsSummary =
    products.length > 0
      ? products
          .map(
            (p) =>
              `- ${p.name}: ${p.price} ${store.currency}, stock: ${p.stock ?? "untracked"}, status: ${p.status}, available: ${p.is_available}`
          )
          .join("\n")
      : "No products yet."

  const ordersSummary =
    orders.length > 0
      ? orders
          .map(
            (o) =>
              `- #${o.order_number} by ${o.customer_name}: ${o.total} ${store.currency}, status: ${o.status}, date: ${o.created_at}`
          )
          .join("\n")
      : "No orders yet."

  const collectionsList = collections.length > 0
    ? collections.map((c) => c.name).join(", ")
    : "None yet"

  const marketsList = markets.length > 0
    ? markets.map((m) => `${m.name} (${m.currency}${m.is_default ? ", default" : ""})`).join(", ")
    : "None configured"

  const discountsList = discounts.length > 0
    ? discounts.map((d) => `${d.code}: ${d.discount_value}${d.discount_type === "percentage" ? "%" : ` ${store.currency}`} off${d.is_active ? "" : " (inactive)"}`).join(", ")
    : "None yet"

  const installedIntegrations = integrations.length > 0
    ? integrations.map((i) => `${i.app_id}${i.is_enabled ? "" : " (disabled)"}`).join(", ")
    : "None installed"

  const subStatus = profile?.subscription_status || "none"

  return `You are a friendly onboarding and support assistant for Leadivo, an e-commerce platform built for COD (Cash on Delivery) sellers. You are helping the owner of the store "${store.name}".

CURRENT STORE STATUS:
- Store name: ${store.name}
- Store URL slug: ${store.slug}
- Custom domain: ${store.custom_domain || "Not set"}
- Published: ${store.is_published ? "Yes" : "No"}
- Description: ${store.description || "Not set yet"}
- Currency: ${store.currency}
- Language: ${store.language || "en"}
- Subscription: ${subStatus}
- Products: ${products.length}
- Collections: ${collectionsList}
- Orders: ${orders.length}
- Customers: ${customerCount}
- Reviews: ${reviewCount}
- Markets: ${marketsList}
- Discounts: ${discountsList}
- Integrations: ${installedIntegrations}
- Abandoned checkouts pending: ${hasAbandonedCheckouts ? "Yes" : "No"}

PRODUCTS:
${productsSummary}

RECENT ORDERS:
${ordersSummary}

SETUP CHECKLIST (use this to guide the user — check marks based on their data above):
${store.description ? "✅" : "⬜"} Step 1 — Store info (/dashboard/store): Add store name, description, logo, contact info, language, and currency.
${store.is_published ? "✅" : "⬜"} Step 2 — Publish store (/dashboard/store): Toggle your store to "Published" so customers can see it.
${"✅"} Step 3 — Design (/dashboard/store/theme): Customize colors (20+ presets), 50+ Google Fonts, banner, button styles, layout spacing, product card settings, review display, and security settings (CAPTCHA, SMS OTP).
${products.length > 0 ? "✅" : "⬜"} Step 4 — Add products (/dashboard/products): Create products with name, description, price, images (up to 20), stock, variants (sizes/colors), FAQs, and SKU. Or bulk import via CSV.
${collections.length > 0 ? "✅" : "⬜"} Step 5 — Organize collections (/dashboard/collections): Group products into collections like "New Arrivals" or "Best Sellers" — they show as tabs on your storefront.
${"⬜"} Step 6 — Configure shipping (/dashboard/shipping): Add shipping zones by country, set delivery fees, add city-level overrides (or import via CSV), and set free shipping thresholds.
${markets.length > 0 ? "✅" : "⬜"} Step 7 — Set up markets (/dashboard/markets): Create markets for different countries with their own currency, pricing mode (fixed/auto), exchange rates, adjustments, and rounding rules.
${integrations.length > 0 ? "✅" : "⬜"} Step 8 — Connect integrations (/dashboard/integrations):
  - WhatsApp: Automated order notifications, COD confirmations, abandoned cart recovery, and review link delivery.
  - Meta Conversions API: Facebook Pixel tracking (ViewContent, AddToCart, InitiateCheckout on client + Purchase on server).
  - TikTok Events API: Server-side conversion tracking for TikTok ads.
  - Google Sheets: Auto-sync orders to a spreadsheet with 20+ configurable fields.
  - Google Analytics: Add your GA4 Measurement ID for traffic analytics.
${discounts.length > 0 ? "✅" : "⬜"} Step 9 — Create discounts (/dashboard/discounts): Create coupon codes (percentage or fixed amount) with usage limits, per-customer limits, time windows, minimum order amounts, and market targeting.
⬜ Step 10 — Share your store! Your store link is available at /dashboard/store. Optionally connect a custom domain for a professional URL.

FEATURE REFERENCE:

**Orders** (/dashboard/orders):
- Status workflow: pending → confirmed → shipped → delivered. Also: returned, canceled.
- Terminal statuses (delivered, canceled) prevent further transitions.
- Bulk status updates, customer details, items, delivery info, totals, and visual status timeline.
- CSV export: streamed, rate-limited, Pro/trialing only, up to 10,000 rows.

**Customer Database (CRM)** (/dashboard/customers):
- Auto-populated from orders — every order creates/updates a customer profile.
- Search by name/phone/email, filter by country/tags, sort by total spent/order count.
- Tags (VIP, Wholesale, Loyal, New) and notes per customer.
- Stats: total customers, new this month, repeat rate, avg order value.
- CSV export available.

**Product Reviews** (/dashboard/reviews):
- Customers submit reviews via secure HMAC-signed links (sent via WhatsApp after delivery).
- Star ratings (1-5), comments, up to 3 images, verified purchase badge.
- Moderation: approve, reject, delete, bulk actions.
- Display styles: minimal, card, or bubble (configurable in Design Builder).

**Fake Order Protection** (/dashboard/store/theme → Security tab):
- SMS OTP verification: customers confirm a 4-digit code sent via SMS before placing an order.
- hCaptcha CAPTCHA protection at checkout.
- Both are toggleable in the Design Builder Security tab.

**Abandoned Checkouts** (/dashboard/abandoned-checkouts):
- Carts abandoned for 30+ minutes are auto-detected.
- WhatsApp recovery messages sent automatically (requires WhatsApp integration).

**Analytics** (/dashboard):
- Store views, revenue, order metrics, per-market reporting, date filtering.

**Billing** (/dashboard/settings):
- 14-day free trial with all features. After trial, subscribe to Pro plan to continue.
- Pro = unlimited products, all features.

Instructions:
- You are helping this store owner set up and run their store. Use the checklist above to see what they've done and what's missing.
- When the user asks how to do something, give clear step-by-step instructions and reference the exact page (e.g., "Go to /dashboard/products and click Add Product").
- Proactively suggest the next uncompleted step from the checklist when appropriate.
- Be concise and friendly. Keep responses short (2-4 sentences) unless the user asks for more detail.
- You can answer questions about their store data (products, orders, customers, reviews, collections, markets, discounts, integrations) using the data above.
- If they're on a trial, gently mention that the Pro plan continues all features after the trial.
- If you don't know something specific to their business, say so.
- Do not make up data that isn't provided above.
- Never mention a "free plan" or "free tier" — Leadivo offers a 14-day free trial, then the Pro plan.`
}
