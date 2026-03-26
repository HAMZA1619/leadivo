import crypto from "crypto"
import { createAdminClient } from "@/lib/supabase/admin"
import { normalizePhone } from "@/lib/integrations/apps/whatsapp"
import { send2faPin, verify2faPin } from "./client"

const HMAC_SECRET = process.env.INFOBIP_API_KEY || "verification-secret"

/** Normalize phone to a canonical form for consistent DB lookups */
function canonical(phone: string, country?: string): string {
  return normalizePhone(phone, country)
}

export async function initiateVerification(
  storeId: string,
  phone: string,
  _method: "sms_otp",
  country?: string
): Promise<{ method: string; expires_in: number }> {
  const admin = createAdminClient()
  const normalizedPhone = canonical(phone, country)

  // Rate limit: max 3 per phone per store in 10 minutes
  const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { count } = await admin
    .from("phone_verifications")
    .select("*", { count: "exact", head: true })
    .eq("store_id", storeId)
    .eq("phone", normalizedPhone)
    .gte("created_at", tenMinAgo)

  if ((count || 0) >= 3) {
    throw new Error("TOO_MANY_ATTEMPTS")
  }

  let pinId: string
  try {
    const result = await send2faPin(phone, country)
    pinId = result.pinId
  } catch {
    throw new Error("SMS_FAILED")
  }

  const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString()

  await admin.from("phone_verifications").insert({
    store_id: storeId,
    phone: normalizedPhone,
    code_hash: pinId,
    method: "sms_otp",
    expires_at: expiresAt,
  })

  return { method: "sms_otp", expires_in: 120 }
}

export async function confirmVerification(
  storeId: string,
  phone: string,
  code: string,
  country?: string
): Promise<{ verified: boolean; token?: string }> {
  const admin = createAdminClient()
  const normalizedPhone = canonical(phone, country)

  const { data: row } = await admin
    .from("phone_verifications")
    .select("*")
    .eq("store_id", storeId)
    .eq("phone", normalizedPhone)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!row) {
    return { verified: false }
  }

  // Check expiry
  if (new Date(row.expires_at) < new Date()) {
    await admin
      .from("phone_verifications")
      .update({ status: "expired" })
      .eq("id", row.id)
    return { verified: false }
  }

  // Increment attempts
  const newAttempts = (row.attempts || 0) + 1
  if (newAttempts >= 5) {
    await admin
      .from("phone_verifications")
      .update({ status: "expired", attempts: newAttempts })
      .eq("id", row.id)
    throw new Error("MAX_ATTEMPTS")
  }

  await admin
    .from("phone_verifications")
    .update({ attempts: newAttempts })
    .eq("id", row.id)

  // Verify PIN via Infobip 2FA API
  const pinId = row.code_hash
  const verified = await verify2faPin(pinId, code)

  if (!verified) {
    return { verified: false }
  }

  // Mark verified
  await admin
    .from("phone_verifications")
    .update({ status: "verified" })
    .eq("id", row.id)

  const token = generateVerificationToken(storeId, normalizedPhone)
  return { verified: true, token }
}

export function generateVerificationToken(
  storeId: string,
  phone: string
): string {
  const timestamp = Date.now()
  const payload = `${storeId}:${phone}:${timestamp}`
  const hmac = crypto
    .createHmac("sha256", HMAC_SECRET)
    .update(payload)
    .digest("hex")
  return Buffer.from(`${payload}:${hmac}`).toString("base64")
}

export function validateVerificationToken(
  token: string,
  phone: string,
  storeId: string,
  country?: string
): boolean {
  try {
    const normalizedPhone = canonical(phone, country)
    const decoded = Buffer.from(token, "base64").toString("utf8")
    const parts = decoded.split(":")
    if (parts.length !== 4) return false

    const [tokenStoreId, tokenPhone, timestampStr, tokenHmac] = parts
    if (tokenStoreId !== storeId || tokenPhone !== normalizedPhone) return false

    // Token valid for 10 minutes
    const timestamp = parseInt(timestampStr, 10)
    if (Date.now() - timestamp > 10 * 60 * 1000) return false

    const expectedPayload = `${tokenStoreId}:${tokenPhone}:${timestampStr}`
    const expectedHmac = crypto
      .createHmac("sha256", HMAC_SECRET)
      .update(expectedPayload)
      .digest("hex")

    return crypto.timingSafeEqual(
      Buffer.from(tokenHmac, "hex"),
      Buffer.from(expectedHmac, "hex")
    )
  } catch {
    return false
  }
}
