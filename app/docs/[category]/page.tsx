"use client"

import { use, useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCategory, getCategoryArticles } from "@/lib/docs/content"
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react"
import * as Icons from "lucide-react"
import { useLanguageStore } from "@/lib/store/language-store"
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

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: slug } = use(params)
  const category = getCategory(slug)
  if (!category) notFound()

  const articles = getCategoryArticles(slug)
  const lang = useLanguageStore((s) => s.language)
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === "rtl"

  const IconComponent =
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[category.icon] ?? Icons.FileText

  return (
    <div className="space-y-10">
      {/* Back link */}
      <Link href="/docs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
        {t("docs.title")}
      </Link>

      {/* Category header */}
      <FadeIn>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">{category.title[lang]}</h1>
            <p className="mt-1 text-muted-foreground">{category.description[lang]}</p>
          </div>
        </div>
      </FadeIn>

      {/* Articles list */}
      <div className="space-y-3">
        {articles.map((article, i) => (
          <FadeIn key={article.slug} delay={i * 40}>
            <Link
              href={`/docs/${slug}/${article.slug}`}
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
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
