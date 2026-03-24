import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import { getRedis } from "@/lib/upstash/redis"
import { cacheDel } from "@/lib/upstash/cache"
import { revalidateTag } from "next/cache"
import { normalizePhone } from "@/lib/integrations/apps/whatsapp"
import { verifyReviewToken } from "@/lib/reviews"
import { reviewSchema, reviewModerationSchema } from "@/lib/validations/review"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = reviewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
    }

    const { store_slug, product_id, order_id, customer_phone, token, rating, comment, image_urls } = parsed.data

    const normalizedPhone = normalizePhone(customer_phone)

    if (!verifyReviewToken(order_id, product_id, normalizedPhone, token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    const admin = createAdminClient()

    const { data: store } = await admin
      .from("stores")
      .select("id, is_published")
      .eq("slug", store_slug)
      .single()

    if (!store || !store.is_published) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    const redis = getRedis()
    if (redis) {
      try {
        const key = `review-submit:${normalizedPhone}`
        const pipeline = redis.pipeline()
        pipeline.incr(key)
        pipeline.expire(key, 3600)
        const [count] = await pipeline.exec<[number, number]>()
        if (count > 5) {
          return NextResponse.json({ error: "rate_limit" }, { status: 429, headers: { "Retry-After": "3600" } })
        }
      } catch {}
    }

    const { data: order } = await admin
      .from("orders")
      .select("id, customer_phone, customer_name, customer_country, store_id")
      .eq("id", order_id)
      .eq("store_id", store.id)
      .eq("status", "delivered")
      .single()

    if (!order) {
      return NextResponse.json({ error: "Order not found or not delivered" }, { status: 404 })
    }

    const orderNormalizedPhone = normalizePhone(order.customer_phone || "", order.customer_country || undefined)
    if (orderNormalizedPhone !== normalizedPhone) {
      return NextResponse.json({ error: "Phone mismatch" }, { status: 403 })
    }

    const { data: orderItem } = await admin
      .from("order_items")
      .select("id")
      .eq("order_id", order_id)
      .eq("product_id", product_id)
      .limit(1)
      .single()

    if (!orderItem) {
      return NextResponse.json({ error: "Product not in order" }, { status: 400 })
    }

    const { data: existing } = await admin
      .from("product_reviews")
      .select("id")
      .eq("product_id", product_id)
      .eq("customer_phone", normalizedPhone)
      .limit(1)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Already reviewed" }, { status: 409 })
    }

    if (comment) {
      const urlCount = (comment.match(/https?:\/\//g) || []).length
      if (urlCount > 3) {
        return NextResponse.json({ error: "Too many URLs in comment" }, { status: 400 })
      }
    }

    if (image_urls && image_urls.length > 0) {
      const prefix = `${store.id}/reviews/`
      for (const url of image_urls) {
        const path = url.split("/product-images/")[1]
        if (!path || !path.startsWith(prefix)) {
          return NextResponse.json({ error: "Invalid image path" }, { status: 400 })
        }
      }
    }

    const { data: review, error: insertError } = await admin
      .from("product_reviews")
      .insert({
        store_id: store.id,
        product_id,
        order_id,
        customer_phone: normalizedPhone,
        customer_name: order.customer_name || "Customer",
        rating,
        comment: comment || null,
        image_urls: image_urls || [],
        status: "pending",
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
    }

    revalidateTag(`reviews:${product_id}`)
    await cacheDel(`reviews:${product_id}`, `review-stats:${product_id}`)

    return NextResponse.json({ review }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const product_id = searchParams.get("product_id")

    if (!product_id) {
      return NextResponse.json({ error: "product_id is required" }, { status: 400 })
    }

    const admin = createAdminClient()

    const { data: reviews } = await admin
      .from("product_reviews")
      .select("id, customer_name, rating, comment, image_urls, is_verified_purchase, created_at")
      .eq("product_id", product_id)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(50)

    const list = reviews || []

    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    let total = 0
    for (const r of list) {
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1
      total += r.rating
    }

    const stats = {
      average: list.length > 0 ? Math.round((total / list.length) * 10) / 10 : 0,
      count: list.length,
      breakdown,
    }

    return NextResponse.json({ reviews: list, stats })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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
    const parsed = reviewModerationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const { review_id, status } = parsed.data

    const { data: review, error } = await supabase
      .from("product_reviews")
      .update({ status })
      .eq("id", review_id)
      .eq("store_id", store.id)
      .select("id, product_id, status")
      .single()

    if (error || !review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    revalidateTag(`reviews:${review.product_id}`)
    await cacheDel(`reviews:${review.product_id}`, `review-stats:${review.product_id}`)

    return NextResponse.json({ review })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = request.nextUrl
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const { data: review } = await supabase
      .from("product_reviews")
      .select("id, product_id, image_urls")
      .eq("id", id)
      .eq("store_id", store.id)
      .single()

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    if (review.image_urls && Array.isArray(review.image_urls) && review.image_urls.length > 0) {
      const paths = review.image_urls.map((url: string) => {
        const parts = url.split("/product-images/")
        return parts[1] || ""
      }).filter(Boolean)
      if (paths.length > 0) {
        await supabase.storage.from("product-images").remove(paths)
      }
    }

    const { error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", id)
      .eq("store_id", store.id)

    if (error) {
      return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
    }

    revalidateTag(`reviews:${review.product_id}`)
    await cacheDel(`reviews:${review.product_id}`, `review-stats:${review.product_id}`)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
