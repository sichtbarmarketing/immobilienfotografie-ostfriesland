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
import { Eye, Edit } from "lucide-react"

type ContentItem = {
  id: number
  key: string
  title: string
  content: string
}

const fallbackContent = [
  {
    id: 1,
    key: "hero_title",
    title: "Hero Titel",
    content: "Immobilienfotografie neu definiert.",
  },
  {
    id: 2,
    key: "hero_subtitle",
    title: "Hero Untertitel",
    content: "Professionelle Immobilienfotografie, Videos und Virtual Homestaging in Ostfriesland.",
  },
  {
    id: 3,
    key: "about_title",
    title: "Über uns Titel",
    content: "Über sichtbar.immo",
  },
  {
    id: 4,
    key: "contact_title",
    title: "Kontakt Titel",
    content: "Jetzt unverbindlich anfragen",
  },
  {
    id: 5,
    key: "impressum",
    title: "Impressum",
    content: `<h2>Angaben gemäß § 5 TMG</h2>
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
</p>`,
  },
  {
    id: 6,
    key: "datenschutz",
    title: "Datenschutzerklärung",
    content: `<h2>1. Datenschutz auf einen Blick</h2>
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
</p>`,
  },
]

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
          // Use fallback content if API fails
          console.warn("API failed, using fallback content")
          setContentItems(fallbackContent)
          setSelectedContent(fallbackContent[0])
        }
      } catch (error) {
        console.error("Error loading content:", error)
        // Use fallback content on error
        setContentItems(fallbackContent)
        setSelectedContent(fallbackContent[0])
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
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="text">Texte</TabsTrigger>
            <TabsTrigger value="legal">Rechtliches</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Inhalte werden geladen...</p>
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

          <TabsContent value="legal" className="mt-0">
            <LegalEditor />
          </TabsContent>

          <TabsContent value="logo" className="mt-0">
            <LogoUploader />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function LegalEditor() {
  const [impressumContent, setImpressumContent] = useState<ContentItem | null>(null)
  const [datenschutzContent, setDatenschutzContent] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updateResult, setUpdateResult] = useState<{ success: boolean; message: string } | null>(null)
  const [activeTab, setActiveTab] = useState("impressum")
  const [previewMode, setPreviewMode] = useState<{ impressum: boolean; datenschutz: boolean }>({
    impressum: false,
    datenschutz: false,
  })

  // Load legal content with fallback
  useEffect(() => {
    const fetchLegalContent = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/admin/content")
        const data = await response.json()

        let impressum, datenschutz

        if (response.ok && data.success && data.content) {
          impressum = data.content.find((item: any) => item.key === "impressum")
          datenschutz = data.content.find((item: any) => item.key === "datenschutz")
        }

        // Use fallback if not found
        if (!impressum) {
          impressum = fallbackContent.find((item) => item.key === "impressum")
        }
        if (!datenschutz) {
          datenschutz = fallbackContent.find((item) => item.key === "datenschutz")
        }

        setImpressumContent(impressum || null)
        setDatenschutzContent(datenschutz || null)

        console.log("Legal content loaded:", {
          impressum: !!impressum,
          datenschutz: !!datenschutz,
          impressumLength: impressum?.content?.length,
          datenschutzLength: datenschutz?.content?.length,
        })
      } catch (error) {
        console.error("Error loading legal content:", error)
        // Use fallback content on error
        const impressum = fallbackContent.find((item) => item.key === "impressum")
        const datenschutz = fallbackContent.find((item) => item.key === "datenschutz")

        setImpressumContent(impressum || null)
        setDatenschutzContent(datenschutz || null)
      } finally {
        setLoading(false)
      }
    }

    fetchLegalContent()
  }, [])

  const handleSubmit = async (contentType: "impressum" | "datenschutz", e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUpdateResult(null)

    const content = contentType === "impressum" ? impressumContent : datenschutzContent
    if (!content) return

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateSiteContent(formData)
      setUpdateResult(result)

      if (result.success) {
        // Update local state
        const updatedContent = {
          ...content,
          content: formData.get("content") as string,
        }

        if (contentType === "impressum") {
          setImpressumContent(updatedContent)
        } else {
          setDatenschutzContent(updatedContent)
        }
      }
    } catch (error) {
      console.error("Error updating legal content:", error)
      setUpdateResult({
        success: false,
        message: "Ein unerwarteter Fehler ist aufgetreten",
      })
    }
  }

  const togglePreview = (contentType: "impressum" | "datenschutz") => {
    setPreviewMode((prev) => ({
      ...prev,
      [contentType]: !prev[contentType],
    }))
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Rechtliche Inhalte werden geladen...</p>
      </div>
    )
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

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="impressum">Impressum</TabsTrigger>
          <TabsTrigger value="datenschutz">Datenschutzerklärung</TabsTrigger>
        </TabsList>

        <TabsContent value="impressum" className="mt-0">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Impressum bearbeiten</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => togglePreview("impressum")}
                className="flex items-center gap-2"
              >
                {previewMode.impressum ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {previewMode.impressum ? "Bearbeiten" : "Vorschau"}
              </Button>
            </div>

            {previewMode.impressum ? (
              <div className="border rounded-lg p-6 bg-muted/30">
                <h4 className="font-medium mb-4">Vorschau:</h4>
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: impressumContent?.content || "Kein Inhalt verfügbar" }}
                />
              </div>
            ) : (
              <form onSubmit={(e) => handleSubmit("impressum", e)} className="space-y-6">
                <input type="hidden" name="key" value="impressum" />
                <input type="hidden" name="id" value={impressumContent?.id || "5"} />
                <input type="hidden" name="title" value="Impressum" />

                <div className="space-y-2">
                  <Label htmlFor="impressum-content">Impressum Inhalt (HTML erlaubt)</Label>
                  <Textarea
                    id="impressum-content"
                    name="content"
                    rows={20}
                    defaultValue={impressumContent?.content || ""}
                    key={`impressum-${impressumContent?.id}`} // Force re-render when content changes
                    className="w-full font-mono text-sm"
                    placeholder="Geben Sie hier den Inhalt Ihres Impressums ein..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Sie können HTML-Tags verwenden: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;br /&gt;, &lt;strong&gt;,
                    etc.
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Impressum speichern
                </Button>
              </form>
            )}
          </div>
        </TabsContent>

        <TabsContent value="datenschutz" className="mt-0">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Datenschutzerklärung bearbeiten</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => togglePreview("datenschutz")}
                className="flex items-center gap-2"
              >
                {previewMode.datenschutz ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {previewMode.datenschutz ? "Bearbeiten" : "Vorschau"}
              </Button>
            </div>

            {previewMode.datenschutz ? (
              <div className="border rounded-lg p-6 bg-muted/30">
                <h4 className="font-medium mb-4">Vorschau:</h4>
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: datenschutzContent?.content || "Kein Inhalt verfügbar" }}
                />
              </div>
            ) : (
              <form onSubmit={(e) => handleSubmit("datenschutz", e)} className="space-y-6">
                <input type="hidden" name="key" value="datenschutz" />
                <input type="hidden" name="id" value={datenschutzContent?.id || "6"} />
                <input type="hidden" name="title" value="Datenschutzerklärung" />

                <div className="space-y-2">
                  <Label htmlFor="datenschutz-content">Datenschutzerklärung Inhalt (HTML erlaubt)</Label>
                  <Textarea
                    id="datenschutz-content"
                    name="content"
                    rows={20}
                    defaultValue={datenschutzContent?.content || ""}
                    key={`datenschutz-${datenschutzContent?.id}`} // Force re-render when content changes
                    className="w-full font-mono text-sm"
                    placeholder="Geben Sie hier den Inhalt Ihrer Datenschutzerklärung ein..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Sie können HTML-Tags verwenden: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;br /&gt;, &lt;strong&gt;,
                    etc.
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Datenschutzerklärung speichern
                </Button>
              </form>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
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
