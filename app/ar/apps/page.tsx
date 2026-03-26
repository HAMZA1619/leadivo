import type { Metadata } from "next"
import { AppsIndex } from "@/components/marketing/apps-index"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "متجر التطبيقات — اربط أدواتك",
  description:
    "اربط واتساب وفيسبوك بيكسل وGoogle Sheets وتيك توك بيكسل وGoogle Analytics بمتجر Leadivo. جميع التكاملات مدمجة بدون إضافات.",
  keywords: [
    "تكاملات متجر الكتروني",
    "واتساب متجر",
    "فيسبوك بيكسل",
    "google sheets طلبات",
    "تيك توك بيكسل",
    "تحليلات جوجل متجر",
  ],
  alternates: {
    canonical: `${APP_URL}/ar/apps`,
    languages: {
      en: `${APP_URL}/apps`,
      ar: `${APP_URL}/ar/apps`,
      fr: `${APP_URL}/fr/apps`,
    },
  },
  openGraph: {
    type: "website",
    url: `${APP_URL}/ar/apps`,
    siteName: "Leadivo",
    title: "متجر التطبيقات — اربط أدواتك",
    description:
      "اربط واتساب وفيسبوك بيكسل وGoogle Sheets وتيك توك بيكسل وGoogle Analytics بمتجر Leadivo.",
    locale: "ar",
  },
}

export default function Page() {
  return <AppsIndex locale="ar" />
}
