import { NextResponse } from "next/server"

export async function GET() {
  try {
    const hasApiKey = !!process.env.OPENAI_API_KEY

    return NextResponse.json({
      available: hasApiKey,
      provider: "openai",
      serverTime: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in AI info route:", error)

    return NextResponse.json({ error: "An unexpected error occurred", available: false }, { status: 500 })
  }
}

