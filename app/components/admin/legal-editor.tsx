"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "./rich-text-editor"
import { updateSiteContent } from "@/app/actions/admin-content"

export function LegalEditor() {
  const [impressumContent, setImpressumContent] = useState("")
  const [datenschutzContent, setDatenschutzContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState("impressum")
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    setLoading(true)
    try {
      const [impressumResponse, datenschutzResponse] = await Promise.all([
        fetch("/api/admin/content?type=impressum"),
        fetch("/api/admin/content?type=datenschutz"),
      ])

      if (impressumResponse.ok) {
        const impressumData = await impressumResponse.json()
        setImpressumContent(impressumData.content || getDefaultImpressum())
      } else {
        setImpressumContent(getDefaultImpressum())
      }

      if (datenschutzResponse.ok) {
        const datenschutzData = await datenschutzResponse.json()
        setDatenschutzContent(datenschutzData.content || getDefaultDatenschutz())
      } else {
        setDatenschutzContent(getDefaultDatenschutz())
      }
    } catch (error) {
      console.error("Error loading content:", error)
      setImpressumContent(getDefaultImpressum())
      setDatenschutzContent(getDefaultDatenschutz())
      setMessage({ type: "error", text: "Fehler beim Laden der Inhalte" })
    } finally {
      setLoading(false)
    }
  }

  const getDefaultImpressum = () => `
    <h1>Impressum</h1>
    <h2>Angaben gemäß § 5 TMG</h2>
    <p>
      Sichtbar Marketing<br>
      Vaderkoborg 24a<br>
      26789 Leer
    </p>
    <h2>Kontakt</h2>
    <p>
      Telefon: +49 151 424 833 23<br>
      E-Mail: info@sichtbar-marketing.de
    </p>
    <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
    <p>
      Sichtbar Marketing<br>
      Vaderkoborg 24a<br>
      26789 Leer
    </p>
  `

  const getDefaultDatenschutz = () => `
    <h1>Datenschutzerklärung</h1>
    <h2>1. Datenschutz auf einen Blick</h2>
    <h3>Allgemeine Hinweise</h3>
    <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
    
    <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
    <h3>Datenschutz</h3>
    <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.</p>
    
    <h2>3. Datenerfassung auf dieser Website</h2>
    <h3>Kontaktformular</h3>
    <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>
    
    <p>Verantwortliche Stelle:<br>
    Sichtbar Marketing<br>
    Vaderkoborg 24a<br>
    26789 Leer<br>
    E-Mail: info@sichtbar-marketing.de</p>
  `

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const currentContent = activeTab === "impressum" ? impressumContent : datenschutzContent
      const result = await updateSiteContent(activeTab as "impressum" | "datenschutz", currentContent)

      if (result.success) {
        setMessage({
          type: "success",
          text: `${activeTab === "impressum" ? "Impressum" : "Datenschutzerklärung"} erfolgreich gespeichert`,
        })
      } else {
        setMessage({ type: "error", text: result.error || "Fehler beim Speichern" })
      }
    } catch (error) {
      console.error("Save error:", error)
      setMessage({ type: "error", text: "Fehler beim Speichern" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rechtliche Inhalte bearbeiten</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <Alert className={message.type === "error" ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}>
            <AlertDescription className={message.type === "error" ? "text-red-700" : "text-green-700"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="impressum">Impressum</TabsTrigger>
            <TabsTrigger value="datenschutz">Datenschutzerklärung</TabsTrigger>
          </TabsList>

          <TabsContent value="impressum" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Impressum bearbeiten</h3>
              <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                {previewMode ? "Bearbeiten" : "Vorschau"}
              </Button>
            </div>

            {previewMode ? (
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px]">
                <div
                  className="prose prose-sm max-w-none"
                  style={{ color: "#000000" }}
                  dangerouslySetInnerHTML={{ __html: impressumContent }}
                />
              </div>
            ) : (
              <RichTextEditor
                value={impressumContent}
                onChange={setImpressumContent}
                placeholder="Impressum Inhalt eingeben..."
              />
            )}
          </TabsContent>

          <TabsContent value="datenschutz" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Datenschutzerklärung bearbeiten</h3>
              <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                {previewMode ? "Bearbeiten" : "Vorschau"}
              </Button>
            </div>

            {previewMode ? (
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px]">
                <div
                  className="prose prose-sm max-w-none"
                  style={{ color: "#000000" }}
                  dangerouslySetInnerHTML={{ __html: datenschutzContent }}
                />
              </div>
            ) : (
              <RichTextEditor
                value={datenschutzContent}
                onChange={setDatenschutzContent}
                placeholder="Datenschutzerklärung Inhalt eingeben..."
              />
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Speichern..." : "Speichern"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
