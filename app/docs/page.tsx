"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CATEGORIES, searchArticles } from "@/lib/docs/content"
import { Search } from "lucide-react"
import * as Icons from "lucide-react"
import { useLanguageStore } from "@/lib/store/language-store"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

export default function DocsPage() {
  const [query, setQuery] = useState("")
  const lang = useLanguageStore((s) => s.language)
  const { t } = useTranslation()

  const results = query.trim() ? searchArticles(query, lang) : null

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">{t("docs.title")}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {t("docs.subtitle")}
        </p>
      </div>

      <div className="relative mx-auto max-w-md px-1">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("docs.searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {results ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {results.length} {results.length !== 1 ? t("docs.articles") : t("docs.article")}
          </p>
          {results.map((article) => (
            <Link
              key={article.slug}
              href={`/docs/${article.category}/${article.slug}`}
              className="block rounded-lg border p-3 transition-colors hover:bg-muted/50 sm:p-4"
            >
              <p className="font-medium">{article.title[lang]}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {article.description[lang]}
              </p>
            </Link>
          ))}
          {results.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              {t("docs.noResults")}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const IconComponent =
              (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[cat.icon] ?? Icons.FileText
            return (
              <Link key={cat.slug} href={`/docs/${cat.slug}`}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader className="p-4 sm:p-6">
                    <IconComponent className="mb-2 h-6 w-6 text-primary" />
                    <CardTitle className="text-base">{cat.title[lang]}</CardTitle>
                    <CardDescription className="line-clamp-2">{cat.description[lang]}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
