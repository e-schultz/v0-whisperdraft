import type { AIService, AIRequest, AIResponse, AIStreamCallback } from "./types"

/**
 * A mock implementation of the AI service for development and testing
 */
export class MockAIService implements AIService {
  private isAvailable = true
  private errorRate = 0.1 // 10% chance of error
  private responseDelay = 1000 // 1 second delay

  /**
   * Generate a text response from the mock AI
   */
  async generateText(request: AIRequest): Promise<AIResponse> {
    console.log("MockAIService: generateText called with:", request)

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
            request: { prompt: request.prompt },
          },
        },
      }
    }

    // Generate a mock response based on the prompt
    const response = this.generateMockResponse(request.prompt)

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
          model: "mock-ai-model",
        },
      },
    }
  }

  /**
   * Stream a text response from the mock AI
   */
  async streamText(request: AIRequest, callback: AIStreamCallback): Promise<void> {
    console.log("MockAIService: streamText called with:", request)

    // Generate a mock response
    const response = this.generateMockResponse(request.prompt)

    // Split the response into chunks and stream them with delays
    const chunks = response.split(" ")

    for (const chunk of chunks) {
      // Simulate network delay between chunks
      await this.delay(100)

      // Call the callback with the chunk
      callback(chunk + " ")
    }
  }

  /**
   * Check if the AI service is available
   */
  async checkAvailability(): Promise<boolean> {
    await this.delay(500)
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
   * Set the error rate of the mock AI service
   * @param rate A number between 0 and 1 representing the probability of an error
   */
  setErrorRate(rate: number): void {
    this.errorRate = Math.max(0, Math.min(1, rate))
  }

  /**
   * Set the response delay of the mock AI service
   * @param delay Delay in milliseconds
   */
  setResponseDelay(delay: number): void {
    this.responseDelay = delay
  }

  /**
   * Helper method to generate a mock response based on the prompt
   */
  private generateMockResponse(prompt: string): string {
    // Simple logic to generate different responses based on the prompt content
    if (prompt.toLowerCase().includes("hello")) {
      return "Hello! I'm a mock AI assistant. I'm here to help you with your writing."
    }

    if (prompt.toLowerCase().includes("help")) {
      return "I notice you're asking for help. As a mock AI assistant, I can provide guidance on various topics. What specifically would you like help with?"
    }

    if (prompt.toLowerCase().includes("summary")) {
      return "Here's a summary of your content: This is a mock summary that would normally be generated by analyzing your text. It highlights the key points and main ideas from your writing."
    }

    // Default response for any other prompt
    return "I've noticed your recent changes. Your writing is developing nicely. Consider exploring your ideas further and adding more specific details to strengthen your points. Remember, the first draft is about getting your thoughts down - you can refine them later."
  }

  /**
   * Helper method to simulate delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

