import type { AIService } from "./types"
import { OpenAIService } from "./openai-service"
import { useSettingsStore } from "@/lib/stores/settings-store"
import { EnhancedMockAIService } from "./enhanced-mock-ai-service"
import { checkEnvironmentApiKey } from "@/lib/actions/api-key-actions"

// Singleton instance of the AI service
let aiServiceInstance: AIService | null = null
let lastUsedApiKey: string | null = null
let hasEnvApiKey: boolean | null = null

/**
 * Factory for creating and accessing the AI service
 */
export const AIServiceFactory = {
  /**
   * Get the AI service instance
   * Creates a new instance if one doesn't exist
   */
  getService(): AIService {
    // Get the user-provided API key and model from settings
    const { openaiApiKey, aiModel } = useSettingsStore.getState()

    // Use user-provided key if available
    const apiKey = openaiApiKey || ""

    console.log("AIServiceFactory: Getting service with API key:", apiKey ? "Key available" : "No key available")

    // If we don't have any API key, use the mock service
    if (!apiKey && !hasEnvApiKey) {
      console.log("AIServiceFactory: No API key found, using mock service")
      return new EnhancedMockAIService()
    }

    // Create a new instance if we don't have one or if the API key has changed
    if (!aiServiceInstance || lastUsedApiKey !== apiKey) {
      console.log(`AIServiceFactory: Creating new OpenAI service with model: ${aiModel}`)
      aiServiceInstance = new OpenAIService(apiKey, aiModel)
      lastUsedApiKey = apiKey
    }

    return aiServiceInstance
  },

  /**
   * Reset the AI service instance
   * Useful when settings change
   */
  resetService(): void {
    console.log("AIServiceFactory: Resetting service instance")
    aiServiceInstance = null
    lastUsedApiKey = null
  },

  /**
   * Check if we have a valid API key (either user-provided or from environment)
   * This is safe to call from client components
   */
  async hasApiKey(): Promise<boolean> {
    const { openaiApiKey } = useSettingsStore.getState()

    // Check user-provided key
    const userKeyValid = !!openaiApiKey && openaiApiKey.startsWith("sk-")

    // Check environment key (if we haven't already)
    if (hasEnvApiKey === null) {
      try {
        hasEnvApiKey = await checkEnvironmentApiKey()
      } catch (error) {
        console.error("Error checking environment API key:", error)
        hasEnvApiKey = false
      }
    }

    const hasKey = userKeyValid || hasEnvApiKey
    console.log("AIServiceFactory: Checking for API key:", hasKey)
    return hasKey
  },

  /**
   * Check if we have an environment API key
   * This is safe to call from client components
   */
  async hasEnvironmentApiKey(): Promise<boolean> {
    if (hasEnvApiKey === null) {
      try {
        hasEnvApiKey = await checkEnvironmentApiKey()
      } catch (error) {
        console.error("Error checking environment API key:", error)
        hasEnvApiKey = false
      }
    }
    return hasEnvApiKey
  },

  /**
   * Set the environment API key status
   * This is used to cache the result of checking for an environment API key
   */
  setEnvironmentApiKeyStatus(status: boolean): void {
    hasEnvApiKey = status
  },
}

