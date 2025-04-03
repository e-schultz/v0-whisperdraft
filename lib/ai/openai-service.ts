import type { AIService, AIRequest, AIResponse, AIStreamCallback } from "./types"
import { ErrorLogger } from "@/lib/error/error-logger"

/**
 * Implementation of the AI service using OpenAI
 */
export class OpenAIService implements AIService {
  private _apiKey: string
  private model: string
  private useEnvironmentKey: boolean

  constructor(apiKey: string, model = "gpt-4o") {
    this._apiKey = apiKey
    this.model = model
    // If no API key is provided, we'll use the environment key
    this.useEnvironmentKey = !apiKey
  }

  get apiKey(): string {
    return this._apiKey
  }

  /**
   * Generate a text response from OpenAI
   */
  async generateText(request: AIRequest): Promise<AIResponse> {
    try {
      console.log("OpenAIService: Generating text with model:", this.model)

      // If we're using the environment key, we need to make a server request
      if (this.useEnvironmentKey) {
        return await this.generateTextWithServerAction(request)
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
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
      ErrorLogger.logAIServiceError(
        "Error calling OpenAI API",
        "generateText",
        error instanceof Error ? error : new Error(String(error)),
      )

      return {
        success: false,
        data: {
          error: "Failed to communicate with OpenAI API",
          code: "network_error",
          metadata: {
            timestamp: new Date().toISOString(),
          },
        },
      }
    }
  }

  /**
   * Generate text using a server action to keep the API key secure
   */
  private async generateTextWithServerAction(request: AIRequest): Promise<AIResponse> {
    try {
      // Create a server action to make the OpenAI API call
      const { generateOpenAIResponse } = await import("@/lib/actions/openai-actions")

      return await generateOpenAIResponse(request, this.model)
    } catch (error) {
      ErrorLogger.logAIServiceError(
        "Error calling OpenAI API via server action",
        "generateTextWithServerAction",
        error instanceof Error ? error : new Error(String(error)),
      )

      return {
        success: false,
        data: {
          error: "Failed to communicate with OpenAI API via server",
          code: "server_action_error",
          metadata: {
            timestamp: new Date().toISOString(),
          },
        },
      }
    }
  }

  /**
   * Stream a text response from OpenAI
   */
  async streamText(request: AIRequest, callback: AIStreamCallback): Promise<void> {
    try {
      console.log("OpenAIService: Streaming text with model:", this.model)

      // If we're using the environment key, we need to make a server request
      if (this.useEnvironmentKey) {
        // For now, we'll fall back to non-streaming for server-side API key
        const response = await this.generateTextWithServerAction(request)
        if (response.success) {
          callback(response.data.text)
        } else {
          throw new Error(response.data.error)
        }
        return
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: request.systemPrompt || "" },
            { role: "user", content: request.prompt },
          ],
          max_tokens: request.maxTokens || 500,
          temperature: request.temperature || 0.7,
          stream: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "OpenAI API error")
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("Failed to get response reader")
      }

      const decoder = new TextDecoder("utf-8")
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process the buffer to extract chunks
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.substring(6))
              const content = data.choices[0]?.delta?.content
              if (content) {
                callback(content)
              }
            } catch (e) {
              console.error("Error parsing streaming response:", e)
            }
          }
        }
      }
    } catch (error) {
      ErrorLogger.logAIServiceError(
        "Error streaming from OpenAI API",
        "streamText",
        error instanceof Error ? error : new Error(String(error)),
      )

      throw error
    }
  }

  /**
   * Check if the OpenAI service is available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      console.log("OpenAIService: Checking availability with API key:", this._apiKey ? "Key exists" : "No key")

      // If we're using the environment key, check via server action
      if (this.useEnvironmentKey) {
        const { checkOpenAIAvailability } = await import("@/lib/actions/openai-actions")
        return await checkOpenAIAvailability()
      }

      // Make a simple request to validate the API key
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      console.log("OpenAIService: API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("OpenAIService: API key validation failed:", errorData)

        ErrorLogger.logAIServiceError(
          `OpenAI API key validation failed: ${errorData.error?.message || response.statusText}`,
          "checkAvailability",
          new Error(errorData.error?.message || response.statusText),
        )
        return false
      }

      console.log("OpenAIService: API key validation successful")
      return true
    } catch (error) {
      console.error("OpenAIService: Error checking availability:", error)

      ErrorLogger.logAIServiceError(
        "Error checking OpenAI API availability",
        "checkAvailability",
        error instanceof Error ? error : new Error(String(error)),
      )

      return false
    }
  }
}

