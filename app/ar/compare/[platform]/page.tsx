import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getComparePlatform, getAllCompareSlugs } from "@/lib/compare"
import { ComparePage } from "@/components/marketing/compare-page"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export async function generateStaticParams() {
  return getAllCompareSlugs().map((platform) => ({ platform }))
}

export async function generateMetadata({ params }: { params: Promise<{ platform: string }> }): Promise<Metadata> {
  const { platform: slug } = await params
  const platform = getComparePlatform(slug)
  if (!platform) return {}

  return {
    title: platform.metaTitle.ar,
    description: platform.metaDescription.ar,
    keywords: platform.keywords,
    alternates: {
      canonical: `${APP_URL}/ar/compare/${slug}`,
      languages: {
        en: `${APP_URL}/compare/${slug}`,
        ar: `${APP_URL}/ar/compare/${slug}`,
        fr: `${APP_URL}/fr/compare/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      url: `${APP_URL}/ar/compare/${slug}`,
      siteName: "Leadivo",
      title: platform.metaTitle.ar,
      description: platform.metaDescription.ar,
      locale: "ar",
    },
    twitter: {
      card: "summary_large_image",
      title: platform.metaTitle.ar,
      description: platform.metaDescription.ar,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ platform: string }> }) {
  const { platform: slug } = await params
  const platform = getComparePlatform(slug)
  if (!platform) notFound()

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${APP_URL}/ar` },
      { "@type": "ListItem", position: 2, name: "المقارنات", item: `${APP_URL}/ar/compare` },
      { "@type": "ListItem", position: 3, name: `Leadivo مقابل ${platform.name}`, item: `${APP_URL}/ar/compare/${slug}` },
    ],
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: platform.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question.ar,
      acceptedAnswer: { "@type": "Answer", text: faq.answer.ar },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ComparePage platform={platform} locale="ar" />
    </>
  )
}
