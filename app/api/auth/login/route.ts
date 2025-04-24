import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Initialize Supabase on the server side
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Server-side auth error:", error)
      return NextResponse.json(
        { success: false, message: "Anmeldung fehlgeschlagen", error: error.message },
        { status: 401 },
      )
    }

    if (!data.user) {
      return NextResponse.json({ success: false, message: "Benutzer nicht gefunden" }, { status: 404 })
    }

    // Set a cookie for authentication
    cookies().set("adminAuth", "true", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    // Return success with user data
    return NextResponse.json({
      success: true,
      message: "Anmeldung erfolgreich",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    })
  } catch (error) {
    console.error("Unexpected server error:", error)
    return NextResponse.json({ success: false, message: "Ein unerwarteter Fehler ist aufgetreten" }, { status: 500 })
  }
}
