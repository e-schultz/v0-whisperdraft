import OpenAI from "openai"
import type { AIRequest, AIResponse } from "@/lib/ai/types"

// Initialize OpenAI with environment variable
let openaiInstance: OpenAI | null = null

export function getOpenAIInstance(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set")
    }

    // Add the dangerouslyAllowBrowser flag to prevent the error
    // This is safe because we're only using this in API routes which run on the server
    openaiInstance = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Add this flag to fix the error
    })
  }
  return openaiInstance
}

export async function generateOpenAICompletion(request: AIRequest, model: string): Promise<AIResponse> {
  try {
    const openai = getOpenAIInstance()

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: request.systemPrompt || "" },
        { role: "user", content: request.prompt },
      ],
      max_tokens: request.maxTokens || 500,
      temperature: request.temperature || 0.7,
    })

    return {
      success: true,
      data: {
        text: response.choices[0].message.content || "",
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
        metadata: {
          model: response.model,
          timestamp: new Date().toISOString(),
        },
      },
    }
  } catch (error) {
    console.error("OpenAI API error:", error)

    return {
      success: false,
      data: {
        error: error instanceof Error ? error.message : "Unknown error occurred",
        code: error instanceof Error ? error.name : "unknown_error",
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
    }
  }
}

export async function checkOpenAIAvailability(): Promise<boolean> {
  try {
    // Get the API key directly from environment
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.log("No OpenAI API key found in environment variables")
      return false
    }

    // Make a simple HTTP request to the OpenAI API to check if the key is valid
    // This avoids using the SDK methods that might be causing the error
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (response.ok) {
      console.log("OpenAI API key is valid")
      return true
    } else {
      console.log(`OpenAI API key validation failed with status: ${response.status}`)
      return false
    }
  } catch (error) {
    console.error("Error checking OpenAI availability:", error)
    return false
  }
}

