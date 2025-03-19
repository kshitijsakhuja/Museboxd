"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedVinylProps {
  imageUrl: string
  size?: number
  isPlaying?: boolean
}

export function AnimatedVinyl({ imageUrl, size = 200, isPlaying = false }: AnimatedVinylProps) {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    let animationFrame: number

    const animate = () => {
      if (isPlaying) {
        setRotation((prev) => (prev + 0.5) % 360)
      }
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isPlaying])

  const vinylSize = size
  const labelSize = size * 0.4
  const holeSize = size * 0.05

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Vinyl record */}
      <motion.div
        className="absolute inset-0 rounded-full bg-black"
        style={{
          width: vinylSize,
          height: vinylSize,
          transform: `rotate(${rotation}deg)`,
        }}
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 3,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {/* Grooves */}
        <div
          className="absolute inset-0 rounded-full border-4 border-gray-800 opacity-30"
          style={{ width: "90%", height: "90%", top: "5%", left: "5%" }}
        />
        <div
          className="absolute inset-0 rounded-full border-4 border-gray-800 opacity-30"
          style={{ width: "80%", height: "80%", top: "10%", left: "10%" }}
        />
        <div
          className="absolute inset-0 rounded-full border-4 border-gray-800 opacity-30"
          style={{ width: "70%", height: "70%", top: "15%", left: "15%" }}
        />
        <div
          className="absolute inset-0 rounded-full border-4 border-gray-800 opacity-30"
          style={{ width: "60%", height: "60%", top: "20%", left: "20%" }}
        />

        {/* Label */}
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            width: labelSize,
            height: labelSize,
            top: `${(vinylSize - labelSize) / 2}px`,
            left: `${(vinylSize - labelSize) / 2}px`,
          }}
        >
          <img src={imageUrl || "/placeholder.svg"} alt="Album cover" className="w-full h-full object-cover" />
        </div>

        {/* Center hole */}
        <div
          className="absolute rounded-full bg-gray-100 dark:bg-gray-800"
          style={{
            width: holeSize,
            height: holeSize,
            top: `${(vinylSize - holeSize) / 2}px`,
            left: `${(vinylSize - holeSize) / 2}px`,
          }}
        />
      </motion.div>
    </div>
  )
}

