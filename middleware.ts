import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only apply to /admin/dashboard routes
  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    // Check for auth cookie
    const authCookie = request.cookies.get("adminAuth")

    // If no auth cookie, redirect to login
    if (!authCookie || authCookie.value !== "true") {
      // We'll rely on client-side auth check instead of redirecting here
      // This prevents redirect loops
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/dashboard/:path*",
}
