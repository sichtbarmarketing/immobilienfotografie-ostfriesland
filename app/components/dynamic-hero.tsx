"use client"

import { useState, useEffect } from "react"
import ParallaxSection from "./parallax-section"
import FadeIn from "./fade-in"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import DynamicContent from "./dynamic-content"

interface DynamicHeroProps {
  fallbackImageUrl?: string
}

export default function DynamicHero({ fallbackImageUrl = "/sleek-modern-residence.png" }: DynamicHeroProps) {
  const [heroImageUrl, setHeroImageUrl] = useState<string>(fallbackImageUrl)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch("/api/images?category=hero")
        const data = await response.json()

        if (response.ok && data.success && data.images.length > 0) {
          // Use the first hero image
          setHeroImageUrl(data.images[0].url)
        }
      } catch (error) {
        console.error("Error fetching hero image:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroImage()
  }, [])

  return (
    <ParallaxSection
      imageUrl={heroImageUrl}
      overlayOpacity={0.4}
      darkMode={true}
      className="h-screen flex items-center justify-center"
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-center h-full">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <DynamicContent
              contentKey="hero_title"
              defaultValue="Immobilienfotografie neu definiert."
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 text-white"
              as="h1"
            />
          </FadeIn>
          <FadeIn delay={200}>
            <DynamicContent
              contentKey="hero_subtitle"
              defaultValue="Professionelle Immobilienfotografie, Videos und Virtual Homestaging in Ostfriesland."
              className="text-xl md:text-2xl font-light max-w-3xl mx-auto mb-10 text-white/90"
              as="p"
            />
          </FadeIn>
          <FadeIn delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="rounded-full bg-white text-black hover:bg-white/90" size="lg" asChild>
                <Link href="#portfolio">Portfolio entdecken</Link>
              </Button>
              <Button
                className="rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30"
                size="lg"
                variant="outline"
                asChild
              >
                <Link href="#contact">Kontakt aufnehmen</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </ParallaxSection>
  )
}
