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
  let sanitized = value.replace(/\r\n|\r|\n/g, " ")
  sanitized = sanitized.replace(/"/g, '""')
  if (DANGEROUS_CHARS.some((c) => sanitized.startsWith(c))) {
    sanitized = "'" + sanitized
  }
  return `"${sanitized}"`
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  try {
    return new Date(dateStr).toISOString().split("T")[0]
  } catch {
    return dateStr
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single()

    if (!profile || !["active", "trialing"].includes(profile.subscription_status || "")) {
      return Response.json({ error: "upgrade_required" }, { status: 403 })
    }

    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("owner_id", user.id)
      .single()

    if (!store) {
      return Response.json({ error: "Store not found" }, { status: 404 })
    }

    const redis = getRedis()
    if (redis) {
      try {
        const key = `customer-export-rate:${user.id}`
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

    const { searchParams } = request.nextUrl
    const search = searchParams.get("search")?.trim() || ""
    const country = searchParams.get("country") || ""
    const tag = searchParams.get("tag") || ""

    const CSV_HEADERS = [
      "Name", "Phone", "Email", "City", "Country", "Tags",
      "Currency", "Total Spent", "Order Count", "First Order", "Last Order", "Notes",
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
              .from("customers")
              .select("customer_name, customer_phone, customer_email, customer_city, customer_country, tags, currency, total_spent, order_count, first_order_at, last_order_at, notes")
              .eq("store_id", store.id)

            if (search) {
              const escaped = search.replace(/%/g, "\\%").replace(/_/g, "\\_")
              query = query.or(`customer_name.ilike.%${escaped}%,customer_phone.ilike.%${escaped}%,customer_email.ilike.%${escaped}%`)
            }

            if (country) query = query.eq("customer_country", country)
            if (tag) query = query.contains("tags", [tag])

            const { data: customers, error } = await query
              .order("last_order_at", { ascending: false })
              .range(fetched, fetched + BATCH_SIZE - 1)

            if (error || !customers || customers.length === 0) break

            let chunk = ""
            for (const c of customers) {
              const row = [
                sanitizeCell(c.customer_name || ""),
                sanitizeCell(c.customer_phone || ""),
                sanitizeCell(c.customer_email || ""),
                sanitizeCell(c.customer_city || ""),
                sanitizeCell(c.customer_country || ""),
                sanitizeCell(Array.isArray(c.tags) ? c.tags.join(", ") : ""),
                sanitizeCell(c.currency || ""),
                sanitizeCell(String(c.total_spent ?? "")),
                sanitizeCell(String(c.order_count ?? "")),
                sanitizeCell(formatDate(c.first_order_at)),
                sanitizeCell(formatDate(c.last_order_at)),
                sanitizeCell(c.notes || ""),
              ].join(",") + "\n"
              chunk += row
            }

            controller.enqueue(new TextEncoder().encode(chunk))
            fetched += customers.length

            if (customers.length < BATCH_SIZE) break
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
        "Content-Disposition": `attachment; filename="customers-${today}.csv"`,
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
