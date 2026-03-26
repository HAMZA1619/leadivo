import type { Metadata } from "next"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "Terms of Service | Leadivo",
  description: "Read the terms and conditions for using Leadivo, the online store builder for social media sellers.",
  alternates: {
    canonical: `${APP_URL}/terms`,
    languages: { en: `${APP_URL}/terms`, ar: `${APP_URL}/ar/terms`, fr: `${APP_URL}/fr/terms` },
  },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
