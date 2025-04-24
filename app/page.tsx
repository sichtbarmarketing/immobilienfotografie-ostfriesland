import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, CheckCircle, Video, PanelTop, ArrowRight } from "lucide-react"
import SeoText from "@/app/components/seo-text"
import { ContactForm } from "@/app/components/contact-form"
import Footer from "@/app/components/footer"
import AppleHeader from "@/app/components/apple-header"
import FadeIn from "@/app/components/fade-in"
import HomestagingSection from "@/app/components/homestaging-section"
import PortfolioSection from "@/app/components/portfolio-section"
import DynamicImage from "@/app/components/dynamic-image"
import DynamicHero from "@/app/components/dynamic-hero"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppleHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <DynamicHero fallbackImageUrl="/sleek-modern-residence.png" />

        {/* Intro Section */}
        <section className="py-24 md:py-32 bg-apple-gray-light">
          <div className="container mx-auto px-4 md:px-6">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-center mb-6 gradient-text">
                Immobilienfotografie in Ostfriesland.
              </h2>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto text-center text-muted-foreground mb-16">
                Als professioneller Immobilienfotograf biete ich hochwertige visuelle Lösungen für die erfolgreiche
                Vermarktung Ihrer Immobilie.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn delay={300} direction="up">
                <div className="overflow-hidden rounded-2xl">
                  <DynamicImage
                    category="interior"
                    index={0}
                    alt="Wohnzimmer mit natürlichem Licht"
                    className="aspect-[4/3] transition-transform duration-700 hover:scale-105"
                    width={600}
                    height={450}
                    fallbackSrc="/sun-drenched-loft.png"
                  />
                </div>
              </FadeIn>
              <FadeIn delay={400} direction="up">
                <div className="overflow-hidden rounded-2xl">
                  <DynamicImage
                    category="interior"
                    index={1}
                    alt="Moderne Küche"
                    className="aspect-[4/3] transition-transform duration-700 hover:scale-105"
                    width={600}
                    height={450}
                    fallbackSrc="/sleek-minimalist-kitchen.png"
                  />
                </div>
              </FadeIn>
              <FadeIn delay={500} direction="up">
                <div className="overflow-hidden rounded-2xl">
                  <DynamicImage
                    category="interior"
                    index={2}
                    alt="Luxuriöses Badezimmer"
                    className="aspect-[4/3] transition-transform duration-700 hover:scale-105"
                    width={600}
                    height={450}
                    fallbackSrc="/serene-spa-retreat.png"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 md:py-32 bg-black text-white">
          <div className="container mx-auto px-4 md:px-6">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-center mb-6">
                Dienstleistungen im Überblick
              </h2>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto text-center text-white/70 mb-16">
                Professionelle visuelle Lösungen für Immobilienmakler und private Anbieter.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn delay={300} direction="up">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 transition-transform duration-500 hover:translate-y-[-10px]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-medium mb-4">Immobilienfotografie</h3>
                  <p className="text-white/70 mb-6">
                    Professionelle Fotos von Innen- und Außenaufnahmen, die Ihre Immobilie im besten Licht präsentieren.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-white/70" />
                      <span>Hochwertige Innenaufnahmen</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-white/70" />
                      <span>Professionelle Außenaufnahmen</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-white/70" />
                      <span>Optimale Bildbearbeitung</span>
                    </li>
                  </ul>
                </div>
              </FadeIn>

              <FadeIn delay={400} direction="up">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 transition-transform duration-500 hover:translate-y-[-10px]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-medium mb-4">Immobilienvideos</h3>
                  <p className="text-white/70 mb-6">
                    Dynamische Videos, die Ihre Immobilie lebendig und ansprechend präsentieren. Ideal für
                    Online-Portale.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-white/70" />
                      <span>Professionelle Videoproduktion</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-white/70" />
                      <span>360° Rundgänge</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-white/70" />
                      <span>Drohnenaufnahmen</span>
                    </li>
                  </ul>
                </div>
              </FadeIn>

              <FadeIn delay={500} direction="up">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 transition-transform duration-500 hover:translate-y-[-10px]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <PanelTop className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-medium mb-4">Virtual Homestaging</h3>
                  <p className="text-white/70 mb-6">
                    Mit virtueller Einrichtung leere Räume ansprechend gestalten. Zeigen Sie das volle Potenzial.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-white/70" />
                      <span>Virtuelle Möblierung</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-white/70" />
                      <span>Verschiedene Einrichtungsstile</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-white/70" />
                      <span>Realistische Darstellung</span>
                    </li>
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <PortfolioSection />

        {/* Virtual Homestaging Section */}
        <HomestagingSection />

        {/* About Section */}
        <section id="about" className="py-24 md:py-32 bg-black text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <FadeIn>
                  <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6">Über sichtbar.immo</h2>
                </FadeIn>
                <FadeIn delay={200}>
                  <p className="text-white/70 mb-6">
                    Als professioneller Immobilienfotograf in Ostfriesland biete ich hochwertige visuelle Lösungen für
                    die Immobilienvermarktung. Mit jahrelanger Erfahrung und modernster Ausrüstung sorge ich dafür, dass
                    Ihre Immobilie im besten Licht präsentiert wird.
                  </p>
                </FadeIn>
                <FadeIn delay={300}>
                  <p className="text-white/70 mb-8">
                    Mein Ziel ist es, durch qualitativ hochwertige Fotos, Videos und virtuelle Einrichtungen den
                    Verkaufs- oder Vermietungsprozess zu beschleunigen und den bestmöglichen Preis für Ihre Immobilie zu
                    erzielen.
                  </p>
                </FadeIn>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <FadeIn delay={400}>
                    <div className="flex flex-col">
                      <span className="text-4xl font-medium text-white mb-2">500+</span>
                      <span className="text-sm text-white/70">Fotografierte Immobilien</span>
                    </div>
                  </FadeIn>
                  <FadeIn delay={500}>
                    <div className="flex flex-col">
                      <span className="text-4xl font-medium text-white mb-2">100%</span>
                      <span className="text-sm text-white/70">Ostfriesland-Abdeckung</span>
                    </div>
                  </FadeIn>
                  <FadeIn delay={600}>
                    <div className="flex flex-col">
                      <span className="text-4xl font-medium text-white mb-2">24h</span>
                      <span className="text-sm text-white/70">Bearbeitungszeit</span>
                    </div>
                  </FadeIn>
                  <FadeIn delay={700}>
                    <div className="flex flex-col">
                      <span className="text-4xl font-medium text-white mb-2">100%</span>
                      <span className="text-sm text-white/70">Kundenzufriedenheit</span>
                    </div>
                  </FadeIn>
                </div>

                <FadeIn delay={800}>
                  <Button className="rounded-full bg-white text-black hover:bg-white/90 group" asChild>
                    <Link href="#contact">
                      Kontakt aufnehmen
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </FadeIn>
              </div>
              <FadeIn direction="right">
                <div className="overflow-hidden rounded-2xl">
                  <DynamicImage
                    category="about"
                    index={0}
                    alt="Immobilienfotograf"
                    className="transition-transform duration-700 hover:scale-105"
                    width={600}
                    height={600}
                    fallbackSrc="/focused-portraitist.png"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 md:py-32 bg-apple-gray-light">
          <div className="container mx-auto px-4 md:px-6">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-center mb-6 gradient-text">
                Jetzt unverbindlich anfragen
              </h2>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto text-center text-muted-foreground mb-16">
                Füllen Sie das Formular aus und ich melde mich zeitnah bei Ihnen zurück
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
                <ContactForm />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* SEO Text Section */}
        <SeoText />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  )
}
