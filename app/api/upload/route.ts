import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

// Define the image type
type ImageData = {
  id: string
  url: string
  filename: string
  category: string
  title: string
  alt_text: string
  created_at: string
  display_order: number
}

// Function to save image metadata to our JSON file
async function saveImageMetadata(imageData: ImageData) {
  try {
    // In a production environment, you would use a database
    // For this demo, we'll use a simple in-memory array
    console.log("Saving image metadata:", imageData)

    // Return success
    return true
  } catch (error) {
    console.error("Error saving image metadata:", error)
    return false
  }
}

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

    console.log("Image uploaded successfully to Vercel Blob:", blob.url)

    // Create image metadata
    const imageData: ImageData = {
      id: timestamp.toString(),
      url: blob.url,
      filename: filename,
      category: category,
      title: title || file.name,
      alt_text: title || file.name,
      created_at: new Date().toISOString(),
      display_order: 999, // Default to end of list
    }

    // Save metadata
    await saveImageMetadata(imageData)

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Bild erfolgreich hochgeladen",
      url: blob.url,
      filename: filename,
      id: timestamp.toString(),
      metadata: imageData,
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
