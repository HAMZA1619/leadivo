import { createAdminClient } from "@/lib/supabase/admin"
import { validateWebhookEvent, WebhookSignatureError } from "@/lib/billing"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

async function revalidateOwnerStore(supabase: ReturnType<typeof createAdminClient>, userId: string) {
  const { data: store } = await supabase
    .from("stores")
    .select("id, slug")
    .eq("owner_id", userId)
    .single()
  if (store) {
    revalidateTag(`store:${store.slug}`, "max")
    revalidateTag(`store:${store.id}`, "max")
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headers = Object.fromEntries(request.headers.entries())

    let event
    try {
      event = validateWebhookEvent(body, headers)
    } catch (e) {
      if (e instanceof WebhookSignatureError) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
      if (e instanceof Error && e.message === "Webhook secret not configured") {
        return NextResponse.json({ error: e.message }, { status: 503 })
      }
      throw e
    }

    const supabase = createAdminClient()
    let ownerId: string | undefined

    switch (event.type) {
      case "subscription.active": {
        const subId = event.subscriptionId
        const customerId = event.customerId
        const userId = event.metadata?.user_id
        if (!subId) break

        const update = {
          subscription_status: "active",
          subscription_tier: "pro",
          billing_subscription_id: subId,
          ...(customerId ? { billing_customer_id: customerId } : {}),
        }

        if (userId) {
          await supabase.from("profiles").update(update).eq("id", userId)
          ownerId = userId
        } else if (customerId) {
          const { data } = await supabase.from("profiles").update(update).eq("billing_customer_id", customerId).select("id").single()
          ownerId = data?.id
        }
        break
      }

      case "subscription.canceled": {
        const subId = event.subscriptionId
        if (!subId) break

        const { data } = await supabase
          .from("profiles")
          .update({ subscription_status: "canceled" })
          .eq("billing_subscription_id", subId)
          .select("id")
          .single()
        ownerId = data?.id
        break
      }

      case "subscription.revoked": {
        const subId = event.subscriptionId
        if (!subId) break

        const { data } = await supabase
          .from("profiles")
          .update({
            subscription_status: "expired",
            subscription_tier: "free",
          })
          .eq("billing_subscription_id", subId)
          .select("id")
          .single()
        ownerId = data?.id
        break
      }

      case "subscription.past_due": {
        const subId = event.subscriptionId
        if (!subId) break

        const { data } = await supabase
          .from("profiles")
          .update({
            subscription_status: "past_due",
          })
          .eq("billing_subscription_id", subId)
          .select("id")
          .single()
        ownerId = data?.id
        break
      }
    }

    // Store invoice locally for provider migration safety
    if (ownerId && event.type === "subscription.active") {
      await supabase.from("billing_invoices").upsert(
        {
          user_id: ownerId,
          provider_invoice_id: event.subscriptionId ?? "",
          amount: 0,
          currency: "usd",
          status: "paid",
          billing_reason: "subscription_create",
        },
        { onConflict: "provider_invoice_id" }
      ).select()
    }

    if (ownerId) {
      await revalidateOwnerStore(supabase, ownerId)
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
