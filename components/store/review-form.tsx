"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ImagePlus, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/store/star-rating"
import { useTranslation } from "react-i18next"
import Image from "next/image"
import "@/lib/i18n"

const clientReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
})

type FormValues = z.infer<typeof clientReviewSchema>

interface ReviewFormProps {
  storeSlug: string
  productId: string
  orderId: string
  customerPhone: string
  token: string
  lang: string
}

type FormState = "idle" | "submitting" | "success" | "error"

const MAX_IMAGES = 3
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function ReviewForm({
  storeSlug,
  productId,
  orderId,
  customerPhone,
  token,
  lang,
}: ReviewFormProps) {
  const { t } = useTranslation()
  const [formState, setFormState] = useState<FormState>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(clientReviewSchema),
    defaultValues: { rating: 0, comment: "" },
  })

  const rating = watch("rating")
  const comment = watch("comment") || ""

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    const remaining = MAX_IMAGES - uploadedImages.length
    if (remaining <= 0) return

    const toUpload = Array.from(files).slice(0, remaining)
    const oversized = toUpload.filter((f) => f.size > MAX_FILE_SIZE)
    if (oversized.length > 0) {
      setErrorMessage(t("storefront.reviewImageTooLarge"))
      setFormState("error")
      return
    }

    setUploading(true)
    try {
      for (const file of toUpload) {
        const formData = new FormData()
        formData.append("files", file)
        formData.append("store_slug", storeSlug)
        formData.append("product_id", productId)
        formData.append("order_id", orderId)
        formData.append("customer_phone", customerPhone)
        formData.append("token", token)

        const res = await fetch("/api/reviews/upload-images", {
          method: "POST",
          body: formData,
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || "Upload failed")
        }
        const data = await res.json()
        setUploadedImages((prev) => [...prev, ...(data.urls || [])])
      }
      setFormState("idle")
      setErrorMessage("")
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Upload failed")
      setFormState("error")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  function removeImage(index: number) {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(values: FormValues) {
    setFormState("submitting")
    setErrorMessage("")

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_slug: storeSlug,
          product_id: productId,
          order_id: orderId,
          customer_phone: customerPhone,
          token,
          rating: values.rating,
          comment: values.comment || undefined,
          image_urls: uploadedImages.length > 0 ? uploadedImages : undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to submit review")
      }

      setFormState("success")
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit review")
      setFormState("error")
    }
  }

  if (formState === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950">
        <p className="font-medium text-green-700 dark:text-green-300">
          {t("storefront.reviewSubmitted")}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Star picker */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">{t("storefront.reviewRating")}</label>
          <StarRating
            rating={rating}
            size="lg"
            interactive
            onRate={(r) => setValue("rating", r, { shouldValidate: true })}
          />
        </div>
        {errors.rating && (
          <p className="text-sm text-destructive">{t("storefront.reviewRatingRequired")}</p>
        )}
      </div>

      {/* Comment */}
      <div className="space-y-1">
        <label htmlFor="review-comment" className="text-sm font-medium">
          {t("storefront.reviewComment")}
        </label>
        <textarea
          id="review-comment"
          {...register("comment")}
          rows={4}
          maxLength={1000}
          placeholder={t("storefront.reviewCommentPlaceholder")}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
        <div className="text-right text-xs text-muted-foreground">
          {comment.length}/1000
        </div>
      </div>

      {/* Image upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("storefront.reviewImages")}</label>
        <div className="flex flex-wrap gap-2">
          {uploadedImages.map((url, i) => (
            <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-md border">
              <Image
                src={url}
                alt={`Upload ${i + 1}`}
                fill
                unoptimized
                className="object-cover"
                sizes="80px"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {uploadedImages.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={cn(
                "flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
                uploading && "pointer-events-none opacity-50"
              )}
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-[10px]">{t("storefront.reviewAddImage")}</span>
                </>
              )}
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleImageUpload(e.target.files)}
        />
      </div>

      {/* Error message */}
      {formState === "error" && errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={formState === "submitting" || rating === 0}
        className="w-full"
      >
        {formState === "submitting" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          t("storefront.reviewSubmit")
        )}
      </Button>
    </form>
  )
}
