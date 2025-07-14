import { NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export async function GET() {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not defined")
      return NextResponse.json(
        {
          success: false,
          error: "OPENAI_API_KEY is not defined in environment variables",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Explicitly create the OpenAI provider with the API key
    const openaiProvider = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Test the AI SDK with a simple prompt
    const { text } = await generateText({
      model: openaiProvider("gpt-3.5-turbo"), // Using gpt-3.5-turbo for wider availability
      prompt: "List 3 available AI models you can use",
      system: "You are a helpful assistant. Keep your response brief.",
    })

    return NextResponse.json({
      success: true,
      message: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Error testing AI SDK:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        status: error.status,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

