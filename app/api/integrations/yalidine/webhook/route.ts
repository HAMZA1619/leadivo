import crypto from "crypto"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ORDER_STATUS_TRANSITIONS, type OrderStatus } from "@/lib/constants"

const STATUS_MAP: Record<string, OrderStatus> = {
  // In transit → confirmed (already confirmed from order creation)
  "Ramassé": "confirmed",
  "Transfert": "confirmed",
  "Expédié": "confirmed",
  "Centre": "confirmed",
  "Vers Wilaya": "confirmed",
  "Reçu à Wilaya": "confirmed",
  // Out for delivery → shipped
  "Sorti en livraison": "shipped",
  "En attente du client": "shipped",
  "Tentative échouée": "shipped",
  // Terminal success
  "Livré": "delivered",
  // Return flow → returned
  "Retourné au vendeur": "returned",
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-webhook-secret") ?? ""
    const expected = process.env.INTEGRATION_WEBHOOK_SECRET ?? ""
    if (!secret || !expected || !timingSafeEqual(secret, expected)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const { tracking, last_status: status } = body as Record<string, unknown>

    if (typeof tracking !== "string" || typeof status !== "string" || !tracking || !status) {
      return NextResponse.json({ error: "Missing tracking or status" }, { status: 400 })
    }

    const admin = createAdminClient()

    const mappedStatus = STATUS_MAP[status]
    if (mappedStatus) {
      const { data: order } = await admin
        .from("orders")
        .select("id, status")
        .eq("shipment_tracking", tracking)
        .single()

      if (order) {
        const validTransitions = ORDER_STATUS_TRANSITIONS[order.status as OrderStatus] ?? []
        if (validTransitions.includes(mappedStatus)) {
          await admin
            .from("orders")
            .update({ status: mappedStatus, updated_at: new Date().toISOString() })
            .eq("id", order.id)
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
