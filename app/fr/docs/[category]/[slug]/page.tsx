"use client"

import { use } from "react"
import { DocsArticle } from "@/components/docs/docs-article"

export default function FrArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = use(params)
  return <DocsArticle categorySlug={category} articleSlug={slug} linkPrefix="/fr" />
}
