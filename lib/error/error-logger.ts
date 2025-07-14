// Types of errors for better categorization
export enum ErrorType {
  // User-facing errors
  UI = "UI",
  VALIDATION = "VALIDATION",

  // Data-related errors
  STORAGE = "STORAGE",
  NETWORK = "NETWORK",

  // AI-related errors
  AI_SERVICE = "AI_SERVICE",

  // System errors
  INITIALIZATION = "INITIALIZATION",
  UNKNOWN = "UNKNOWN",
}

// Severity levels for errors
export enum ErrorSeverity {
  INFO = "INFO", // Informational, not critical
  WARNING = "WARNING", // Potential issue, but not breaking functionality
  ERROR = "ERROR", // Functionality is impaired
  CRITICAL = "CRITICAL", // Application cannot function properly
}

// Structure for error context
export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  timestamp: number
  additionalData?: Record<string, any>
}

// Structure for error details
export interface ErrorDetails {
  type: ErrorType
  severity: ErrorSeverity
  message: string
  originalError?: Error
  context: ErrorContext
}

// Error logger service
export const ErrorLogger = {
  // Log an error with full details
  logError: (details: ErrorDetails): void => {
    // In production, this would send to a logging service
    console.error(`[${details.severity}][${details.type}] ${details.message}`, {
      context: details.context,
      originalError: details.originalError,
    })

    // Here you would integrate with a service like Sentry, LogRocket, etc.
    // if (process.env.NODE_ENV === 'production') {
    //   sendToLoggingService(details);
    // }
  },

  // Helper method for UI errors
  logUIError: (
    message: string,
    component: string,
    originalError?: Error,
    additionalData?: Record<string, any>,
  ): void => {
    ErrorLogger.logError({
      type: ErrorType.UI,
      severity: ErrorSeverity.ERROR,
      message,
      originalError,
      context: {
        component,
        timestamp: Date.now(),
        additionalData,
      },
    })
  },

  // Helper method for storage errors
  logStorageError: (
    message: string,
    action: string,
    originalError?: Error,
    additionalData?: Record<string, any>,
  ): void => {
    ErrorLogger.logError({
      type: ErrorType.STORAGE,
      severity: ErrorSeverity.ERROR,
      message,
      originalError,
      context: {
        action,
        timestamp: Date.now(),
        additionalData,
      },
    })
  },

  // Helper method for AI service errors
  logAIServiceError: (
    message: string,
    action: string,
    originalError?: Error,
    additionalData?: Record<string, any>,
  ): void => {
    ErrorLogger.logError({
      type: ErrorType.AI_SERVICE,
      severity: ErrorSeverity.ERROR,
      message,
      originalError,
      context: {
        action,
        timestamp: Date.now(),
        additionalData,
      },
    })
  },
}

