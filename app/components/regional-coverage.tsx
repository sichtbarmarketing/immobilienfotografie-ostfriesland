import { MapPin } from "lucide-react"

export default function RegionalCoverage() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Immobilienfotograf für ganz Ostfriesland
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Als Ihr Immobilienfotograf bin ich in ganz Ostfriesland für Sie im Einsatz. Egal ob in Leer, Emden, Aurich,
            Norden oder Wittmund - ich bringe Ihre Immobilie perfekt zur Geltung.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
          {[
            { city: "Leer", desc: "und Umgebung" },
            { city: "Emden", desc: "und Umgebung" },
            { city: "Aurich", desc: "und Umgebung" },
            { city: "Norden", desc: "und Umgebung" },
            { city: "Wittmund", desc: "und Umgebung" },
          ].map((location) => (
            <div
              key={location.city}
              className="flex flex-col items-center p-4 bg-background rounded-lg shadow-sm border"
            >
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-bold text-lg">{location.city}</h3>
              <p className="text-sm text-muted-foreground">{location.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Auch in anderen Orten Ostfrieslands bin ich gerne für Sie tätig. Kontaktieren Sie mich für Ihre individuelle
            Anfrage.
          </p>
        </div>
      </div>
    </section>
  )
}
