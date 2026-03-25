import crypto from "crypto"
import { createAdminClient } from "@/lib/supabase/admin"
import { normalizePhone } from "@/lib/integrations/apps/whatsapp"
import { sendFlashCall, sendSmsOtp, verifyFlashCallPin } from "./client"

const HMAC_SECRET = process.env.INFOBIP_API_KEY || "verification-secret"

function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex")
}

function generateCode(): string {
  return String(crypto.randomInt(1000, 10000))
}

/** Normalize phone to a canonical form for consistent DB lookups */
function canonical(phone: string, country?: string): string {
  return normalizePhone(phone, country)
}

export async function initiateVerification(
  storeId: string,
  phone: string,
  method: "flash_call" | "sms_otp",
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

  const code = generateCode()
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString()

  if (method === "flash_call") {
    try {
      await sendFlashCall(phone, country)
    } catch {
      throw new Error("FLASH_CALL_FAILED")
    }
  } else {
    await sendSmsOtp(phone, code, country)
  }

  await admin.from("phone_verifications").insert({
    store_id: storeId,
    phone: normalizedPhone,
    // For flash call: Infobip 2FA manages its own PIN, but we store
    // our generated code as a server-side fallback. The confirm endpoint
    // accepts the code Infobip delivers (last 4 digits of calling number)
    // OR the code we generated — either path hashes to the same verification row.
    // In practice, flash_call verification uses Infobip's /2fa/2/pin/verify.
    code_hash: hashCode(code),
    method,
    expires_at: expiresAt,
  })

  return { method, expires_in: 120 }
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

  // For flash calls, verify via Infobip's 2FA verify endpoint
  let verified = false
  if (row.method === "flash_call") {
    verified = await verifyFlashCallPin(normalizedPhone, code)
  } else {
    // SMS OTP: compare against our stored hash
    verified = hashCode(code) === row.code_hash
  }

  if (!verified) {
    return { verified: false }
  }

  // Mark verified
  await admin
    .from("phone_verifications")
    .update({ status: "verified" })
    .eq("id", row.id)

  // Token uses normalized phone so it matches regardless of input format
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
