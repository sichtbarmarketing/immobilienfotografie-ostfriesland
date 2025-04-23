"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { validateAdminCredentials } from "../lib/auth"

export type UploadResult = {
  success: boolean
  message: string
  url?: string
  filename?: string
}

export async function uploadImage(prevState: any, formData: FormData): Promise<UploadResult> {
  // Check authentication
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!validateAdminCredentials({ username, password })) {
    return {
      success: false,
      message: "Ungültige Anmeldedaten",
    }
  }

  try {
    const file = formData.get("file") as File
    const category = formData.get("category") as string

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

    // Revalidate the page to show the new image
    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      message: "Bild erfolgreich hochgeladen",
      url: blob.url,
      filename,
    }
  } catch (error) {
    console.error("Upload error:", error)
    return {
      success: false,
      message: "Fehler beim Hochladen des Bildes",
    }
  }
}

// Function to list all uploaded images (would need to be implemented with a database in a real app)
// This is a placeholder - in a real app, you'd store image metadata in a database
export async function getUploadedImages() {
  // In a real app, you would fetch this from a database
  return []
}
