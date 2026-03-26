import { createClient } from "@/lib/supabase/server"
import { cancelSubscription } from "@/lib/billing"
import { NextResponse } from "next/server"

export const maxDuration = 60

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("billing_subscription_id")
      .eq("id", user.id)
      .single()

    if (!profile?.billing_subscription_id) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 400 }
      )
    }

    await cancelSubscription(profile.billing_subscription_id)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
