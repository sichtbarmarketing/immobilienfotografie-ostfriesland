"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { updateSiteContent, type ContentUpdateResult } from "../../actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getContent, type ContentRecord } from "../../lib/supabase"

export default function ContentEditor() {
  const [activeTab, setActiveTab] = useState("impressum")
  const [content, setContent] = useState<ContentRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<ContentUpdateResult | null>(null)

  // Load content
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true)
      try {
        const content = await getContent(activeTab)
        setContent(content)
      } catch (error) {
        console.error("Error loading content:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [activeTab])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateSiteContent(formData)
      setResult(result)

      if (result.success) {
        // Update local state
        setContent({
          id: content?.id || "",
          key: formData.get("key") as string,
          title: formData.get("title") as string,
          content: formData.get("content") as string,
          created_at: content?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Content update error:", error)
      setResult({
        success: false,
        message: "Ein unerwarteter Fehler ist aufgetreten",
      })
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

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="impressum">Impressum</TabsTrigger>
          <TabsTrigger value="datenschutz">Datenschutz</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="text-center py-12">Inhalt wird geladen...</div>
        ) : (
          <TabsContent value={activeTab} className="mt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="hidden" name="key" value={activeTab} />

              <div className="space-y-2">
                <label htmlFor="content-title" className="text-sm font-medium">
                  Titel
                </label>
                <input
                  id="content-title"
                  name="title"
                  type="text"
                  defaultValue={content?.title || (activeTab === "impressum" ? "Impressum" : "Datenschutzerklärung")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="content-editor" className="text-sm font-medium">
                  Inhalt
                </label>
                <textarea
                  id="content-editor"
                  name="content"
                  rows={20}
                  defaultValue={content?.content || ""}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Sie können HTML-Tags verwenden, um den Text zu formatieren.
                </p>
              </div>

              <Button type="submit" className="w-full">
                Inhalt speichern
              </Button>
            </form>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
