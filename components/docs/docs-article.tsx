"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getCategory, getArticle, getCategoryArticles } from "@/lib/docs/content"
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react"
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

function StepImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-xl border bg-muted/30 shadow-sm">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={450}
        className="w-full"
        unoptimized
      />
    </div>
  )
}

export function DocsArticle({ categorySlug, articleSlug, linkPrefix = "" }: { categorySlug: string; articleSlug: string; linkPrefix?: string }) {
  const category = getCategory(categorySlug)
  const article = getArticle(categorySlug, articleSlug)
  if (!category || !article) notFound()

  const { t, i18n } = useTranslation()
  const lang = (i18n.language || "en") as "en" | "ar" | "fr"
  const isRtl = i18n.dir() === "rtl"

  const allArticles = getCategoryArticles(categorySlug)
  const currentIndex = allArticles.findIndex((a) => a.slug === articleSlug)
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href={`${linkPrefix}/docs`} className="transition-colors hover:text-foreground">
          {t("docs.title")}
        </Link>
        <ChevronRight className="h-3 w-3 rtl:-rotate-180" />
        <Link href={`${linkPrefix}/docs/${categorySlug}`} className="transition-colors hover:text-foreground">
          {category.title[lang]}
        </Link>
        <ChevronRight className="h-3 w-3 rtl:-rotate-180" />
        <span className="truncate text-foreground">{article.title[lang]}</span>
      </div>

      <FadeIn>
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">{article.title[lang]}</h1>
          <p className="mt-2 text-muted-foreground">{article.description[lang]}</p>
        </div>
      </FadeIn>

      <div className="space-y-8">
        {article.steps.map((step, i) => (
          <FadeIn key={i} delay={i * 50}>
            <div className="rounded-xl border p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold">{step.title[lang]}</h2>
                  <p className="mt-1 text-muted-foreground">{step.description[lang]}</p>
                  {step.image && <StepImage src={step.image} alt={step.title[lang]} />}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {article.faqs && article.faqs.length > 0 && (
        <FadeIn>
          <div className="space-y-4 rounded-xl border bg-muted/30 p-5 sm:p-6">
            <h2 className="text-xl font-semibold">{t("docs.faq")}</h2>
            <div className="space-y-3">
              {article.faqs.map((faq, i) => (
                <details key={i} className="group rounded-lg border bg-background">
                  <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 font-medium [&::-webkit-details-marker]:hidden">
                    <span>{faq.question[lang]}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90 rtl:-rotate-180 rtl:group-open:-rotate-90" />
                  </summary>
                  <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer[lang]}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {(prevArticle || nextArticle) && (
        <FadeIn>
          <div className="grid gap-3 border-t pt-8 sm:grid-cols-2">
            {prevArticle ? (
              <Link
                href={`${linkPrefix}/docs/${categorySlug}/${prevArticle.slug}`}
                className="group flex items-center gap-3 rounded-xl border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
              >
                {isRtl ? (
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1 group-hover:text-primary" />
                ) : (
                  <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1 group-hover:text-primary" />
                )}
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t("docs.previous")}</p>
                  <p className="truncate text-sm font-medium">{prevArticle.title[lang]}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextArticle && (
              <Link
                href={`${linkPrefix}/docs/${categorySlug}/${nextArticle.slug}`}
                className="group flex items-center justify-end gap-3 rounded-xl border p-4 text-end transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t("docs.next")}</p>
                  <p className="truncate text-sm font-medium">{nextArticle.title[lang]}</p>
                </div>
                {isRtl ? (
                  <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                ) : (
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                )}
              </Link>
            )}
          </div>
        </FadeIn>
      )}
    </div>
  )
}
