import urlJoin from "url-join"
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks"

const POLAR_API_URL = process.env.POLAR_API_URL || "https://api.polar.sh"

export interface Invoice {
  id: string
  created_at: string
  amount: number
  currency: string
  status: string
  billing_reason: string
}

export type BillingEventType =
  | "subscription.active"
  | "subscription.canceled"
  | "subscription.revoked"
  | "subscription.past_due"

export interface BillingEvent {
  type: BillingEventType
  subscriptionId: string | undefined
  customerId: string | undefined
  metadata: Record<string, string> | undefined
}

export async function createCheckoutUrl(userId: string, email: string): Promise<string> {
  const productId = process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID
  if (!productId) throw new Error("Billing not configured")

  const res = await fetch(urlJoin(POLAR_API_URL, "v1/checkouts/custom/"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      success_url:
        urlJoin(process.env.NEXT_PUBLIC_APP_URL!, "dashboard/settings") +
        "?checkout=success",
      metadata: { user_id: userId },
      customer_email: email,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("Billing checkout error:", err)
    throw new Error("Failed to create checkout")
  }

  const checkout = await res.json()
  return checkout.url as string
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const res = await fetch(
    urlJoin(POLAR_API_URL, "v1/subscriptions", subscriptionId),
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancel_at_period_end: true }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    console.error("Billing cancel error:", err)
    throw new Error("Failed to cancel subscription")
  }
}

export async function getInvoices(customerId: string): Promise<Invoice[]> {
  const url = new URL(urlJoin(POLAR_API_URL, "v1/orders/"))
  url.searchParams.set("customer_id", customerId)
  url.searchParams.set("sorting", "-created_at")
  url.searchParams.set("limit", "50")

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
    },
  })

  if (!res.ok) {
    console.error("Billing invoices error:", await res.text())
    return []
  }

  const data = await res.json()
  return (data.items ?? []).map((o: Record<string, unknown>) => ({
    id: o.id,
    created_at: o.created_at,
    amount: o.total_amount,
    currency: o.currency,
    status: o.status,
    billing_reason: o.billing_reason,
  }))
}

export function validateWebhookEvent(body: string, headers: Record<string, string>): BillingEvent {
  const secret = process.env.POLAR_WEBHOOK_SECRET
  if (!secret) throw new Error("Webhook secret not configured")

  let event: { type: string; data: Record<string, unknown> }
  try {
    event = validateEvent(body, headers, secret) as typeof event
  } catch (e) {
    if (e instanceof WebhookVerificationError) {
      throw new WebhookSignatureError("Invalid signature")
    }
    throw e
  }

  return {
    type: event.type as BillingEventType,
    subscriptionId: event.data?.id as string | undefined,
    customerId: event.data?.customerId as string | undefined,
    metadata: event.data?.metadata as Record<string, string> | undefined,
  }
}

export class WebhookSignatureError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "WebhookSignatureError"
  }
}
