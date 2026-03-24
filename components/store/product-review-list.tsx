"use client"

import { useState, useMemo } from "react"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { StarRating } from "@/components/store/star-rating"
import { ReviewImageGallery } from "@/components/store/review-image-gallery"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

type SortOption = "newest" | "oldest" | "highest" | "lowest"

interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string | null
  image_urls: string[] | null
  is_verified_purchase: boolean
  created_at: string
}

interface ProductReviewListProps {
  reviews: Review[]
  designSettings: {
    reviewCardStyle: "minimal" | "card" | "bubble"
    showReviewImages: boolean
    showVerifiedBadge: boolean
  }
  lang: string
}

function formatRelativeDate(dateStr: string, lang: string): string {
  return new Date(dateStr).toLocaleDateString(lang, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function ProductReviewList({ reviews, designSettings, lang }: ProductReviewListProps) {
  const { t } = useTranslation()
  const [sort, setSort] = useState<SortOption>("newest")

  const sorted = useMemo(() => {
    const copy = [...reviews]
    switch (sort) {
      case "newest":
        return copy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      case "oldest":
        return copy.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      case "highest":
        return copy.sort((a, b) => b.rating - a.rating)
      case "lowest":
        return copy.sort((a, b) => a.rating - b.rating)
      default:
        return copy
    }
  }, [reviews, sort])

  const { reviewCardStyle, showReviewImages, showVerifiedBadge } = designSettings

  return (
    <div className="space-y-4">
      {/* Sort dropdown */}
      <div className="flex justify-end">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="newest">{t("storefront.reviewSortNewest")}</option>
          <option value="oldest">{t("storefront.reviewSortOldest")}</option>
          <option value="highest">{t("storefront.reviewSortHighest")}</option>
          <option value="lowest">{t("storefront.reviewSortLowest")}</option>
        </select>
      </div>

      {/* Reviews */}
      <div className={cn(reviewCardStyle === "minimal" ? "divide-y" : "space-y-3")}>
        {sorted.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            style={reviewCardStyle}
            showImages={showReviewImages}
            showVerified={showVerifiedBadge}
            lang={lang}
          />
        ))}
      </div>
    </div>
  )
}

function ReviewCard({
  review,
  style,
  showImages,
  showVerified,
  lang,
}: {
  review: Review
  style: "minimal" | "card" | "bubble"
  showImages: boolean
  showVerified: boolean
  lang: string
}) {
  const { t } = useTranslation()
  const hasImages = showImages && review.image_urls && review.image_urls.length > 0

  if (style === "minimal") {
    return (
      <div className="py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{review.customer_name}</span>
          <StarRating rating={review.rating} size="sm" />
          {showVerified && review.is_verified_purchase && (
            <span className="inline-flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              {t("storefront.verifiedPurchase")}
            </span>
          )}
        </div>
        {review.comment && (
          <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
        )}
        {hasImages && <ReviewImageGallery images={review.image_urls!} className="mt-2" />}
        <span className="mt-1 block text-xs text-muted-foreground">
          {formatRelativeDate(review.created_at, lang)}
        </span>
      </div>
    )
  }

  if (style === "bubble") {
    return (
      <div className="rounded-2xl bg-muted p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
            {review.customer_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium">{review.customer_name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatRelativeDate(review.created_at, lang)}
              </span>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>
        </div>
        {review.comment && (
          <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
        )}
        {hasImages && <ReviewImageGallery images={review.image_urls!} className="mt-2" />}
        {showVerified && review.is_verified_purchase && (
          <span className="mt-2 inline-flex items-center gap-1 text-xs text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            {t("storefront.verifiedPurchase")}
          </span>
        )}
      </div>
    )
  }

  // card style (default)
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
          {review.customer_name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <span className="truncate text-sm font-medium">{review.customer_name}</span>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatRelativeDate(review.created_at, lang)}
        </span>
      </div>
      <StarRating rating={review.rating} size="sm" />
      {review.comment && (
        <p className="text-sm text-muted-foreground">{review.comment}</p>
      )}
      {hasImages && <ReviewImageGallery images={review.image_urls!} />}
      {showVerified && review.is_verified_purchase && (
        <span className="inline-flex items-center gap-1 text-xs text-green-600">
          <CheckCircle2 className="h-3 w-3" />
          {t("storefront.verifiedPurchase")}
        </span>
      )}
    </div>
  )
}
