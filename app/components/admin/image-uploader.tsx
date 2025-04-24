"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function ImageUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; url?: string } | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("")

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

    // Validate form
    if (!category) {
      setResult({ success: false, message: "Bitte wählen Sie eine Bildkategorie aus" })
      return
    }

    if (!selectedFile) {
      setResult({ success: false, message: "Bitte wählen Sie ein Bild aus" })
      return
    }

    setIsUploading(true)
    setResult(null)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("category", category)
      formData.append("title", title || selectedFile.name)

      // Upload image
      console.log("Uploading image...")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      console.log("Upload response:", result)

      if (response.ok && result.success) {
        setResult({
          success: true,
          message: "Bild erfolgreich hochgeladen",
          url: result.url,
        })

        // Reset form on success
        setCategory("")
        setTitle("")
        setSelectedFile(null)
        setPreviewUrl(null)

        // Reset file input
        const fileInput = document.getElementById("file") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setResult({
          success: false,
          message: result.message || "Fehler beim Hochladen des Bildes",
        })
      }
    } catch (error) {
      console.error("Upload error:", error)
      setResult({
        success: false,
        message: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {result && (
        <Alert
          variant={result.success ? "default" : "destructive"}
          className={`mb-6 ${result.success ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : ""}`}
        >
          {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Bildkategorie *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Bitte auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero">Hero Bild</SelectItem>
                <SelectItem value="interior">Innenaufnahmen</SelectItem>
                <SelectItem value="exterior">Außenaufnahmen</SelectItem>
                <SelectItem value="drone">Drohnenaufnahmen</SelectItem>
                <SelectItem value="virtual-staging">Virtual Homestaging</SelectItem>
                <SelectItem value="about">Über uns</SelectItem>
                <SelectItem value="intro">Intro Bereich</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel des Bildes" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Bild auswählen *</Label>
          <Input id="file" type="file" accept="image/*" onChange={handleFileChange} required />
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
