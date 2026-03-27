import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { store_id, api_id, api_token } = await request.json()
    if (!store_id || !api_id || !api_token) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
    }

    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("id", store_id)
      .eq("owner_id", user.id)
      .single()
    if (!store) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

    const res = await fetch("https://api.yalidine.app/v1/wilayas/", {
      headers: { "X-API-ID": api_id, "X-API-TOKEN": api_token },
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 400 })
    }

    const data = await res.json()
    const wilayas = Array.isArray(data) ? data : data.data || []

    return NextResponse.json({
      ok: true,
      wilayas: wilayas.map((w: { id: number; name: string }) => ({ id: w.id, name: w.name })),
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
