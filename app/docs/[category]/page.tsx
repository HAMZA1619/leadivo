"use client"

import { use } from "react"
import { DocsCategory } from "@/components/docs/docs-category"

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = use(params)
  return <DocsCategory categorySlug={category} />
}
