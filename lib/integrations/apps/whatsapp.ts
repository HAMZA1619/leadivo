import urlJoin from "url-join"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import type { AppDefinition } from "@/lib/integrations/registry"
import { COUNTRIES } from "@/lib/constants"

export const whatsappApp: AppDefinition = {
  id: "whatsapp",
  name: "WhatsApp",
  description: "Send order confirmations to customers via WhatsApp when orders are placed.",
  icon: WhatsAppIcon,
  iconColor: "#25D366",
  category: "notifications",
  events: ["order.created", "order.status_changed", "checkout.abandoned"],
  hasCustomSetup: true,
}

export interface WhatsAppConfig {
  instance_name: string
  connected: boolean
  enabled_events?: string[]
  cod_confirmation_enabled?: boolean
}

interface OrderItem {
  product_name: string
  product_price: number
  quantity: number
  variant_options?: Record<string, string> | null
}

interface EventPayload {
  order_number: number
  customer_name: string
  customer_phone: string
  customer_country?: string
  customer_city?: string
  customer_address?: string
  total: number
  subtotal?: number
  discount_id?: string | null
  discount_amount?: number
  delivery_fee?: number
  currency?: string
  status?: string
  old_status?: string
  new_status?: string
  items?: OrderItem[]
  [key: string]: unknown
}

interface AbandonedCheckoutPayload {
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_country?: string
  customer_city?: string
  customer_address?: string
  cart_items: Array<{
    product_name: string
    product_price: number
    quantity: number
    variant_options?: string | null
  }>
  subtotal: number
  total: number
  currency: string
  store_name: string
  store_url: string
  abandoned_checkout_id: string
  status: string
  created_at: string
  [key: string]: unknown
}

const COUNTRY_DIAL_CODES: Record<string, string> = {
  MA: "212", DZ: "213", TN: "216", EG: "20", SA: "966", AE: "971",
  US: "1", GB: "44", FR: "33", DE: "49", ES: "34", IT: "39",
  TR: "90", IN: "91", PK: "92", BD: "880", NG: "234", KE: "254",
  ZA: "27", BR: "55", MX: "52", CA: "1", AU: "61", JP: "81",
  CN: "86", KR: "82", ID: "62", PH: "63", TH: "66", VN: "84",
  RU: "7", PL: "48", NL: "31", BE: "32", SE: "46", NO: "47",
  DK: "45", FI: "358", PT: "351", GR: "30", CZ: "420", RO: "40",
  HU: "36", AT: "43", CH: "41", IE: "353", IL: "972", JO: "962",
  LB: "961", IQ: "964", KW: "965", QA: "974", BH: "973", OM: "968",
  LY: "218", SD: "249", ET: "251", GH: "233", CI: "225", SN: "221",
  CM: "237", MR: "222", ML: "223",
}

const COUNTRY_NAME_TO_CODE: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.name.toLowerCase(), c.code])
)

function resolveCountryCode(country: string): string | undefined {
  const upper = country.toUpperCase()
  if (COUNTRY_DIAL_CODES[upper]) return upper
  return COUNTRY_NAME_TO_CODE[country.toLowerCase()]
}

export function normalizePhone(phone: string, country?: string): string {
  let cleaned = phone.replace(/[^0-9+]/g, "")

  if (cleaned.startsWith("+")) {
    return cleaned.replace("+", "")
  }

  if (cleaned.startsWith("0") && country) {
    const code = resolveCountryCode(country)
    const dialCode = code ? COUNTRY_DIAL_CODES[code] : undefined
    if (dialCode) {
      return dialCode + cleaned.substring(1)
    }
  }

  if (cleaned.startsWith("00")) {
    return cleaned.substring(2)
  }

  return cleaned
}

export interface WhatsAppLanguage {
  code: string
  name: string
  dialects?: { code: string; name: string }[]
}

