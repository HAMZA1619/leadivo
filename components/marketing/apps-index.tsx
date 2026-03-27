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
import { ArrowRight, Check, Sparkles } from "lucide-react"
import "@/lib/i18n"
import { APP_PAGES } from "@/lib/apps"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { MetaIcon } from "@/components/icons/meta"
import { TiktokIcon } from "@/components/icons/tiktok"
import { GoogleSheetsIcon } from "@/components/icons/google-sheets"
import { GoogleAnalyticsIcon } from "@/components/icons/google-analytics"
import { YalidineIcon } from "@/components/icons/yalidine"

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

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  whatsapp: WhatsAppIcon,
  meta: MetaIcon,
  tiktok: TiktokIcon,
  "google-sheets": GoogleSheetsIcon,
  "google-analytics": GoogleAnalyticsIcon,
  yalidine: YalidineIcon,
}

const CATEGORY_ORDER = ["communication", "marketing", "shipping", "productivity", "analytics"] as const

export function AppsIndex({ locale }: { locale?: string } = {}) {
  return (
    <I18nProvider overrideLang={locale}>
      <AppsIndexContent linkPrefix={locale ? `/${locale}` : ""} />
      {!locale && <LanguageSwitcher />}
    </I18nProvider>
  )
}

function AppsIndexContent({ linkPrefix = "" }: { linkPrefix?: string }) {
  const { t } = useTranslation()

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    apps: APP_PAGES.filter((a) => a.category === cat),
  })).filter((g) => g.apps.length > 0)

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-12 pt-20 sm:pb-16 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <FadeIn>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {t("apps.builtIn")} — {t("apps.included")}
            </div>
          </FadeIn>
          <FadeIn delay={60}>
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {t("apps.indexTitle")}
            </h1>
          </FadeIn>
          <FadeIn delay={120}>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground sm:text-lg">
              {t("apps.indexSubtitle")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Strengths pills */}
      <section className="px-4 pb-10">
        <FadeIn>
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2">
            {[
              t("compare.strength.onePrice"),
              t("compare.strength.2min"),
              t("compare.strength.20langs"),
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium sm:text-sm">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* App cards by category */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-5xl">
          {grouped.map((group, gi) => (
            <div key={group.category} className={gi > 0 ? "mt-10" : ""}>
              <FadeIn delay={gi * 40}>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(`apps.category.${group.category}`)}
                </h2>
              </FadeIn>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.apps.map((app, i) => {
                  const Icon = ICON_MAP[app.iconId]
                  return (
                    <FadeIn key={app.slug} delay={gi * 40 + i * 60}>
                      <Link
                        href={`${linkPrefix}/apps/${app.slug}`}
                        className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg sm:p-6"
                      >
                        {/* Icon + badge row */}
                        <div className="mb-3 flex items-start justify-between">
                          <div
                            className="flex h-11 w-11 items-center justify-center rounded-xl sm:h-12 sm:w-12"
                            style={{ backgroundColor: `${app.iconColor}12` }}
                          >
                            {Icon && <Icon className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: app.iconColor }} />}
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                            <Check className="h-3 w-3" />
                            {t("apps.builtIn")}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="text-[15px] font-semibold leading-tight sm:text-base">{app.name}</h3>

                        {/* Description */}
                        <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                          {t(app.heroDescKey).slice(0, 110)}...
                        </p>

                        {/* Arrow link */}
                        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                          <span>{t("apps.learnMore")}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:-rotate-180 rtl:group-hover:-translate-x-1" />
                        </div>
                      </Link>
                    </FadeIn>
                  )
                })}
              </div>
            </div>
          ))}
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
            <h2 className="text-balance text-2xl font-bold sm:text-3xl">
              {t("apps.ctaTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-primary-foreground/80 sm:text-lg">
              {t("apps.ctaDescription")}
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-6 shadow-lg">
              <Link href="/signup">{t("landing.ctaCta")}</Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-12 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:justify-between md:text-start">
            <div>
              <LeadivoLogo className="mx-auto h-8 md:mx-0" />
              <p className="mt-2 text-sm text-muted-foreground">{t("landing.footerTagline")}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <Link href={`${linkPrefix}/docs`} className="transition-colors hover:text-foreground">
                {t("docs.title")}
              </Link>
              <Link href={`${linkPrefix}/privacy`} className="transition-colors hover:text-foreground">
                {t("landing.privacyPolicy")}
              </Link>
              <Link href={`${linkPrefix}/terms`} className="transition-colors hover:text-foreground">
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
