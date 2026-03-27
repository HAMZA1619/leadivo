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
  Bell,
  Check,
  ChevronDown,
  CreditCard,
  Eye,
  FlaskConical,
  Gift,
  Globe,
  HelpCircle,
  Info,
  MousePointerClick,
  RefreshCw,
  Rows3,
  Server,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Table,
  Tag,
  Target,
  TrendingUp,
  Truck,
  Upload,
  Zap,
} from "lucide-react"
import "@/lib/i18n"
import type { AppLandingPage } from "@/lib/apps"
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

/** Map app slug → docs article slug (only overrides where they differ) */
const APP_TO_DOC_SLUG: Record<string, string> = {
  "facebook-pixel": "meta-pixel",
}
function getDocSlug(appSlug: string) {
  return APP_TO_DOC_SLUG[appSlug] || appSlug
}

/** Map app slug → dashboard integration route */
const APP_TO_INTEGRATION: Record<string, string> = {
  "facebook-pixel": "meta-capi",
  "tiktok-pixel": "tiktok-eapi",
}
function getIntegrationPath(appSlug: string) {
  return `/dashboard/integrations/${APP_TO_INTEGRATION[appSlug] || appSlug}`
}

const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Bell, ShoppingCart, Sparkles, Truck, Star, Globe, Server, MousePointerClick,
  CreditCard, FlaskConical, Target, BarChart3, RefreshCw, Settings, Table,
  Rows3, Upload, TrendingUp, Shield, Zap, Eye, Gift, Tag,
}

export function AppsPage({ app, locale }: { app: AppLandingPage; locale?: string }) {
  return (
    <I18nProvider overrideLang={locale}>
      <AppsContent app={app} linkPrefix={locale ? `/${locale}` : ""} />
      {!locale && <LanguageSwitcher />}
    </I18nProvider>
  )
}

