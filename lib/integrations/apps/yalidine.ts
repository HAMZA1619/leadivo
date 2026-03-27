import { YalidineIcon } from "@/components/icons/yalidine"
import type { AppDefinition } from "@/lib/integrations/registry"

export const yalidineApp: AppDefinition = {
  id: "yalidine",
  name: "Yalidine Express",
  description: "Automatically ship orders via Yalidine Express across all 58 Algerian wilayas with COD support.",
  icon: YalidineIcon,
  iconColor: "#E02424",
  category: "shipping",
  events: ["order.created"],
  hasCustomSetup: true,
}

export interface YalidineConfig {
  api_id: string
  api_token: string
  from_wilaya_name: string
  enabled_events?: string[]
  auto_create_shipment?: boolean
  economic?: boolean
}

interface OrderItem {
  product_name: string
  product_price: number
  quantity: number
  variant_options?: Record<string, string> | null
}

export interface EventPayload {
  order_id?: string
  order_number: number
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_address?: string
  customer_city?: string
  customer_country?: string
  total: number
  subtotal?: number
  delivery_fee?: number
  currency?: string
  items?: OrderItem[]
  [key: string]: unknown
}

const YALIDINE_BASE = "https://api.yalidine.app/v1"

function yalidineHeaders(config: YalidineConfig): Record<string, string> {
  return {
    "X-API-ID": config.api_id,
    "X-API-TOKEN": config.api_token,
    "Content-Type": "application/json",
  }
}

function splitName(fullName: string): { firstname: string; familyname: string } {
  const parts = fullName.trim().split(/\s+/)
  return {
    firstname: parts[0] || "",
    familyname: parts.slice(1).join(" ") || parts[0] || "",
  }
}

function buildProductList(items?: OrderItem[]): string {
  if (!items || items.length === 0) return "Order items"
  return items.map((i) => `${i.product_name} x${i.quantity}`).join(", ")
}

export async function handleYalidine(
  eventType: string,
  payload: EventPayload,
  config: YalidineConfig,
  storeName: string,
  currency: string,
  storeId?: string,
): Promise<void> {
  if (!config.api_id || !config.api_token) {
    throw new Error("Yalidine API credentials not configured")
  }

  const enabledEvents = config.enabled_events ?? ["order.created"]
  if (!enabledEvents.includes(eventType)) return

  if (eventType !== "order.created") return
  if (config.auto_create_shipment === false) return

  // Resolve destination wilaya from shipping zone (Algerian stores use wilaya names as zone names)
  let toWilayaName = ""
  if (storeId && payload.customer_city) {
    const { createAdminClient } = await import("@/lib/supabase/admin")
    const admin = createAdminClient()
    const { data: cityRate } = await admin
      .from("shipping_city_rates")
      .select("zone_id, shipping_zones!inner(country_name, store_id)")
      .eq("shipping_zones.store_id", storeId)
      .ilike("city_name", payload.customer_city.trim().replace(/%/g, "\\%").replace(/_/g, "\\_"))
      .limit(1)
      .single()
    if (cityRate) {
      const zone = cityRate.shipping_zones as unknown as { country_name: string }
      toWilayaName = zone.country_name || ""
    }
  }

  const { firstname, familyname } = splitName(payload.customer_name)

  const parcel = {
    order_id: String(payload.order_number),
    from_wilaya_name: config.from_wilaya_name || "Alger",
    firstname,
    familyname,
    contact_phone: payload.customer_phone,
    address: payload.customer_address || "",
    to_commune_name: payload.customer_city || "",
    to_wilaya_name: toWilayaName,
    product_list: buildProductList(payload.items),
    price: Math.round(payload.total),
    do_insurance: false,
    declared_value: 0,
    length: 30,
    width: 20,
    height: 10,
    weight: 1,
    freeshipping: false,
    is_stopdesk: false,
    stopdesk_id: null,
    has_exchange: false,
    product_to_collect: null,
    economic: config.economic ?? false,
  }

  const maxRetries = 2
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(`${YALIDINE_BASE}/parcels/`, {
        method: "POST",
        headers: yalidineHeaders(config),
        body: JSON.stringify([parcel]),
        signal: AbortSignal.timeout(15000),
      })

      if (!res.ok) {
        const body = await res.text().catch(() => "")
        const status = res.status
        if (status >= 500 && attempt < maxRetries) {
          lastError = new Error(`Yalidine API error ${status}: ${body}`)
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
          continue
        }
        throw new Error(`Yalidine API error ${status}: ${body}`)
      }

      const data = await res.json()
      const result = data[String(payload.order_number)]

      if (result?.tracking && storeId) {
        const { createAdminClient } = await import("@/lib/supabase/admin")
        const admin = createAdminClient()
        await admin
          .from("orders")
          .update({
            shipment_tracking: result.tracking,
            shipment_label_url: result.label || null,
            shipping_provider: "yalidine",
          })
          .eq("store_id", storeId)
          .eq("order_number", payload.order_number)
      }

      return
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
        continue
      }
    }
  }

  throw lastError!
}

export async function fetchYalidineWilayas(apiId: string, apiToken: string) {
  const res = await fetch(`${YALIDINE_BASE}/wilayas/`, {
    headers: { "X-API-ID": apiId, "X-API-TOKEN": apiToken },
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Yalidine API error ${res.status}`)
  return res.json()
}

export async function fetchYalidineCommunes(apiId: string, apiToken: string, wilayaId: number) {
  const res = await fetch(`${YALIDINE_BASE}/communes/?wilaya_id=${wilayaId}`, {
    headers: { "X-API-ID": apiId, "X-API-TOKEN": apiToken },
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Yalidine API error ${res.status}`)
  return res.json()
}

export async function getYalidineParcelStatus(apiId: string, apiToken: string, tracking: string) {
  const res = await fetch(`${YALIDINE_BASE}/parcels/${tracking}`, {
    headers: { "X-API-ID": apiId, "X-API-TOKEN": apiToken },
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Yalidine API error ${res.status}`)
  return res.json()
}
