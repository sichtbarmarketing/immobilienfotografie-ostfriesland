import { createClient } from "@supabase/supabase-js"

// These environment variables are automatically available from the Supabase integration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a Supabase client for client-side usage
export const supabase =
  typeof window !== "undefined"
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null // Don't initialize on server

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
    // For server-side operations, we'll use a direct fetch instead of Supabase client
    // This is a fallback approach when Supabase client isn't working properly
    if (typeof window === "undefined") {
      // Return empty array for now - we'll handle this with static placeholders
      return []
    }

    // Client-side operations
    if (!supabase) {
      console.error("Supabase client not initialized")
      return []
    }

    let query = supabase.from("images").select("*")

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
    // For server-side operations, we'll use a direct fetch instead of Supabase client
    // This is a fallback approach when Supabase client isn't working properly
    if (typeof window === "undefined") {
      // Return null for now - we'll handle this with static content
      return null
    }

    // Client-side operations
    if (!supabase) {
      console.error("Supabase client not initialized")
      return null
    }

    const { data, error } = await supabase.from("content").select("*").eq("key", key).single()

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
