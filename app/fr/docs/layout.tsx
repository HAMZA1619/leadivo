import type { Metadata } from "next"
import { DocsShell } from "@/components/docs/docs-shell"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "Documentation — Leadivo",
  description: "Apprenez à utiliser Leadivo pour créer et gérer votre boutique en ligne.",
  alternates: {
    canonical: `${APP_URL}/fr/docs`,
    languages: {
      en: `${APP_URL}/docs`,
      ar: `${APP_URL}/ar/docs`,
      fr: `${APP_URL}/fr/docs`,
    },
  },
  openGraph: {
    type: "website",
    title: "Documentation — Leadivo",
    description: "Apprenez à utiliser Leadivo pour créer et gérer votre boutique en ligne.",
    url: `${APP_URL}/fr/docs`,
    locale: "fr",
  },
}

export default function FrDocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell locale="fr">{children}</DocsShell>
}
