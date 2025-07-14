import type { AIService, AIRequest, AIResponse, AIStreamCallback } from "./types"

/**
 * An enhanced mock implementation of the AI service for Whisperdraft
 */
export class EnhancedMockAIService implements AIService {
  private isAvailable = true
  private errorRate = 0.05 // 5% chance of error
  private responseDelay = 800 // 800ms delay
  private streamChunkDelay = 50 // 50ms between stream chunks

  /**
   * Generate a text response from the mock AI
   */
  async generateText(request: AIRequest): Promise<AIResponse> {
    console.log("EnhancedMockAIService: generateText called")

    // Simulate network delay
    await this.delay(this.responseDelay)

    // Randomly generate errors to test error handling
    if (Math.random() < this.errorRate) {
      return {
        success: false,
        data: {
          error: "Mock AI service error",
          code: "mock_error",
          status: 500,
          metadata: {
            timestamp: new Date().toISOString(),
            request: { prompt: request.prompt.substring(0, 100) + "..." },
          },
        },
      }
    }

    // Generate a mock response based on the prompt
    const response = this.generateMockResponse(request.prompt, request.systemPrompt || "")

    return {
      success: true,
      data: {
        text: response,
        usage: {
          promptTokens: request.prompt.length,
          completionTokens: response.length,
          totalTokens: request.prompt.length + response.length,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          model: "whisperdraft-mock-ai",
        },
      },
    }
  }

  /**
   * Stream a text response from the mock AI
   */
  async streamText(request: AIRequest, callback: AIStreamCallback): Promise<void> {
    console.log("EnhancedMockAIService: streamText called")

    // Simulate initial delay
    await this.delay(this.responseDelay)

    // Randomly generate errors to test error handling
    if (Math.random() < this.errorRate) {
      throw new Error("Mock AI streaming error")
    }

    // Generate a mock response
    const response = this.generateMockResponse(request.prompt, request.systemPrompt || "")

    // Split the response into words and stream them with delays
    const words = response.split(" ")

    for (let i = 0; i < words.length; i++) {
      // Simulate network delay between chunks
      await this.delay(this.streamChunkDelay)

      // Determine how many words to send in this chunk (1-3)
      const chunkSize = Math.min(Math.floor(Math.random() * 3) + 1, words.length - i)
      const chunk = words.slice(i, i + chunkSize).join(" ") + " "

      // Call the callback with the chunk
      callback(chunk)

      // Skip ahead
      i += chunkSize - 1
    }
  }

  /**
   * Check if the AI service is available
   */
  async checkAvailability(): Promise<boolean> {
    await this.delay(300)
    return this.isAvailable
  }

  /**
   * Set the availability of the mock AI service
   * Useful for testing error scenarios
   */
  setAvailability(isAvailable: boolean): void {
    this.isAvailable = isAvailable
  }

  /**
   * Helper method to generate a mock response based on the prompt
   */
  private generateMockResponse(prompt: string, systemPrompt: string): string {
    // Extract key information from the prompt to make the response more relevant
    const containsRecentChanges = prompt.includes("Recent changes:")
    const containsCurrentContent = prompt.includes("current content:")

    // Determine the type of content in the prompt
    const hasCode = prompt.includes("```") || prompt.includes("function") || prompt.includes("class")
    const hasList = prompt.includes("- ") || prompt.includes("1. ")
    const hasQuestion = prompt.includes("?")

    // Generate different responses based on the content
    if (containsRecentChanges && !containsCurrentContent) {
      return "I notice you've made some changes to your document. Would you like me to help you refine these changes or provide feedback on specific aspects of your writing?"
    }

    if (hasCode) {
      return "I see you're working with code. Your syntax looks good. Consider adding comments to explain the more complex parts of your implementation. This will make it easier for others (or future you) to understand your thought process."
    }

    if (hasList) {
      return "Your list is developing nicely. Consider grouping related items together or adding a brief introduction to provide context for why these items are important."
    }

    if (hasQuestion) {
      return "That's an interesting question you're exploring. Perhaps consider approaching it from multiple perspectives to gain a more nuanced understanding. What counterarguments might someone raise to your current thinking?"
    }

    // Default thoughtful response
    return "I notice your writing is evolving thoughtfully. The way you're developing your ideas shows careful consideration. Perhaps consider exploring the connection between your second and third points more explicitly - there seems to be an interesting relationship there that could add depth to your overall narrative."
  }

  /**
   * Helper method to simulate delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

