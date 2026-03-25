import { normalizePhone } from "@/lib/integrations/apps/whatsapp"

const API_KEY = process.env.INFOBIP_API_KEY || ""
const BASE_URL = process.env.INFOBIP_BASE_URL || ""

// 2FA Application + Message Template IDs (created via Infobip 2FA API)
const APP_ID = process.env.INFOBIP_2FA_APP_ID || ""
const SMS_MSG_ID = process.env.INFOBIP_2FA_SMS_MSG_ID || ""
const VOICE_MSG_ID = process.env.INFOBIP_2FA_VOICE_MSG_ID || ""

async function infobipFetch(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `App ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Infobip ${path} failed (${res.status}): ${text}`)
  }
  return res.json()
}

/**
 * Send a PIN via the 2FA API. Works for both SMS and Voice (flash call).
 * SMS uses /2fa/2/pin, Voice uses /2fa/2/pin/voice.
 * Infobip generates the PIN — we get back a pinId to verify later.
 */
export async function send2faPin(
  phone: string,
  channel: "sms" | "voice",
  country?: string
): Promise<{ pinId: string }> {
  const normalized = normalizePhone(phone, country)
  const path = channel === "voice" ? "/2fa/2/pin/voice" : "/2fa/2/pin"
  const data = await infobipFetch(path, {
    applicationId: APP_ID,
    messageId: channel === "voice" ? VOICE_MSG_ID : SMS_MSG_ID,
    to: normalized,
  })
  return { pinId: data.pinId }
}

/**
 * Verify a PIN via the 2FA API. Works for both SMS and Voice.
 */
export async function verify2faPin(
  pinId: string,
  pin: string
): Promise<boolean> {
  try {
    const data = await infobipFetch(`/2fa/2/pin/${pinId}/verify`, {
      pin,
    })
    return data.verified === true
  } catch {
    return false
  }
}
