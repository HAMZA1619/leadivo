import { createClient } from "@/lib/supabase/server"
import { getInvoices } from "@/lib/billing"
import { NextResponse } from "next/server"

export const maxDuration = 60

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Try local invoices first
    const { data: localInvoices } = await supabase
      .from("billing_invoices")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (localInvoices && localInvoices.length > 0) {
      return NextResponse.json({
        orders: localInvoices.map((inv) => ({
          id: inv.id,
          created_at: inv.created_at,
          amount: inv.amount,
          currency: inv.currency,
          status: inv.status,
          billing_reason: inv.billing_reason,
        })),
      })
    }

    // Fallback to billing provider API for historical data
    const { data: profile } = await supabase
      .from("profiles")
      .select("billing_customer_id")
      .eq("id", user.id)
      .single()

    if (!profile?.billing_customer_id) {
      return NextResponse.json({ orders: [] })
    }

    const orders = await getInvoices(profile.billing_customer_id)
    return NextResponse.json({ orders })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
