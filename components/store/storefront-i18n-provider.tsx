"use client"

import { useEffect } from "react"
import { I18nextProvider } from "react-i18next"
import i18n, { loadLocale } from "@/lib/i18n"
import { RTL_LANGUAGES } from "@/lib/i18n/languages"

export function StorefrontI18nProvider({
  lang,
  children,
}: {
  lang: string
  children: React.ReactNode
}) {
  useEffect(() => {
    loadLocale(lang).then(() => {
      i18n.changeLanguage(lang)
    }).catch(() => {})
    document.documentElement.dir = RTL_LANGUAGES.has(lang) ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }, [lang])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
