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
    title: app.metaTitle.en,
    description: app.metaDescription.en,
    keywords: app.keywords,
    alternates: {
      canonical: `${APP_URL}/apps/${slug}`,
      languages: {
        en: `${APP_URL}/apps/${slug}`,
        ar: `${APP_URL}/ar/apps/${slug}`,
        fr: `${APP_URL}/fr/apps/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      url: `${APP_URL}/apps/${slug}`,
      siteName: "Leadivo",
      title: app.metaTitle.en,
      description: app.metaDescription.en,
    },
    twitter: {
      card: "summary_large_image",
      title: app.metaTitle.en,
      description: app.metaDescription.en,
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
    name: `${app.name} Integration for Leadivo`,
    description: app.metaDescription.en,
    applicationCategory: app.category === "marketing" ? "BusinessApplication" : app.category === "analytics" ? "BusinessApplication" : "BusinessApplication",
    operatingSystem: "Leadivo",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Included with Leadivo Pro plan",
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
      { "@type": "ListItem", position: 2, name: "Apps", item: `${APP_URL}/apps` },
      { "@type": "ListItem", position: 3, name: app.name, item: `${APP_URL}/apps/${slug}` },
    ],
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: app.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question.en,
      acceptedAnswer: { "@type": "Answer", text: faq.answer.en },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <AppsPage app={app} />
    </>
  )
}
