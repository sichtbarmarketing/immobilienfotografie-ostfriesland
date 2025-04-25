"use client"

import { CheckCircle } from "lucide-react"
import FadeIn from "./fade-in"
import BeforeAfterSlider from "./before-after-slider"
import { useEffect, useState } from "react"

export default function HomestagingSection() {
  const [beforeImage, setBeforeImage] = useState("/virtual-staging-before.png")
  const [afterImage, setAfterImage] = useState("/virtual-staging-after.png")

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images?category=virtual-staging")
        const data = await response.json()

        if (response.ok && data.success && data.images.length >= 2) {
          // Assuming the first two images are before and after
          setBeforeImage(data.images[0].url)
          setAfterImage(data.images[1].url)
        }
      } catch (error) {
        console.error("Error fetching homestaging images:", error)
      }
    }

    fetchImages()
  }, [])

  return (
    <section id="homestaging" className="py-16 md:py-32 bg-apple-gray-light">
      <div className="md:container mx-auto md:px-6">
        {/* Mobile slider - full width */}
        <div className="md:hidden w-full mb-8">
          <FadeIn direction="up" className="w-full">
            <BeforeAfterSlider
              beforeImage={beforeImage}
              afterImage={afterImage}
              className="w-full shadow-lg rounded-none"
            />
          </FadeIn>
        </div>

        <div className="px-4 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Text content */}
            <div>
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6 gradient-text">
                  Virtuelles Homestaging
                </h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="text-muted-foreground mb-6">
                  Mit modernen Visualisierungstechnologien werden leere Räume virtuell eingerichtet und gestaltet. So
                  können potenzielle Käufer oder Mieter sich besser vorstellen, wie die Immobilie eingerichtet aussehen
                  könnte.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <p className="text-muted-foreground mb-8">
                  Virtual Homestaging ist eine kostengünstige Alternative zum klassischen Home Staging und bietet
                  zahlreiche Vorteile für die Vermarktung Ihrer Immobilie.
                </p>
              </FadeIn>

              <FadeIn delay={400}>
                <h3 className="text-xl font-medium mb-6">Was beinhaltet Virtual Homestaging?</h3>
              </FadeIn>

              <div className="space-y-6">
                <FadeIn delay={500}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Fotografie</h4>
                      <p className="text-muted-foreground">
                        Professionelle Aufnahmen der leeren Räume als Basis für das virtuelle Staging
                      </p>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={600}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Stilauswahl</h4>
                      <p className="text-muted-foreground">
                        Auswahl des passenden Einrichtungsstils für die Zielgruppe der Immobilie
                      </p>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={700}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Möblierung</h4>
                      <p className="text-muted-foreground">
                        Digitales Einsetzen von Möbeln, Dekorationen und Accessoires in die Raumaufnahmen
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* Desktop slider - only visible on md and up */}
            <div className="hidden md:block">
              <FadeIn direction="left">
                <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} className="w-full shadow-lg" />
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
