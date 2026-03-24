import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = request.nextUrl
    const from = searchParams.get("from") || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    const to = searchParams.get("to") || new Date().toISOString()

    const [{ count: totalCustomers }, { count: newThisPeriod }, { data: allCustomers }, { data: topCustomers }] = await Promise.all([
      supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id),
      supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id)
        .gte("created_at", from)
        .lte("created_at", to),
      supabase
        .from("customers")
        .select("order_count, total_spent")
        .eq("store_id", store.id),
      supabase
        .from("customers")
        .select("id, customer_name, total_spent, order_count")
        .eq("store_id", store.id)
        .order("total_spent", { ascending: false })
        .limit(5),
    ])

    const repeatCount = allCustomers?.filter((c) => c.order_count > 1).length || 0
    const total = totalCustomers || 0
    const repeatRate = total > 0 ? Math.round((repeatCount / total) * 1000) / 10 : 0
    const totalSpentSum = allCustomers?.reduce((sum, c) => sum + Number(c.total_spent), 0) || 0
    const avgOrderValue = total > 0 ? Math.round((totalSpentSum / total) * 100) / 100 : 0

    return NextResponse.json({
      totalCustomers: total,
      newThisPeriod: newThisPeriod || 0,
      repeatRate,
      avgOrderValue,
      topCustomers: topCustomers || [],
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
