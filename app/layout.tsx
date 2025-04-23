import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "sichtbar.immo | Immobilienfotograf Ostfriesland | Immobilienfotografie in Ostfriesland",
  description:
    "Professioneller Immobilienfotograf für ganz Ostfriesland. Immobilienfotografie, Immobilienvideos und Virtual Homestaging in Leer, Emden, Aurich, Norden und Umgebung. Präsentieren Sie Ihre Immobilie optimal.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
