import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, CheckCircle, Video, PanelTop } from "lucide-react"
import RegionalCoverage from "@/app/components/regional-coverage"
import SeoText from "@/app/components/seo-text"
import { ContactForm } from "@/app/components/contact-form"
import Footer from "@/app/components/footer"

// Use static placeholders instead of fetching from Supabase
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Camera className="h-6 w-6" />
            <span>sichtbar.immo</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#services" className="text-sm font-medium hover:text-primary">
              Dienstleistungen
            </Link>
            <Link href="#portfolio" className="text-sm font-medium hover:text-primary">
              Portfolio
            </Link>
            <Link href="#homestaging" className="text-sm font-medium hover:text-primary">
              Virtual Homestaging
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary">
              Über uns
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary">
              Kontakt
            </Link>
          </nav>
          <Button asChild>
            <Link href="#contact">Jetzt anfragen</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/sleek-modern-residence.png"
              alt="Moderne Immobilienfotografie"
              fill
              className="object-cover brightness-[0.8]"
              priority
            />
          </div>
          <div className="container relative z-10 flex flex-col items-start justify-center py-24 md:py-32 lg:py-40 text-white">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Immobilienfotografie in Ostfriesland.
              </h1>
              <p className="mt-6 max-w-2xl text-lg md:text-xl">
                Ihr Experte für Immobilienfotografie, Immobilienvideos und Virtual Homestaging in ganz Ostfriesland.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="#portfolio">Portfolio ansehen</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-background/20 hover:bg-background/30 text-white"
                  asChild
                >
                  <Link href="#contact">Kontakt aufnehmen</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-6">Immobilienfotografie in Ostfriesland.</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Als professioneller Immobilienfotograf für hochwertige Immobilienfotos biete ich Ihnen
                Immobilienfotografie, Immobilienvideos, 360° Rundgänge, Drohnenaufnahmen, Grundrisszeichnungen für
                Immobilienangebote und Virtual Homestaging in ganz Ostfriesland - von Leer über Emden bis Aurich, Norden
                und Wittmund.
              </p>
              <p className="text-lg text-muted-foreground">
                Professionelle Fotos und Videos helfen Ihnen, Ihre Immobilie optimal zu präsentieren – und das macht
                sich bezahlt!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/sun-drenched-loft.png"
                  alt="Wohnzimmer mit natürlichem Licht"
                  width={400}
                  height={300}
                  className="object-cover transition-transform hover:scale-105 aspect-[4/3]"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/sleek-minimalist-kitchen.png"
                  alt="Moderne Küche"
                  width={400}
                  height={300}
                  className="object-cover transition-transform hover:scale-105 aspect-[4/3]"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/serene-spa-retreat.png"
                  alt="Luxuriöses Badezimmer"
                  width={400}
                  height={300}
                  className="object-cover transition-transform hover:scale-105 aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Regional Coverage Section */}
        <RegionalCoverage />

        {/* Services Section */}
        <section id="services" className="py-16 md:py-24 bg-muted/50">
          <div className="container">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Dienstleistungen im Überblick</h2>
              <p className="text-muted-foreground max-w-2xl">
                Professionelle Immobilienfotografie, Immobilienvideos und Virtual Homestaging für Immobilienmakler und
                private Anbieter. Steigern Sie den Wert Ihrer Immobilie mit hochwertigen visuellen Inhalten.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Immobilienfotografie</h3>
                  <p className="text-muted-foreground">
                    Professionelle Fotos von Innen- und Außenaufnahmen, die Ihre Immobilie im besten Licht präsentieren.
                    Mit modernster Technik und professioneller Bildbearbeitung.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Hochwertige Innenaufnahmen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Professionelle Außenaufnahmen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Optimale Bildbearbeitung</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Video className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Immobilienvideos</h3>
                  <p className="text-muted-foreground">
                    Dynamische Videos, die Ihre Immobilie lebendig und ansprechend präsentieren. Ideal für
                    Online-Portale und Social Media.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Professionelle Videoproduktion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>360° Rundgänge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Drohnenaufnahmen</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <PanelTop className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Virtual Homestaging</h3>
                  <p className="text-muted-foreground">
                    Mit virtueller Einrichtung leere Räume ansprechend gestalten. Zeigen Sie das volle Potenzial Ihrer
                    Immobilie.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Virtuelle Möblierung</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Verschiedene Einrichtungsstile</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Realistische Darstellung</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-16 md:py-24">
          <div className="container">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Portfolio</h2>
              <p className="text-muted-foreground max-w-2xl">
                Entdecken Sie eine Auswahl meiner Arbeiten im Bereich Immobilienfotografie
              </p>
            </div>

            <Tabs defaultValue="innen" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="innen">Innenaufnahmen</TabsTrigger>
                  <TabsTrigger value="aussen">Außenaufnahmen</TabsTrigger>
                  <TabsTrigger value="drohne">Drohnenaufnahmen</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="innen" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={`interior-${index}`} className="overflow-hidden rounded-lg">
                      <Image
                        src={`/cozy-reading-nook.png`}
                        alt={`Innenaufnahme ${index + 1}`}
                        width={600}
                        height={400}
                        className="object-cover transition-transform hover:scale-105 aspect-[4/3]"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="aussen" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={`exterior-${index}`} className="overflow-hidden rounded-lg">
                      <Image
                        src={`/modern-suburban-home.png`}
                        alt={`Außenaufnahme ${index + 1}`}
                        width={600}
                        height={400}
                        className="object-cover transition-transform hover:scale-105 aspect-[4/3]"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="drohne" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={`drone-${index}`} className="overflow-hidden rounded-lg">
                      <Image
                        src={`/suburban-aerial-view.png?height=400&width=600&query=aerial+property+view+${index + 1}`}
                        alt={`Drohnenaufnahme ${index + 1}`}
                        width={600}
                        height={400}
                        className="object-cover transition-transform hover:scale-105 aspect-[4/3]"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Virtual Homestaging Section */}
        <section id="homestaging" className="py-16 md:py-24 bg-muted/50">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/virtual-staging-comparison.png"
                  alt="Virtual Homestaging Vorher/Nachher Vergleich"
                  width={600}
                  height={600}
                  className="rounded-lg object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Virtuelles Homestaging</h2>
                <p className="text-muted-foreground mb-4">
                  Mit modernen Visualisierungstechnologien werden wir leere Räume virtuell einrichten und gestalten. So
                  können potenzielle Käufer oder Mieter sich besser vorstellen, wie die Immobilie eingerichtet aussehen
                  könnte.
                </p>
                <p className="text-muted-foreground mb-6">
                  Virtual Homestaging ist eine kostengünstige Alternative zum klassischen Home Staging und bietet
                  zahlreiche Vorteile für die Vermarktung Ihrer Immobilie.
                </p>

                <h3 className="text-xl font-bold mb-4">Was beinhaltet Virtual Homestaging?</h3>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <span className="font-semibold">Fotografie</span>
                      <p className="text-muted-foreground">
                        Professionelle Aufnahmen der leeren Räume als Basis für das virtuelle Staging
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <span className="font-semibold">Stilauswahl</span>
                      <p className="text-muted-foreground">
                        Auswahl des passenden Einrichtungsstils für die Zielgruppe der Immobilie
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <span className="font-semibold">Möblierung</span>
                      <p className="text-muted-foreground">
                        Digitales Einsetzen von Möbeln, Dekorationen und Accessoires in die Raumaufnahmen
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <span className="font-semibold">Finalisierung</span>
                      <p className="text-muted-foreground">
                        Professionelle Nachbearbeitung für ein realistisches Endergebnis
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Über sichtbar.immo</h2>
                <p className="text-muted-foreground mb-4">
                  Als professioneller Immobilienfotograf in Ostfriesland biete ich hochwertige visuelle Lösungen für die
                  Immobilienvermarktung. Mit jahrelanger Erfahrung und modernster Ausrüstung sorge ich dafür, dass Ihre
                  Immobilie im besten Licht präsentiert wird.
                </p>
                <p className="text-muted-foreground mb-4">
                  Mein Ziel ist es, durch qualitativ hochwertige Fotos, Videos und virtuelle Einrichtungen den Verkaufs-
                  oder Vermietungsprozess zu beschleunigen und den bestmöglichen Preis für Ihre Immobilie zu erzielen.
                </p>
                <p className="text-muted-foreground mb-6">
                  Ich arbeite sowohl mit Immobilienmaklern als auch mit privaten Anbietern in ganz Ostfriesland zusammen
                  und biete maßgeschneiderte Lösungen für jede Art von Immobilie - von Einfamilienhäusern über
                  Ferienwohnungen bis hin zu Gewerbeimmobilien.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-primary">500+</span>
                    <span className="text-sm text-muted-foreground">Fotografierte Immobilien</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-primary">100%</span>
                    <span className="text-sm text-muted-foreground">Ostfriesland-Abdeckung</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-primary">24h</span>
                    <span className="text-sm text-muted-foreground">Bearbeitungszeit</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-primary">100%</span>
                    <span className="text-sm text-muted-foreground">Kundenzufriedenheit</span>
                  </div>
                </div>
              </div>
              <div>
                <Image
                  src="/focused-portraitist.png"
                  alt="Immobilienfotograf"
                  width={600}
                  height={600}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Bereit, Ihre Immobilie optimal zu präsentieren?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-primary-foreground/90">
              Kontaktieren Sie mich noch heute und lassen Sie uns gemeinsam Ihre Immobilie ins beste Licht rücken
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="#contact">Jetzt unverbindlich anfragen</Link>
            </Button>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24">
          <div className="container">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Jetzt unverbindlich anfragen</h2>
              <p className="text-muted-foreground max-w-2xl">
                Füllen Sie das Formular aus und ich melde mich zeitnah bei Ihnen zurück
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <ContactForm />
            </div>
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
