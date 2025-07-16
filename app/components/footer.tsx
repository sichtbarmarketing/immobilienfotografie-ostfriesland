"use client"

import { useState } from "react"
import { LegalPopup } from "./legal-popup"

export default function Footer() {
  const [legalPopup, setLegalPopup] = useState<{ type: "impressum" | "datenschutz"; isOpen: boolean }>({
    type: "impressum",
    isOpen: false,
  })

  const openLegalPopup = (type: "impressum" | "datenschutz") => {
    setLegalPopup({ type, isOpen: true })
  }

  const closeLegalPopup = () => {
    setLegalPopup({ ...legalPopup, isOpen: false })
  }

  return (
    <>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Description */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Sichtbar Marketing</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Professionelle Immobilienfotografie und Virtual Staging für Makler, Bauträger und Immobilienbesitzer.
                Wir setzen Ihre Immobilien perfekt in Szene.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="font-medium">Telefon:</span>
                  <br />
                  +49 151 424 833 23
                </p>
                <p>
                  <span className="font-medium">E-Mail:</span>
                  <br />
                  info@sichtbar-marketing.de
                </p>
                <p>
                  <span className="font-medium">Adresse:</span>
                  <br />
                  Vaderkoborg 24a
                  <br />
                  26789 Leer
                </p>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Rechtliches</h3>
              <div className="space-y-2">
                <button
                  onClick={() => openLegalPopup("impressum")}
                  className="block text-sm text-gray-300 hover:text-white transition-colors duration-200 text-left"
                >
                  Impressum
                </button>
                <button
                  onClick={() => openLegalPopup("datenschutz")}
                  className="block text-sm text-gray-300 hover:text-white transition-colors duration-200 text-left"
                >
                  Datenschutzerklärung
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Sichtbar Marketing. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>

      <LegalPopup type={legalPopup.type} isOpen={legalPopup.isOpen} onClose={closeLegalPopup} />
    </>
  )
}
