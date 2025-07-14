import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  try {
    // Continue with the request
    const response = NextResponse.next()

    // Ensure proper content-type for API responses
    response.headers.set("content-type", "application/json")

    // Add basic security headers
    response.headers.set("X-Content-Type-Options", "nosniff")

    return response
  } catch (error: any) {
    console.error("Middleware caught unhandled error:", error)

    // Ensure we return a proper JSON response
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      },
    )
  }
}

export const config = {
  matcher: "/api/:path*",
}

