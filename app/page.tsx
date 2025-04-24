import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, CheckCircle, Video, PanelTop, ArrowRight } from "lucide-react"
import { MapPin } from "@/app/components/map-pin"
import SeoText from "@/app/components/seo-text"
import { ContactForm } from "@/app/components/contact-form"
import Footer from "@/app/components/footer"
import AppleHeader from "@/app/components/apple-header"
import ParallaxSection from "@/app/components/parallax-section"
import FadeIn from "@/app/components/fade-in"
import HomestagingSection from "@/app/components/homestaging-section"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppleHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <ParallaxSection
          imageUrl="/sleek-modern-residence.png"
          overlayOpacity={0.4}
          darkMode={true}
          className="h-screen flex items-center justify-center"
        >
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-center h-full">
            <div className="max-w-3xl mx-auto text-center">
              <FadeIn>
                <h1 className="apple-heading mb-6 text-white">Immobilienfotografie neu definiert.</h1>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="apple-subheading mb-10 text-white/90">
                  Professionelle Immobilienfotografie, Videos und Virtual Homestaging in Ostfriesland.
                </p>
              </FadeIn>
              <FadeIn delay={400}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="apple-button bg-white text-black hover:bg-white/90" size="lg" asChild>
                    <Link href="#portfolio">Portfolio entdecken</Link>
                  </Button>
                  <Button
                    className="apple-button bg-white/20 text-white backdrop-blur-md hover:bg-white/30"
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

        {/* Intro Section */}
        <section className="apple-section bg-apple-gray-light">
          <div className="container mx-auto px-4 md:px-6">
            <FadeIn>
              <h2 className="apple-heading text-center mb-6 gradient-text">Immobilienfotografie in Ostfriesland.</h2>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="apple-subheading text-center text-muted-foreground mb-16">
                Als professioneller Immobilienfotograf biete ich hochwertige visuelle Lösungen für die erfolgreiche
                Vermarktung Ihrer Immobilie.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn delay={300} direction="up">
                <div className="apple-card overflow-hidden rounded-2xl">
                  <Image
                    src="/sun-drenched-loft.png"
                    alt="Wohnzimmer mit natürlichem Licht"
                    width={600}
                    height={450}
                    className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </FadeIn>
              <FadeIn delay={400} direction="up">
                <div className="apple-card overflow-hidden rounded-2xl">
                  <Image
                    src="/sleek-minimalist-kitchen.png"
                    alt="Moderne Küche"
                    width={600}
                    height={450}
                    className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </FadeIn>
              <FadeIn delay={500} direction="up">
                <div className="apple-card overflow-hidden rounded-2xl">
                  <Image
                    src="/serene-spa-retreat.png"
                    alt="Luxuriöses Badezimmer"
                    width={600}
                    height={450}
                    className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Dark Mode Section - Services */}
        <section id="services" className="apple-section bg-black text-white">
          <div className="container mx-auto px-4 md:px-6">
            <FadeIn>
              <h2 className="apple-heading text-center mb-6">Dienstleistungen im Überblick</h2>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="apple-subheading text-center text-white/70 mb-16">
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

        {/* Regional Coverage Section */}
        <section className="apple-section bg-apple-gray-light">
          <div className="container mx-auto px-4 md:px-6">
            <FadeIn>
              <h2 className="apple-heading text-center mb-6 gradient-text">Immobilienfotograf für ganz Ostfriesland</h2>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="apple-subheading text-center text-muted-foreground mb-16">
                Als Ihr Immobilienfotograf bin ich in ganz Ostfriesland für Sie im Einsatz.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
              {[
                { city: "Leer", desc: "und Umgebung" },
                { city: "Emden", desc: "und Umgebung" },
                { city: "Aurich", desc: "und Umgebung" },
                { city: "Norden", desc: "und Umgebung" },
                { city: "Wittmund", desc: "und Umgebung" },
              ].map((location, index) => (
                <FadeIn key={location.city} delay={300 + index * 100} direction="up">
                  <div className="bg-white rounded-2xl shadow-sm p-6 text-center transition-transform duration-500 hover:translate-y-[-10px]">
                    <MapPin className="h-8 w-8 text-black mx-auto mb-3" />
                    <h3 className="font-medium text-lg">{location.city}</h3>
                    <p className="text-sm text-muted-foreground">{location.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={800}>
              <p className="text-center text-muted-foreground mt-12 max-w-2xl mx-auto">
                Auch in anderen Orten Ostfrieslands bin ich gerne für Sie tätig. Kontaktieren Sie mich für Ihre
                individuelle Anfrage.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Portfolio Section with Parallax */}
        <ParallaxSection
          imageUrl="/modern-suburban-home.png"
          overlayOpacity={0.7}
          darkMode={true}
          className="apple-section"
        >
          <div id="portfolio" className="container mx-auto px-4 md:px-6">
            <FadeIn>
              <h2 className="apple-heading text-center mb-6 text-white">Portfolio</h2>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="apple-subheading text-center text-white/70 mb-16">
                Entdecken Sie eine Auswahl meiner Arbeiten im Bereich Immobilienfotografie
              </p>
            </FadeIn>

            <Tabs defaultValue="innen" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white/10 backdrop-blur-md">
                  <TabsTrigger
                    value="innen"
                    className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
                  >
                    Innenaufnahmen
                  </TabsTrigger>
                  <TabsTrigger
                    value="aussen"
                    className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
                  >
                    Außenaufnahmen
                  </TabsTrigger>
                  <TabsTrigger
                    value="drohne"
                    className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
                  >
                    Drohnenaufnahmen
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="innen" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <FadeIn key={`interior-${index}`} delay={300 + index * 50} direction="up">
                      <div className="apple-card overflow-hidden rounded-2xl">
                        <Image
                          src={`/cozy-reading-nook.png`}
                          alt={`Innenaufnahme ${index + 1}`}
                          width={600}
                          height={400}
                          className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="aussen" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <FadeIn key={`exterior-${index}`} delay={300 + index * 50} direction="up">
                      <div className="apple-card overflow-hidden rounded-2xl">
                        <Image
                          src={`/modern-suburban-home.png`}
                          alt={`Außenaufnahme ${index + 1}`}
                          width={600}
                          height={400}
                          className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="drohne" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <FadeIn key={`drone-${index}`} delay={300 + index * 50} direction="up">
                      <div className="apple-card overflow-hidden rounded-2xl">
                        <Image
                          src={`/suburban-aerial-view.png`}
                          alt={`Drohnenaufnahme ${index + 1}`}
                          width={600}
                          height={400}
                          className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ParallaxSection>

        {/* Virtual Homestaging Section */}
        <HomestagingSection />

        {/* About Section - Dark Mode */}
        <section id="about" className="apple-section bg-black text-white">
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
                  <Button className="apple-button bg-white text-black hover:bg-white/90 group" asChild>
                    <Link href="#contact">
                      Kontakt aufnehmen
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </FadeIn>
              </div>
              <FadeIn direction="right">
                <div className="apple-card overflow-hidden rounded-2xl">
                  <Image
                    src="/focused-portraitist.png"
                    alt="Immobilienfotograf"
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="apple-section bg-apple-gray-light">
          <div className="container mx-auto px-4 md:px-6">
            <FadeIn>
              <h2 className="apple-heading text-center mb-6 gradient-text">Jetzt unverbindlich anfragen</h2>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="apple-subheading text-center text-muted-foreground mb-16">
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
