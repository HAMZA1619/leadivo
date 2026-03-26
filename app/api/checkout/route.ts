import { createClient } from "@/lib/supabase/server"
import { createCheckoutUrl } from "@/lib/billing"
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

    const url = await createCheckoutUrl(user.id, user.email!)
    return NextResponse.json({ url })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error"
    const status = message === "Billing not configured" ? 503 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
