import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WhatsAppSetup } from "@/components/dashboard/integrations/whatsapp-setup"

export default async function WhatsAppPage() {
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
    .eq("integration_id", "whatsapp")
    .single()

  return (
    <WhatsAppSetup
      storeId={store.id}
      installed={integration || null}
    />
  )
}
