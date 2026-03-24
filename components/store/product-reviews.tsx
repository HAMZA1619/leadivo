import { getProductReviews, getProductReviewStats } from "@/lib/storefront/cache"
import { StarRating } from "@/components/store/star-rating"
import { ProductReviewList } from "@/components/store/product-review-list"

interface ProductReviewsProps {
  productId: string
  storeSlug: string
  designSettings: {
    reviewCardStyle: "minimal" | "card" | "bubble"
    showReviewImages: boolean
    showVerifiedBadge: boolean
  }
  lang: string
}

export async function ProductReviews({
  productId,
  storeSlug,
  designSettings,
  lang,
}: ProductReviewsProps) {
  const [reviews, stats] = await Promise.all([
    getProductReviews(productId),
    getProductReviewStats(productId),
  ])

  if (!stats || stats.count === 0) {
    return null
  }

  const breakdown = stats.breakdown as Record<number, number>

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl font-bold">{stats.average.toFixed(1)}</span>
          <StarRating rating={stats.average} size="lg" />
          <span className="text-sm text-muted-foreground">
            {stats.count} {stats.count === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Breakdown bars */}
        <div className="flex w-full max-w-xs flex-col gap-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = breakdown[star] || 0
            const pct = stats.count > 0 ? (count / stats.count) * 100 : 0
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-right text-muted-foreground">{star}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right text-xs text-muted-foreground">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review list */}
      <ProductReviewList
        reviews={reviews as Array<{
          id: string
          customer_name: string
          rating: number
          comment: string | null
          image_urls: string[] | null
          is_verified_purchase: boolean
          created_at: string
        }>}
        designSettings={designSettings}
        lang={lang}
      />
    </div>
  )
}
