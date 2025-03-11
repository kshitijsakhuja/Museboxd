"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  initialRating?: number
  onChange?: (rating: number) => void
  readOnly?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StarRating({ initialRating = 0, onChange, readOnly = false, size = "md", className }: StarRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    setRating(initialRating)
  }, [initialRating])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (readOnly) return

    const { left, width } = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - left) / width

    // For half-star precision
    let value = starIndex
    if (percent <= 0.5) {
      value -= 0.5
    }

    setHoverRating(value)
  }

  const handleMouseLeave = () => {
    if (readOnly) return
    setHoverRating(0)
  }

  const handleClick = (value: number) => {
    if (readOnly) return

    // Toggle off if clicking the same value
    const newRating = rating === value ? 0 : value
    setRating(newRating)
    onChange?.(newRating)
  }

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const renderStar = (starIndex: number) => {
    const activeRating = hoverRating || rating
    const isActive = activeRating >= starIndex
    const isHalfActive = Math.ceil(activeRating) === starIndex && !Number.isInteger(activeRating)

    return (
      <div
        key={starIndex}
        className="relative cursor-pointer"
        onMouseMove={(e) => handleMouseMove(e, starIndex)}
        onClick={() => handleClick(starIndex)}
      >
        {/* Background star (empty) */}
        <Star className={cn(sizeClasses[size], "text-muted-foreground/30", readOnly && "cursor-default")} fill="none" />

        {/* Foreground star (filled) with clip for half stars */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            width: isHalfActive ? "50%" : isActive ? "100%" : "0%",
            transition: hoverRating ? "none" : "width 150ms ease",
          }}
        >
          <Star className={cn(sizeClasses[size], "text-yellow-400")} fill="currentColor" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-1", className)} onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map(renderStar)}

      {!readOnly && <span className="ml-2 text-sm text-muted-foreground">{hoverRating || rating || 0}/5</span>}
    </div>
  )
}

