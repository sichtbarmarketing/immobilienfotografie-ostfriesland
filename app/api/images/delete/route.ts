import { NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ success: false, message: "Keine Bild-ID angegeben" }, { status: 400 })
    }

    // Delete the blob
    await del(id)

    // Revalidate paths to update the UI
    revalidatePath("/admin/dashboard")
    revalidatePath("/")

    return NextResponse.json({
      success: true,
      message: "Bild erfolgreich gelöscht",
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Fehler beim Löschen des Bildes: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}
