import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Initialize Supabase on the server side
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Sign out
    await supabase.auth.signOut()

    // Clear the auth cookie
    cookies().delete("adminAuth")

    return NextResponse.json({ success: true, message: "Abmeldung erfolgreich" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "Fehler bei der Abmeldung" }, { status: 500 })
  }
}
