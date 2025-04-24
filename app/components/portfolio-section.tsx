import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FadeIn from "./fade-in"
import DynamicImage from "./dynamic-image"

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-24 md:py-32 bg-black text-white">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-center mb-6">Portfolio</h2>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto text-center text-white/70 mb-16">
            Entdecken Sie eine Auswahl meiner Arbeiten im Bereich Immobilienfotografie
          </p>
        </FadeIn>

        <Tabs defaultValue="interior" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white/10 backdrop-blur-md">
              <TabsTrigger
                value="interior"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Innenaufnahmen
              </TabsTrigger>
              <TabsTrigger
                value="exterior"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Außenaufnahmen
              </TabsTrigger>
              <TabsTrigger
                value="drone"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Drohnenaufnahmen
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="interior" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <FadeIn key={`interior-${index}`} delay={300 + index * 50} direction="up">
                  <div className="overflow-hidden rounded-2xl">
                    <DynamicImage
                      category="interior"
                      index={index}
                      alt={`Innenaufnahme ${index + 1}`}
                      className="aspect-[4/3] transition-transform duration-700 hover:scale-105"
                      width={600}
                      height={400}
                      fallbackSrc="/cozy-reading-nook.png"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exterior" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <FadeIn key={`exterior-${index}`} delay={300 + index * 50} direction="up">
                  <div className="overflow-hidden rounded-2xl">
                    <DynamicImage
                      category="exterior"
                      index={index}
                      alt={`Außenaufnahme ${index + 1}`}
                      className="aspect-[4/3] transition-transform duration-700 hover:scale-105"
                      width={600}
                      height={400}
                      fallbackSrc="/modern-suburban-home.png"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drone" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <FadeIn key={`drone-${index}`} delay={300 + index * 50} direction="up">
                  <div className="overflow-hidden rounded-2xl">
                    <DynamicImage
                      category="drone"
                      index={index}
                      alt={`Drohnenaufnahme ${index + 1}`}
                      className="aspect-[4/3] transition-transform duration-700 hover:scale-105"
                      width={600}
                      height={400}
                      fallbackSrc="/suburban-aerial-view.png"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
