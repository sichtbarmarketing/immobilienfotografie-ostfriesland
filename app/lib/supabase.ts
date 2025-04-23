import { createClient } from "@supabase/supabase-js"
import { supabaseAdmin } from "./supabase-admin"

// These environment variables are automatically available from the Supabase integration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a single supabase client for client-side usage
export const supabase = typeof window !== "undefined" ? createClient(supabaseUrl, supabaseAnonKey) : null // Don't initialize on server

// Types for our database tables
export type ImageRecord = {
  id: string
  url: string
  filename: string
  category: string
  title: string
  alt_text: string
  created_at: string
  updated_at: string
  display_order: number
  section: string
}

export type ContentRecord = {
  id: string
  key: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

// Helper functions for database operations
export async function getImages(category?: string): Promise<ImageRecord[]> {
  try {
    // Use admin client for server-side operations
    const client = typeof window === "undefined" ? supabaseAdmin : supabase

    if (!client) {
      console.error("Supabase client not initialized")
      return []
    }

    let query = client.from("images").select("*")

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error } = await query.order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching images:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getImages:", error)
    return []
  }
}

export async function getContent(key: string): Promise<ContentRecord | null> {
  try {
    // Use admin client for server-side operations
    const client = typeof window === "undefined" ? supabaseAdmin : supabase

    if (!client) {
      console.error("Supabase client not initialized")
      return null
    }

    const { data, error } = await client.from("content").select("*").eq("key", key).single()

    if (error) {
      console.error(`Error fetching content for key ${key}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Error in getContent for key ${key}:`, error)
    return null
  }
}

export async function updateContent(key: string, title: string, content: string): Promise<boolean> {
  try {
    // Always use admin client for updates
    const { error } = await supabaseAdmin.from("content").upsert({
      key,
      title,
      content,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error(`Error updating content for key ${key}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error in updateContent for key ${key}:`, error)
    return false
  }
}
