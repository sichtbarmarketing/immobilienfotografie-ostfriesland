"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateSiteContent } from "@/app/actions/admin-content"

type ContentItem = {
  id: number
  key: string
  title: string
  content: string
}

export default function ContentEditor() {
  const [activeTab, setActiveTab] = useState("text")
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updateResult, setUpdateResult] = useState<{ success: boolean; message: string } | null>(null)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)

  // Load content items
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/admin/content")
        const data = await response.json()

        if (response.ok && data.success) {
          setContentItems(data.content)
          if (data.content.length > 0) {
            setSelectedContent(data.content[0])
          }
        } else {
          setError(data.message || "Failed to load content")
        }
      } catch (error) {
        console.error("Error loading content:", error)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const handleContentSelect = (key: string) => {
    const content = contentItems.find((item) => item.key === key)
    if (content) {
      setSelectedContent(content)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUpdateResult(null)

    if (!selectedContent) return

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateSiteContent(formData)
      setUpdateResult(result)

      if (result.success) {
        // Update local state
        const updatedContent = {
          ...selectedContent,
          title: formData.get("title") as string,
          content: formData.get("content") as string,
        }

        setSelectedContent(updatedContent)
        setContentItems(contentItems.map((item) => (item.key === updatedContent.key ? updatedContent : item)))
      }
    } catch (error) {
      console.error("Error updating content:", error)
      setUpdateResult({
        success: false,
        message: "An unexpected error occurred",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website-Inhalte bearbeiten</CardTitle>
        <CardDescription>Bearbeiten Sie die Texte Ihrer Website</CardDescription>
      </CardHeader>
      <CardContent>
        {updateResult && (
          <Alert
            variant={updateResult.success ? "default" : "destructive"}
            className={`mb-6 ${updateResult.success ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : ""}`}
          >
            {updateResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{updateResult.message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="text">Texte</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Inhalte werden geladen...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p>{error}</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-4">
                  Erneut versuchen
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <Label>Inhaltsbereich auswählen</Label>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {contentItems.map((item) => (
                      <Button
                        key={item.key}
                        variant={selectedContent?.key === item.key ? "default" : "outline"}
                        className="w-full justify-start text-left"
                        onClick={() => handleContentSelect(item.key)}
                      >
                        {item.title}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-3">
                  {selectedContent ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <input type="hidden" name="key" value={selectedContent.key} />
                      <input type="hidden" name="id" value={selectedContent.id} />

                      <div className="space-y-2">
                        <Label htmlFor="title">Titel</Label>
                        <Input id="title" name="title" defaultValue={selectedContent.title} className="w-full" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">Inhalt</Label>
                        <Textarea
                          id="content"
                          name="content"
                          rows={10}
                          defaultValue={selectedContent.content}
                          className="w-full font-mono"
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Inhalt speichern
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Bitte wählen Sie einen Inhaltsbereich aus</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="logo" className="mt-0">
            <LogoUploader />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function LogoUploader() {
  const [logoUrl, setLogoUrl] = useState<string>("/logo.svg")
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [updateResult, setUpdateResult] = useState<{ success: boolean; message: string } | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Load current logo
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)

      try {
        const response = await fetch("/api/admin/settings")
        const data = await response.json()

        if (response.ok && data.success) {
          const logoSetting = data.settings.find((s: any) => s.key === "logo_url")
          if (logoSetting) setLogoUrl(logoSetting.value)
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)

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
    setUpdateResult(null)
    setUploading(true)

    try {
      const formData = new FormData(e.currentTarget)

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      setUpdateResult({
        success: result.success,
        message: result.message,
      })

      if (result.success && result.logoUrl) {
        setLogoUrl(result.logoUrl)
        // Clear the file input
        setSelectedFile(null)
        setPreviewUrl(null)
      }
    } catch (error) {
      console.error("Error updating logo:", error)
      setUpdateResult({
        success: false,
        message: "An unexpected error occurred",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {updateResult && (
        <Alert
          variant={updateResult.success ? "default" : "destructive"}
          className={`mb-6 ${updateResult.success ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : ""}`}
        >
          {updateResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{updateResult.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Aktuelles Logo</h3>
          {loading ? (
            <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center p-6 bg-muted rounded-lg">
              <div className="bg-white p-4 rounded-lg mb-4">
                <img
                  src={logoUrl || "/placeholder.svg"}
                  alt="Site Logo"
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Logo aktualisieren</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Neues Logo hochladen</Label>
              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/svg+xml,image/png,image/jpeg"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                Empfohlenes Format: SVG oder PNG mit transparentem Hintergrund. Das Logo sollte bereits den Seitennamen
                enthalten.
              </p>
            </div>

            {previewUrl && (
              <div className="mt-4 p-4 bg-muted rounded-lg flex justify-center">
                <img src={previewUrl || "/placeholder.svg"} alt="Logo Preview" className="h-16 w-auto object-contain" />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? "Wird hochgeladen..." : "Logo speichern"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
