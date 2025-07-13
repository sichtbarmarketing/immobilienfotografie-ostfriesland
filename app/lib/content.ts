import { createClient } from "@supabase/supabase-js"

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Types
export type ContentItem = {
  id: number
  key: string
  title: string
  content: string
}

export type SiteSettings = {
  id: number
  key: string
  value: string
}

// Helper function to create Supabase client safely
function createSupabaseClient() {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase credentials not available")
      return null
    }
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return null
  }
}

// Get content by key
export async function getContent(key: string): Promise<string> {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) {
      console.warn(`Cannot fetch content for key ${key}: Supabase not available`)
      return ""
    }

    const { data, error } = await supabase.from("site_content").select("content").eq("key", key).single()

    if (error) {
      console.warn(`Content not found for key ${key}:`, error.message)
      return ""
    }

    return data?.content || ""
  } catch (error) {
    console.warn(`Error fetching content for key ${key}:`, error)
    return ""
  }
}

// Get all content
export async function getAllContent(): Promise<Record<string, string>> {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) {
      console.warn("Cannot fetch content: Supabase not available")
      return {}
    }

    const { data, error } = await supabase.from("site_content").select("key, content")

    if (error) {
      console.warn("Error fetching all content:", error.message)
      return {}
    }

    if (!data || !Array.isArray(data)) {
      console.warn("Invalid content data received")
      return {}
    }

    // Convert array to object with key-value pairs
    return data.reduce(
      (acc, item) => {
        if (item && item.key && typeof item.content === "string") {
          acc[item.key] = item.content
        }
        return acc
      },
      {} as Record<string, string>,
    )
  } catch (error) {
    console.warn("Error in getAllContent:", error)
    return {}
  }
}

// Get setting by key
export async function getSetting(key: string): Promise<string> {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) {
      console.warn(`Cannot fetch setting for key ${key}: Supabase not available`)
      return ""
    }

    const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).single()

    if (error) {
      console.warn(`Setting not found for key ${key}:`, error.message)
      return ""
    }

    return data?.value || ""
  } catch (error) {
    console.warn(`Error fetching setting for key ${key}:`, error)
    return ""
  }
}

// Get all settings
export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const supabase = createSupabaseClient()
    if (!supabase) {
      console.warn("Cannot fetch settings: Supabase not available")
      return {}
    }

    const { data, error } = await supabase.from("site_settings").select("key, value")

    if (error) {
      console.warn("Error fetching all settings:", error.message)
      return {}
    }

    if (!data || !Array.isArray(data)) {
      console.warn("Invalid settings data received")
      return {}
    }

    // Convert array to object with key-value pairs
    return data.reduce(
      (acc, item) => {
        if (item && item.key && typeof item.value === "string") {
          acc[item.key] = item.value
        }
        return acc
      },
      {} as Record<string, string>,
    )
  } catch (error) {
    console.warn("Error in getAllSettings:", error)
    return {}
  }
}
