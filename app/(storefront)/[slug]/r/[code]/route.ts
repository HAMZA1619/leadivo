import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; code: string }> }
) {
  const { slug, code } = await params

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("short_links")
    .select("original_url")
    .eq("code", code)
    .single()

  if (error || !data) {
    return NextResponse.redirect(new URL(`/${slug}`, request.url), { status: 302 })
  }

  // Increment clicks in the background (fire-and-forget)
  supabase.rpc("increment_short_link_clicks", { link_code: code }).then()

  return NextResponse.redirect(data.original_url, { status: 302 })
}
