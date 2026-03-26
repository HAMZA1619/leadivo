import type { Metadata } from "next"
import { TermsPage } from "@/components/marketing/terms-page"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "شروط الخدمة | Leadivo",
  description: "اقرأ شروط وأحكام استخدام Leadivo، منشئ المتاجر الإلكترونية لبائعي السوشيال ميديا.",
  alternates: {
    canonical: `${APP_URL}/ar/terms`,
    languages: { en: `${APP_URL}/terms`, ar: `${APP_URL}/ar/terms`, fr: `${APP_URL}/fr/terms` },
  },
  openGraph: { type: "website", url: `${APP_URL}/ar/terms`, locale: "ar", title: "شروط الخدمة | Leadivo" },
}

export default function Page() {
  return <TermsPage locale="ar" />
}
