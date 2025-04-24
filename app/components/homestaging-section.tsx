import { CheckCircle } from "lucide-react"
import FadeIn from "./fade-in"
import BeforeAfterSlider from "./before-after-slider"

export default function HomestagingSection() {
  return (
    <section id="homestaging" className="apple-section bg-apple-gray-light">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeIn direction="left">
            <BeforeAfterSlider
              beforeImage="/virtual-staging-before.png"
              afterImage="/virtual-staging-after.png"
              className="w-full shadow-lg"
            />
          </FadeIn>
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
        </div>
      </div>
    </section>
  )
}
