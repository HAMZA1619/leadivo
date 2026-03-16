"use client"

import { useState } from "react"
import Link from "next/link"
import { LeadivoLogo } from "@/components/icons/leadivo-logo"
import { I18nProvider } from "@/components/dashboard/i18n-provider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTranslation } from "react-i18next"
import { useLanguageStore, type Language } from "@/lib/store/language-store"
import { BarChart3, Check, Globe, Languages, ShoppingCart, Smartphone, Truck, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import "@/lib/i18n"

const FEATURES = [
  { icon: Zap, key: "auth.brand.feature1" },
  { icon: ShoppingCart, key: "auth.brand.feature2" },
  { icon: BarChart3, key: "auth.brand.feature3" },
  { icon: Smartphone, key: "auth.brand.feature4" },
  { icon: Globe, key: "auth.brand.feature5" },
  { icon: Truck, key: "auth.brand.feature6" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthLayoutInner>{children}</AuthLayoutInner>
    </I18nProvider>
  )
}

function AuthLayoutInner({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel — hidden on mobile */}
      <div className="relative hidden w-[480px] shrink-0 flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-20 -start-20 h-72 w-72 rounded-full border border-primary-foreground/10" />
          <div className="absolute -top-10 -start-10 h-52 w-52 rounded-full border border-primary-foreground/5" />
          <div className="absolute -bottom-16 -end-16 h-64 w-64 rounded-full border border-primary-foreground/10" />
          <div className="absolute -bottom-8 -end-8 h-44 w-44 rounded-full border border-primary-foreground/5" />
        </div>

        {/* Top: Logo */}
        <div className="relative">
          <Link href="/">
            <LeadivoLogo className="h-8 brightness-0 invert" />
          </Link>
        </div>

        {/* Middle: Value prop */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">
              {t("auth.brand.title")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed opacity-80">
              {t("auth.brand.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((feat) => (
              <div key={feat.key} className="flex items-center gap-2.5 rounded-lg bg-primary-foreground/10 px-3 py-2.5">
                <feat.icon className="h-4 w-4 shrink-0 opacity-80" />
                <span className="text-xs font-medium">{t(feat.key)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Social proof */}
        <div className="relative">
          <p className="text-xs opacity-60">
            {t("auth.brand.trusted")}
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col">
        {/* Top bar: mobile logo + language */}
        <header className="flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="lg:hidden">
            <Link href="/">
              <LeadivoLogo className="h-8" />
            </Link>
          </div>
          <div className="hidden lg:block" />
          <LanguageDropdown />
        </header>

        {/* Form */}
        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="flex items-center justify-center gap-4 px-4 pb-6 text-xs text-muted-foreground">
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            {t("landing.privacyPolicy")}
          </Link>
          <span>·</span>
          <Link href="/terms" className="transition-colors hover:text-foreground">
            {t("landing.termsOfService")}
          </Link>
        </footer>
      </div>
    </div>
  )
}

const LANGUAGE_CODES: Language[] = ["en", "fr", "ar"]

function LanguageDropdown() {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguageStore()
  const [open, setOpen] = useState(false)

  function handleChange(lang: Language) {
    setLanguage(lang)
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Languages className="h-4 w-4" />
          <span className="text-xs font-medium uppercase">{language}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-36 p-1">
        {LANGUAGE_CODES.map((code) => (
          <button
            key={code}
            onClick={() => handleChange(code)}
            className={cn(
              "flex w-full items-center justify-between rounded-sm px-3 py-1.5 text-sm transition-colors hover:bg-muted",
              language === code && "font-medium"
            )}
          >
            {t(`language.${code}`)}
            {language === code && <Check className="h-3 w-3" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
