"use client"
import { ErrorType } from "@/lib/error/error-logger"

interface ErrorMessageProps {
  type?: ErrorType
  message: string
  suggestion?: string
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

// Update the ErrorMessage component to be more compact
export function ErrorMessage({
  type = ErrorType.UNKNOWN,
  message,
  suggestion,
  onRetry,
  onDismiss,
  className = "",
}: ErrorMessageProps) {
  return (
    <div
      className={`py-1 px-2 bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md text-xs flex items-center w-full ${className}`}
    >
      <div className="flex-shrink-0 mr-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-600 dark:text-red-400"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      <div className="flex-1 text-red-700 dark:text-red-400">{message}</div>
      <div className="flex space-x-1 ml-1.5">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-1.5 py-0.5 text-xs bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-700 
                     text-red-800 dark:text-red-200 rounded transition-colors"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-1.5 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
                     text-gray-800 dark:text-gray-200 rounded transition-colors"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  )
}