export const WHATSAPP_LANGUAGES: WhatsAppLanguage[] = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français", dialects: [
    { code: "fr", name: "Français standard" },
    { code: "fr-CA", name: "Français canadien" },
    { code: "fr-MA", name: "Français marocain" },
  ]},
  { code: "ar", name: "العربية", dialects: [
    { code: "ar", name: "العربية الفصحى" },
    { code: "ar-EG", name: "مصري" },
    { code: "ar-MA", name: "دارجة مغربية" },
    { code: "ar-SA", name: "خليجي" },
    { code: "ar-LB", name: "لبناني / شامي" },
    { code: "ar-DZ", name: "جزائري" },
    { code: "ar-TN", name: "تونسي" },
  ]},
  { code: "es", name: "Español", dialects: [
    { code: "es", name: "Español (España)" },
    { code: "es-MX", name: "Español (México)" },
    { code: "es-AR", name: "Español (Argentina)" },
  ]},
  { code: "pt", name: "Português", dialects: [
    { code: "pt", name: "Português (Portugal)" },
    { code: "pt-BR", name: "Português (Brasil)" },
  ]},
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "nl", name: "Nederlands" },
  { code: "tr", name: "Türkçe" },
  { code: "ru", name: "Русский" },
  { code: "zh", name: "中文", dialects: [
    { code: "zh", name: "简体中文" },
    { code: "zh-TW", name: "繁體中文" },
  ]},
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "hi", name: "हिन्दी" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "pl", name: "Polski" },
  { code: "sv", name: "Svenska" },
  { code: "th", name: "ไทย" },
  { code: "vi", name: "Tiếng Việt" },
]

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  fr: "French", "fr-CA": "Canadian French", "fr-MA": "Moroccan French",
  ar: "Modern Standard Arabic", "ar-EG": "Egyptian Arabic", "ar-MA": "Moroccan Arabic (Darija)",
  "ar-SA": "Gulf Arabic", "ar-LB": "Lebanese/Levantine Arabic", "ar-DZ": "Algerian Arabic", "ar-TN": "Tunisian Arabic",
  es: "Spanish", "es-MX": "Mexican Spanish", "es-AR": "Argentine Spanish",
  pt: "Portuguese", "pt-BR": "Brazilian Portuguese",
  de: "German", it: "Italian", nl: "Dutch", tr: "Turkish", ru: "Russian",
  zh: "Simplified Chinese", "zh-TW": "Traditional Chinese",
  ja: "Japanese", ko: "Korean", hi: "Hindi", id: "Indonesian",
  ms: "Malay", pl: "Polish", sv: "Swedish", th: "Thai", vi: "Vietnamese",
}

