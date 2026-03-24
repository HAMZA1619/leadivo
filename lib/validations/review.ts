import { z } from "zod"

export const reviewSchema = z.object({
  store_slug: z.string().min(1),
  product_id: z.string().uuid(),
  order_id: z.string().uuid(),
  customer_phone: z.string().min(5),
  token: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional().transform((val) => {
    if (!val) return val
    return val.replace(/<[^>]*>/g, "").replace(/\s{3,}/g, " ").trim()
  }),
  image_urls: z.array(z.string().url()).max(3).optional(),
})

export const reviewModerationSchema = z.object({
  review_id: z.string().uuid(),
  status: z.enum(["approved", "rejected"]),
})

export const reviewBulkModerationSchema = z.object({
  review_ids: z.array(z.string().uuid()).min(1).max(50),
  action: z.enum(["approved", "rejected", "deleted"]),
})
