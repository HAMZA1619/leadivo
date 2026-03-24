import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const PAGE_SIZE = 20

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = Math.max(0, parseInt(searchParams.get("page") || "0", 10) || 0)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("owner_id", user.id)
      .single()

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    const search = searchParams.get("search")?.trim() || ""
    const sort = searchParams.get("sort") || "last_order_at"
    const order = searchParams.get("order") || "desc"
    const country = searchParams.get("country") || ""
    const city = searchParams.get("city") || ""
    const tag = searchParams.get("tag") || ""
    const minSpent = searchParams.get("minSpent") || ""
    const maxSpent = searchParams.get("maxSpent") || ""
    const minOrders = searchParams.get("minOrders") || ""
    const maxOrders = searchParams.get("maxOrders") || ""

    let query = supabase
      .from("customers")
      .select("id, customer_phone, customer_name, customer_email, customer_city, customer_country, tags, currency, total_spent, order_count, last_order_at, created_at")
      .eq("store_id", store.id)

    if (search) {
      const escaped = search.replace(/%/g, "\\%").replace(/_/g, "\\_")
      query = query.or(`customer_name.ilike.%${escaped}%,customer_phone.ilike.%${escaped}%,customer_email.ilike.%${escaped}%`)
    }

    if (country) query = query.eq("customer_country", country)
    if (city) query = query.eq("customer_city", city)
    if (tag) query = query.contains("tags", [tag])
    if (minSpent) query = query.gte("total_spent", parseFloat(minSpent))
    if (maxSpent) query = query.lte("total_spent", parseFloat(maxSpent))
    if (minOrders) query = query.gte("order_count", parseInt(minOrders, 10))
    if (maxOrders) query = query.lte("order_count", parseInt(maxOrders, 10))

    const validSorts = ["total_spent", "order_count", "last_order_at", "created_at", "customer_name"]
    const sortCol = validSorts.includes(sort) ? sort : "last_order_at"
    const ascending = order === "asc"

    const { data: customers, error } = await query
      .order(sortCol, { ascending })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (error) {
      return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
    }

    return NextResponse.json({ customers: customers || [], hasMore: (customers?.length || 0) === PAGE_SIZE })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
