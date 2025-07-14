"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Eye, Edit } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateSiteContent } from "@/app/actions/admin-content"

type LegalContent = {
  id: number
  key: string
  title: string
  content: string
}

export default function LegalEditor() {
  const [impressumContent, setImpressumContent] = useState<LegalContent | null>(null)
  const [datenschutzContent, setDatenschutzContent] = useState<LegalContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updateResult, setUpdateResult] = useState<{ success: boolean; message: string } | null>(null)
  const [activeTab, setActiveTab] = useState("impressum")
  const [previewMode, setPreviewMode] = useState<{ impressum: boolean; datenschutz: boolean }>({
    impressum: false,
    datenschutz: false,
  })

  // Load legal content
  useEffect(() => {
    const fetchLegalContent = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/admin/content")
        const data = await response.json()

        if (response.ok && data.success) {
          const impressum = data.content.find((item: any) => item.key === "impressum")
          const datenschutz = data.content.find((item: any) => item.key === "datenschutz")

          if (impressum) setImpressumContent(impressum)
          if (datenschutz) setDatenschutzContent(datenschutz)
        } else {
          setError(data.message || "Failed to load legal content")
        }
      } catch (error) {
        console.error("Error loading legal content:", error)
        setError("An unexpected error occurred")
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
        message: "An unexpected error occurred",
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

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-4">
          Erneut versuchen
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rechtliche Inhalte bearbeiten</CardTitle>
        <CardDescription>Bearbeiten Sie Impressum und Datenschutzerklärung Ihrer Website</CardDescription>
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
            <TabsTrigger value="impressum">Impressum</TabsTrigger>
            <TabsTrigger value="datenschutz">Datenschutzerklärung</TabsTrigger>
          </TabsList>

          <TabsContent value="impressum" className="mt-0">
            {impressumContent ? (
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
                      dangerouslySetInnerHTML={{ __html: impressumContent.content }}
                    />
                  </div>
                ) : (
                  <form onSubmit={(e) => handleSubmit("impressum", e)} className="space-y-6">
                    <input type="hidden" name="key" value={impressumContent.key} />
                    <input type="hidden" name="id" value={impressumContent.id} />
                    <input type="hidden" name="title" value={impressumContent.title} />

                    <div className="space-y-2">
                      <Label htmlFor="impressum-content">Impressum Inhalt (HTML erlaubt)</Label>
                      <Textarea
                        id="impressum-content"
                        name="content"
                        rows={20}
                        defaultValue={impressumContent.content}
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
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Impressum-Inhalt nicht gefunden</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="datenschutz" className="mt-0">
            {datenschutzContent ? (
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
                      dangerouslySetInnerHTML={{ __html: datenschutzContent.content }}
                    />
                  </div>
                ) : (
                  <form onSubmit={(e) => handleSubmit("datenschutz", e)} className="space-y-6">
                    <input type="hidden" name="key" value={datenschutzContent.key} />
                    <input type="hidden" name="id" value={datenschutzContent.id} />
                    <input type="hidden" name="title" value={datenschutzContent.title} />

                    <div className="space-y-2">
                      <Label htmlFor="datenschutz-content">Datenschutzerklärung Inhalt (HTML erlaubt)</Label>
                      <Textarea
                        id="datenschutz-content"
                        name="content"
                        rows={20}
                        defaultValue={datenschutzContent.content}
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
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Datenschutzerklärung-Inhalt nicht gefunden</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
