import { NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/static"
import { initiateVerification } from "@/lib/integrations/infobip/verification"

export async function POST(request: Request) {
  try {
    const { slug, phone, country } = await request.json()

    if (!slug || !phone) {
      return NextResponse.json({ error: "Missing slug or phone" }, { status: 400 })
    }

    // Sanitize inputs
    if (typeof slug !== "string" || slug.length > 100 || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
    }
    if (typeof phone !== "string" || phone.length > 20 || !/^[+\d\s()-]+$/.test(phone)) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 })
    }

    const supabase = createStaticClient()
    const { data: store } = await supabase
      .from("stores")
      .select("id, design_settings")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    const ds = (store.design_settings || {}) as Record<string, unknown>
    const requireSmsOtp = ds.requireSmsOtp === true

    if (!requireSmsOtp) {
      return NextResponse.json({ error: "Verification not enabled" }, { status: 400 })
    }

    try {
      const result = await initiateVerification(store.id, phone, "sms_otp", country)
      return NextResponse.json(result)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : ""

      if (message === "TOO_MANY_ATTEMPTS") {
        return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 })
      }

      throw err
    }
  } catch (err) {
    console.error("[verify-phone]", err)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
