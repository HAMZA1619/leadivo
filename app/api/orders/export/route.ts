import { createClient } from "@/lib/supabase/server"
import { getRedis } from "@/lib/upstash/redis"
import { NextRequest } from "next/server"

const MAX_ROWS = 10000
const BATCH_SIZE = 500
const RATE_LIMIT = 5
const RATE_LIMIT_TTL = 3600

const DANGEROUS_CHARS = ["=", "+", "-", "@", "\t", "\r"]

function sanitizeCell(value: string): string {
  if (!value) return '""'
  // Replace newlines/carriage returns to prevent row breaks inside cells
  let sanitized = value.replace(/\r\n|\r|\n/g, " ")
  sanitized = sanitized.replace(/"/g, '""')
  if (DANGEROUS_CHARS.some((c) => sanitized.startsWith(c))) {
    sanitized = "'" + sanitized
  }
  return `"${sanitized}"`
}

function formatItems(items: Array<{ product_name: string; quantity: number; variant_label?: string }>): string {
  if (!items || !Array.isArray(items)) return ""
  return items
    .map((item) => {
      const variant = item.variant_label ? ` (${item.variant_label})` : ""
      return `${item.product_name}${variant} x${item.quantity}`
    })
    .join("; ")
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toISOString().split("T")[0]
  } catch {
    return dateStr
  }
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  returned: "Returned",
  canceled: "Canceled",
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check subscription status
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single()

    if (!profile || !["active", "trialing"].includes(profile.subscription_status || "")) {
      return Response.json({ error: "upgrade_required" }, { status: 403 })
    }

    // Check store ownership
    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("owner_id", user.id)
      .single()

    if (!store) {
      return Response.json({ error: "Store not found" }, { status: 404 })
    }

    // Rate limiting via Redis (pipeline ensures INCR+EXPIRE execute in one round-trip)
    const redis = getRedis()
    if (redis) {
      try {
        const key = `export-rate:${user.id}`
        const pipeline = redis.pipeline()
        pipeline.incr(key)
        pipeline.expire(key, RATE_LIMIT_TTL)
        const [count] = await pipeline.exec<[number, number]>()
        if (count > RATE_LIMIT) {
          return Response.json({ error: "rate_limit" }, { status: 429, headers: { "Retry-After": String(RATE_LIMIT_TTL) } })
        }
      } catch {
        // Skip rate limiting if Redis fails
      }
    }

    // Parse filters (same as /api/orders/list)
    const { searchParams } = request.nextUrl
    const search = searchParams.get("search")?.trim() || ""
    const status = searchParams.get("status") || ""
    const market = searchParams.get("market") || ""
    const dateFrom = searchParams.get("dateFrom") || ""
    const dateTo = searchParams.get("dateTo") || ""

    // CSV headers
    const CSV_HEADERS = [
      "Order #", "Date", "Status", "Customer Name", "Phone", "Email",
      "City", "Country", "Address", "Items", "Subtotal", "Delivery Fee",
      "Discount", "Total", "Currency", "Payment Method", "Note",
    ]

    const BOM = "\uFEFF"
    const headerRow = CSV_HEADERS.map((h) => sanitizeCell(h)).join(",") + "\n"

    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(new TextEncoder().encode(BOM + headerRow))

          let fetched = 0

          while (fetched < MAX_ROWS) {
            let query = supabase
              .from("orders")
              .select("id, order_number, status, customer_name, customer_email, customer_phone, customer_address, customer_city, customer_country, total, subtotal, delivery_fee, discount_amount, currency, payment_method, note, created_at")
              .eq("store_id", store.id)

            if (search) {
              const orderNum = parseInt(search.replace(/^#/, ""), 10)
              if (!isNaN(orderNum)) {
                query = query.eq("order_number", orderNum)
              } else {
                const escaped = search.replace(/%/g, "\\%").replace(/_/g, "\\_")
                query = query.or(`customer_name.ilike.%${escaped}%,customer_phone.ilike.%${escaped}%`)
              }
            }

            if (status) query = query.eq("status", status)
            if (market) query = query.eq("market_id", market)
            if (dateFrom) query = query.gte("created_at", `${dateFrom}T00:00:00`)
            if (dateTo) query = query.lte("created_at", `${dateTo}T23:59:59`)

            const { data: orders, error } = await query
              .order("created_at", { ascending: false })
              .range(fetched, fetched + BATCH_SIZE - 1)

            if (error || !orders || orders.length === 0) break

            // Fetch order items for this batch
            const orderIds = orders.map((o) => o.id)
            const { data: allItems } = await supabase
              .from("order_items")
              .select("order_id, product_name, quantity, variant_label")
              .in("order_id", orderIds)
              .limit(5000)

            const itemsByOrder = new Map<string, Array<{ product_name: string; quantity: number; variant_label?: string }>>()
            if (allItems) {
              for (const item of allItems) {
                const list = itemsByOrder.get(item.order_id) || []
                list.push(item)
                itemsByOrder.set(item.order_id, list)
              }
            }

            // Build CSV rows
            let chunk = ""
            for (const order of orders) {
              const items = itemsByOrder.get(order.id) || []
              const row = [
                sanitizeCell(String(order.order_number)),
                sanitizeCell(formatDate(order.created_at)),
                sanitizeCell(STATUS_LABELS[order.status] || order.status),
                sanitizeCell(order.customer_name || ""),
                sanitizeCell(order.customer_phone || ""),
                sanitizeCell(order.customer_email || ""),
                sanitizeCell(order.customer_city || ""),
                sanitizeCell(order.customer_country || ""),
                sanitizeCell(order.customer_address || ""),
                sanitizeCell(formatItems(items)),
                sanitizeCell(String(order.subtotal ?? "")),
                sanitizeCell(String(order.delivery_fee ?? "")),
                sanitizeCell(String(order.discount_amount ?? "")),
                sanitizeCell(String(order.total ?? "")),
                sanitizeCell(order.currency || ""),
                sanitizeCell(order.payment_method || ""),
                sanitizeCell(order.note || ""),
              ].join(",") + "\n"
              chunk += row
            }

            controller.enqueue(new TextEncoder().encode(chunk))
            fetched += orders.length

            if (orders.length < BATCH_SIZE) break
          }

          controller.close()
        } catch {
          controller.close()
        }
      },
    })

    const today = new Date().toISOString().split("T")[0]

    return new Response(stream, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-${today}.csv"`,
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
