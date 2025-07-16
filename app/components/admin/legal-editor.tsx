"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RichTextEditor } from "./rich-text-editor"

interface LegalContent {
  key: string
  title: string
  content: string
}

export function LegalEditor() {
  const [activeTab, setActiveTab] = useState("impressum")
  const [content, setContent] = useState<Record<string, LegalContent>>({
    impressum: { key: "impressum", title: "Impressum", content: "" },
    datenschutz: { key: "datenschutz", title: "Datenschutzerklärung", content: "" },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/content")
      const data = await response.json()

      if (data.success && Array.isArray(data.content)) {
        const contentMap: Record<string, LegalContent> = {
          impressum: { key: "impressum", title: "Impressum", content: getDefaultImpressum() },
          datenschutz: { key: "datenschutz", title: "Datenschutzerklärung", content: getDefaultDatenschutz() },
        }

        data.content.forEach((item: any) => {
          if (item.key === "impressum" || item.key === "datenschutz") {
            contentMap[item.key] = {
              key: item.key,
              title: item.title || contentMap[item.key].title,
              content: item.content || contentMap[item.key].content,
            }
          }
        })

        setContent(contentMap)
      }
    } catch (error) {
      console.error("Error fetching content:", error)
      setMessage({ type: "error", text: "Fehler beim Laden der Inhalte" })
    } finally {
      setLoading(false)
    }
  }

  const getDefaultImpressum = () => {
    return `<h2>Angaben gemäß § 5 TMG</h2>
<p>Sichtbar Marketing<br>
Vaderkoborg 24a<br>
26789 Leer</p>

<h3>Kontakt</h3>
<p>Telefon: +49 151 424 833 23<br>
E-Mail: info@sichtbar-marketing.de</p>

<h3>Umsatzsteuer-ID</h3>
<p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br>
DE123456789</p>

<h3>Berufsbezeichnung und berufsrechtliche Regelungen</h3>
<p>Berufsbezeichnung: Fotograf<br>
Zuständige Kammer: Handwerkskammer Ostfriesland<br>
Verliehen durch: Bundesrepublik Deutschland</p>

<h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
<p>Sichtbar Marketing<br>
Vaderkoborg 24a<br>
26789 Leer</p>`
  }

  const getDefaultDatenschutz = () => {
    return `<h2>1. Datenschutz auf einen Blick</h2>
<h3>Allgemeine Hinweise</h3>
<p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>

<h3>Datenerfassung auf dieser Website</h3>
<p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br>
Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>

<p><strong>Wie erfassen wir Ihre Daten?</strong><br>
Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.</p>

<p><strong>Wofür nutzen wir Ihre Daten?</strong><br>
Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.</p>

<p><strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong><br>
Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.</p>

<h2>2. Verantwortliche Stelle</h2>
<p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br><br>
Sichtbar Marketing<br>
Vaderkoborg 24a<br>
26789 Leer<br>
Telefon: +49 151 424 833 23<br>
E-Mail: info@sichtbar-marketing.de</p>`
  }

  const handleContentChange = (newContent: string) => {
    setContent((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        content: newContent,
      },
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)

      const currentContent = content[activeTab]
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: currentContent.key,
          title: currentContent.title,
          content: currentContent.content,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: "Inhalt erfolgreich gespeichert!" })
      } else {
        setMessage({ type: "error", text: data.error || "Fehler beim Speichern" })
      }
    } catch (error) {
      console.error("Error saving content:", error)
      setMessage({ type: "error", text: "Fehler beim Speichern der Inhalte" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rechtliche Inhalte bearbeiten</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="impressum">Impressum</TabsTrigger>
            <TabsTrigger value="datenschutz">Datenschutz</TabsTrigger>
          </TabsList>

          <TabsContent value="impressum" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Impressum bearbeiten</h3>
              <div className="flex gap-2">
                <Button
                  variant={previewMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  {previewMode ? "Bearbeiten" : "Vorschau"}
                </Button>
                <Button onClick={handleSave} disabled={saving} size="sm">
                  {saving ? "Speichern..." : "Speichern"}
                </Button>
              </div>
            </div>

            {previewMode ? (
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px]">
                <div
                  className="prose prose-sm max-w-none [&_*]:text-black [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_p]:text-black [&_strong]:text-black"
                  dangerouslySetInnerHTML={{ __html: content.impressum.content }}
                />
              </div>
            ) : (
              <RichTextEditor
                value={content.impressum.content}
                onChange={handleContentChange}
                placeholder="Impressum-Inhalt eingeben..."
              />
            )}
          </TabsContent>

          <TabsContent value="datenschutz" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Datenschutzerklärung bearbeiten</h3>
              <div className="flex gap-2">
                <Button
                  variant={previewMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  {previewMode ? "Bearbeiten" : "Vorschau"}
                </Button>
                <Button onClick={handleSave} disabled={saving} size="sm">
                  {saving ? "Speichern..." : "Speichern"}
                </Button>
              </div>
            </div>

            {previewMode ? (
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px]">
                <div
                  className="prose prose-sm max-w-none [&_*]:text-black [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_p]:text-black [&_strong]:text-black"
                  dangerouslySetInnerHTML={{ __html: content.datenschutz.content }}
                />
              </div>
            ) : (
              <RichTextEditor
                value={content.datenschutz.content}
                onChange={handleContentChange}
                placeholder="Datenschutzerklärung-Inhalt eingeben..."
              />
            )}
          </TabsContent>
        </Tabs>

        {message && (
          <Alert
            className={`mt-4 ${message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
          >
            <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
