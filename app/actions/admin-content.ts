"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"

// Types
export type ContentUpdateResult = {
  success: boolean
  message: string
}

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Update site content
export async function updateSiteContent(formData: FormData): Promise<ContentUpdateResult> {
  try {
    const key = formData.get("key") as string
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    if (!key || !title) {
      return {
        success: false,
        message: "Schlüssel und Titel sind erforderlich",
      }
    }

    // Update the content in the database
    const { error } = await supabase
      .from("site_content")
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating content:", error)
      return {
        success: false,
        message: "Fehler beim Speichern des Inhalts: " + error.message,
      }
    }

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/admin/dashboard")

    return {
      success: true,
      message: "Inhalt erfolgreich gespeichert",
    }
  } catch (error) {
    console.error("Content update error:", error)
    return {
      success: false,
      message: "Ein unerwarteter Fehler ist aufgetreten",
    }
  }
}
