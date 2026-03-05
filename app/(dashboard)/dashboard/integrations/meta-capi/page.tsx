import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MetaCapiSetup } from "@/components/dashboard/integrations/meta-capi-setup"

export default async function MetaCapiPage() {
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

  const { data: integration } = await supabase
    .from("store_integrations")
    .select("*")
    .eq("store_id", store.id)
    .eq("integration_id", "meta-capi")
    .single()

  return (
    <MetaCapiSetup
      storeId={store.id}
      installed={integration || null}
    />
  )
}
