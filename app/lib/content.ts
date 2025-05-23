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

// Get content by key
export async function getContent(key: string): Promise<string> {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.from("site_content").select("content").eq("key", key).single()

    if (error) {
      console.error(`Error fetching content for key ${key}:`, error)
      return ""
    }

    return data?.content || ""
  } catch (error) {
    console.error(`Error in getContent for key ${key}:`, error)
    return ""
  }
}

// Get all content
export async function getAllContent(): Promise<Record<string, string>> {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.from("site_content").select("key, content")

    if (error) {
      console.error("Error fetching all content:", error)
      return {}
    }

    // Convert array to object with key-value pairs
    return data.reduce(
      (acc, item) => {
        acc[item.key] = item.content
        return acc
      },
      {} as Record<string, string>,
    )
  } catch (error) {
    console.error("Error in getAllContent:", error)
    return {}
  }
}

// Get setting by key
export async function getSetting(key: string): Promise<string> {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).single()

    if (error) {
      console.error(`Error fetching setting for key ${key}:`, error)
      return ""
    }

    return data?.value || ""
  } catch (error) {
    console.error(`Error in getSetting for key ${key}:`, error)
    return ""
  }
}

// Get all settings
export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.from("site_settings").select("key, value")

    if (error) {
      console.error("Error fetching all settings:", error)
      return {}
    }

    // Convert array to object with key-value pairs
    return data.reduce(
      (acc, item) => {
        acc[item.key] = item.value
        return acc
      },
      {} as Record<string, string>,
    )
  } catch (error) {
    console.error("Error in getAllSettings:", error)
    return {}
  }
}
