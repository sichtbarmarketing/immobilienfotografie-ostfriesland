"use server"

import { revalidatePath } from "next/cache"
import { put, del } from "@vercel/blob"
import { supabaseAdmin } from "../lib/supabase-admin"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../lib/auth"

// Types
export type UploadResult = {
  success: boolean
  message: string
  url?: string
  id?: string
}

export type ContentUpdateResult = {
  success: boolean
  message: string
}

// Check if user is authenticated as admin
async function isAdmin() {
  const session = await getServerSession(authOptions)
  return !!session?.user
}

// Image upload action
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  if (!(await isAdmin())) {
    return {
      success: false,
      message: "Nicht autorisiert",
    }
  }

  try {
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    const title = formData.get("title") as string
    const altText = formData.get("altText") as string
    const section = formData.get("section") as string

    if (!file || file.size === 0) {
      return {
        success: false,
        message: "Keine Datei ausgewählt",
      }
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        message: "Nur Bilddateien sind erlaubt",
      }
    }

    // Get file extension
    const fileExtension = file.name.split(".").pop() || "jpg"

    // Create a filename based on category and timestamp
    const timestamp = Date.now()
    const filename = `${category}-${timestamp}.${fileExtension}`

    // Upload to Vercel Blob
    const blob = await put(`images/${filename}`, file, {
      access: "public",
    })

    // Get the next display order
    const { data: existingImages } = await supabaseAdmin
      .from("images")
      .select("display_order")
      .eq("category", category)
      .order("display_order", { ascending: false })
      .limit(1)

    const nextOrder = existingImages && existingImages.length > 0 ? existingImages[0].display_order + 1 : 1

    // Store metadata in Supabase using the admin client
    const { data, error } = await supabaseAdmin
      .from("images")
      .insert({
        url: blob.url,
        filename,
        category,
        title: title || filename,
        alt_text: altText || title || filename,
        section: section || category,
        display_order: nextOrder,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Database error:", error)
      return {
        success: false,
        message: "Fehler beim Speichern der Bilddaten: " + error.message,
      }
    }

    // Revalidate the pages
    revalidatePath("/admin/dashboard")
    revalidatePath("/")

    return {
      success: true,
      message: "Bild erfolgreich hochgeladen",
      url: blob.url,
      id: data[0].id,
    }
  } catch (error) {
    console.error("Upload error:", error)
    return {
      success: false,
      message: "Fehler beim Hochladen des Bildes: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}

// Delete image action
export async function deleteImage(id: string): Promise<UploadResult> {
  if (!(await isAdmin())) {
    return {
      success: false,
      message: "Nicht autorisiert",
    }
  }

  try {
    // Get the image data
    const { data: image, error: fetchError } = await supabaseAdmin.from("images").select("*").eq("id", id).single()

    if (fetchError || !image) {
      return {
        success: false,
        message: "Bild nicht gefunden",
      }
    }

    // Delete from Vercel Blob
    try {
      await del(`images/${image.filename}`)
    } catch (blobError) {
      console.error("Blob deletion error:", blobError)
      // Continue even if blob deletion fails
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin.from("images").delete().eq("id", id)

    if (deleteError) {
      return {
        success: false,
        message: "Fehler beim Löschen des Bildes aus der Datenbank",
      }
    }

    // Revalidate the pages
    revalidatePath("/admin/dashboard")
    revalidatePath("/")

    return {
      success: true,
      message: "Bild erfolgreich gelöscht",
    }
  } catch (error) {
    console.error("Delete error:", error)
    return {
      success: false,
      message: "Fehler beim Löschen des Bildes",
    }
  }
}

// Update image metadata
export async function updateImageMetadata(formData: FormData): Promise<UploadResult> {
  if (!(await isAdmin())) {
    return {
      success: false,
      message: "Nicht autorisiert",
    }
  }

  try {
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const altText = formData.get("altText") as string
    const category = formData.get("category") as string
    const section = formData.get("section") as string
    const displayOrder = Number.parseInt(formData.get("displayOrder") as string) || 0

    const { error } = await supabaseAdmin
      .from("images")
      .update({
        title,
        alt_text: altText,
        category,
        section,
        display_order: displayOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      return {
        success: false,
        message: "Fehler beim Aktualisieren der Bilddaten",
      }
    }

    // Revalidate the pages
    revalidatePath("/admin/dashboard")
    revalidatePath("/")

    return {
      success: true,
      message: "Bilddaten erfolgreich aktualisiert",
    }
  } catch (error) {
    console.error("Update error:", error)
    return {
      success: false,
      message: "Fehler beim Aktualisieren der Bilddaten",
    }
  }
}

// Reorder images
export async function reorderImages(category: string, orderedIds: string[]): Promise<UploadResult> {
  if (!(await isAdmin())) {
    return {
      success: false,
      message: "Nicht autorisiert",
    }
  }

  try {
    // Update each image's display_order
    for (let i = 0; i < orderedIds.length; i++) {
      const { error } = await supabaseAdmin
        .from("images")
        .update({
          display_order: i + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderedIds[i])

      if (error) {
        return {
          success: false,
          message: `Fehler beim Aktualisieren der Reihenfolge für Bild ${orderedIds[i]}`,
        }
      }
    }

    // Revalidate the pages
    revalidatePath("/admin/dashboard")
    revalidatePath("/")

    return {
      success: true,
      message: "Bildreihenfolge erfolgreich aktualisiert",
    }
  } catch (error) {
    console.error("Reorder error:", error)
    return {
      success: false,
      message: "Fehler beim Aktualisieren der Bildreihenfolge",
    }
  }
}

// Content management actions
export async function updateSiteContent(formData: FormData): Promise<ContentUpdateResult> {
  if (!(await isAdmin())) {
    return {
      success: false,
      message: "Nicht autorisiert",
    }
  }

  try {
    const key = formData.get("key") as string
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    if (!key || !content) {
      return {
        success: false,
        message: "Fehlende Daten",
      }
    }

    const { error } = await supabaseAdmin.from("content").upsert({
      key,
      title,
      content,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      return {
        success: false,
        message: "Fehler beim Speichern des Inhalts",
      }
    }

    // Revalidate the pages
    revalidatePath("/admin/dashboard")
    revalidatePath("/")

    return {
      success: true,
      message: "Inhalt erfolgreich gespeichert",
    }
  } catch (error) {
    console.error("Content update error:", error)
    return {
      success: false,
      message: "Fehler beim Speichern des Inhalts",
    }
  }
}
