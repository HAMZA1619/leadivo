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
    title: `${article.title.fr} — Documentation Leadivo`,
    description: article.description.fr,
    alternates: {
      canonical: `${APP_URL}/fr/docs/${category}/${slug}`,
      languages: {
        en: `${APP_URL}/docs/${category}/${slug}`,
        ar: `${APP_URL}/ar/docs/${category}/${slug}`,
        fr: `${APP_URL}/fr/docs/${category}/${slug}`,
      },
    },
    openGraph: {
      title: `${article.title.fr} — Documentation Leadivo`,
      description: article.description.fr,
      type: "article",
      url: `${APP_URL}/fr/docs/${category}/${slug}`,
      locale: "fr",
      ...(firstImage ? { images: [{ url: `${APP_URL}${firstImage}`, width: 800, height: 450, alt: article.title.fr }] } : {}),
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
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${APP_URL}/fr` },
      { "@type": "ListItem", position: 2, name: "Documentation", item: `${APP_URL}/fr/docs` },
      ...(cat
        ? [{ "@type": "ListItem", position: 3, name: cat.title.fr, item: `${APP_URL}/fr/docs/${category}` }]
        : []),
      ...(article
        ? [{ "@type": "ListItem", position: 4, name: article.title.fr, item: `${APP_URL}/fr/docs/${category}/${slug}` }]
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
            name: faq.question.fr,
            acceptedAnswer: { "@type": "Answer", text: faq.answer.fr },
          })),
        }
      : null

  const howToJsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: article.title.fr,
        description: article.description.fr,
        inLanguage: "fr",
        step: article.steps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.title.fr,
          text: step.description.fr,
          ...(step.image ? { image: `${APP_URL}${step.image}` } : {}),
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      {howToJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />}
      {children}
    </>
  )
}
