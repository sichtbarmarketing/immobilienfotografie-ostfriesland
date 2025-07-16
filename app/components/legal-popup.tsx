"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LegalPopupProps {
  isOpen: boolean
  onClose: () => void
  type: "impressum" | "datenschutz"
}

export function LegalPopup({ isOpen, onClose, type }: LegalPopupProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)

      const fetchLegalContent = async () => {
        try {
          const response = await fetch("/api/admin/content")
          const data = await response.json()

          if (response.ok && data.success && Array.isArray(data.content)) {
            const legalContent = data.content.find((item: any) => item.key === type)

            if (legalContent && legalContent.content) {
              setTitle(legalContent.title || (type === "impressum" ? "Impressum" : "Datenschutzerklärung"))
              setContent(legalContent.content)
            } else {
              setTitle(type === "impressum" ? "Impressum" : "Datenschutzerklärung")
              setContent(getDefaultContent(type))
            }
          } else {
            setTitle(type === "impressum" ? "Impressum" : "Datenschutzerklärung")
            setContent(getDefaultContent(type))
          }
        } catch (error) {
          console.error("Error fetching legal content:", error)
          setTitle(type === "impressum" ? "Impressum" : "Datenschutzerklärung")
          setContent(getDefaultContent(type))
        } finally {
          setLoading(false)
        }
      }

      fetchLegalContent()
    }
  }, [type, isOpen])

  const getDefaultContent = (contentType: string) => {
    if (contentType === "impressum") {
      return `
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          Sichtbar Marketing<br />
          Vaderkoborg 24a<br />
          26789 Leer
        </p>
        
        <h3>Kontakt</h3>
        <p>
          Telefon: +49 151 424 833 23<br />
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
          Sichtbar Marketing<br />
          Vaderkoborg 24a<br />
          26789 Leer
        </p>
      `
    } else {
      return `
        <h2>1. Datenschutz auf einen Blick</h2>
        <h3>Allgemeine Hinweise</h3>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
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
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
        </p>
        
        <h2>2. Verantwortliche Stelle</h2>
        <p>
          Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br />
          <br />
          Sichtbar Marketing<br />
          Vaderkoborg 24a<br />
          26789 Leer<br />
          Telefon: +49 151 424 833 23<br />
          E-Mail: info@sichtbar-marketing.de
        </p>
      `
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-medium text-black dark:text-white">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-8 text-center text-gray-600">Inhalt wird geladen...</div>
          ) : (
            <div
              className="prose prose-sm max-w-none text-black dark:text-white [&_*]:text-black [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_p]:text-black [&_strong]:text-black"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <Button
            onClick={onClose}
            className="rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            Schließen
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LegalPopup
