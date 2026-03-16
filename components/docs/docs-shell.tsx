"use client"

import Link from "next/link"
import { I18nProvider } from "@/components/dashboard/i18n-provider"
import { LanguageSwitcher } from "@/components/dashboard/language-switcher"
import { LeadivoLogo } from "@/components/icons/leadivo-logo"
import { Separator } from "@/components/ui/separator"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <DocsShellInner>{children}</DocsShellInner>
    </I18nProvider>
  )
}

function DocsShellInner({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:py-14">{children}</main>

      <footer className="border-t px-4 py-12 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:justify-between md:text-start">
            <div>
              <LeadivoLogo className="mx-auto h-8 md:mx-0" />
              <p className="mt-2 text-sm text-muted-foreground">{t("landing.footerTagline")}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <Link href="/docs" className="transition-colors hover:text-foreground">
                {t("docs.title")}
              </Link>
              <Link href="/compare" className="transition-colors hover:text-foreground">
                {t("compare.backToAll")}
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
      <LanguageSwitcher />
    </div>
  )
}
