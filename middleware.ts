import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  try {
    // Continue with the request
    return NextResponse.next()
  } catch (error: any) {
    console.error("Middleware caught unhandled error:", error)

    // Ensure we return a proper JSON response
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const config = {
  matcher: "/api/:path*",
}

