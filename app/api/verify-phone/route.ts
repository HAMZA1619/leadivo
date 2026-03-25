import { NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/static"
import { initiateVerification } from "@/lib/integrations/infobip/verification"

export async function POST(request: Request) {
  try {
    const { slug, phone, method: preferredMethod, country } = await request.json()

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
    const requireFlashCall = ds.requireFlashCall === true
    const requireSmsOtp = ds.requireSmsOtp === true

    if (!requireFlashCall && !requireSmsOtp) {
      return NextResponse.json({ error: "Verification not enabled" }, { status: 400 })
    }

    // Determine method: client override > flash call > SMS
    let method: "flash_call" | "sms_otp" =
      preferredMethod === "sms_otp" && requireSmsOtp
        ? "sms_otp"
        : requireFlashCall
          ? "flash_call"
          : "sms_otp"

    try {
      const result = await initiateVerification(store.id, phone, method, country)
      return NextResponse.json(result)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : ""

      if (message === "TOO_MANY_ATTEMPTS") {
        return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 })
      }

      // Flash call failed — fallback to SMS if enabled
      if (message === "FLASH_CALL_FAILED" && requireSmsOtp) {
        method = "sms_otp"
        const result = await initiateVerification(store.id, phone, method, country)
        return NextResponse.json(result)
      }

      throw err
    }
  } catch (err) {
    console.error("[verify-phone]", err)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
