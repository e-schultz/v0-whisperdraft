/**
 * Represents a request to the AI service
 */
export interface AIRequest {
  prompt: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
  options?: Record<string, any>
}

/**
 * Represents a successful response from the AI service
 */
export interface AISuccessResponse {
  text: string
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
  metadata?: Record<string, any>
}

/**
 * Represents an error response from the AI service
 */
export interface AIErrorResponse {
  error: string
  code?: string
  status?: number
  metadata?: Record<string, any>
}

/**
 * Represents a response from the AI service (either success or error)
 */
export type AIResponse = { success: true; data: AISuccessResponse } | { success: false; data: AIErrorResponse }

/**
 * Callback for streaming responses
 */
export type AIStreamCallback = (chunk: string) => void

/**
 * AI service interface
 */
export interface AIService {
  /**
   * Generate a text response from the AI
   */
  generateText(request: AIRequest): Promise<AIResponse>

  /**
   * Stream a text response from the AI
   */
  streamText?(request: AIRequest, callback: AIStreamCallback): Promise<void>

  /**
   * Check if the AI service is available
   */
  checkAvailability(): Promise<boolean>
}

