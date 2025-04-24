import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Initialize Supabase on the server side
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get the session from the request
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Session check error:", error)
      return NextResponse.json({ authenticated: false, error: error.message })
    }

    return NextResponse.json({
      authenticated: !!data.session,
      user: data.session?.user
        ? {
            id: data.session.user.id,
            email: data.session.user.email,
          }
        : null,
    })
  } catch (error) {
    console.error("Unexpected server error:", error)
    return NextResponse.json({ authenticated: false, error: "Server error" })
  }
}
