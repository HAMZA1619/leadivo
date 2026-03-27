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

    const { data: integration } = await supabase
      .from("store_integrations")
      .select("config")
      .eq("store_id", storeId)
      .eq("integration_id", "yalidine")
      .single()
    if (!integration) return NextResponse.json({ error: "Integration not found" }, { status: 404 })

    const config = integration.config as Record<string, unknown>
    const apiId = config.api_id as string
    const apiToken = config.api_token as string
    if (!apiId || !apiToken) return NextResponse.json({ error: "Not configured" }, { status: 400 })

    const [parcelRes, historyRes] = await Promise.all([
      fetch(`https://api.yalidine.app/v1/parcels/${encodeURIComponent(tracking)}`, {
        headers: { "X-API-ID": apiId, "X-API-TOKEN": apiToken },
        signal: AbortSignal.timeout(10000),
      }),
      fetch(`https://api.yalidine.app/v1/histories/${encodeURIComponent(tracking)}`, {
        headers: { "X-API-ID": apiId, "X-API-TOKEN": apiToken },
        signal: AbortSignal.timeout(10000),
      }),
    ])

    const parcel = parcelRes.ok ? await parcelRes.json() : null
    const history = historyRes.ok ? await historyRes.json() : null

    return NextResponse.json({ parcel, history })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
