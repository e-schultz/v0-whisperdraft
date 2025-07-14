import { type NextRequest, NextResponse } from "next/server"
import { generateOpenAICompletion } from "@/lib/server/openai-server"
import type { AIRequest } from "@/lib/ai/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, systemPrompt, maxTokens, temperature, model = "gpt-4o" } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const aiRequest: AIRequest = {
      prompt,
      systemPrompt,
      maxTokens,
      temperature,
    }

    const response = await generateOpenAICompletion(aiRequest, model)

    if (response.success) {
      return NextResponse.json(response.data)
    } else {
      return NextResponse.json({ error: response.data.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in generate route:", error)

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

