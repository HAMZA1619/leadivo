import { createHmac, timingSafeEqual } from "crypto"

export function generateReviewToken(orderId: string, productId: string, phone: string): string {
  const secret = process.env.REVIEW_SECRET
  if (!secret) throw new Error("REVIEW_SECRET is not configured")
  return createHmac("sha256", secret)
    .update(`${orderId}${productId}${phone}`)
    .digest("hex")
}

export function verifyReviewToken(orderId: string, productId: string, phone: string, token: string): boolean {
  const expected = generateReviewToken(orderId, productId, phone)
  if (expected.length !== token.length) return false
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token))
}