function AppsContent({ app, linkPrefix = "" }: { app: AppLandingPage; linkPrefix?: string }) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === "rtl"
  const AppIcon = ICON_MAP[app.iconId]

  const otherApps = APP_PAGES.filter((a) => a.slug !== app.slug)

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      {/* Back link */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:pt-8">
        <Link href={`${linkPrefix}/apps`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
          {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          {t("apps.viewAll")}
        </Link>
      </div>

      {/* App header — icon + name + badges + CTA (mobile: stacked, desktop: row) */}
      <section className="px-4 pb-6 pt-6 sm:pb-8 sm:pt-8">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              {/* Icon */}
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-sm sm:h-20 sm:w-20"
                style={{ backgroundColor: `${app.iconColor}12`, border: `1px solid ${app.iconColor}20` }}
              >
                {AppIcon && <AppIcon className="h-9 w-9 sm:h-11 sm:w-11" style={{ color: app.iconColor }} />}
              </div>

              {/* Name + meta */}
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{app.name}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t("apps.developer")}</span>
                  <span className="text-muted-foreground/40">|</span>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Tag className="h-3 w-3" />
                    {t(`apps.category.${app.category}`)}
                  </span>
                  <span className="text-muted-foreground/40">|</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <Check className="h-3 w-3" />
                    {t("apps.builtIn")}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={getIntegrationPath(app.slug)}>{t("apps.getStarted")}</Link>
                </Button>
                <span className="text-center text-xs text-muted-foreground sm:text-end">
                  {t("apps.priceNote")}
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Separator />

      {/* Main content + sidebar */}
      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[1fr_280px] lg:gap-10 xl:grid-cols-[1fr_300px]">

          {/* Main content column */}
          <div className="min-w-0">

            {/* Description */}
            <FadeIn>
              <div className="mb-10">
                <h2 className="mb-3 text-lg font-semibold">{t("apps.overview")}</h2>
                <p className="leading-relaxed text-muted-foreground">{t(app.heroDescKey)}</p>
              </div>
            </FadeIn>

            {/* Features */}
            <FadeIn delay={60}>
              <div className="mb-10">
                <h2 className="mb-5 text-lg font-semibold">{t("apps.features")}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {app.features.map((feat, i) => {
                    const FeatureIcon = FEATURE_ICONS[feat.icon] || Zap
                    return (
                      <div key={feat.titleKey} className="flex gap-3 rounded-xl border bg-card p-4">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${app.iconColor}12` }}
                        >
                          <FeatureIcon className="h-4.5 w-4.5 h-[18px] w-[18px]" style={{ color: app.iconColor } as React.CSSProperties} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-medium">{t(feat.titleKey)}</h3>
                          <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{t(feat.descKey)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </FadeIn>

            {/* How it works */}
            <FadeIn delay={120}>
              <div className="mb-10">
                <h2 className="mb-5 text-lg font-semibold">{t("apps.howItWorks")}</h2>
                <div className="space-y-0">
                  {app.steps.map((step, i) => (
                    <div key={step.titleKey} className="relative flex gap-4 pb-6 last:pb-0">
                      {/* Vertical connector line */}
                      {i < app.steps.length - 1 && (
                        <div
                          className="absolute start-[19px] top-10 bottom-0 w-px"
                          style={{ backgroundColor: `${app.iconColor}30` }}
                        />
                      )}
                      <div
                        className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: app.iconColor }}
                      >
                        {i + 1}
                      </div>
                      <div className="pt-1.5">
                        <h3 className="font-medium">{t(step.titleKey)}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(step.descKey)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* FAQs */}
            <FadeIn delay={180}>
              <div className="mb-10">
                <h2 className="mb-5 text-lg font-semibold">{t("apps.faqTitle")}</h2>
                <div className="space-y-3">
                  {app.faqs.map((faq, i) => {
                    const lang = (i18n.language || "en") as "en" | "ar" | "fr"
                    const q = faq.question[lang] || faq.question.en
                    const a = faq.answer[lang] || faq.answer.en
                    return (
                      <details key={i} className="group rounded-xl border bg-card">
                        <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-5 py-4 text-sm font-medium transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                          <span>{q}</span>
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="border-t px-5 py-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
                      </details>
                    )
                  })}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Sidebar — sticky on desktop, card on mobile */}
          <div className="lg:relative">
            <div className="lg:sticky lg:top-6">
              <FadeIn delay={100}>
                <div className="rounded-xl border bg-card p-5">
                  {/* Sidebar app icon + name (compact) */}
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${app.iconColor}12` }}
                    >
                      {AppIcon && <AppIcon className="h-5 w-5" style={{ color: app.iconColor }} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight">{app.name}</p>
                      <p className="text-xs text-muted-foreground">{t("apps.developer")}</p>
                    </div>
                  </div>

                  <Button asChild className="w-full" size="sm">
                    <Link href={getIntegrationPath(app.slug)}>{t("apps.getStarted")}</Link>
                  </Button>

                  <Separator className="my-4" />

                  {/* Details list */}
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("apps.details")}</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <dt className="flex items-center gap-1.5 text-muted-foreground">
                        <Tag className="h-3.5 w-3.5" />
                        {t("apps.appCategory")}
                      </dt>
                      <dd className="text-end font-medium">{t(`apps.category.${app.category}`)}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <dt className="flex items-center gap-1.5 text-muted-foreground">
                        <CreditCard className="h-3.5 w-3.5" />
                        {t("apps.pricing")}
                      </dt>
                      <dd className="text-end">
                        <span className="font-medium text-primary">{t("apps.price")}</span>
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <dt className="flex items-center gap-1.5 text-muted-foreground">
                        <Info className="h-3.5 w-3.5" />
                        {t("apps.builtIn")}
                      </dt>
                      <dd className="text-end">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                          <Check className="h-3 w-3" />
                          {t("apps.included")}
                        </span>
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <dt className="flex items-center gap-1.5 text-muted-foreground">
                        <HelpCircle className="h-3.5 w-3.5" />
                        {t("apps.support")}
                      </dt>
                      <dd className="text-end">
                        <Link href={`${linkPrefix}/docs/integrations/${getDocSlug(app.slug)}`} className="text-xs font-medium text-primary transition-colors hover:underline">
                          {t("docs.title")}
                        </Link>
                      </dd>
                    </div>
                  </dl>

                  {/* Related apps */}
                  {otherApps.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("apps.moreApps")}</h3>
                      <div className="space-y-2">
                        {otherApps.map((a) => {
                          const Icon = ICON_MAP[a.iconId]
                          return (
                            <Link
                              key={a.slug}
                              href={`${linkPrefix}/apps/${a.slug}`}
                              className="flex items-center gap-2.5 rounded-lg p-2 text-sm transition-colors hover:bg-muted/50"
                            >
                              <div
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                style={{ backgroundColor: `${a.iconColor}12` }}
                              >
                                {Icon && <Icon className="h-4 w-4" style={{ color: a.iconColor }} />}
                              </div>
                              <span className="truncate font-medium">{a.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              </FadeIn>
            </div>
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
