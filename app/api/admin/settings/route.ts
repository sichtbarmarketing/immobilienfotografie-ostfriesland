import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

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
        settings: [],
      })
    }

    // Fetch all settings
    const { data, error } = await supabase.from("site_settings").select("*")

    if (error) {
      console.error("Error fetching settings:", error)
      return NextResponse.json({
        success: false,
        message: "Error fetching settings: " + error.message,
        settings: [],
      })
    }

    return NextResponse.json({
      success: true,
      settings: data || [],
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({
      success: false,
      message: "An unexpected error occurred",
      settings: [],
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
          message: "Database not available",
        },
        { status: 500 },
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
