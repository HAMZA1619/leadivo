import type { Metadata } from "next"
import { LandingPage } from "@/components/marketing/landing-page"

const APP_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ? `https://www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://www.leadivo.app"

export const metadata: Metadata = {
  title: "Leadivo — Turn Your Social Media Into a Store",
  description:
    "Create a beautiful storefront in seconds. Share one link in your bio. Receive orders via WhatsApp or COD — no coding needed. Free trial included.",
  keywords: [
    "online store builder",
    "link in bio store",
    "ecommerce platform",
    "social media store",
    "COD store",
    "WhatsApp orders",
    "create online store",
    "storefront builder",
    "no-code ecommerce",
    "sell on Instagram",
    "sell on TikTok",
  ],
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "Leadivo",
    title: "Leadivo — Turn Your Social Media Into a Store",
    description:
      "Create a beautiful storefront in seconds. Share one link in your bio. Receive orders directly — no coding needed.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leadivo — Turn Your Social Media Into a Store",
    description:
      "Create a beautiful storefront in seconds. Share one link in your bio. Receive orders directly — no coding needed.",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Leadivo",
  url: APP_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Create a beautiful storefront in seconds. Share one link in your bio. Receive orders directly — no coding needed.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free trial included",
  },
}

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Leadivo",
  url: APP_URL,
  logo: `${APP_URL}/icon.png`,
  sameAs: [],
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Leadivo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Leadivo is a platform that lets you create a beautiful online storefront in seconds. Share one link in your bio and start receiving orders — no coding or technical skills needed.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need coding skills?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Leadivo is designed so anyone can create and manage a store with zero technical knowledge.",
      },
    },
    {
      "@type": "Question",
      name: "What payment methods are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Leadivo supports Cash on Delivery (COD) and integrates with WhatsApp for direct order communication with customers.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use my own domain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can connect your own custom domain to your Leadivo storefront.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free trial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Leadivo offers a free trial so you can explore all features before committing to a subscription.",
      },
    },
    {
      "@type": "Question",
      name: "Can customers leave reviews on my store?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! After an order is delivered, customers receive a review link via WhatsApp. They can rate products, write comments, and add photos. You can moderate all reviews before they appear on your store.",
      },
    },
    {
      "@type": "Question",
      name: "Do I get a customer database?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every order automatically creates a customer profile with contact info, purchase history, and lifetime stats. You can tag customers (VIP, Wholesale, etc.), add notes, and export your database anytime.",
      },
    },
    {
      "@type": "Question",
      name: "How do I protect my store from fake orders?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Leadivo offers built-in checkout protection with SMS OTP verification and CAPTCHA. When enabled, customers must confirm their phone number with a one-time code before placing an order.",
      },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LandingPage />
    </>
  )
}
