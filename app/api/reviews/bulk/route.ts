import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { cacheDel } from "@/lib/upstash/cache"
import { revalidateTag } from "next/cache"
import { reviewBulkModerationSchema } from "@/lib/validations/review"

export async function PATCH(request: NextRequest) {
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

    const body = await request.json()
    const parsed = reviewBulkModerationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const { review_ids, action } = parsed.data

    const { data: reviews } = await supabase
      .from("product_reviews")
      .select("id, product_id, image_urls")
      .eq("store_id", store.id)
      .in("id", review_ids)

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({ error: "No reviews found" }, { status: 404 })
    }

    const productIds = new Set<string>()
    for (const r of reviews) {
      productIds.add(r.product_id)
    }

    if (action === "deleted") {
      const allPaths: string[] = []
      for (const r of reviews) {
        if (r.image_urls && Array.isArray(r.image_urls)) {
          for (const url of r.image_urls) {
            const parts = (url as string).split("/product-images/")
            if (parts[1]) allPaths.push(parts[1])
          }
        }
      }
      if (allPaths.length > 0) {
        await supabase.storage.from("product-images").remove(allPaths)
      }

      const { error } = await supabase
        .from("product_reviews")
        .delete()
        .eq("store_id", store.id)
        .in("id", review_ids)

      if (error) {
        return NextResponse.json({ error: "Failed to delete reviews" }, { status: 500 })
      }
    } else {
      const { error } = await supabase
        .from("product_reviews")
        .update({ status: action })
        .eq("store_id", store.id)
        .in("id", review_ids)

      if (error) {
        return NextResponse.json({ error: "Failed to update reviews" }, { status: 500 })
      }
    }

    for (const pid of productIds) {
      revalidateTag(`reviews:${pid}`)
      await cacheDel(`reviews:${pid}`, `review-stats:${pid}`)
    }

    return NextResponse.json({ ok: true, count: reviews.length })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