async function generateAIMessage(
  eventType: string,
  payload: EventPayload,
  storeName: string,
  currency: string,
  language: string,
  codConfirmation?: boolean
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  const langName = LANGUAGE_NAMES[language] || "English"

  let context: string
  if (eventType === "order.created") {
    const itemsList = payload.items?.length
      ? payload.items
          .map(
            (i) =>
              `- ${i.product_name}${i.variant_options ? ` (${Object.values(i.variant_options).join(", ")})` : ""} x${i.quantity} — ${i.product_price} ${currency}`
          )
          .join("\n")
      : "Items not available"

    const addressParts = [
      payload.customer_address ? `Address: ${payload.customer_address}` : null,
      payload.customer_city ? `City: ${payload.customer_city}` : null,
      payload.customer_country ? `Country: ${payload.customer_country}` : null,
    ].filter(Boolean).join("\n")

    const discountLine = payload.discount_amount && payload.discount_amount > 0
      ? `\nDiscount: -${payload.discount_amount} ${currency}`
      : ""
    const subtotalLine = payload.subtotal != null && payload.discount_amount && payload.discount_amount > 0
      ? `\nSubtotal: ${payload.subtotal} ${currency}`
      : ""
    const deliveryLine = payload.delivery_fee && payload.delivery_fee > 0
      ? `\nDelivery fee: ${payload.delivery_fee} ${currency}`
      : ""

    context = `Event: New order placed
Store: ${storeName}
Order #${payload.order_number}
Customer: ${payload.customer_name}
${addressParts || "Address: Not provided"}${subtotalLine}${discountLine}${deliveryLine}
Total: ${payload.total} ${currency}
Items ordered:
${itemsList}`
  } else if (eventType === "order.status_changed") {
    const addressParts = [
      payload.customer_address ? `Address: ${payload.customer_address}` : null,
      payload.customer_city ? `City: ${payload.customer_city}` : null,
      payload.customer_country ? `Country: ${payload.customer_country}` : null,
    ].filter(Boolean).join("\n")

    context = `Event: Order status updated
Store: ${storeName}
Order #${payload.order_number}
Customer: ${payload.customer_name}
${addressParts || "Address: Not provided"}
Previous status: ${payload.old_status}
New status: ${payload.new_status}`
  } else if (eventType === "checkout.abandoned") {
    const aPayload = payload as unknown as AbandonedCheckoutPayload
    const itemsList = aPayload.cart_items?.length
      ? aPayload.cart_items
          .map(
            (i) =>
              `- ${i.product_name}${i.variant_options ? ` (${i.variant_options})` : ""} x${i.quantity} — ${i.product_price} ${currency}`
          )
          .join("\n")
      : "Items not available"

    context = `Event: Abandoned checkout recovery
Store: ${aPayload.store_name}
Customer: ${aPayload.customer_name}
Total: ${aPayload.total} ${currency}
Store URL: ${aPayload.store_url}

Items in cart:
${itemsList}`
  } else {
    return null
  }

  const systemPrompts: Record<string, string> = {
    "order.created": `You are a WhatsApp notification assistant. Generate a warm, friendly WhatsApp message in ${langName} to confirm a customer's new order.

CRITICAL — ONLY translate the static text (greetings, labels, closing). NEVER translate or change any of these dynamic values:
- Customer name: "${payload.customer_name}" — use EXACTLY as-is (first word only).
- Store name: "${storeName}" — use EXACTLY as-is. Do NOT add words like "store" or "متجر" before it.
- Product names: use EXACTLY as provided in the items list.
- Address: use EXACTLY as provided. Do NOT translate or reformat it.
- Numbers, prices, currency codes: keep as-is.

Rules:
- Write ONLY the static/surrounding text in ${langName}. All dynamic data stays in its original form.
- Use WhatsApp formatting: *bold* for store name, order number, and total.
- Structure (use blank lines between each section):
  1. Greet using the customer's name exactly as given above.
  2. Blank line.
  3. Order number.
  4. Blank line.
  5. Each item on its own line with quantity and price.
  6. Blank line.
  7. If a discount was applied, show subtotal, discount, then total. Otherwise just show total.
  8. If a delivery fee is provided, show it before the total.
  9. Blank line.
  10. Delivery details: address and country (include city only if provided).
  11. Blank line.
  12. A short closing.${codConfirmation ? `\n  13. End with a natural question asking the customer to confirm their order (e.g. "Can you confirm this order?" or "Does everything look good?"). Keep it casual.` : ""}
- Keep it concise — sound like a real person, not a robot.
- Vary your wording naturally each time.
- Do NOT include links, emojis, or placeholder text.
- Do NOT start with "Dear" — be casual and direct.
- Output ONLY the message text.`,

    "order.status_changed": `You are a WhatsApp notification assistant. Generate a short, friendly WhatsApp message in ${langName} to update a customer on their order status.

CRITICAL — ONLY translate the static text (greetings, labels, closing). NEVER translate or change any of these dynamic values:
- Customer name: "${payload.customer_name}" — use EXACTLY as-is (first word only).
- Store name: "${storeName}" — use EXACTLY as-is. Do NOT add words like "store" or "متجر" before it.
- Numbers, prices, currency codes: keep as-is.

Rules:
- Write ONLY the static/surrounding text in ${langName}. All dynamic data stays in its original form.
- Use WhatsApp formatting: *bold* for store name, order number, and new status.
- Structure:
  1. Greet using the customer's name exactly as given above.
  2. Inform them their order status changed.
  3. Show: Order #, old status → new status.
  4. A short encouraging line based on the new status.
- Keep it to 3-5 lines. Short and clear.
- Vary your wording naturally each time.
- Do NOT include links, emojis, or placeholder text.
- Do NOT start with "Dear" — be casual and direct.
- Output ONLY the message text.`,

    "checkout.abandoned": `You are a WhatsApp recovery assistant. Generate a warm, friendly WhatsApp message in ${langName} to remind a customer about items they left in their cart.

CRITICAL — ONLY translate the static text (greetings, labels, closing). NEVER translate or change any of these dynamic values:
- Customer name: "${payload.customer_name}" — use EXACTLY as-is (first word only).
- Store name: "${(payload as unknown as AbandonedCheckoutPayload).store_name}" — use EXACTLY as-is. Do NOT add words like "store" or "متجر" before it.
- Product names: use EXACTLY as provided in the items list.
- Numbers, prices, currency codes: keep as-is.
- Store URL: use EXACTLY as provided.

Rules:
- Write ONLY the static/surrounding text in ${langName}. All dynamic data stays in its original form.
- Use WhatsApp formatting: *bold* for store name and total.
- Structure (use blank lines between each section):
  1. Greet using the customer's name (first word only).
  2. Blank line.
  3. Remind them they left items in their cart at *store name*.
  4. Blank line.
  5. List the items briefly, each on its own line with quantity and price.
  6. Blank line.
  7. Show the total in bold.
  8. Blank line.
  9. A line saying they can complete their order, followed by the store URL on its own line.
  10. Blank line.
  11. A short encouraging closing (one line).
- Keep it concise and well-spaced.
- Sound helpful and friendly, not pushy.
- Do NOT include emojis or placeholder text.
- Do NOT start with "Dear" — be casual and direct.
- Output ONLY the message text.`,
  }

  const systemPrompt = systemPrompts[eventType]
  if (!systemPrompt) return null

  try {
    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: context },
          ],
          max_tokens: 400,
          temperature: 0.9,
        }),
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!res.ok) return null

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content?.trim()
    return text || null
  } catch {
    return null
  }
}

