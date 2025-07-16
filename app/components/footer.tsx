"use client"

import { useState } from "react"
import { LegalPopup } from "./legal-popup"

export default function Footer() {
  const [showLegal, setShowLegal] = useState(false)
  const [legalType, setLegalType] = useState<"impressum" | "datenschutz">("impressum")

  const openLegal = (type: "impressum" | "datenschutz") => {
    setLegalType(type)
    setShowLegal(true)
  }

  return (
    <>
      <footer className="bg-white py-12 px-4 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-black">Professionelle Immobilienfotografie</h3>
              <p className="text-gray-600 mb-4">
                Hochwertige Fotografie für Immobilien, die Ihre Objekte ins beste Licht rückt und potenzielle Käufer
                begeistert.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">Kontakt</h3>
              <ul className="space-y-2">
                <li className="text-gray-600">+49 151 424 833 23</li>
                <li className="text-gray-600">info@sichtbar-marketing.de</li>
                <li className="text-gray-600">
                  Vaderkoborg 24a
                  <br />
                  26789 Leer
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">© 2024 Immobilienfotografie. Alle Rechte vorbehalten.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button
                onClick={() => openLegal("impressum")}
                className="text-black hover:text-gray-700 text-sm font-medium underline"
              >
                Impressum
              </button>
              <button
                onClick={() => openLegal("datenschutz")}
                className="text-black hover:text-gray-700 text-sm font-medium underline"
              >
                Datenschutz
              </button>
            </div>
          </div>
        </div>
      </footer>

      <LegalPopup isOpen={showLegal} onClose={() => setShowLegal(false)} type={legalType} />
    </>
  )
}
