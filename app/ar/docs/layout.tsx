import type { Metadata } from "next"
import { DocsShell } from "@/components/docs/docs-shell"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "المساعدة والتوثيق — Leadivo",
  description: "تعلّم كيف تستخدم Leadivo لإنشاء وإدارة متجرك الإلكتروني.",
  alternates: {
    canonical: `${APP_URL}/ar/docs`,
    languages: {
      en: `${APP_URL}/docs`,
      ar: `${APP_URL}/ar/docs`,
      fr: `${APP_URL}/fr/docs`,
    },
  },
  openGraph: {
    type: "website",
    title: "المساعدة والتوثيق — Leadivo",
    description: "تعلّم كيف تستخدم Leadivo لإنشاء وإدارة متجرك الإلكتروني.",
    url: `${APP_URL}/ar/docs`,
    locale: "ar",
  },
}

export default function ArDocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell locale="ar">{children}</DocsShell>
}
