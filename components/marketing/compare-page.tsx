"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { useEffect, useRef, useState, type ReactNode } from "react"
import dynamic from "next/dynamic"

const LanguageSwitcher = dynamic(
  () => import("@/components/dashboard/language-switcher").then((m) => m.LanguageSwitcher),
  { ssr: false }
)
import { I18nProvider } from "@/components/dashboard/i18n-provider"
import { LeadivoLogo } from "@/components/icons/leadivo-logo"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  Globe,
  MessageCircle,
  Minus,
  Package,
  ShoppingCart,
  Smartphone,
  Zap,
} from "lucide-react"
import "@/lib/i18n"
import type { ComparePlatform } from "@/lib/compare"
import { COMPARE_PLATFORMS } from "@/lib/compare"

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

const ICON_MAP: Record<string, typeof Check> = {
  ShoppingCart,
  Zap,
  Smartphone,
  BarChart3,
  MessageCircle,
  Globe,
  Package,
}

function FeatureValue({ value }: { value: boolean | string }) {
  const { t } = useTranslation()
  if (value === true) return <Check className="mx-auto h-5 w-5 text-emerald-500" />
  if (value === false) return <Minus className="mx-auto h-5 w-5 text-muted-foreground/40" />
  if (value === "plugin") return <span className="text-xs text-muted-foreground">{t("compare.plugin")}</span>
  if (value === "theme") return <span className="text-xs text-muted-foreground">{t("compare.theme")}</span>
  if (value === "limited") return <span className="text-xs text-muted-foreground">{t("compare.limited")}</span>
  return <span className="text-sm font-medium">{value}</span>
}

export function ComparePage({ platform }: { platform: ComparePlatform }) {
  return (
    <I18nProvider>
      <CompareContent platform={platform} />
      <LanguageSwitcher />
    </I18nProvider>
  )
}

function CompareContent({ platform }: { platform: ComparePlatform }) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === "rtl"

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      {/* Back link */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8">
        <Link href="/compare" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          {t("compare.backToAll")}
        </Link>
      </div>

      {/* Hero */}
      <section className="px-4 pb-0 pt-8 sm:pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <h1 className="text-3xl font-semibold leading-tight text-balance sm:text-4xl md:text-5xl">
              <span className="text-primary">Leadivo</span>{" "}
              {t("compare.vs")}{" "}
              {platform.name}
            </h1>
          </FadeIn>
          <FadeIn delay={80}>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
              {t(platform.leadivoFitKey)}
            </p>
          </FadeIn>
          <FadeIn delay={140}>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="shadow-lg">
                <Link href="/signup">{t("landing.heroCta")}</Link>
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("landing.heroTrialNote")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* What they're known for — respectful nod */}
      <section className="px-4 py-12 sm:py-16">
        <FadeIn>
          <div className="mx-auto max-w-2xl rounded-xl border bg-muted/30 p-6 text-center sm:p-8">
            <p className="text-sm font-medium text-muted-foreground">{t("compare.knownForLabel", { name: platform.name })}</p>
            <p className="mt-2 text-base">{t(platform.knownForKey)}</p>
          </div>
        </FadeIn>
      </section>

      {/* Why Leadivo highlights */}
      <section className="border-t bg-muted/30 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <h2 className="mb-12 text-center text-2xl font-semibold text-balance sm:text-3xl">
              {t("compare.whyLeadivo")}
            </h2>
          </FadeIn>
          <div className="grid gap-8 sm:grid-cols-3">
            {platform.highlights.map((h, i) => {
              const Icon = ICON_MAP[h.icon] || Zap
              return (
                <FadeIn key={h.titleKey} delay={i * 60}>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold">{t(h.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground">{t(h.descKey)}</p>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <h2 className="mb-12 text-center text-2xl font-semibold text-balance sm:text-3xl">
              {t("compare.featureComparison")}
            </h2>
          </FadeIn>
          <FadeIn delay={60}>
            <div className="overflow-hidden rounded-xl border">
              {/* Table header */}
              <div className="grid grid-cols-3 bg-muted/50 px-4 py-3 text-sm font-semibold sm:px-6">
                <span>{t("compare.feature")}</span>
                <span className="text-center text-primary">Leadivo</span>
                <span className="text-center text-muted-foreground">{platform.name}</span>
              </div>
              {/* Table rows */}
              {platform.features.map((feat, i) => (
                <div
                  key={feat.key}
                  className={`grid grid-cols-3 items-center px-4 py-3 text-sm sm:px-6 ${
                    i % 2 === 0 ? "bg-background" : "bg-muted/20"
                  }`}
                >
                  <span className="font-medium">{t(feat.key)}</span>
                  <span className="text-center">
                    <FeatureValue value={feat.leadivo} />
                  </span>
                  <span className="text-center">
                    <FeatureValue value={feat.other} />
                  </span>
                </div>
              ))}
            </div>
            {platform.slug === "woocommerce" && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {t("compare.woocommercePriceNote")}
              </p>
            )}
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/30 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <h2 className="mb-12 text-center text-2xl font-semibold text-balance sm:text-3xl">
              {t("compare.faqTitle")}
            </h2>
          </FadeIn>
          <div className="divide-y">
            {platform.faqs.map((faq, i) => {
              const lang = (i18n.language || "en") as "en" | "ar" | "fr"
              const q = faq.question[lang] || faq.question.en
              const a = faq.answer[lang] || faq.answer.en
              return (
                <FadeIn key={i} delay={i * 50}>
                  <div className="py-6">
                    <h3 className="font-semibold">{q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary px-4 py-16 text-primary-foreground sm:py-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -end-20 -top-20 h-64 w-64 rounded-full border border-primary-foreground/10" />
          <div className="absolute -bottom-16 -start-16 h-56 w-56 rounded-full border border-primary-foreground/10" />
        </div>
        <FadeIn>
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-balance sm:text-3xl">{t("compare.ctaTitle")}</h2>
            <p className="mx-auto mt-4 max-w-lg text-lg opacity-90">
              {t("compare.ctaDescription")}
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8 shadow-lg">
              <Link href="/signup">{t("landing.ctaCta")}</Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* Other comparisons */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <h2 className="mb-8 text-center text-xl font-semibold">{t("compare.otherComparisons")}</h2>
          </FadeIn>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {COMPARE_PLATFORMS.filter((p) => p.slug !== platform.slug).map((p) => (
              <Link
                key={p.slug}
                href={`/compare/${p.slug}`}
                className="rounded-lg border p-4 text-center transition-colors hover:border-primary/50 hover:bg-muted/30"
              >
                <span className="text-sm font-medium">Leadivo vs {p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-12 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:justify-between md:text-start">
            <div>
              <LeadivoLogo className="mx-auto h-8 md:mx-0" />
              <p className="mt-2 text-sm text-muted-foreground">{t("landing.footerTagline")}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/docs" className="transition-colors hover:text-foreground">
                {t("docs.title")}
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-foreground">
                {t("landing.privacyPolicy")}
              </Link>
              <Link href="/terms" className="transition-colors hover:text-foreground">
                {t("landing.termsOfService")}
              </Link>
            </div>
          </div>
          <Separator className="my-6" />
          <p className="text-center text-xs text-muted-foreground">
            {t("landing.footerCopyright")}
          </p>
        </div>
      </footer>
    </div>
  )
}
