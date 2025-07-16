"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LegalPopupProps {
  type: "impressum" | "datenschutz"
  isOpen: boolean
  onClose: () => void
}

export function LegalPopup({ type, isOpen, onClose }: LegalPopupProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchContent()
    }
  }, [isOpen, type])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/content")
      const data = await response.json()

      if (data.success && Array.isArray(data.content)) {
        const item = data.content.find((item: any) => item.key === type)
        if (item && item.content) {
          setContent(item.content)
        } else {
          setContent(getDefaultContent())
        }
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
      return `<h2>Angaben gemäß § 5 TMG</h2>
<p>Sichtbar Marketing<br>
Vaderkoborg 24a<br>
26789 Leer</p>

<h3>Kontakt</h3>
<p>Telefon: +49 151 424 833 23<br>
E-Mail: info@sichtbar-marketing.de</p>

<h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
<p>Sichtbar Marketing<br>
Vaderkoborg 24a<br>
26789 Leer</p>`
    } else {
      return `<h2>1. Datenschutz auf einen Blick</h2>

<h3>Allgemeine Hinweise</h3>
<p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>

<h2>2. Verantwortliche Stelle</h2>
<p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>

<p>Sichtbar Marketing<br>
Vaderkoborg 24a<br>
26789 Leer<br>
Telefon: +49 151 424 833 23<br>
E-Mail: info@sichtbar-marketing.de</p>`
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-black">
            {type === "impressum" ? "Impressum" : "Datenschutzerklärung"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2 text-black">Lade Inhalt...</span>
            </div>
          ) : (
            <div
              className="prose prose-sm max-w-none [&_*]:text-black [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_p]:text-black [&_strong]:text-black [&_em]:text-black [&_li]:text-black [&_a]:text-blue-600 [&_a:hover]:text-blue-800 [&_p]:mb-4 [&_h1]:mb-4 [&_h2]:mb-3 [&_h3]:mb-2"
              dangerouslySetInnerHTML={{ __html: content }}
              style={{
                lineHeight: "1.6",
                color: "#000000",
              }}
            />
          )}
        </div>

        <div className="border-t p-4 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Schließen
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LegalPopup
