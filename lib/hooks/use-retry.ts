"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { ErrorLogger, ErrorType } from "@/lib/error/error-logger"

interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  backoffFactor?: number
  onRetry?: (attempt: number, error: Error) => void
  errorType?: ErrorType
  component?: string
  action?: string
}

interface RetryState {
  isLoading: boolean
  error: Error | null
  attempt: number
}

export function useRetry<T>(
  asyncFn: () => Promise<T>,
  options: RetryOptions = {},
): [() => Promise<T | null>, RetryState, () => void] {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    backoffFactor = 2,
    onRetry,
    errorType = ErrorType.UNKNOWN,
    component = "unknown",
    action = "unknown",
  } = options

  const [state, setState] = useState<RetryState>({
    isLoading: false,
    error: null,
    attempt: 0,
  })

  // Use a ref to track if the component is mounted
  const isMountedRef = useRef(true)

  // Store the asyncFn in a ref to avoid dependency changes
  const asyncFnRef = useRef(asyncFn)
  asyncFnRef.current = asyncFn

  useEffect(() => {
    // Set up cleanup to prevent state updates after unmount
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const reset = useCallback(() => {
    if (isMountedRef.current) {
      setState({
        isLoading: false,
        error: null,
        attempt: 0,
      })
    }
  }, [])

  const execute = useCallback(async (): Promise<T | null> => {
    if (!isMountedRef.current) return null

    setState((prev) => ({
      ...prev,
      isLoading: true,
    }))

    let attempt = 0
    let delay = initialDelay

    while (attempt <= maxRetries) {
      try {
        const result = await asyncFnRef.current()

        if (isMountedRef.current) {
          setState({
            isLoading: false,
            error: null,
            attempt,
          })
        }

        return result
      } catch (error) {
        attempt++

        // Log the error
        ErrorLogger.logError({
          type: errorType,
          severity: attempt >= maxRetries ? "ERROR" : "WARNING",
          message: `Operation failed (attempt ${attempt}/${maxRetries})`,
          originalError: error instanceof Error ? error : new Error(String(error)),
          context: {
            component,
            action,
            timestamp: Date.now(),
            additionalData: { attempt, maxRetries },
          },
        })

        if (attempt <= maxRetries) {
          // If we have retries left, wait and try again
          if (onRetry && isMountedRef.current) {
            onRetry(attempt, error instanceof Error ? error : new Error(String(error)))
          }

          await new Promise((resolve) => setTimeout(resolve, delay))
          delay *= backoffFactor // Exponential backoff
        } else {
          // We've exhausted our retries
          if (isMountedRef.current) {
            setState({
              isLoading: false,
              error: error instanceof Error ? error : new Error(String(error)),
              attempt: attempt - 1,
            })
          }
          return null
        }
      }
    }

    return null
  }, [maxRetries, initialDelay, backoffFactor, onRetry, errorType, component, action])

  return [execute, state, reset]
}

