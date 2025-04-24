"use client"

import { useRef, useEffect, type ReactNode } from "react"

interface ParallaxSectionProps {
  imageUrl: string
  children: ReactNode
  className?: string
  speed?: number
  overlayOpacity?: number
  darkMode?: boolean
}

export default function ParallaxSection({
  imageUrl,
  children,
  className = "",
  speed = 0.5,
  overlayOpacity = 0.3,
  darkMode = false,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current

    if (!section || !image) return

    const handleScroll = () => {
      const sectionTop = section.getBoundingClientRect().top
      const sectionHeight = section.offsetHeight
      const windowHeight = window.innerHeight

      // Check if section is in viewport
      if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
        // Calculate how far the section is from the center of the viewport
        const distanceFromCenter = sectionTop - windowHeight / 2 + sectionHeight / 2
        // Apply parallax effect
        const translateY = distanceFromCenter * speed
        image.style.transform = `translateY(${translateY}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initialize position

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [speed])

  return (
    <section ref={sectionRef} className={`relative overflow-hidden ${darkMode ? "text-white" : ""} ${className}`}>
      <div
        ref={imageRef}
        className="absolute inset-0 w-full"
        style={{
          backgroundImage: `url(${imageUrl})`,
          height: "120%",
          top: "-10%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "transform 1000ms",
        }}
      ></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: darkMode ? `rgba(0, 0, 0, ${overlayOpacity})` : `rgba(255, 255, 255, ${overlayOpacity})`,
        }}
      ></div>
      <div className="relative z-10">{children}</div>
    </section>
  )
}
