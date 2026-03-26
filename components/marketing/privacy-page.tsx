"use client"

import Link from "next/link"
import { I18nProvider } from "@/components/dashboard/i18n-provider"
import { LanguageSwitcher } from "@/components/dashboard/language-switcher"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { useTranslation } from "react-i18next"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { LeadivoLogo } from "@/components/icons/leadivo-logo"
import { Separator } from "@/components/ui/separator"
import "@/lib/i18n"

export function PrivacyPage({ locale }: { locale?: string } = {}) {
  const linkPrefix = locale ? `/${locale}` : ""
  return (
    <I18nProvider overrideLang={locale}>
      <PrivacyContent linkPrefix={linkPrefix} />
      {!locale && <LanguageSwitcher />}
    </I18nProvider>
  )
}

function PrivacyContent({ linkPrefix = "" }: { linkPrefix?: string }) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === "rtl"

  const sections = [
    { title: t("privacy.collectTitle"), text: t("privacy.collectText") },
    { title: t("privacy.reviewDataTitle"), text: t("privacy.reviewDataText") },
    { title: t("privacy.customerDataTitle"), text: t("privacy.customerDataText") },
    { title: t("privacy.useTitle"), text: t("privacy.useText") },
    { title: t("privacy.sharingTitle"), text: t("privacy.sharingText") },
    { title: t("privacy.cookiesTitle"), text: t("privacy.cookiesText") },
    { title: t("privacy.securityTitle"), text: t("privacy.securityText") },
    { title: t("privacy.phoneVerificationTitle"), text: t("privacy.phoneVerificationText") },
    { title: t("privacy.rightsTitle"), text: t("privacy.rightsText") },
    { title: t("privacy.contactTitle"), text: t("privacy.contactText") },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <Link href={`${linkPrefix}/`} className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          {t("landing.footer")}
        </Link>

        <h1 className="mb-2 text-3xl font-bold">{t("privacy.title")}</h1>
        <p className="mb-8 text-sm text-muted-foreground">{t("privacy.lastUpdated")}</p>
        <p className="mb-8 text-muted-foreground">{t("privacy.intro")}</p>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-2 text-xl font-semibold">{section.title}</h2>
              <p className="text-muted-foreground">{section.text}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t px-4 py-12 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:justify-between md:text-start">
            <div>
              <LeadivoLogo className="mx-auto h-8 md:mx-0" />
              <p className="mt-2 text-sm text-muted-foreground">{t("landing.footerTagline")}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href={`${linkPrefix}/docs`} className="transition-colors hover:text-foreground">{t("docs.title")}</Link>
              <Link href={`${linkPrefix}/privacy`} className="transition-colors hover:text-foreground">{t("landing.privacyPolicy")}</Link>
              <Link href={`${linkPrefix}/terms`} className="transition-colors hover:text-foreground">{t("landing.termsOfService")}</Link>
            </div>
          </div>
          <Separator className="my-6" />
          <p className="text-center text-xs text-muted-foreground">{t("landing.footerCopyright")}</p>
        </div>
      </footer>
    </div>
  )
}
