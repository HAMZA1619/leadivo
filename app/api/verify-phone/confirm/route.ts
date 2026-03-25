import { NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/static"
import { confirmVerification } from "@/lib/integrations/infobip/verification"

export async function POST(request: Request) {
  try {
    const { slug, phone, code, country } = await request.json()

    if (!slug || !phone || !code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const supabase = createStaticClient()
    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    try {
      const result = await confirmVerification(store.id, phone, code, country)
      return NextResponse.json(result)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : ""
      if (message === "MAX_ATTEMPTS") {
        return NextResponse.json({ error: "Too many attempts" }, { status: 429 })
      }
      throw err
    }
  } catch (err) {
    console.error("[verify-phone/confirm]", err)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
