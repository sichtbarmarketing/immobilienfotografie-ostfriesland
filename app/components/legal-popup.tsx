"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LegalPopupProps {
  contentKey: string
  isOpen: boolean
  onClose: () => void
}

// Static content for legal pages
const staticContent = {
  impressum: {
    title: "Impressum",
    content: `
      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        Max Mustermann<br />
        sichtbar.immo<br />
        Musterstraße 123<br />
        26789 Leer
      </p>
      
      <h3>Kontakt</h3>
      <p>
        Telefon: +49 (0) 123 456789<br />
        E-Mail: info@sichtbar-marketing.de
      </p>
      
      <h3>Umsatzsteuer-ID</h3>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
        DE123456789
      </p>
      
      <h3>Berufsbezeichnung und berufsrechtliche Regelungen</h3>
      <p>
        Berufsbezeichnung: Fotograf<br />
        Zuständige Kammer: Handwerkskammer Ostfriesland<br />
        Verliehen durch: Bundesrepublik Deutschland
      </p>
      
      <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
      <p>
        Max Mustermann<br />
        Musterstraße 123<br />
        26789 Leer
      </p>
    `,
  },
  datenschutz: {
    title: "Datenschutzerklärung",
    content: `
      <h2>1. Datenschutz auf einen Blick</h2>
      <h3>Allgemeine Hinweise</h3>
      <p>
        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
      </p>
      
      <h3>Datenerfassung auf dieser Website</h3>
      <p>
        <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
        Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
      </p>
      
      <p>
        <strong>Wie erfassen wir Ihre Daten?</strong><br />
        Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
      </p>
      
      <p>
        <strong>Wofür nutzen wir Ihre Daten?</strong><br />
        Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
      </p>
      
      <p>
        <strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong><br />
        Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
      </p>
    `,
  },
}

export default function LegalPopup({ contentKey, isOpen, onClose }: LegalPopupProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)

      // Use static content instead of fetching from Supabase
      const legalContent = staticContent[contentKey as keyof typeof staticContent]

      if (legalContent) {
        setTitle(legalContent.title)
        setContent(legalContent.content)
      } else {
        setTitle(contentKey === "impressum" ? "Impressum" : "Datenschutzerklärung")
        setContent("Inhalt wird noch hinzugefügt.")
      }

      setLoading(false)
    }
  }, [contentKey, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-8 text-center">Inhalt wird geladen...</div>
          ) : (
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>

        <div className="sticky bottom-0 bg-background p-4 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Schließen
          </Button>
        </div>
      </div>
    </div>
  )
}
