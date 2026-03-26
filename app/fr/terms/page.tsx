import type { Metadata } from "next"
import { TermsPage } from "@/components/marketing/terms-page"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "Conditions d'utilisation | Leadivo",
  description: "Lisez les conditions d'utilisation de Leadivo, le créateur de boutiques en ligne pour les vendeurs sociaux.",
  alternates: {
    canonical: `${APP_URL}/fr/terms`,
    languages: { en: `${APP_URL}/terms`, ar: `${APP_URL}/ar/terms`, fr: `${APP_URL}/fr/terms` },
  },
  openGraph: { type: "website", url: `${APP_URL}/fr/terms`, locale: "fr", title: "Conditions d'utilisation | Leadivo" },
}

export default function Page() {
  return <TermsPage locale="fr" />
}
