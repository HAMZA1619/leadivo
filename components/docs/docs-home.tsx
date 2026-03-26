"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { CATEGORIES, searchArticles } from "@/lib/docs/content"
import { Search, ChevronRight } from "lucide-react"
import * as Icons from "lucide-react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

function FadeIn({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.35s ease ${delay}ms, transform 0.35s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export function DocsHome({ linkPrefix = "" }: { linkPrefix?: string }) {
  const [query, setQuery] = useState("")
  const { t, i18n } = useTranslation()
  const lang = (i18n.language || "en") as "en" | "ar" | "fr"

  const results = query.trim() ? searchArticles(query, lang) : null

  return (
    <div className="space-y-10">
      <FadeIn>
        <div className="text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">{t("docs.title")}</h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {t("docs.subtitle")}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <div className="relative mx-auto max-w-md">
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("docs.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ps-10"
          />
        </div>
      </FadeIn>

      {results ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {results.length} {results.length !== 1 ? t("docs.articles") : t("docs.article")}
          </p>
          {results.map((article) => (
            <Link
              key={article.slug}
              href={`${linkPrefix}/docs/${article.category}/${article.slug}`}
              className="group flex items-center justify-between gap-3 rounded-xl border p-4 transition-all hover:border-primary/50 hover:shadow-sm sm:p-5"
            >
              <div className="min-w-0">
                <p className="font-medium">{article.title[lang]}</p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {article.description[lang]}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary rtl:-rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          ))}
          {results.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              {t("docs.noResults")}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => {
            const IconComponent =
              (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[cat.icon] ?? Icons.FileText
            return (
              <FadeIn key={cat.slug} delay={i * 50}>
                <Link
                  href={`${linkPrefix}/docs/${cat.slug}`}
                  className="group flex h-full flex-col rounded-xl border p-5 transition-all hover:border-primary/50 hover:shadow-sm sm:p-6"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{cat.title[lang]}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{cat.description[lang]}</p>
                  <div className="mt-auto flex items-center gap-1 pt-4 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    {t("docs.viewArticles")}
                    <ChevronRight className="h-3 w-3 rtl:-rotate-180" />
                  </div>
                </Link>
              </FadeIn>
            )
          })}
        </div>
      )}
    </div>
  )
}
