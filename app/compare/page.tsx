import type { Metadata } from "next"
import { CompareIndex } from "@/components/marketing/compare-index"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "Compare Leadivo — See How Leadivo Stacks Up",
  description:
    "Compare Leadivo with Shopify, WooCommerce, YouCan, and Salla. See why social sellers and COD businesses choose Leadivo for fast, mobile-first storefronts.",
  keywords: [
    "leadivo comparison",
    "leadivo vs shopify",
    "leadivo vs woocommerce",
    "leadivo vs youcan",
    "leadivo vs salla",
    "cod store builder comparison",
    "best ecommerce platform cod",
  ],
  alternates: {
    canonical: `${APP_URL}/compare`,
  },
  openGraph: {
    type: "website",
    url: `${APP_URL}/compare`,
    siteName: "Leadivo",
    title: "Compare Leadivo — See How Leadivo Stacks Up",
    description:
      "Compare Leadivo with Shopify, WooCommerce, YouCan, and Salla. See why social sellers and COD businesses choose Leadivo.",
  },
}

export default function Page() {
  return <CompareIndex />
}
