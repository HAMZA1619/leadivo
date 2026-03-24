import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import {
  ArrowLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageSquare,
  ShoppingCart,
  DollarSign,
  Calendar,
  Hash,
} from "lucide-react"
import { T } from "@/components/dashboard/translated-text"
import { FormattedDateTime } from "@/components/dashboard/formatted-date"
import { RelativeDate } from "@/components/dashboard/relative-date"
import { CustomerTagsEditor } from "@/components/dashboard/customer-tags-editor"
import { CustomerNotesEditor } from "@/components/dashboard/customer-notes-editor"

const statusBadgeConfig: Record<string, { dot: string; bg: string; label: string }> = {
  pending: { dot: "bg-amber-400", bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300", label: "Pending" },
  confirmed: { dot: "bg-sky-400", bg: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300", label: "Confirmed" },
  shipped: { dot: "bg-violet-400", bg: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300", label: "Shipped" },
  delivered: { dot: "bg-emerald-400", bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300", label: "Delivered" },
  returned: { dot: "bg-orange-400", bg: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300", label: "Returned" },
  canceled: { dot: "bg-rose-400", bg: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300", label: "Canceled" },
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>
}) {
  const { customerId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", user.id)
    .single()

  if (!store) redirect("/dashboard/store")

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .eq("store_id", store.id)
    .single()

  if (!customer) notFound()

  // Use RPC to match orders via normalize_phone() so we hit the functional index
  const { data: orders } = await supabase.rpc("get_customer_orders", {
    p_store_id: store.id,
    p_norm_phone: customer.customer_phone,
    p_limit: 100,
  })

  const initials = customer.customer_name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const avgOrder = customer.order_count > 0
    ? customer.total_spent / customer.order_count
    : 0

  const whatsappPhone = customer.customer_phone.replace(/[^0-9]/g, "")

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/dashboard/customers" className="hover:text-foreground">
          <T k="customers.title" />
        </Link>
        <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
        <span className="text-foreground font-medium">{customer.customer_name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/customers" className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initials}
        </div>
        <div>
          <h1 className="text-xl font-bold">{customer.customer_name}</h1>
          <p className="text-sm text-muted-foreground">{customer.customer_phone}</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
        {/* Left column — Order History */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold"><T k="customers.detail.orderHistory" /></h2>
          {(!orders || orders.length === 0) ? (
            <p className="py-8 text-center text-muted-foreground"><T k="customers.detail.noOrders" /></p>
          ) : (
            <div className="rounded-md border divide-y">
              {orders.map((order) => {
                const cfg = statusBadgeConfig[order.status] || { dot: "bg-gray-400", bg: "bg-gray-100 text-gray-600", label: order.status }
                return (
                  <Link
                    key={order.id}
                    href={`/dashboard/orders/${order.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-medium text-sm">#{order.order_number}</span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bg}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-sm">
                      <span className="font-medium">{formatPrice(order.total, order.currency)}</span>
                      <span className="text-muted-foreground hidden sm:inline">
                        <RelativeDate date={order.created_at} />
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Right column — Customer Info */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="text-sm font-semibold"><T k="customers.detail.contactInfo" /></h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span>{customer.customer_phone}</span>
              </div>
              {customer.customer_email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{customer.customer_email}</span>
                </div>
              )}
              {customer.customer_city && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{customer.customer_city}</span>
                </div>
              )}
              {customer.customer_country && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" />
                  <span>{customer.customer_country}</span>
                </div>
              )}
              {customer.customer_address && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mt-0.5" />
                  <span className="break-all">{customer.customer_address}</span>
                </div>
              )}
            </div>
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <T k="customers.detail.messageOnWhatsApp" />
            </a>
          </div>

          {/* Stats */}
          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="text-sm font-semibold"><T k="customers.detail.statistics" /></h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-3.5 w-3.5" />
                  <T k="customers.detail.totalSpent" />
                </span>
                <span className="font-medium">{formatPrice(customer.total_spent, customer.currency || "USD")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <T k="customers.detail.orderCount" />
                </span>
                <span className="font-medium">{customer.order_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" />
                  <T k="customers.detail.avgOrder" />
                </span>
                <span className="font-medium">{formatPrice(avgOrder, customer.currency || "USD")}</span>
              </div>
              <Separator />
              {customer.first_order_at && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <T k="customers.detail.firstOrder" />
                  </span>
                  <span className="text-muted-foreground"><FormattedDateTime date={customer.first_order_at} /></span>
                </div>
              )}
              {customer.last_order_at && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <T k="customers.detail.lastOrder" />
                  </span>
                  <span className="text-muted-foreground"><RelativeDate date={customer.last_order_at} /></span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="text-sm font-semibold"><T k="customers.detail.tags" /></h3>
            <CustomerTagsEditor customerId={customer.id} initialTags={customer.tags || []} />
          </div>

          {/* Notes */}
          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="text-sm font-semibold"><T k="customers.detail.notes" /></h3>
            <CustomerNotesEditor customerId={customer.id} initialNotes={customer.notes} />
          </div>
        </div>
      </div>
    </div>
  )
}
