import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

// Static fallback settings
const fallbackSettings = [
  {
    id: 1,
    key: "site_name",
    value: "sichtbar.immo",
  },
  {
    id: 2,
    key: "logo_url",
    value: "/logo.svg",
  },
]

// Create a Supabase client with better error handling
function createSupabaseClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase credentials not configured, using fallback settings")
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
      console.log("Using fallback settings due to missing Supabase configuration")
      return NextResponse.json({
        success: true,
        settings: fallbackSettings,
        source: "fallback",
      })
    }

    // Try to fetch settings from database
    const { data, error } = await supabase.from("site_settings").select("*")

    if (error) {
      console.warn("Error fetching settings from database:", error.message)
      console.log("Using fallback settings due to database error")
      return NextResponse.json({
        success: true,
        settings: fallbackSettings,
        source: "fallback",
        note: "Database unavailable, using default settings",
      })
    }

    // If we have data, use it; otherwise use fallback
    const settings = data && data.length > 0 ? data : fallbackSettings

    return NextResponse.json({
      success: true,
      settings: settings,
      source: data && data.length > 0 ? "database" : "fallback",
    })
  } catch (error) {
    console.error("Unexpected error in settings API:", error)

    // Always return valid JSON, even on error
    return NextResponse.json({
      success: true,
      settings: fallbackSettings,
      source: "fallback",
      error: "Unexpected error occurred, using default settings",
    })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseClient()

    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          message: "Database not available - settings cannot be updated",
        },
        { status: 503 },
      )
    }

    const formData = await request.formData()
    const siteName = formData.get("site_name") as string
    const logoFile = formData.get("logo") as File | null

    // Update site name
    if (siteName) {
      const { error: nameError } = await supabase
        .from("site_settings")
        .update({ value: siteName, updated_at: new Date().toISOString() })
        .eq("key", "site_name")

      if (nameError) {
        console.error("Error updating site name:", nameError)
        return NextResponse.json(
          { success: false, message: "Error updating site name: " + nameError.message },
          { status: 500 },
        )
      }
    }

    // Update logo if a new one was uploaded
    let logoUrl = null
    if (logoFile && logoFile.size > 0) {
      // Validate file type
      if (!logoFile.type.startsWith("image/")) {
        return NextResponse.json({ success: false, message: "Only image files are allowed" }, { status: 400 })
      }

      try {
        // Upload to Vercel Blob
        const blob = await put(`logo/site-logo-${Date.now()}.${logoFile.name.split(".").pop()}`, logoFile, {
          access: "public",
        })

        // Update logo URL in database
        const { error: logoError } = await supabase
          .from("site_settings")
          .update({ value: blob.url, updated_at: new Date().toISOString() })
          .eq("key", "logo_url")

        if (logoError) {
          console.error("Error updating logo URL:", logoError)
          return NextResponse.json(
            { success: false, message: "Error updating logo URL: " + logoError.message },
            { status: 500 },
          )
        }

        logoUrl = blob.url
      } catch (blobError) {
        console.error("Error uploading logo:", blobError)
        return NextResponse.json({ success: false, message: "Error uploading logo file" }, { status: 500 })
      }
    }

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/admin/dashboard")

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      logoUrl,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
