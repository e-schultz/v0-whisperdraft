"use server"

import type { AIRequest, AIResponse } from "@/lib/ai/types"
import { getEnvironmentApiKey } from "./api-key-actions"

/**
 * Server action to check if the OpenAI API is available
 * This keeps the API key secure on the server
 */
export async function checkOpenAIAvailability(): Promise<boolean> {
  try {
    const apiKey = await getEnvironmentApiKey()

    if (!apiKey) {
      return false
    }

    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error("Error checking OpenAI availability:", error)
    return false
  }
}

/**
 * Server action to generate a response from OpenAI
 * This keeps the API key secure on the server
 */
export async function generateOpenAIResponse(request: AIRequest, model: string): Promise<AIResponse> {
  try {
    const apiKey = await getEnvironmentApiKey()

    if (!apiKey) {
      return {
        success: false,
        data: {
          error: "No API key available",
          code: "missing_api_key",
          metadata: {
            timestamp: new Date().toISOString(),
          },
        },
      }
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: request.systemPrompt || "" },
          { role: "user", content: request.prompt },
        ],
        max_tokens: request.maxTokens || 500,
        temperature: request.temperature || 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        data: {
          error: errorData.error?.message || "OpenAI API error",
          code: errorData.error?.code || "api_error",
          status: response.status,
          metadata: errorData,
        },
      }
    }

    const data = await response.json()

    return {
      success: true,
      data: {
        text: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        metadata: {
          model: data.model,
          timestamp: new Date().toISOString(),
        },
      },
    }
  } catch (error) {
    return {
      success: false,
      data: {
        error: "Failed to communicate with OpenAI API",
        code: "network_error",
        metadata: {
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        },
      },
    }
  }
}

