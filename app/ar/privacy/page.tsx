import type { Metadata } from "next"
import { PrivacyPage } from "@/components/marketing/privacy-page"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "سياسة الخصوصية | Leadivo",
  description: "تعرّف على كيفية جمع واستخدام وحماية بياناتك الشخصية في Leadivo.",
  alternates: {
    canonical: `${APP_URL}/ar/privacy`,
    languages: { en: `${APP_URL}/privacy`, ar: `${APP_URL}/ar/privacy`, fr: `${APP_URL}/fr/privacy` },
  },
  openGraph: { type: "website", url: `${APP_URL}/ar/privacy`, locale: "ar", title: "سياسة الخصوصية | Leadivo" },
}

export default function Page() {
  return <PrivacyPage locale="ar" />
}
