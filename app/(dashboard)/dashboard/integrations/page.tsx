import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { IntegrationManager } from "@/components/dashboard/integration-manager"

export default async function IntegrationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", user.id)
    .single()

  if (!store) redirect("/dashboard/store")

  const [{ data: installed }, { data: latestEvents }] = await Promise.all([
    supabase
      .from("store_integrations")
      .select("*")
      .eq("store_id", store.id),
    supabase
      .from("integration_events")
      .select("integration_id, status, created_at")
      .eq("store_id", store.id)
      .in("status", ["completed", "failed"])
      .order("created_at", { ascending: false })
      .limit(50),
  ])

  // Build a map of integration_id → latest event status
  const latestEventMap: Record<string, { status: string; created_at: string }> = {}
  for (const ev of latestEvents || []) {
    if (!latestEventMap[ev.integration_id]) {
      latestEventMap[ev.integration_id] = { status: ev.status, created_at: ev.created_at }
    }
  }

  return (
    <div className="space-y-4">
      <IntegrationManager
        storeId={store.id}
        installedIntegrations={installed || []}
        latestEvents={latestEventMap}
      />
    </div>
  )
}
