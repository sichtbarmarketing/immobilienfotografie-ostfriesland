import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // This is a more robust middleware to protect the admin dashboard
  // using NextAuth.js

  // Only apply to /admin/dashboard routes
  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/dashboard/:path*",
}
