import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyReviewToken } from "@/lib/reviews"
import { normalizePhone } from "@/lib/integrations/apps/whatsapp"
import { ReviewForm } from "@/components/store/review-form"
import { getT } from "@/lib/i18n/storefront"
import { getStoreBySlug } from "@/lib/storefront/cache"

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; productId: string }>
  searchParams: Promise<{ order?: string; phone?: string; token?: string }>
}) {
  const { slug, productId } = await params
  const { order: orderId, phone, token } = await searchParams

  if (!orderId || !phone || !token) notFound()

  const store = await getStoreBySlug(slug, "id, language, is_published")
  if (!store) notFound()

  const normalizedPhone = normalizePhone(phone)

  if (!verifyReviewToken(orderId, productId, normalizedPhone, token)) {
    notFound()
  }

  const supabase = createAdminClient()

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, customer_phone, customer_country")
    .eq("id", orderId)
    .eq("store_id", store.id)
    .single()

  if (!order) notFound()

  const orderNormalizedPhone = normalizePhone(order.customer_phone, order.customer_country)
  if (orderNormalizedPhone !== normalizedPhone) notFound()

  const t = getT(store.language || "en")

  if (order.status !== "delivered") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">{t("storefront.reviewOrderRequired")}</p>
        </div>
      </div>
    )
  }

  const { data: existingReview } = await supabase
    .from("product_reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("customer_phone", normalizedPhone)
    .maybeSingle()

  if (existingReview) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">{t("storefront.reviewAlreadyExists")}</p>
        </div>
      </div>
    )
  }

  const { data: product } = await supabase
    .from("products")
    .select("name, image_urls")
    .eq("id", productId)
    .eq("store_id", store.id)
    .single()

  if (!product) notFound()

  const imageIds: string[] = product.image_urls || []
  let imageUrl: string | null = null
  if (imageIds.length > 0) {
    const { resolveImageUrls } = await import("@/lib/storefront/cache")
    const imgMap = await resolveImageUrls(imageIds.slice(0, 1))
    imageUrl = imgMap.get(imageIds[0]) || null
  }

  const productName = product.name.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">")

  return (
    <div className="mx-auto max-w-lg space-y-6 py-6">
      <div className="flex items-center gap-4">
        {imageUrl ? (
          <img src={imageUrl} alt={productName} className="h-16 w-16 rounded-lg border object-cover shrink-0" />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground/40">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--store-heading-font)" }}>
            {t("storefront.writeReview")}
          </h1>
          <p className="text-muted-foreground truncate">{productName}</p>
        </div>
      </div>
      <ReviewForm
        storeSlug={slug}
        productId={productId}
        orderId={orderId}
        customerPhone={normalizedPhone}
        token={token}
        lang={store.language || "en"}
      />
    </div>
  )
}
