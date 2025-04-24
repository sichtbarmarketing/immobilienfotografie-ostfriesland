import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    // Get form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    const title = formData.get("title") as string

    // Validate inputs
    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, message: "Keine Datei ausgewählt" }, { status: 400 })
    }

    if (!category) {
      return NextResponse.json({ success: false, message: "Keine Kategorie ausgewählt" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "Nur Bilddateien sind erlaubt" }, { status: 400 })
    }

    // Get file extension
    const fileExtension = file.name.split(".").pop() || "jpg"

    // Create a filename based on category and timestamp
    const timestamp = Date.now()
    const filename = `${category}-${timestamp}.${fileExtension}`

    // Upload to Vercel Blob
    const blob = await put(`images/${filename}`, file, {
      access: "public",
    })

    // We'll skip the Supabase insert for now since we're having API key issues
    // Instead, we'll just return the successful blob upload information

    console.log("Image uploaded successfully to Vercel Blob:", blob.url)

    return NextResponse.json({
      success: true,
      message: "Bild erfolgreich hochgeladen",
      url: blob.url,
      filename: filename,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Fehler beim Hochladen des Bildes: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}

// Increase the limit for the request body size
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
}
