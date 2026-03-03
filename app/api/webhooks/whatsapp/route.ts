import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import urlJoin from "url-join"

async function generateClarificationMessage(customerText: string, language: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return "Sorry, I didn't understand. Could you reply with *yes* to confirm or *no* to cancel?"

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a WhatsApp assistant helping a customer confirm or cancel their order. The customer sent an unclear reply. Generate a short, friendly message in ${language === "ar" ? "Arabic" : language === "fr" ? "French" : "English"} asking them to clarify by replying with yes to confirm or no to cancel. Keep it to 1-2 sentences, casual tone, no emojis. Output ONLY the message.`,
          },
          { role: "user", content: `Customer replied: "${customerText}"` },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) return "Sorry, I didn't understand. Could you reply with *yes* to confirm or *no* to cancel?"

    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() || "Sorry, I didn't understand. Could you reply with *yes* to confirm or *no* to cancel?"
  } catch {
    return "Sorry, I didn't understand. Could you reply with *yes* to confirm or *no* to cancel?"
  }
}

async function sendWhatsAppText(instanceName: string, phone: string, text: string): Promise<void> {
  const evolutionUrl = process.env.EVOLUTION_API_URL
  const evolutionKey = process.env.EVOLUTION_API_KEY
  if (!evolutionUrl || !evolutionKey) return

  await fetch(urlJoin(evolutionUrl, "message/sendText", instanceName), {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: evolutionKey },
    body: JSON.stringify({ number: phone, text }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => {})
}

async function classifyResponse(text: string): Promise<"confirm" | "cancel" | "unknown" | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You classify customer replies to an order confirmation message. The customer was asked to confirm or cancel their order. Based on their reply, output EXACTLY one word: "confirm" if positive, "cancel" if negative, "unknown" if unclear. No explanation.`,
          },
          { role: "user", content: text },
        ],
        max_tokens: 10,
        temperature: 0,
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) return null

    const data = await res.json()
    const result = data.choices?.[0]?.message?.content?.trim().toLowerCase()

    if (result === "confirm") return "confirm"
    if (result === "cancel") return "cancel"
    if (result === "unknown") return "unknown"
    return null
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get("secret")
    if (!secret || secret !== process.env.WHATSAPP_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Skip messages sent by us
    if (body?.data?.key?.fromMe) {
      return NextResponse.json({ ok: true })
    }

    const remoteJid = body?.data?.key?.remoteJid as string | undefined
    if (!remoteJid || !remoteJid.endsWith("@s.whatsapp.net")) {
      return NextResponse.json({ ok: true })
    }

    const phone = remoteJid.replace("@s.whatsapp.net", "")

    // Try to extract action from button response
    let action: "confirm" | "cancel" | null = null
    let orderId: string | null = null

    const buttonId =
      body?.data?.message?.buttonsResponseMessage?.selectedButtonId as string | undefined
    if (buttonId) {
      if (buttonId.startsWith("confirm_")) {
        action = "confirm"
        orderId = buttonId.replace("confirm_", "")
      } else if (buttonId.startsWith("cancel_")) {
        action = "cancel"
        orderId = buttonId.replace("cancel_", "")
      }
    }

    const supabase = createAdminClient()

    // Text fallback: use AI to classify response as confirm/cancel
    if (!action) {
      const text = (
        (body?.data?.message?.conversation as string) ||
        (body?.data?.message?.extendedTextMessage?.text as string) ||
        ""
      ).trim()

      if (text) {
        const result = await classifyResponse(text)

        if (result === "unknown") {
          // Check if this phone has a pending confirmation before asking to clarify
          const { data: pending } = await supabase
            .from("order_confirmations")
            .select("store_id")
            .eq("status", "pending")
            .eq("customer_phone", phone)
            .limit(1)
            .single()

          if (pending) {
            const { data: integration } = await supabase
              .from("store_integrations")
              .select("config")
              .eq("store_id", pending.store_id)
              .eq("integration_id", "whatsapp")
              .single()

            const instanceName = (integration?.config as Record<string, unknown>)?.instance_name as string | undefined
            const { data: store } = await supabase
              .from("stores")
              .select("language")
              .eq("id", pending.store_id)
              .single()

            if (instanceName) {
              const clarification = await generateClarificationMessage(text, store?.language || "en")
              await sendWhatsAppText(instanceName, phone, clarification)
            }
          }

          return NextResponse.json({ ok: true, clarification: true })
        }

        action = result === "confirm" || result === "cancel" ? result : null
      }
    }

    if (!action) {
      return NextResponse.json({ ok: true })
    }

    // Find pending confirmation for this phone (+ exact order if from button)
    let query = supabase
      .from("order_confirmations")
      .select("id, order_id")
      .eq("status", "pending")
      .eq("customer_phone", phone)

    if (orderId) {
      query = query.eq("order_id", orderId)
    }

    const { data: confirmation } = await query
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!confirmation) {
      return NextResponse.json({ ok: true })
    }

    const newConfirmationStatus = action === "confirm" ? "confirmed" : "canceled"
    const newOrderStatus = action === "confirm" ? "confirmed" : "canceled"
    const now = new Date().toISOString()

    // Update confirmation record
    await supabase
      .from("order_confirmations")
      .update({ status: newConfirmationStatus, responded_at: now })
      .eq("id", confirmation.id)
      .eq("status", "pending")

    // Update order status (only if still pending)
    await supabase
      .from("orders")
      .update({ status: newOrderStatus, updated_at: now })
      .eq("id", confirmation.order_id)
      .eq("status", "pending")

    return NextResponse.json({ ok: true, action: newConfirmationStatus })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
