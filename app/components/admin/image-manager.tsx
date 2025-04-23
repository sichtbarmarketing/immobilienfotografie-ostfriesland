"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { deleteImage, updateImageMetadata, reorderImages, type UploadResult } from "../../actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type ImageRecord, getImages } from "../../lib/supabase"
import { Trash2, Edit, MoveVertical, Check, X } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

// Sortable image item component
function SortableImageItem({ image }: { image: ImageRecord }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border rounded-md p-2 mb-2 bg-background cursor-move flex items-center gap-2"
    >
      <MoveVertical className="h-5 w-5 text-muted-foreground" />
      <div className="w-16 h-16 relative overflow-hidden rounded">
        <img src={image.url || "/placeholder.svg"} alt={image.alt_text} className="object-cover w-full h-full" />
      </div>
      <div className="flex-1 ml-2">
        <p className="font-medium text-sm truncate">{image.title}</p>
        <p className="text-xs text-muted-foreground">Kategorie: {image.category}</p>
      </div>
    </div>
  )
}

export default function ImageManager() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("hero")
  const [images, setImages] = useState<ImageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [editingImage, setEditingImage] = useState<ImageRecord | null>(null)
  const [isReordering, setIsReordering] = useState(false)
  const [reorderedImages, setReorderedImages] = useState<ImageRecord[]>([])

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Load images
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true)
      try {
        const images = await getImages(activeCategory)
        setImages(images)
        setReorderedImages(images)
      } catch (error) {
        console.error("Error loading images:", error)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [activeCategory])

  // Handle image deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Sind Sie sicher, dass Sie dieses Bild löschen möchten?")) {
      return
    }

    try {
      const result = await deleteImage(id)
      setResult(result)

      if (result.success) {
        // Remove from local state
        setImages(images.filter((img) => img.id !== id))
      }
    } catch (error) {
      console.error("Delete error:", error)
      setResult({
        success: false,
        message: "Ein unerwarteter Fehler ist aufgetreten",
      })
    }
  }

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateImageMetadata(formData)
      setResult(result)

      if (result.success) {
        // Update local state
        const updatedImages = images.map((img) => {
          if (img.id === editingImage?.id) {
            return {
              ...img,
              title: formData.get("title") as string,
              alt_text: formData.get("altText") as string,
              category: formData.get("category") as string,
              section: formData.get("section") as string,
              display_order: Number.parseInt(formData.get("displayOrder") as string) || img.display_order,
            }
          }
          return img
        })
        setImages(updatedImages)
        setEditingImage(null)
      }
    } catch (error) {
      console.error("Update error:", error)
      setResult({
        success: false,
        message: "Ein unerwarteter Fehler ist aufgetreten",
      })
    }
  }

  // Handle DnD end
  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      // Find the indices
      const oldIndex = reorderedImages.findIndex((img) => img.id === active.id)
      const newIndex = reorderedImages.findIndex((img) => img.id === over.id)

      // Reorder the array
      const newOrder = [...reorderedImages]
      const [movedItem] = newOrder.splice(oldIndex, 1)
      newOrder.splice(newIndex, 0, movedItem)

      // Update state
      setReorderedImages(newOrder)
    }
  }

  // Save reordering
  const handleSaveReordering = async () => {
    try {
      const orderedIds = reorderedImages.map((img) => img.id)
      const result = await reorderImages(activeCategory, orderedIds)
      setResult(result)

      if (result.success) {
        setImages(reorderedImages)
        setIsReordering(false)
      }
    } catch (error) {
      console.error("Reorder save error:", error)
      setResult({
        success: false,
        message: "Ein unerwarteter Fehler ist aufgetreten",
      })
    }
  }

  // Cancel reordering
  const handleCancelReordering = () => {
    setReorderedImages([...images])
    setIsReordering(false)
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

      <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="interior">Innen</TabsTrigger>
          <TabsTrigger value="exterior">Außen</TabsTrigger>
          <TabsTrigger value="drone">Drohne</TabsTrigger>
          <TabsTrigger value="virtual-staging">Homestaging</TabsTrigger>
          <TabsTrigger value="about">Über uns</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="text-center py-12">Bilder werden geladen...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Keine Bilder in dieser Kategorie gefunden</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Bilder in Kategorie: {activeCategory}</h3>
              {!isReordering ? (
                <Button variant="outline" size="sm" onClick={() => setIsReordering(true)}>
                  Reihenfolge ändern
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSaveReordering}>
                    <Check className="h-4 w-4 mr-1" /> Speichern
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancelReordering}>
                    <X className="h-4 w-4 mr-1" /> Abbrechen
                  </Button>
                </div>
              )}
            </div>

            {isReordering ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext items={reorderedImages.map((img) => img.id)} strategy={verticalListSortingStrategy}>
                  {reorderedImages.map((image) => (
                    <SortableImageItem key={image.id} image={image} />
                  ))}
                </SortableContext>
              </DndContext>
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
                          <p className="text-sm text-muted-foreground">Bereich: {image.section || image.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => setEditingImage(image)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(image.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Tabs>

      {/* Edit Image Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Bild bearbeiten</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input type="hidden" name="id" value={editingImage.id} />

              <div className="space-y-2">
                <label htmlFor="edit-title" className="text-sm font-medium">
                  Titel
                </label>
                <input
                  id="edit-title"
                  name="title"
                  type="text"
                  defaultValue={editingImage.title}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-altText" className="text-sm font-medium">
                  Alt-Text
                </label>
                <input
                  id="edit-altText"
                  name="altText"
                  type="text"
                  defaultValue={editingImage.alt_text}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-category" className="text-sm font-medium">
                  Kategorie
                </label>
                <select
                  id="edit-category"
                  name="category"
                  defaultValue={editingImage.category}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="hero">Hero Bild</option>
                  <option value="interior">Innenaufnahmen</option>
                  <option value="exterior">Außenaufnahmen</option>
                  <option value="drone">Drohnenaufnahmen</option>
                  <option value="virtual-staging">Virtual Homestaging</option>
                  <option value="about">Über uns</option>
                  <option value="intro">Intro Bereich</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-section" className="text-sm font-medium">
                  Website-Bereich
                </label>
                <select
                  id="edit-section"
                  name="section"
                  defaultValue={editingImage.section || ""}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Automatisch (basierend auf Kategorie)</option>
                  <option value="hero">Hero Sektion</option>
                  <option value="intro">Intro Sektion</option>
                  <option value="portfolio">Portfolio Sektion</option>
                  <option value="homestaging">Virtual Homestaging Sektion</option>
                  <option value="about">Über uns Sektion</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-displayOrder" className="text-sm font-medium">
                  Anzeigereihenfolge
                </label>
                <input
                  id="edit-displayOrder"
                  name="displayOrder"
                  type="number"
                  defaultValue={editingImage.display_order}
                  min="1"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setEditingImage(null)}>
                  Abbrechen
                </Button>
                <Button type="submit">Speichern</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
