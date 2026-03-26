import type { Metadata } from "next"
import { CompareIndex } from "@/components/marketing/compare-index"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "Comparer Leadivo — Découvrez comment Leadivo se compare",
  description:
    "Comparez Leadivo avec Shopify, WooCommerce, Wix, YouCan, Salla et plus. Découvrez pourquoi les vendeurs sociaux et COD choisissent Leadivo.",
  keywords: [
    "comparaison leadivo",
    "leadivo vs shopify",
    "leadivo vs woocommerce",
    "leadivo vs youcan",
    "alternative shopify",
    "plateforme ecommerce cod",
  ],
  alternates: {
    canonical: `${APP_URL}/fr/compare`,
    languages: { en: `${APP_URL}/compare`, ar: `${APP_URL}/ar/compare`, fr: `${APP_URL}/fr/compare` },
  },
  openGraph: {
    type: "website",
    url: `${APP_URL}/fr/compare`,
    siteName: "Leadivo",
    title: "Comparer Leadivo — Découvrez comment Leadivo se compare",
    description: "Comparez Leadivo avec Shopify, WooCommerce, YouCan, Salla et plus.",
    locale: "fr",
  },
}

export default function Page() {
  return <CompareIndex locale="fr" />
}
