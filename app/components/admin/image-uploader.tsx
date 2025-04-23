"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { uploadImage, type UploadResult } from "../../actions/admin-actions"
import { Button } from "@/components/ui/button"

export default function ImageUploader() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)

    // Create preview
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await uploadImage(formData)
      setResult(result)

      if (result.success) {
        // Reset form on success
        e.currentTarget.reset()
        setSelectedFile(null)
        setPreviewUrl(null)
      }
    } catch (error) {
      console.error("Upload error:", error)
      setResult({
        success: false,
        message: "Ein unerwarteter Fehler ist aufgetreten",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {result?.message && (
        <div
          className={`p-4 mb-6 rounded-md ${result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {result.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Bildkategorie *
            </label>
            <select
              id="category"
              name="category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="">Bitte auswählen</option>
              <option value="hero">Hero Bild</option>
              <option value="interior">Innenaufnahmen</option>
              <option value="exterior">Außenaufnahmen</option>
              <option value="drone">Drohnenaufnahmen</option>
              <option value="virtual-staging">Virtual Homestaging</option>
              <option value="about">Über uns</option>
              <option value="intro">Intro Bereich</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="section" className="text-sm font-medium">
              Website-Bereich
            </label>
            <select
              id="section"
              name="section"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Automatisch (basierend auf Kategorie)</option>
              <option value="hero">Hero Sektion</option>
              <option value="intro">Intro Sektion</option>
              <option value="portfolio">Portfolio Sektion</option>
              <option value="homestaging">Virtual Homestaging Sektion</option>
              <option value="about">Über uns Sektion</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Titel
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Titel des Bildes"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="altText" className="text-sm font-medium">
              Alt-Text
            </label>
            <input
              id="altText"
              name="altText"
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Beschreibung für Screenreader"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="file" className="text-sm font-medium">
            Bild auswählen *
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Vorschau:</p>
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Vorschau"
              className="max-w-full h-auto max-h-64 rounded-md"
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isUploading}>
          {isUploading ? "Wird hochgeladen..." : "Bild hochladen"}
        </Button>
      </form>

      {result?.success && result.url && (
        <div className="mt-6 p-4 border rounded-md">
          <p className="font-medium mb-2">Bild erfolgreich hochgeladen:</p>
          <p className="text-sm text-muted-foreground break-all mb-2">{result.url}</p>
          <img
            src={result.url || "/placeholder.svg"}
            alt="Hochgeladenes Bild"
            className="max-w-full h-auto max-h-64 rounded-md"
          />
        </div>
      )}
    </div>
  )
}
