import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    keyFirstChars: process.env.OPENAI_API_KEY
      ? `${process.env.OPENAI_API_KEY.substring(0, 3)}...${process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 3)}`
      : null,
    nodeEnv: process.env.NODE_ENV,
  })
}

