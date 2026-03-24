"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

const SIZE_MAP = { sm: 14, md: 18, lg: 24 } as const

interface StarRatingProps {
  rating: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRate?: (rating: number) => void
  className?: string
}

export function StarRating({
  rating,
  size = "md",
  interactive = false,
  onRate,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)
  const px = SIZE_MAP[size]
  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.min(1, Math.max(0, displayRating - (star - 1)))
        const isFull = fill >= 1
        const isPartial = fill > 0 && fill < 1

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            className={cn(
              "relative shrink-0",
              interactive && "cursor-pointer transition-transform hover:scale-110",
              !interactive && "cursor-default"
            )}
            style={{ width: px, height: px }}
            onClick={interactive ? () => onRate?.(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            {/* Empty star (background) */}
            <Star
              className="absolute inset-0 text-gray-300"
              style={{ width: px, height: px }}
            />
            {/* Filled star — full or partial via clip */}
            {(isFull || isPartial) && (
              <Star
                className="absolute inset-0 fill-current text-yellow-400"
                style={{
                  width: px,
                  height: px,
                  clipPath: isPartial
                    ? `inset(0 ${(1 - fill) * 100}% 0 0)`
                    : undefined,
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
