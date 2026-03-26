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
import { ArrowRight, Check } from "lucide-react"
import "@/lib/i18n"
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

export function CompareIndex({ locale }: { locale?: string } = {}) {
  return (
    <I18nProvider overrideLang={locale}>
      <CompareIndexContent linkPrefix={locale ? `/${locale}` : ""} />
      {!locale && <LanguageSwitcher />}
    </I18nProvider>
  )
}

function CompareIndexContent({ linkPrefix = "" }: { linkPrefix?: string }) {
  const { t } = useTranslation()

  const leadivoStrengths = [
    "compare.strength.codAnalytics",
    "compare.strength.whatsapp",
    "compare.strength.multiMarket",
    "compare.strength.20langs",
    "compare.strength.2min",
    "compare.strength.onePrice",
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      {/* Hero */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <h1 className="text-3xl font-semibold leading-tight text-balance sm:text-4xl md:text-5xl">
              {t("compare.indexTitle")}
            </h1>
          </FadeIn>
          <FadeIn delay={80}>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
              {t("compare.indexSubtitle")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* What makes Leadivo stand out */}
      <section className="border-t bg-muted/30 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <h2 className="mb-10 text-center text-2xl font-semibold">{t("compare.whatMakesLeadivo")}</h2>
          </FadeIn>
          <FadeIn delay={60}>
            <div className="grid gap-3 sm:grid-cols-2">
              {leadivoStrengths.map((key) => (
                <div key={key} className="flex items-center gap-3 rounded-lg border bg-background p-4">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium">{t(key)}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Platform cards */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="mb-10 text-center text-2xl font-semibold">{t("compare.chooseComparison")}</h2>
          </FadeIn>
          <div className="grid gap-4 sm:grid-cols-2">
            {COMPARE_PLATFORMS.map((p, i) => (
              <FadeIn key={p.slug} delay={i * 60}>
                <Link
                  href={`${linkPrefix}/compare/${p.slug}`}
                  className="group flex items-center justify-between rounded-xl border p-6 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div>
                    <h3 className="font-semibold">
                      Leadivo <span className="text-muted-foreground">{t("compare.vs")}</span> {p.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t(p.knownForKey)}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary rtl:-rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              </FadeIn>
            ))}
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
            <p className="mx-auto mt-4 max-w-lg text-lg opacity-90">{t("compare.ctaDescription")}</p>
            <Button asChild size="lg" variant="secondary" className="mt-8 shadow-lg">
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
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
