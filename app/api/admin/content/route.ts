import { NextResponse } from "next/server"

// Force dynamic rendering
export const dynamic = "force-dynamic"

// Static fallback content for when database is not available
const fallbackContent = [
  {
    id: 1,
    key: "hero_title",
    title: "Hero Titel",
    content: "Immobilienfotografie neu definiert.",
  },
  {
    id: 2,
    key: "hero_subtitle",
    title: "Hero Untertitel",
    content: "Professionelle Immobilienfotografie, Videos und Virtual Homestaging in Ostfriesland.",
  },
  {
    id: 3,
    key: "about_title",
    title: "Über uns Titel",
    content: "Über sichtbar.immo",
  },
  {
    id: 4,
    key: "contact_title",
    title: "Kontakt Titel",
    content: "Jetzt unverbindlich anfragen",
  },
]

// Create a Supabase client with better error handling
function createSupabaseClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase credentials not configured, using fallback content")
      return null
    }

    const { createClient } = require("@supabase/supabase-js")
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn("Error creating Supabase client:", error)
    return null
  }
}

export async function GET() {
  try {
    const supabase = createSupabaseClient()

    if (!supabase) {
      console.log("Using fallback content due to missing Supabase configuration")
      return NextResponse.json({
        success: true,
        content: fallbackContent,
        source: "fallback",
      })
    }

    // Try to fetch content from database
    const { data, error } = await supabase.from("site_content").select("*").order("key")

    if (error) {
      console.warn("Error fetching content from database:", error.message)
      console.log("Using fallback content due to database error")
      return NextResponse.json({
        success: true,
        content: fallbackContent,
        source: "fallback",
        note: "Database unavailable, using default content",
      })
    }

    // If we have data, use it; otherwise use fallback
    const content = data && data.length > 0 ? data : fallbackContent

    return NextResponse.json({
      success: true,
      content: content,
      source: data && data.length > 0 ? "database" : "fallback",
    })
  } catch (error) {
    console.error("Unexpected error in content API:", error)

    // Always return valid JSON, even on error
    return NextResponse.json({
      success: true,
      content: fallbackContent,
      source: "fallback",
      error: "Unexpected error occurred, using default content",
    })
  }
}
