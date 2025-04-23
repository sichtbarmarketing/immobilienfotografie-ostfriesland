"use client"

import { useState } from "react"
import Link from "next/link"
import { Camera } from "lucide-react"
import LegalPopup from "./legal-popup"

export default function Footer() {
  const [impressumOpen, setImpressumOpen] = useState(false)
  const [datenschutzOpen, setDatenschutzOpen] = useState(false)

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold mb-4">
              <Camera className="h-6 w-6" />
              <span>sichtbar.immo</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Professionelle Immobilienfotografie, Immobilienvideos und Virtual Homestaging in ganz Ostfriesland. Ich
              helfe Ihnen, Ihre Immobilie optimal zu präsentieren.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-facebook"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Dienstleistungen</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#services" className="text-muted-foreground hover:text-foreground">
                  Immobilienfotografie
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-muted-foreground hover:text-foreground">
                  Immobilienvideos
                </Link>
              </li>
              <li>
                <Link href="#homestaging" className="text-muted-foreground hover:text-foreground">
                  Virtual Homestaging
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-muted-foreground hover:text-foreground">
                  Drohnenaufnahmen
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-muted-foreground hover:text-foreground">
                  360° Rundgänge
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Rechtliches</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setImpressumOpen(true)} className="text-muted-foreground hover:text-foreground">
                  Impressum
                </button>
              </li>
              <li>
                <button
                  onClick={() => setDatenschutzOpen(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Datenschutz
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} sichtbar.immo | Immobilienfotograf Ostfriesland. Alle Rechte vorbehalten.</p>
        </div>
      </div>

      {/* Legal Popups */}
      <LegalPopup contentKey="impressum" isOpen={impressumOpen} onClose={() => setImpressumOpen(false)} />

      <LegalPopup contentKey="datenschutz" isOpen={datenschutzOpen} onClose={() => setDatenschutzOpen(false)} />
    </footer>
  )
}
