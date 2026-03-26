import type { Metadata } from "next"
import { AppsIndex } from "@/components/marketing/apps-index"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "Apps Store — Connect Your Tools",
  description:
    "Connect WhatsApp, Facebook Pixel, Google Sheets, TikTok Pixel, and Google Analytics to your Leadivo store. All integrations built-in, no plugins needed.",
  keywords: [
    "ecommerce integrations",
    "whatsapp ecommerce",
    "facebook pixel online store",
    "google sheets order tracking",
    "tiktok pixel ecommerce",
    "google analytics store",
  ],
  alternates: {
    canonical: `${APP_URL}/apps`,
    languages: {
      en: `${APP_URL}/apps`,
      ar: `${APP_URL}/ar/apps`,
      fr: `${APP_URL}/fr/apps`,
    },
  },
  openGraph: {
    type: "website",
    url: `${APP_URL}/apps`,
    siteName: "Leadivo",
    title: "Apps Store — Connect Your Tools",
    description:
      "Connect WhatsApp, Facebook Pixel, Google Sheets, TikTok Pixel, and Google Analytics to your Leadivo store.",
  },
}

export default function Page() {
  return <AppsIndex />
}
