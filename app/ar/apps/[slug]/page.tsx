import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAppPage, getAllAppSlugs } from "@/lib/apps"
import { AppsPage } from "@/components/marketing/apps-page"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export async function generateStaticParams() {
  return getAllAppSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const app = getAppPage(slug)
  if (!app) return {}

  return {
    title: app.metaTitle.ar,
    description: app.metaDescription.ar,
    keywords: app.keywords,
    alternates: {
      canonical: `${APP_URL}/ar/apps/${slug}`,
      languages: {
        en: `${APP_URL}/apps/${slug}`,
        ar: `${APP_URL}/ar/apps/${slug}`,
        fr: `${APP_URL}/fr/apps/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      url: `${APP_URL}/ar/apps/${slug}`,
      siteName: "Leadivo",
      title: app.metaTitle.ar,
      description: app.metaDescription.ar,
      locale: "ar",
    },
    twitter: {
      card: "summary_large_image",
      title: app.metaTitle.ar,
      description: app.metaDescription.ar,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = getAppPage(slug)
  if (!app) notFound()

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `تكامل ${app.name} مع Leadivo`,
    description: app.metaDescription.ar,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Leadivo",
    inLanguage: "ar",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "مشمول مع خطة Leadivo Pro",
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${APP_URL}/ar` },
      { "@type": "ListItem", position: 2, name: "التطبيقات", item: `${APP_URL}/ar/apps` },
      { "@type": "ListItem", position: 3, name: app.name, item: `${APP_URL}/ar/apps/${slug}` },
    ],
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: app.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question.ar,
      acceptedAnswer: { "@type": "Answer", text: faq.answer.ar },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <AppsPage app={app} locale="ar" />
    </>
  )
}
