"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getContent } from "../lib/supabase"

interface LegalPopupProps {
  contentKey: string
  isOpen: boolean
  onClose: () => void
}

export default function LegalPopup({ contentKey, isOpen, onClose }: LegalPopupProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const loadContent = async () => {
        setLoading(true)
        setError(false)
        try {
          const data = await getContent(contentKey)
          if (data) {
            setTitle(data.title)
            setContent(data.content)
          } else {
            setTitle(contentKey === "impressum" ? "Impressum" : "Datenschutzerklärung")
            setContent("Inhalt wird noch hinzugefügt.")
          }
        } catch (error) {
          console.error("Error loading content:", error)
          setError(true)
          setTitle(contentKey === "impressum" ? "Impressum" : "Datenschutzerklärung")
          setContent("Der Inhalt konnte nicht geladen werden.")
        } finally {
          setLoading(false)
        }
      }

      loadContent()
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
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              Es gab ein Problem beim Laden des Inhalts. Bitte versuchen Sie es später erneut.
            </div>
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