export function buildWhatsAppMessage(
  eventType: string,
  payload: EventPayload,
  storeName: string,
  currency: string,
  codConfirmation?: boolean
): string {
  const firstName = payload.customer_name.split(" ")[0]

  if (eventType === "order.created") {
    const itemsBlock = payload.items?.length
      ? payload.items
          .map(
            (i) =>
              `  ${i.product_name}${i.variant_options ? ` (${Object.values(i.variant_options).join(", ")})` : ""} x${i.quantity} — ${i.product_price} ${currency}`
          )
          .join("\n")
      : null

    const addressLine = [payload.customer_address, payload.customer_city, payload.customer_country].filter(Boolean).join(", ")

    const lines = [
      `Hey ${firstName}! Your order from *${storeName}* has been received.`,
      ``,
      `*Order #${payload.order_number}*`,
      ``,
    ]

    if (itemsBlock) {
      lines.push(itemsBlock, ``)
    }

    if (payload.discount_amount && payload.discount_amount > 0 && payload.subtotal != null) {
      lines.push(`Subtotal: ${payload.subtotal} ${currency}`)
      lines.push(`Discount: -${payload.discount_amount} ${currency}`)
    }
    if (payload.delivery_fee && payload.delivery_fee > 0) {
      lines.push(`Delivery fee: ${payload.delivery_fee} ${currency}`)
    }
    lines.push(`*Total: ${payload.total} ${currency}*`)

    if (addressLine) {
      lines.push(``, `Delivery: ${addressLine}`)
    }

    if (codConfirmation) {
      lines.push(``, `Can you confirm this order?`)
    } else {
      lines.push(``, `We're on it! You'll hear from us when there's an update.`)
    }

    return lines.join("\n")
  }

  if (eventType === "order.status_changed") {
    return [
      `Hey ${firstName}! Quick update on your order from *${storeName}*:`,
      ``,
      `*Order #${payload.order_number}*`,
      `Status: ${payload.old_status} → *${payload.new_status}*`,
      ``,
      `Thanks for your patience!`,
    ].join("\n")
  }

  if (eventType === "checkout.abandoned") {
    const aPayload = payload as unknown as AbandonedCheckoutPayload
    const itemsBlock = aPayload.cart_items?.length
      ? aPayload.cart_items
          .map(
            (i) =>
              `  ${i.product_name}${i.variant_options ? ` (${i.variant_options})` : ""} x${i.quantity} — ${i.product_price} ${currency}`
          )
          .join("\n")
      : null

    const lines = [
      `Hey ${firstName}! You left some items in your cart at *${aPayload.store_name}*.`,
      ``,
    ]

    if (itemsBlock) {
      lines.push(itemsBlock, ``)
    }

    lines.push(`*Total: ${aPayload.total} ${currency}*`)
    lines.push(``)
    lines.push(`Complete your order here:`)
    lines.push(aPayload.store_url)
    lines.push(``)
    lines.push(`We saved everything for you!`)

    return lines.join("\n")
  }

  return ""
}

export async function handleWhatsApp(
  eventType: string,
  payload: EventPayload,
  config: WhatsAppConfig,
  storeName: string,
  currency: string,
  storeLanguage?: string
): Promise<{ confirmationSent: boolean }> {
  if (!config.connected || !config.instance_name) return { confirmationSent: false }

  const enabledEvents = config.enabled_events ?? ["order.created"]
  if (!enabledEvents.includes(eventType)) return { confirmationSent: false }

  const codConfirmation =
    eventType === "order.created" &&
    !!config.cod_confirmation_enabled &&
    !!payload.order_id

  const message =
    (await generateAIMessage(eventType, payload, storeName, currency, storeLanguage || "en", codConfirmation)) ||
    buildWhatsAppMessage(eventType, payload, storeName, currency, codConfirmation)
  if (!message) return { confirmationSent: false }

  const evolutionUrl = process.env.EVOLUTION_API_URL
  const evolutionKey = process.env.EVOLUTION_API_KEY
  if (!evolutionUrl || !evolutionKey) {
    throw new Error("Evolution API not configured")
  }

  const phone = normalizePhone(payload.customer_phone, payload.customer_country)

  const res = await fetch(
    urlJoin(evolutionUrl, "message/sendText", config.instance_name),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: evolutionKey,
      },
      body: JSON.stringify({
        number: phone,
        text: message,
        linkPreview: eventType === "checkout.abandoned",
      }),
      signal: AbortSignal.timeout(15000),
    }
  )

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`WhatsApp API error ${res.status}: ${body}`)
  }

  return { confirmationSent: codConfirmation }
}
