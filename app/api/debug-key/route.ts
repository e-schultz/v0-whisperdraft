import { NextResponse } from "next/server"

export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY
  const firstThree = hasKey && process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 3) : null
  const lastThree =
    hasKey && process.env.OPENAI_API_KEY
      ? process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 3)
      : null

  return NextResponse.json({
    hasKey,
    keyPreview: hasKey ? `${firstThree}...${lastThree}` : null,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}

