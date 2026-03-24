import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CustomersTable } from "@/components/dashboard/customers-table"
import { T } from "@/components/dashboard/translated-text"

const PAGE_SIZE = 20

export default async function CustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", user.id)
    .single()

  if (!store) redirect("/dashboard/store")

  const [{ data: customers }, { data: profile }] = await Promise.all([
    supabase
      .from("customers")
      .select("id, customer_phone, customer_name, customer_email, customer_city, customer_country, tags, currency, total_spent, order_count, last_order_at, created_at")
      .eq("store_id", store.id)
      .order("last_order_at", { ascending: false })
      .range(0, PAGE_SIZE - 1),
    supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single(),
  ])

  const canExport = ["active", "trialing"].includes(profile?.subscription_status || "")

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold"><T k="customers.title" /></h1>
      <CustomersTable
        initialCustomers={customers || []}
        hasMore={(customers?.length || 0) === PAGE_SIZE}
        canExport={canExport}
      />
    </div>
  )
}
