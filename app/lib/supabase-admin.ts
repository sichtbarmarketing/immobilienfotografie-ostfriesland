import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Check if we're in a server context
const isServer = typeof window === "undefined"

// Only create the admin client on the server
export const supabaseAdmin = isServer
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// Helper function to check if admin client is available
export function getAdminClient() {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is only available on the server")
  }
  return supabaseAdmin
}
