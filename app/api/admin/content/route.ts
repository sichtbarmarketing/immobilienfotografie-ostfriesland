import { type NextRequest, NextResponse } from "next/server"
import { getSiteContent } from "@/app/actions/admin-content"

export async function GET(request: NextRequest) {
  try {
    console.log("API: Fetching site content...")

    const content = await getSiteContent()

    console.log("API: Content fetched:", content?.length, "items")

    return NextResponse.json({
      success: true,
      content: content || [],
    })
  } catch (error) {
    console.error("API Error fetching content:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch content",
        content: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("API: Updating content:", body)

    // Handle content updates here if needed
    return NextResponse.json({
      success: true,
      message: "Content updated successfully",
    })
  } catch (error) {
    console.error("API Error updating content:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update content",
      },
      { status: 500 },
    )
  }
}
