import { NextResponse } from "next/server"
import { list } from "@vercel/blob"

export async function GET(request: Request) {
  try {
    // Get the category from the query string
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // List all blobs with the prefix "images/"
    const blobs = await list({ prefix: "images/" })

    // Filter by category if provided
    let filteredBlobs = blobs.blobs
    if (category) {
      filteredBlobs = filteredBlobs.filter((blob) => blob.pathname.includes(`${category}-`))
    }

    // Map to a more usable format
    const images = filteredBlobs.map((blob) => {
      // Extract category from pathname (e.g., "images/hero-1234567890.jpg" -> "hero")
      const pathParts = blob.pathname.split("/")
      const filenameParts = pathParts[pathParts.length - 1].split("-")
      const extractedCategory = filenameParts[0]

      return {
        id: blob.pathname,
        url: blob.url,
        filename: blob.pathname.split("/").pop(),
        category: extractedCategory,
        title: blob.pathname.split("/").pop() || "Untitled",
        alt_text: blob.pathname.split("/").pop() || "Image",
        created_at: blob.uploadedAt,
        display_order: 999,
      }
    })

    return NextResponse.json({
      success: true,
      images: images,
    })
  } catch (error) {
    console.error("Error listing images:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Fehler beim Abrufen der Bilder: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}
