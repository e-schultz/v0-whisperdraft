import { AIServiceFactory } from "./ai-service-factory"
import type { AIRequest } from "./types"
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/constants"
import { ErrorLogger } from "@/lib/error/error-logger"
import { buildDiffPrompt } from "./prompt-builder"
import type { Diff } from "@/lib/stores/note-store"
import { AIServiceError } from "./errors"

/**
 * Client for interacting with the AI service
 * Provides a simplified interface for the application
 */
export const AIClient = {
  /**
   * Generate a text response from the AI
   */
  async generateResponse(prompt: string, systemPrompt: string = DEFAULT_SYSTEM_PROMPT): Promise<string> {
    console.log("AIClient: generateResponse called with prompt length:", prompt.length)

    try {
      // Check if we have an API key
      const hasApiKey = await AIServiceFactory.hasApiKey()
      if (!hasApiKey) {
        throw new AIServiceError("OpenAI API key is required. Please add it in the settings.", "missing_api_key")
      }

      const service = AIServiceFactory.getService()

      const request: AIRequest = {
        prompt,
        systemPrompt,
        maxTokens: 500,
        temperature: 0.7,
      }

      const response = await service.generateText(request)

      if (response.success) {
        console.log("AIClient: Response generated successfully, length:", response.data.text.length)
        return response.data.text
      } else {
        const error = new AIServiceError(response.data.error, response.data.code, undefined, response.data.metadata)

        ErrorLogger.logAIServiceError(
          `Error generating AI response: ${response.data.error}`,
          "generateResponse",
          error,
          { promptLength: prompt.length },
        )

        throw error
      }
    } catch (error) {
      // If it's already an AIServiceError, just rethrow it
      if (error instanceof AIServiceError) {
        throw error
      }

      // Otherwise, wrap it in an AIServiceError
      const aiError = new AIServiceError(
        "Unexpected error generating AI response",
        "unexpected_error",
        error instanceof Error ? error : undefined,
      )

      ErrorLogger.logAIServiceError("Unexpected error generating AI response", "generateResponse", aiError, {
        promptLength: prompt.length,
      })

      throw aiError
    }
  },

  /**
   * Generate a response based on diffs
   */
  async generateDiffResponse(
    diffs: Diff[],
    currentContent: string,
    systemPrompt: string = DEFAULT_SYSTEM_PROMPT,
  ): Promise<string> {
    if (diffs.length === 0) return ""

    try {
      // Build a prompt from the diffs
      const prompt = buildDiffPrompt(diffs, currentContent, systemPrompt)

      // Generate a response using the built prompt
      return await this.generateResponse(prompt, systemPrompt)
    } catch (error) {
      ErrorLogger.logAIServiceError(
        "Error generating diff response",
        "generateDiffResponse",
        error instanceof Error ? error : new Error(String(error)),
        {
          diffsCount: diffs.length,
          contentLength: currentContent.length,
        },
      )

      throw error
    }
  },

  /**
   * Generate a summary of the provided content
   */
  async generateSummary(content: string): Promise<string> {
    if (!content.trim()) return ""

    try {
      const prompt = `Summarize the following text in 2-3 sentences:

${content}`
      const systemPrompt = "You are a helpful assistant that summarizes text concisely and accurately."

      return await this.generateResponse(prompt, systemPrompt)
    } catch (error) {
      ErrorLogger.logAIServiceError(
        "Error generating summary",
        "generateSummary",
        error instanceof Error ? error : new Error(String(error)),
        { contentLength: content.length },
      )

      return "Unable to generate summary"
    }
  },

  // Add debugging to the isAvailable method to see what's happening

  async isAvailable(): Promise<boolean> {
    try {
      console.log("AIClient: Checking if AI service is available")

      // Check if we have an API key
      const hasApiKey = await AIServiceFactory.hasApiKey()
      console.log("AIClient: Has API key:", hasApiKey)

      if (!hasApiKey) {
        console.log("AIClient: No API key available")
        return false
      }

      const service = AIServiceFactory.getService()
      console.log("AIClient: Got service, checking availability")

      const available = await service.checkAvailability()
      console.log("AIClient: Service availability:", available)

      return available
    } catch (error) {
      console.error("AIClient: Error checking AI service availability:", error)

      ErrorLogger.logAIServiceError(
        "Error checking AI service availability",
        "isAvailable",
        error instanceof Error ? error : new Error(String(error)),
      )

      return false
    }
  },

  /**
   * Retry a failed AI request with exponential backoff
   */
  async retryWithBackoff<T>(operation: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
    let retries = 0
    let delay = initialDelay

    while (true) {
      try {
        return await operation()
      } catch (error) {
        retries++

        if (retries > maxRetries) {
          ErrorLogger.logAIServiceError(
            `Failed after ${maxRetries} retries`,
            "retryWithBackoff",
            error instanceof Error ? error : new Error(String(error)),
            { maxRetries, initialDelay },
          )

          throw error
        }

        console.log(`AIClient: Retry attempt ${retries}/${maxRetries} after ${delay}ms`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff
      }
    }
  },
}

