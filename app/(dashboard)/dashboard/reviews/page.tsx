import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReviewsList } from "@/components/dashboard/reviews-list"
import { T } from "@/components/dashboard/translated-text"

export default async function ReviewsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", user.id)
    .single()

  if (!store) redirect("/dashboard/store")

  const [
    { count: pendingCount },
    { count: approvedCount },
    { count: rejectedCount },
  ] = await Promise.all([
    supabase
      .from("product_reviews")
      .select("id", { count: "exact", head: true })
      .eq("store_id", store.id)
      .eq("status", "pending"),
    supabase
      .from("product_reviews")
      .select("id", { count: "exact", head: true })
      .eq("store_id", store.id)
      .eq("status", "approved"),
    supabase
      .from("product_reviews")
      .select("id", { count: "exact", head: true })
      .eq("store_id", store.id)
      .eq("status", "rejected"),
  ])

  const counts = {
    all: (pendingCount || 0) + (approvedCount || 0) + (rejectedCount || 0),
    pending: pendingCount || 0,
    approved: approvedCount || 0,
    rejected: rejectedCount || 0,
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold"><T k="reviews.title" /></h1>
      <ReviewsList initialCounts={counts} />
    </div>
  )
}
