import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("store_id")
    const tracking = searchParams.get("tracking")
    if (!storeId || !tracking) return NextResponse.json({ error: "Missing params" }, { status: 400 })

    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("id", storeId)
      .eq("owner_id", user.id)
      .single()
    if (!store) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

    return NextResponse.json({
      label_url: `https://api.yalidine.app/v1/labels/${encodeURIComponent(tracking)}.pdf`,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
