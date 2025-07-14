"use server"

import { revalidatePath } from "next/cache"

// Types
export type ContentUpdateResult = {
  success: boolean
  message: string
}

// Simulierte Datenbank-Operationen (da Supabase Probleme hat)
const contentStorage = new Map<string, any>()

// Update site content
export async function updateSiteContent(formData: FormData): Promise<ContentUpdateResult> {
  try {
    const key = formData.get("key") as string
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    console.log("Updating content:", { key, id, title, contentLength: content?.length })

    if (!key || !title) {
      return {
        success: false,
        message: "Schlüssel und Titel sind erforderlich",
      }
    }

    // Simuliere Speicherung (in einer echten App würde das in Supabase gespeichert)
    contentStorage.set(key, {
      id,
      key,
      title,
      content,
      updated_at: new Date().toISOString(),
    })

    console.log("Content updated successfully for key:", key)

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/admin/dashboard")

    return {
      success: true,
      message: `${title} erfolgreich gespeichert`,
    }
  } catch (error) {
    console.error("Content update error:", error)
    return {
      success: false,
      message: "Ein unerwarteter Fehler ist aufgetreten",
    }
  }
}
