import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const PAGE_SIZE = 20

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
    const status = searchParams.get("status") || "all"
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || PAGE_SIZE))

    let query = supabase
      .from("product_reviews")
      .select("*, products(name)", { count: "exact" })
      .eq("store_id", store.id)

    if (status !== "all") {
      query = query.eq("status", status)
    }

    const { data: reviews, error, count } = await query
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    const { count: pendingCount } = await supabase
      .from("product_reviews")
      .select("id", { count: "exact", head: true })
      .eq("store_id", store.id)
      .eq("status", "pending")

    const { count: approvedCount } = await supabase
      .from("product_reviews")
      .select("id", { count: "exact", head: true })
      .eq("store_id", store.id)
      .eq("status", "approved")

    const { count: rejectedCount } = await supabase
      .from("product_reviews")
      .select("id", { count: "exact", head: true })
      .eq("store_id", store.id)
      .eq("status", "rejected")

    const allCount = (pendingCount || 0) + (approvedCount || 0) + (rejectedCount || 0)

    return NextResponse.json({
      reviews: reviews || [],
      counts: {
        all: allCount,
        pending: pendingCount || 0,
        approved: approvedCount || 0,
        rejected: rejectedCount || 0,
      },
      page,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
