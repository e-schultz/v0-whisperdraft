import { NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/constants"

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
    let prompt, systemPrompt
    try {
      const body = await request.json()
      prompt = body.prompt
      systemPrompt = body.systemPrompt
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Validate required fields
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Validate system prompt
    const finalSystemPrompt = systemPrompt && systemPrompt.trim() !== "" ? systemPrompt : DEFAULT_SYSTEM_PROMPT

    console.log("Using system prompt:", finalSystemPrompt.substring(0, 50) + "...")

    try {
      const { text } = await generateText({
        model: openaiProvider("gpt-3.5-turbo"), // Using gpt-3.5-turbo for wider availability
        prompt: prompt,
        system: finalSystemPrompt,
      })

      return NextResponse.json({ text })
    } catch (error: any) {
      console.error("Error generating text:", error)
      throw error // Re-throw to be caught by outer try/catch
    }
  } catch (error: any) {
    console.error("Error calling AI:", {
      message: error.message,
      status: error.status,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { error: error.message || "An error occurred while processing your request" },
      { status: 500 },
    )
  }
}

