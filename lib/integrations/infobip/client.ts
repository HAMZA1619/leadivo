import { normalizePhone } from "@/lib/integrations/apps/whatsapp"

const API_KEY = process.env.INFOBIP_API_KEY || ""
const BASE_URL = process.env.INFOBIP_BASE_URL || ""

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

export async function sendFlashCall(
  phone: string,
  country?: string
): Promise<{ pinId: string }> {
  const normalized = normalizePhone(phone, country)
  const data = await infobipFetch("/2fa/2/pin", {
    applicationId: "flash-call",
    messageId: "flash-call",
    from: "Leadivo",
    to: normalized,
    pinType: "NUMERIC",
    pinLength: 4,
  })
  return { pinId: data.pinId }
}

export async function verifyFlashCallPin(
  phone: string,
  pin: string,
  country?: string
): Promise<boolean> {
  const normalized = normalizePhone(phone, country)
  try {
    const data = await infobipFetch("/2fa/2/pin/verify", {
      to: normalized,
      pin,
    })
    return data.verified === true
  } catch {
    return false
  }
}

export async function sendSmsOtp(
  phone: string,
  code: string,
  country?: string
): Promise<void> {
  const normalized = normalizePhone(phone, country)
  // SMS format for Web OTP API auto-read
  const text = `Your verification code is ${code}\n\n@leadivo.app #${code}`
  await infobipFetch("/sms/2/text/advanced", {
    messages: [
      {
        destinations: [{ to: normalized }],
        from: "Leadivo",
        text,
      },
    ],
  })
}
