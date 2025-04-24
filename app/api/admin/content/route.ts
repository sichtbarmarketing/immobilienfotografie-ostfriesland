import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET() {
  try {
    // Fetch all content items
    const { data, error } = await supabase.from("site_content").select("*").order("key")

    if (error) {
      console.error("Error fetching content:", error)
      return NextResponse.json({ success: false, message: "Error fetching content: " + error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      content: data,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
