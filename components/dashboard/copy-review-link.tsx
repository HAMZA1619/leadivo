"use client"

import { useState } from "react"
import { Link2, Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

export function CopyReviewLink({ url }: { url: string }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button
      onClick={handleCopy}
      className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
      title={t("orderDetail.copyReviewLink")}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" />
          {t("orderDetail.linkCopied")}
        </>
      ) : (
        <>
          <Link2 className="h-3 w-3" />
          {t("orderDetail.reviewLink")}
        </>
      )}
    </button>
  )
}
