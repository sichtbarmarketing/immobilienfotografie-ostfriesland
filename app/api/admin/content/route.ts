import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with better error handling
function createSupabaseClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase credentials not configured")
    }

    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return null
  }
}

export async function GET() {
  try {
    const supabase = createSupabaseClient()

    if (!supabase) {
      return NextResponse.json({
        success: false,
        message: "Database not available",
        content: [],
      })
    }

    // Fetch all content items
    const { data, error } = await supabase.from("site_content").select("*").order("key")

    if (error) {
      console.error("Error fetching content:", error)
      return NextResponse.json({
        success: false,
        message: "Error fetching content: " + error.message,
        content: [],
      })
    }

    return NextResponse.json({
      success: true,
      content: data || [],
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({
      success: false,
      message: "An unexpected error occurred",
      content: [],
    })
  }
}
