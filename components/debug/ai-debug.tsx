"use client"

import { useState, useEffect } from "react"

export function AIDebug() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [apiTest, setApiTest] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testMessage, setTestMessage] = useState<string | null>(null)
  const [keyInfo, setKeyInfo] = useState<any>(null)

  const fetchDebugInfo = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch debug info from API
      const response = await fetch("/api/debug")
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      const data = await response.json()
      setDebugInfo(data)
    } catch (err: any) {
      setError(`Error checking environment: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkApiKey = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Check API key info
      const response = await fetch("/api/debug-key")
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      const data = await response.json()
      setKeyInfo(data)
    } catch (err: any) {
      setError(`Error checking API key: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testOpenAI = async () => {
    setIsLoading(true)
    setError(null)
    setApiTest(null)
    try {
      // Test the OpenAI API
      const response = await fetch("/api/test-openai")
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API request failed with status ${response.status}`)
      }
      const data = await response.json()
      setApiTest(data)
    } catch (err: any) {
      setError(`Error testing OpenAI: ${err.message}`)
      setApiTest({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testAIMessage = async () => {
    setIsLoading(true)
    setError(null)
    setTestMessage(null)
    try {
      // Test AI message via API
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "Say hello and confirm you are working correctly.",
          systemPrompt: "You are a helpful assistant. Keep your response brief.",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setTestMessage(data.text)
    } catch (err: any) {
      setError(`Error testing AI message: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchDebugInfo()
      checkApiKey()
    }
  }, [isOpen])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-20 bg-amber-600 text-white p-2 rounded-full z-50"
        aria-label="Open AI debug panel"
      >
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
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 w-80 max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">AI Debug Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-2 rounded mb-4 text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2 mb-4">
        <button
          onClick={fetchDebugInfo}
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Check Environment"}
        </button>
        <button
          onClick={checkApiKey}
          disabled={isLoading}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? "Checking..." : "Check API Key"}
        </button>
        <button
          onClick={testOpenAI}
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? "Testing..." : "Test OpenAI Connection"}
        </button>
        <button
          onClick={testAIMessage}
          disabled={isLoading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? "Testing..." : "Test AI Message"}
        </button>
      </div>

      {keyInfo && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">API Key Info:</h4>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-auto max-h-32">
            <div>Has API Key: {keyInfo.hasKey ? "✅" : "❌"}</div>
            {keyInfo.keyPreview && <div>Key: {keyInfo.keyPreview}</div>}
            <div>Environment: {keyInfo.environment}</div>
            <div>Timestamp: {keyInfo.timestamp}</div>
          </div>
        </div>
      )}

      {debugInfo && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Environment Info:</h4>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-auto max-h-32">
            <div>Has API Key: {debugInfo.hasOpenAIKey ? "✅" : "❌"}</div>
            {debugInfo.keyFirstChars && <div>Key: {debugInfo.keyFirstChars}</div>}
            <div>Node Env: {debugInfo.nodeEnv}</div>
          </div>
        </div>
      )}

      {apiTest && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">API Test Result:</h4>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-auto max-h-32">
            <div>Success: {apiTest.success ? "✅" : "❌"}</div>
            {apiTest.message && (
              <div>
                <div>Response:</div>
                <div className="whitespace-pre-wrap">{apiTest.message}</div>
              </div>
            )}
            {apiTest.error && <div className="text-red-500">Error: {apiTest.error}</div>}
            <div>Timestamp: {apiTest.timestamp}</div>
          </div>
        </div>
      )}

      {testMessage && (
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">AI Message Test:</h4>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm overflow-auto max-h-32">{testMessage}</div>
        </div>
      )}
    </div>
  )
}

