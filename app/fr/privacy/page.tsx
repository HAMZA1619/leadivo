import type { Metadata } from "next"
import { PrivacyPage } from "@/components/marketing/privacy-page"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "Politique de confidentialité | Leadivo",
  description: "Découvrez comment Leadivo collecte, utilise et protège vos données personnelles.",
  alternates: {
    canonical: `${APP_URL}/fr/privacy`,
    languages: { en: `${APP_URL}/privacy`, ar: `${APP_URL}/ar/privacy`, fr: `${APP_URL}/fr/privacy` },
  },
  openGraph: { type: "website", url: `${APP_URL}/fr/privacy`, locale: "fr", title: "Politique de confidentialité | Leadivo" },
}

export default function Page() {
  return <PrivacyPage locale="fr" />
}
