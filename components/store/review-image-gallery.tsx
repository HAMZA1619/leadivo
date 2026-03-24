"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ReviewImageGalleryProps {
  images: string[]
  className?: string
}

export function ReviewImageGallery({ images, className }: ReviewImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const visible = images.slice(0, 3)

  return (
    <>
      <div className={cn("flex gap-2", className)}>
        {visible.map((url, i) => (
          <button
            key={i}
            type="button"
            className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border"
            onClick={() => setLightboxIndex(i)}
          >
            <Image
              src={url}
              alt={`Review image ${i + 1}`}
              fill
              unoptimized
              className="object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex(null)
            }}
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative max-h-[80vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`Review image ${lightboxIndex + 1}`}
              width={800}
              height={800}
              unoptimized
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
