import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
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

    const { data: customers } = await supabase
      .from("customers")
      .select("tags")
      .eq("store_id", store.id)
      .not("tags", "is", null)
      .not("tags", "eq", "{}")

    const tagSet = new Set<string>()
    if (customers) {
      for (const c of customers) {
        if (Array.isArray(c.tags)) {
          for (const tag of c.tags) {
            tagSet.add(tag)
          }
        }
      }
    }

    return NextResponse.json({ tags: Array.from(tagSet).sort() })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
