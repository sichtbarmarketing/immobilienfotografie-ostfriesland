"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LegalPopupProps {
  isOpen: boolean
  onClose: () => void
  type: "impressum" | "datenschutz"
}

export function LegalPopup({ isOpen, onClose, type }: LegalPopupProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchContent()
    }
  }, [isOpen, type])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/content?type=${type}`)
      if (response.ok) {
        const data = await response.json()
        setContent(data.content || getDefaultContent())
      } else {
        setContent(getDefaultContent())
      }
    } catch (error) {
      console.error("Error fetching legal content:", error)
      setContent(getDefaultContent())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultContent = () => {
    if (type === "impressum") {
      return `
        <h1>Impressum</h1>
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          Sichtbar Marketing<br>
          Vaderkoborg 24a<br>
          26789 Leer
        </p>
        <h2>Kontakt</h2>
        <p>
          Telefon: +49 151 424 833 23<br>
          E-Mail: info@sichtbar-marketing.de
        </p>
        <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>
          Sichtbar Marketing<br>
          Vaderkoborg 24a<br>
          26789 Leer
        </p>
      `
    } else {
      return `
        <h1>Datenschutzerklärung</h1>
        <h2>1. Datenschutz auf einen Blick</h2>
        <h3>Allgemeine Hinweise</h3>
        <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
        
        <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
        <h3>Datenschutz</h3>
        <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.</p>
        
        <h2>3. Datenerfassung auf dieser Website</h2>
        <h3>Kontaktformular</h3>
        <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>
        
        <p>Verantwortliche Stelle:<br>
        Sichtbar Marketing<br>
        Vaderkoborg 24a<br>
        26789 Leer<br>
        E-Mail: info@sichtbar-marketing.de</p>
      `
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full mx-4 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-black">
            {type === "impressum" ? "Impressum" : "Datenschutzerklärung"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div
              className="prose prose-sm max-w-none"
              style={{ color: "#000000" }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        <div className="border-t p-6">
          <Button onClick={onClose} className="w-full">
            Schließen
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LegalPopup
