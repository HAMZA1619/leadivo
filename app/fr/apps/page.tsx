import type { Metadata } from "next"
import { AppsIndex } from "@/components/marketing/apps-index"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "Apps Store — Connectez vos outils",
  description:
    "Connectez WhatsApp, Facebook Pixel, Google Sheets, TikTok Pixel et Google Analytics à votre boutique Leadivo. Toutes les intégrations sont incluses.",
  keywords: [
    "intégrations ecommerce",
    "whatsapp boutique en ligne",
    "facebook pixel boutique",
    "google sheets commandes",
    "tiktok pixel ecommerce",
  ],
  alternates: {
    canonical: `${APP_URL}/fr/apps`,
    languages: { en: `${APP_URL}/apps`, ar: `${APP_URL}/ar/apps`, fr: `${APP_URL}/fr/apps` },
  },
  openGraph: {
    type: "website",
    url: `${APP_URL}/fr/apps`,
    siteName: "Leadivo",
    title: "Apps Store — Connectez vos outils",
    description: "Connectez WhatsApp, Facebook Pixel, Google Sheets, TikTok Pixel et Google Analytics à votre boutique Leadivo.",
    locale: "fr",
  },
}

export default function Page() {
  return <AppsIndex locale="fr" />
}
