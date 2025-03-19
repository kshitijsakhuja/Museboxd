"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface AnimatedBackgroundProps {
  children: React.ReactNode
}

export function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Music note particles
    const particles: {
      x: number
      y: number
      size: number
      speed: number
      opacity: number
      color: string
      type: "note" | "circle"
    }[] = []

    const colors = ["#FF3366", "#33CCFF", "#9933FF", "#FFCC33", "#33FF99"]

    // Create initial particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 2,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.7 ? "note" : "circle",
      })
    }

    // Draw music note
    const drawMusicNote = (x: number, y: number, size: number, color: string, opacity: number) => {
      if (!ctx) return

      ctx.save()
      ctx.globalAlpha = opacity
      ctx.fillStyle = color

      // Draw note head
      ctx.beginPath()
      ctx.ellipse(x, y, size, size * 0.8, Math.PI / 3, 0, Math.PI * 2)
      ctx.fill()

      // Draw note stem
      ctx.fillRect(x + size * 0.7, y - size * 0.7, size * 0.15, -size * 3)

      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.01)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Move particle upward
        particle.y -= particle.speed

        // Reset particle if it goes off screen
        if (particle.y < -10) {
          particle.y = canvas.height + 10
          particle.x = Math.random() * canvas.width
        }

        // Draw particle
        if (particle.type === "note") {
          drawMusicNote(particle.x, particle.y, particle.size, particle.color, particle.opacity)
        } else {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.globalAlpha = particle.opacity
          ctx.fill()
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="relative min-h-screen">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-10 z-0" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

