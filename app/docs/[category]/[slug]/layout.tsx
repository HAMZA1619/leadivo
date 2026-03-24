import type { Metadata } from "next"
import { getArticle, getCategory } from "@/lib/docs/content"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}): Promise<Metadata> {
  const { category, slug } = await params
  const article = getArticle(category, slug)
  if (!article) return {}

  const firstImage = article.steps.find((s) => s.image)?.image

  return {
    title: `${article.title.en} — Leadivo Docs`,
    description: article.description.en,
    alternates: {
      canonical: `${APP_URL}/docs/${category}/${slug}`,
    },
    openGraph: {
      title: `${article.title.en} — Leadivo Docs`,
      description: article.description.en,
      type: "article",
      url: `${APP_URL}/docs/${category}/${slug}`,
      ...(firstImage ? { images: [{ url: `${APP_URL}${firstImage}`, width: 800, height: 450, alt: article.title.en }] } : {}),
    },
  }
}

export default async function ArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const cat = getCategory(category)
  const article = getArticle(category, slug)

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
      { "@type": "ListItem", position: 2, name: "Docs", item: `${APP_URL}/docs` },
      ...(cat
        ? [{ "@type": "ListItem", position: 3, name: cat.title.en, item: `${APP_URL}/docs/${category}` }]
        : []),
      ...(article
        ? [{ "@type": "ListItem", position: 4, name: article.title.en, item: `${APP_URL}/docs/${category}/${slug}` }]
        : []),
    ],
  }

  const faqJsonLd =
    article?.faqs && article.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question.en,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer.en,
            },
          })),
        }
      : null

  const howToJsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: article.title.en,
        description: article.description.en,
        step: article.steps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.title.en,
          text: step.description.en,
          ...(step.image ? { image: `${APP_URL}${step.image}` } : {}),
        })),
      }
    : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      )}
      {children}
    </>
  )
}
