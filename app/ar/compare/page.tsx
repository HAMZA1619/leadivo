import type { Metadata } from "next"
import { CompareIndex } from "@/components/marketing/compare-index"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "قارن Leadivo — اكتشف كيف يقارن Leadivo",
  description:
    "قارن بين Leadivo وShopify وWooCommerce وWix وYouCan وسلة والمزيد. اكتشف لماذا يختار بائعو السوشيال ميديا وأعمال COD منصة Leadivo.",
  keywords: [
    "مقارنة leadivo",
    "ليديفو مقابل شوبيفاي",
    "ليديفو مقابل يوكان",
    "ليديفو مقابل سلة",
    "بديل شوبيفاي عربي",
    "أفضل منصة تجارة إلكترونية",
    "منشئ متاجر cod",
  ],
  alternates: {
    canonical: `${APP_URL}/ar/compare`,
    languages: {
      en: `${APP_URL}/compare`,
      ar: `${APP_URL}/ar/compare`,
      fr: `${APP_URL}/fr/compare`,
    },
  },
  openGraph: {
    type: "website",
    url: `${APP_URL}/ar/compare`,
    siteName: "Leadivo",
    title: "قارن Leadivo — اكتشف كيف يقارن Leadivo",
    description:
      "قارن بين Leadivo وShopify وWooCommerce وYouCan وسلة. اكتشف لماذا يختار البائعون Leadivo.",
    locale: "ar",
  },
}

export default function Page() {
  return <CompareIndex locale="ar" />
}
