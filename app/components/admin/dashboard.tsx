"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upload")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; url?: string } | null>(null)
  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      // Clear session storage
      sessionStorage.removeItem("adminAuth")
      sessionStorage.removeItem("adminUser")

      // Call logout API
      await fetch("/api/auth/logout", { method: "POST" })

      // Force a hard navigation to the login page
      window.location.href = "/admin"
    } catch (error) {
      console.error("Logout error:", error)
      // Fallback to just clearing session storage and redirecting
      sessionStorage.removeItem("adminAuth")
      sessionStorage.removeItem("adminUser")
      window.location.href = "/admin"
    }
  }

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!category) {
      setUploadResult({ success: false, message: "Bitte wählen Sie eine Bildkategorie aus" })
      return
    }

    if (!selectedFile) {
      setUploadResult({ success: false, message: "Bitte wählen Sie ein Bild aus" })
      return
    }

    setIsUploading(true)
    setUploadResult(null)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("category", category)
      formData.append("title", title || selectedFile.name)

      // Upload image
      console.log("Uploading image...")
      setIsUploading(true)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      console.log("Upload response:", result)

      if (response.ok && result.success) {
        setUploadResult({
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
        setUploadResult({
          success: false,
          message: result.message || "Fehler beim Hochladen des Bildes",
        })
      }
    } catch (error) {
      console.error("Upload error:", error)
      setUploadResult({
        success: false,
        message: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-background rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <Button variant="outline" onClick={handleLogout}>
          Abmelden
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="upload">Bilder hochladen</TabsTrigger>
          <TabsTrigger value="manage">Bilder verwalten</TabsTrigger>
          <TabsTrigger value="content">Inhalte bearbeiten</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Bild hochladen</CardTitle>
              <CardDescription>Laden Sie neue Bilder für Ihre Website hoch</CardDescription>
            </CardHeader>
            <CardContent>
              {uploadResult && (
                <Alert
                  variant={uploadResult.success ? "default" : "destructive"}
                  className={`mb-6 ${uploadResult.success ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : ""}`}
                >
                  {uploadResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertDescription>{uploadResult.message}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleUpload} className="space-y-6">
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
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Titel</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Titel des Bildes"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Bild auswählen *</Label>
                  <Input id="file" type="file" accept="image/*" onChange={handleFileChange} />
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

              {uploadResult?.success && uploadResult.url && (
                <div className="mt-6 p-4 border rounded-md">
                  <p className="font-medium mb-2">Bild erfolgreich hochgeladen:</p>
                  <p className="text-sm text-muted-foreground break-all mb-2">{uploadResult.url}</p>
                  <img
                    src={uploadResult.url || "/placeholder.svg"}
                    alt="Hochgeladenes Bild"
                    className="max-w-full h-auto max-h-64 rounded-md"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Bilder verwalten</CardTitle>
              <CardDescription>Verwalten Sie die hochgeladenen Bilder</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Keine Bilder vorhanden. Laden Sie zuerst Bilder hoch.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Inhalte bearbeiten</CardTitle>
              <CardDescription>Bearbeiten Sie die Inhalte Ihrer Website</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="content-title">Titel</Label>
                  <Input id="content-title" placeholder="Seitentitel" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-editor">Inhalt</Label>
                  <Textarea
                    id="content-editor"
                    rows={10}
                    placeholder="Geben Sie hier den Inhalt ein..."
                    className="font-mono"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Inhalt speichern
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
