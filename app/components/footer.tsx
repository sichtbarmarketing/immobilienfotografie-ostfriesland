"use client"

import { useState } from "react"
import Link from "next/link"
import LegalPopup from "./legal-popup"
import DynamicLogo from "./dynamic-logo"

export default function Footer() {
  const [impressumOpen, setImpressumOpen] = useState(false)
  const [datenschutzOpen, setDatenschutzOpen] = useState(false)

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <DynamicLogo iconClassName="h-8 w-auto filter brightness-0 invert" />
            </Link>
            <p className="text-white/70 mb-6 max-w-md">
              Professionelle Immobilienfotografie, Immobilienvideos und Virtual Homestaging in ganz Ostfriesland. Ich
              helfe Ihnen, Ihre Immobilie optimal zu präsentieren.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Dienstleistungen</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#services" className="text-white/70 hover:text-white transition-colors">
                  Immobilienfotografie
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-white/70 hover:text-white transition-colors">
                  Immobilienvideos
                </Link>
              </li>
              <li>
                <Link href="#homestaging" className="text-white/70 hover:text-white transition-colors">
                  Virtual Homestaging
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-white/70 hover:text-white transition-colors">
                  Drohnenaufnahmen
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-white/70 hover:text-white transition-colors">
                  360° Rundgänge
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Rechtliches</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setImpressumOpen(true)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Impressum
                </button>
              </li>
              <li>
                <button
                  onClick={() => setDatenschutzOpen(true)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Datenschutz
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/50">
          <p>© {new Date().getFullYear()} sichtbar.immo | Immobilienfotograf Ostfriesland. Alle Rechte vorbehalten.</p>
        </div>
      </div>

      {/* Legal Popups */}
      {impressumOpen && (
        <LegalPopup contentKey="impressum" isOpen={impressumOpen} onClose={() => setImpressumOpen(false)} />
      )}

      {datenschutzOpen && (
        <LegalPopup contentKey="datenschutz" isOpen={datenschutzOpen} onClose={() => setDatenschutzOpen(false)} />
      )}
    </footer>
  )
}
