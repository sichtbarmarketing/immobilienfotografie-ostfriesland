"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Trash2, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

type ImageRecord = {
  id: string
  url: string
  filename: string
  category: string
  title: string
  alt_text: string
  created_at: string
  display_order: number
}

export default function ImageManager() {
  const [activeCategory, setActiveCategory] = useState("hero")
  const [images, setImages] = useState<ImageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteResult, setDeleteResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Load images
  const loadImages = async () => {
    setLoading(true)
    setError(null)
    setDeleteResult(null)

    try {
      const response = await fetch(`/api/images?category=${activeCategory}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setImages(data.images)
      } else {
        setError(data.message || "Fehler beim Laden der Bilder")
        setImages([])
      }
    } catch (error) {
      console.error("Error loading images:", error)
      setError("Ein unerwarteter Fehler ist aufgetreten")
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  // Delete an image
  const handleDelete = async (id: string) => {
    if (!confirm("Sind Sie sicher, dass Sie dieses Bild löschen möchten?")) {
      return
    }

    setIsDeleting(id)
    setDeleteResult(null)

    try {
      const response = await fetch("/api/images/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setDeleteResult({
          success: true,
          message: "Bild erfolgreich gelöscht",
        })
        // Remove the deleted image from the state
        setImages(images.filter((image) => image.id !== id))
      } else {
        setDeleteResult({
          success: false,
          message: data.message || "Fehler beim Löschen des Bildes",
        })
      }
    } catch (error) {
      console.error("Delete error:", error)
      setDeleteResult({
        success: false,
        message: "Ein unerwarteter Fehler ist aufgetreten",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  // Load images when the component mounts or the category changes
  useEffect(() => {
    loadImages()
  }, [activeCategory])

  return (
    <div className="space-y-6">
      {deleteResult && (
        <Alert
          variant={deleteResult.success ? "default" : "destructive"}
          className={`mb-6 ${
            deleteResult.success ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : ""
          }`}
        >
          {deleteResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{deleteResult.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="interior">Innen</TabsTrigger>
            <TabsTrigger value="exterior">Außen</TabsTrigger>
            <TabsTrigger value="drone">Drohne</TabsTrigger>
            <TabsTrigger value="virtual-staging">Homestaging</TabsTrigger>
            <TabsTrigger value="about">Über uns</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="sm" onClick={loadImages} className="ml-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Aktualisieren
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Bilder werden geladen...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={loadImages} className="mt-4">
            Erneut versuchen
          </Button>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Keine Bilder in dieser Kategorie gefunden</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <Card key={image.id}>
              <CardContent className="p-4">
                <div className="aspect-[4/3] relative overflow-hidden rounded-md mb-3">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt_text}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{image.title}</h4>
                    <p className="text-sm text-muted-foreground">Kategorie: {image.category}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(image.id)}
                    disabled={isDeleting === image.id}
                  >
                    {isDeleting === image.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
