"use client"

import { useState, useEffect, useCallback } from "react"
import { AIClient } from "@/lib/ai/ai-client"
import { DebugPanel } from "../common/debug-panel"
import { ErrorMessage } from "../common/error-message"
import { ErrorType } from "@/lib/error/error-logger"
import { useRetry } from "@/lib/hooks/use-retry"
import { lazy } from "react"
import { useSettingsStore } from "@/lib/stores/settings-store"

// Lazy load the AIServiceFactory to avoid circular dependencies
const AIServiceFactoryLoader = lazy(() =>
  import("@/lib/ai/ai-service-factory").then((mod) => ({
    default: () => mod.AIServiceFactory,
  })),
)

export function AIDebug() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [testResponse, setTestResponse] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("Hello, I'm writing a document about creativity.")
  const [error, setError] = useState<string | null>(null)
  const [shouldCheckAvailability, setShouldCheckAvailability] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)

  // Define the check availability function
  const checkAvailability = useCallback(async () => {
    const available = await AIClient.isAvailable()
    setIsAvailable(available)
    return available
  }, [])

  // Use the retry hook for checking availability
  const [checkAvailabilityFn, availabilityState, resetAvailability] = useRetry(checkAvailability, {
    maxRetries: 2,
    initialDelay: 1000,
    errorType: ErrorType.AI_SERVICE,
    component: "AIDebug",
    action: "checkAvailability",
  })

  // Check if we have a valid API key whenever settings change
  useEffect(() => {
    const validateApiKey = async () => {
      try {
        const { AIServiceFactory } = await import("@/lib/ai/ai-service-factory")
        const hasKey = AIServiceFactory.hasApiKey()
        setHasApiKey(hasKey)

        if (hasKey) {
          // If we have a key, check availability
          checkAvailabilityFn()
        }
      } catch (error) {
        console.error("Error checking API key:", error)
        setHasApiKey(false)
      }
    }

    validateApiKey()
  }, [useSettingsStore.getState().openaiApiKey, checkAvailabilityFn]) // Re-run when API key changes

  // Define the test AI function
  const testAI = useCallback(async () => {
    const response = await AIClient.generateResponse(prompt)
    setTestResponse(response)
    return response
  }, [prompt])

  // Use the retry hook for testing AI
  const [testAIFn, testAIState, resetTestAI] = useRetry(testAI, {
    maxRetries: 2,
    initialDelay: 1000,
    errorType: ErrorType.AI_SERVICE,
    component: "AIDebug",
    action: "testAI",
  })

  // Check availability on first render
  useEffect(() => {
    if (isAvailable === null && !availabilityState.isLoading && shouldCheckAvailability) {
      checkAvailabilityFn()
      setShouldCheckAvailability(false)
    }
  }, [isAvailable, availabilityState.isLoading, checkAvailabilityFn, shouldCheckAvailability])

  // Initialize the check on mount
  useEffect(() => {
    setShouldCheckAvailability(true)
  }, [])

  // Update error state based on retry states
  useEffect(() => {
    if (availabilityState.error) {
      setError(`Error checking availability: ${availabilityState.error.message}`)
    } else if (testAIState.error) {
      setError(`Error testing AI: ${testAIState.error.message}`)
    } else {
      setError(null)
    }
  }, [availabilityState.error, testAIState.error])

  const handleCheckAvailability = () => {
    resetAvailability()
    checkAvailabilityFn()
  }

  const handleTestAI = () => {
    resetTestAI()
    setTestResponse(null)
    testAIFn()
  }

  const aiIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
      <path d="M3 15v4h16a2 2 0 0 0 0-4H3z"></path>
    </svg>
  )

  return (
    <DebugPanel title="AI Debug Panel" icon={aiIcon} position="right" buttonClassName="bg-amber-600">
      {error && (
        <ErrorMessage
          type={ErrorType.AI_SERVICE}
          message={error}
          onRetry={availabilityState.error ? handleCheckAvailability : handleTestAI}
          onDismiss={() => setError(null)}
          className="mb-4"
        />
      )}

      <div className="mb-4">
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">AI Service Status:</div>
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
          {availabilityState.isLoading ? (
            <span className="text-gray-500">Checking...</span>
          ) : isAvailable === null ? (
            <span className="text-gray-500">Unknown</span>
          ) : isAvailable ? (
            <span className="text-green-500">Available ✓</span>
          ) : (
            <span className="text-red-500">Unavailable ✗</span>
          )}
          {hasApiKey ? (
            <span className="ml-2 text-green-500">(API Key Set)</span>
          ) : (
            <span className="ml-2 text-red-500">(No API Key)</span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Test Prompt:</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
          rows={3}
        />
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={handleCheckAvailability}
          disabled={availabilityState.isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {availabilityState.isLoading ? "Checking..." : "Check Availability"}
        </button>
        <button
          onClick={handleTestAI}
          disabled={testAIState.isLoading || isAvailable === false || !hasApiKey}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {testAIState.isLoading ? "Testing..." : "Test AI Response"}
        </button>
      </div>

      {testResponse && (
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">AI Response:</h4>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm overflow-auto max-h-32">{testResponse}</div>
        </div>
      )}
    </DebugPanel>
  )
}

