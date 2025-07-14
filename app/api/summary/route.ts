import { NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not defined")
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    // Explicitly create the OpenAI provider with the API key
    const openaiProvider = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Parse request body
    let content
    try {
      const body = await request.json()
      content = body.content
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ text: "" })
    }

    try {
      const { text } = await generateText({
        model: openaiProvider("gpt-3.5-turbo"), // Using gpt-3.5-turbo for wider availability
        prompt: `Summarize the following text in 2-3 sentences:\n\n${content}`,
        system: "You are a helpful assistant that summarizes text concisely and accurately.",
      })

      return NextResponse.json({ text })
    } catch (error: any) {
      console.error("Error generating summary:", error)
      throw error // Re-throw to be caught by outer try/catch
    }
  } catch (error: any) {
    console.error("Error generating summary:", {
      message: error.message,
      status: error.status,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ error: error.message || "Unable to generate summary" }, { status: 500 })
  }
}

