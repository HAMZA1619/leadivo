import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params
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

    const { data: customer, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .eq("store_id", store.id)
      .single()

    if (error || !customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Use RPC to match orders via normalize_phone() so we hit the functional index
    const { data: orders } = await supabase.rpc("get_customer_orders", {
      p_store_id: store.id,
      p_norm_phone: customer.customer_phone,
      p_limit: 100,
    })

    return NextResponse.json({ customer, orders: orders || [] })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params
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

    const body = await request.json()
    const updates: Record<string, unknown> = {}

    if (body.tags !== undefined) {
      if (!Array.isArray(body.tags) || body.tags.some((t: unknown) => typeof t !== "string")) {
        return NextResponse.json({ error: "Tags must be an array of strings" }, { status: 400 })
      }
      updates.tags = body.tags
    }

    if (body.notes !== undefined) {
      if (typeof body.notes !== "string") {
        return NextResponse.json({ error: "Notes must be a string" }, { status: 400 })
      }
      updates.notes = body.notes
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const { data: customer, error } = await supabase
      .from("customers")
      .update(updates)
      .eq("id", customerId)
      .eq("store_id", store.id)
      .select()
      .single()

    if (error || !customer) {
      return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
    }

    return NextResponse.json({ customer })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
