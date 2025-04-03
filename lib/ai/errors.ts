export class AIServiceError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly cause?: Error,
    public readonly context?: Record<string, any>,
  ) {
    super(message)
    this.name = "AIServiceError"
  }
}

