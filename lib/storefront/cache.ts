import { unstable_cache } from "next/cache"
import { createStaticClient } from "@/lib/supabase/static"
import { createAdminClient } from "@/lib/supabase/admin"
import { getImageUrl } from "@/lib/utils"
import { cacheGet, cacheSet } from "@/lib/upstash/cache"

const REVALIDATE = 300
const IMAGE_REVALIDATE = 600
const REDIS_STORE_TTL = 300 // 5 minutes

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export function getStoreBySlug<T extends string>(slug: string, select: T) {
  return unstable_cache(
    async () => {
      const redisKey = `store:${slug}:${select}`
      const cached = await cacheGet<Record<string, unknown>>(redisKey)
      if (cached) return cached

      const supabase = createStaticClient()
      const { data } = await supabase
        .from("stores")
        .select(select)
        .eq("slug", slug)
        .eq("is_published", true)
        .single()

      if (data) {
        void cacheSet(redisKey, data, REDIS_STORE_TTL)
      }
      return data
    },
    [`store-${slug}-${select}`],
    { tags: [`store:${slug}`], revalidate: REVALIDATE },
  )()
}

// ---------------------------------------------------------------------------
// Owner subscription check
// ---------------------------------------------------------------------------

export function getStoreOwnerAccess(storeId: string) {
  return unstable_cache(
    async () => {
      const supabase = createAdminClient()
      const { data: store } = await supabase
        .from("stores")
        .select("owner_id")
        .eq("id", storeId)
        .single()
      if (!store) return false

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, trial_ends_at")
        .eq("id", store.owner_id)
        .single()
      if (!profile) return false

      const s = profile.subscription_status
      if (s === "active" || s === "past_due" || s === "canceled") return true
      if (s === "trialing" && profile.trial_ends_at) {
        return new Date(profile.trial_ends_at).getTime() > Date.now()
      }
      return false
    },
    [`owner-access-${storeId}`],
    { tags: [`store:${storeId}`], revalidate: 60 },
  )()
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export function getStoreCollections(storeId: string) {
  return unstable_cache(
    async () => {
      const supabase = createStaticClient()
      const { data } = await supabase
        .from("collections")
        .select("id, name, slug")
        .eq("store_id", storeId)
        .order("sort_order")
      return data
    },
    [`collections-${storeId}`],
    { tags: [`collections:${storeId}`], revalidate: REVALIDATE },
  )()
}

// ---------------------------------------------------------------------------
// Products (paginated list)
// ---------------------------------------------------------------------------

export function getStoreProducts(
  storeId: string,
  page: number,
  pageSize: number,
  collectionId?: string | null,
  search?: string | null,
  excludedProductIds?: string[] | null,
) {
  const exclusionKey = excludedProductIds?.length ? excludedProductIds.sort().join(",") : ""
  return unstable_cache(
    async () => {
      const supabase = createStaticClient()

      let query = supabase
        .from("products")
        .select(
          "id, slug, name, price, compare_at_price, image_urls, is_available, stock, options, product_variants(price, is_available, stock)",
        )
        .eq("store_id", storeId)
        .eq("status", "active")
        .order("sort_order")
        .range(page * pageSize, (page + 1) * pageSize - 1)

      if (collectionId) {
        query = query.eq("collection_id", collectionId)
      }

      if (search) {
        query = query.ilike("name", `%${search}%`)
      }

      if (excludedProductIds && excludedProductIds.length > 0) {
        query = query.not("id", "in", `(${excludedProductIds.join(",")})`)
      }

      const { data } = await query
      return data
    },
    [`products-${storeId}-${page}-${pageSize}-${collectionId ?? ""}-${search ?? ""}-${exclusionKey}`],
    { tags: [`products:${storeId}`], revalidate: REVALIDATE },
  )()
}

// ---------------------------------------------------------------------------
// Single product
// ---------------------------------------------------------------------------

export function getProduct(idOrSlug: string, storeId: string) {
  return unstable_cache(
    async () => {
      const supabase = createStaticClient()
      // Try by slug first, then by UUID
      const { data: bySlug } = await supabase
        .from("products")
        .select("*, collections(name, slug)")
        .eq("slug", idOrSlug)
        .eq("store_id", storeId)
        .single()
      if (bySlug) return bySlug
      const { data: byId } = await supabase
        .from("products")
        .select("*, collections(name, slug)")
        .eq("id", idOrSlug)
        .eq("store_id", storeId)
        .single()
      return byId
    },
    [`product-${storeId}-${idOrSlug}`],
    { tags: [`products:${storeId}`], revalidate: REVALIDATE },
  )()
}

// ---------------------------------------------------------------------------
// Product variants
// ---------------------------------------------------------------------------

export function getProductVariants(productId: string) {
  return unstable_cache(
    async () => {
      const supabase = createStaticClient()
      const { data } = await supabase
        .from("product_variants")
        .select("id, options, price, compare_at_price, sku, stock, is_available")
        .eq("product_id", productId)
        .order("sort_order")
      return data
    },
    [`variants-${productId}`],
    { tags: [`product:${productId}`], revalidate: REVALIDATE },
  )()
}

// ---------------------------------------------------------------------------
// Image URL resolution
// ---------------------------------------------------------------------------

export function resolveImageUrls(imageIds: string[]) {
  if (imageIds.length === 0) return Promise.resolve(new Map<string, string>())

  const sortedIds = [...imageIds].sort()
  const cacheKey = `images-${sortedIds.join(",")}`

  return unstable_cache(
    async () => {
      const supabase = createStaticClient()
      const { data: imgs } = await supabase
        .from("store_images")
        .select("id, storage_path")
        .in("id", sortedIds)

      const entries: [string, string][] = (imgs || [])
        .map((i) => [i.id, getImageUrl(i.storage_path)!] as [string, string])
        .filter(([, url]) => url != null)

      return entries
    },
    [cacheKey],
    { revalidate: IMAGE_REVALIDATE },
  )().then((entries) => new Map(entries))
}

// ---------------------------------------------------------------------------
// Markets
// ---------------------------------------------------------------------------

export function getStoreMarkets(storeId: string) {
  return unstable_cache(
    async () => {
      const supabase = createStaticClient()
      const { data } = await supabase
        .from("markets")
        .select("id, name, slug, countries, currency, pricing_mode, price_adjustment, rounding_rule, manual_exchange_rate, is_default, is_active")
        .eq("store_id", storeId)
        .eq("is_active", true)
        .order("is_default", { ascending: false })
      return data
    },
    [`markets-${storeId}`],
    { tags: [`markets:${storeId}`], revalidate: REVALIDATE },
  )()
}

export function getMarketPrices(marketId: string, productIds: string[]) {
  const sortedIds = [...productIds].sort()
  return unstable_cache(
    async () => {
      const supabase = createStaticClient()
      const { data } = await supabase
        .from("market_prices")
        .select("product_id, variant_id, price, compare_at_price")
        .eq("market_id", marketId)
        .in("product_id", sortedIds)
      return data
    },
    [`market-prices-${marketId}-${sortedIds.join(",")}`],
    { tags: [`market-prices:${marketId}`], revalidate: REVALIDATE },
  )()
}

export function getMarketExclusions(marketId: string) {
  return unstable_cache(
    async () => {
      const supabase = createStaticClient()
      const { data } = await supabase
        .from("market_exclusions")
        .select("product_id")
        .eq("market_id", marketId)
      return (data || []).map((row) => row.product_id)
    },
    [`market-exclusions-${marketId}`],
    { tags: [`market-exclusions:${marketId}`], revalidate: REVALIDATE },
  )()
}

// ---------------------------------------------------------------------------
// Product Reviews
// ---------------------------------------------------------------------------

const REVIEWS_REDIS_TTL = 300

export function getProductReviews(productId: string) {
  return unstable_cache(
    async () => {
      const redisKey = `reviews:${productId}`
      const cached = await cacheGet<Record<string, unknown>[]>(redisKey)
      if (cached) return cached

      const supabase = createStaticClient()
      const { data } = await supabase
        .from("product_reviews")
        .select("id, customer_name, rating, comment, image_urls, is_verified_purchase, created_at")
        .eq("product_id", productId)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(50)

      const result = data || []
      if (result.length > 0) {
        void cacheSet(redisKey, result, REVIEWS_REDIS_TTL)
      }
      return result
    },
    [`reviews-${productId}`],
    { tags: [`reviews:${productId}`], revalidate: REVALIDATE },
  )()
}

export function getProductReviewStats(productId: string) {
  return unstable_cache(
    async () => {
      const redisKey = `review-stats:${productId}`
      const cached = await cacheGet<Record<string, unknown>>(redisKey)
      if (cached) return cached

      const supabase = createStaticClient()
      const { data } = await supabase
        .from("product_reviews")
        .select("rating")
        .eq("product_id", productId)
        .eq("status", "approved")

      if (!data || data.length === 0) return null

      const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>
      let total = 0
      for (const r of data) {
        breakdown[r.rating] = (breakdown[r.rating] || 0) + 1
        total += r.rating
      }
      const stats = {
        average: total / data.length,
        count: data.length,
        breakdown,
      }
      void cacheSet(redisKey, stats, REVIEWS_REDIS_TTL)
      return stats
    },
    [`review-stats-${productId}`],
    { tags: [`reviews:${productId}`], revalidate: REVALIDATE },
  )()
}

export function getBulkReviewStats(productIds: string[]) {
  const sorted = [...productIds].sort()
  return unstable_cache(
    async () => {
      if (sorted.length === 0) return {}
      const supabase = createStaticClient()
      const { data } = await supabase
        .from("product_reviews")
        .select("product_id, rating")
        .in("product_id", sorted)
        .eq("status", "approved")

      if (!data) return {}
      const stats: Record<string, { average: number; count: number }> = {}
      for (const r of data) {
        if (!stats[r.product_id]) stats[r.product_id] = { average: 0, count: 0 }
        stats[r.product_id].count++
        stats[r.product_id].average += r.rating
      }
      for (const pid of Object.keys(stats)) {
        stats[pid].average = stats[pid].average / stats[pid].count
      }
      return stats
    },
    [`bulk-review-stats-${sorted.join(",")}`],
    { tags: sorted.map((id) => `reviews:${id}`), revalidate: REVALIDATE },
  )()
}

// ---------------------------------------------------------------------------
// Store integration
// ---------------------------------------------------------------------------

export function getStoreIntegration(storeId: string, integrationId: string) {
  return unstable_cache(
    async () => {
      const supabase = createAdminClient()
      const { data } = await supabase
        .from("store_integrations")
        .select("config")
        .eq("store_id", storeId)
        .eq("integration_id", integrationId)
        .single()
      return data
    },
    [`integration-${storeId}-${integrationId}`],
    { tags: [`integrations:${storeId}`], revalidate: REVALIDATE },
  )()
}
