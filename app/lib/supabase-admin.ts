import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key for admin operations
// This bypasses RLS policies for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

if (!supabaseServiceKey) {
  console.warn("Missing SUPABASE_SERVICE_ROLE_KEY - admin operations may fail")
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
