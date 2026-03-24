import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import { getRedis } from "@/lib/upstash/redis"
import { verifyReviewToken } from "@/lib/reviews"
import { normalizePhone } from "@/lib/integrations/apps/whatsapp"
import sharp from "sharp"

export const maxDuration = 120

const MAX_FILES = 3
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const store_slug = formData.get("store_slug") as string
    const order_id = formData.get("order_id") as string
    const customer_phone = formData.get("customer_phone") as string
    const token = formData.get("token") as string
    const product_id = formData.get("product_id") as string

    if (!store_slug || !order_id || !customer_phone || !token || !product_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const normalizedPhone = normalizePhone(customer_phone)

    if (!verifyReviewToken(order_id, product_id, normalizedPhone, token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    const admin = createAdminClient()

    const { data: store } = await admin
      .from("stores")
      .select("id")
      .eq("slug", store_slug)
      .single()

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const redis = getRedis()
    if (redis) {
      try {
        const key = `review-upload:${ip}`
        const pipeline = redis.pipeline()
        pipeline.incr(key)
        pipeline.expire(key, 3600)
        const [count] = await pipeline.exec<[number, number]>()
        if (count > 10) {
          return NextResponse.json({ error: "rate_limit" }, { status: 429, headers: { "Retry-After": "3600" } })
        }
      } catch {}
    }

    const files: File[] = []
    for (const [key, value] of formData.entries()) {
      if (key === "files" && value instanceof File) {
        files.push(value)
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} files allowed` }, { status: 400 })
    }

    const urls: string[] = []

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` }, { status: 400 })
      }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const processed = await sharp(buffer)
        .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer()

      const storagePath = `${store.id}/reviews/${crypto.randomUUID()}.webp`

      const { error: uploadError } = await admin.storage
        .from("product-images")
        .upload(storagePath, processed, { contentType: "image/webp" })

      if (uploadError) continue

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`
      urls.push(url)
    }

    return NextResponse.json({ urls })
  } catch {
    return NextResponse.json({ error: "Failed to upload images" }, { status: 500 })
  }
}
