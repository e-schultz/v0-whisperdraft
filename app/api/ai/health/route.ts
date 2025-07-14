import { NextResponse } from "next/server"
import { checkOpenAIAvailability } from "@/lib/server/openai-server"

export async function GET() {
  try {
    const hasApiKey = !!process.env.OPENAI_API_KEY

    if (!hasApiKey) {
      return NextResponse.json(
        {
          available: false,
          error: "No API key configured on server",
          serverTime: new Date().toISOString(),
        },
        { status: 404 },
      )
    }

    const isAvailable = await checkOpenAIAvailability()

    return NextResponse.json({
      available: isAvailable,
      provider: "openai",
      serverTime: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in AI health check route:", error)

    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        available: false,
        serverTime: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

