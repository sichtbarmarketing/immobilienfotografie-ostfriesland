"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { uploadImage, type UploadResult } from "../actions/image-upload"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const [state, action] = useActionState<UploadResult, FormData>(uploadImage, {
    success: false,
    message: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const auth = sessionStorage.getItem("adminAuth")
    if (auth !== "true") {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

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

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth")
    router.push("/admin")
  }

  if (!isAuthenticated) {
    return <div>Überprüfung der Authentifizierung...</div>
  }

  return (
    <div className="bg-background rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Bilder hochladen</h2>
        <Button variant="outline" onClick={handleLogout}>
          Abmelden
        </Button>
      </div>

      {state?.message && (
        <div
          className={`p-4 mb-6 rounded-md ${state.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {state.message}
        </div>
      )}

      <form action={action} className="space-y-6">
        {/* Hidden auth fields */}
        <input type="hidden" name="username" value="admin" />
        <input type="hidden" name="password" value="sichtbar2024" />

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Bildkategorie
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
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="file" className="text-sm font-medium">
            Bild auswählen
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

        <Button type="submit" className="w-full">
          Bild hochladen
        </Button>
      </form>

      {state?.success && state.url && (
        <div className="mt-6 p-4 border rounded-md">
          <p className="font-medium mb-2">Bild erfolgreich hochgeladen:</p>
          <p className="text-sm text-muted-foreground break-all mb-2">{state.url}</p>
          <img
            src={state.url || "/placeholder.svg"}
            alt="Hochgeladenes Bild"
            className="max-w-full h-auto max-h-64 rounded-md"
          />
        </div>
      )}
    </div>
  )
}
