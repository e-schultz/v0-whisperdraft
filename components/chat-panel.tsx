"use client"

import { useEffect } from "react"
import { useChatStore } from "@/lib/stores/chat-store"
import { ChatMessages } from "./chat/chat-messages"
import { Panel } from "./common/panel"
import { ErrorBoundary } from "./common/error-boundary"
import { ErrorMessage } from "./common/error-message"
import { ErrorType } from "@/lib/error/error-logger"

export default function ChatPanel() {
  const { messages, isLoading, addMessage, error, setError } = useChatStore()

  // Debug log when messages change
  useEffect(() => {
    console.log("ChatPanel rendered with messages:", messages)
  }, [messages])

  const handleAddTestMessage = () => {
    console.log("Adding test message from header")
    addMessage({
      role: "assistant",
      content: "This is a test message added from the chat header.",
      timestamp: Date.now(),
    })
  }

  // Create header actions
  const headerActions = (
    <button
      onClick={handleAddTestMessage}
      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 
              text-gray-700 dark:text-gray-300 rounded shadow-sm transition-colors"
      aria-label="Add test message"
    >
      Test
    </button>
  )

  // Handle dismissing errors
  const handleDismissError = () => {
    setError(null)
  }

  // Fallback content for empty or error states
  const getEmptyStateFallback = () => {
    if (error) {
      return <ErrorMessage type={ErrorType.AI_SERVICE} message={error} onDismiss={handleDismissError} className="m-4" />
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400 dark:text-gray-600 mb-4"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <p className="text-gray-500 dark:text-gray-400">
          Start writing in the note panel. I'll respond to your changes here.
        </p>
      </div>
    )
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md m-4">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Chat Panel Error</h3>
          <p className="text-sm text-red-700 dark:text-red-400">
            There was a problem loading the chat panel. Try refreshing the page.
          </p>
        </div>
      }
    >
      <div className="flex flex-col h-full w-full overflow-hidden">
        <Panel title="Chat" headerActions={headerActions} contentClassName="overflow-hidden">
          {messages.length === 0 && !isLoading ? (
            getEmptyStateFallback()
          ) : (
            <ErrorBoundary
              fallback={
                <div className="p-4 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Chat Messages Error</h3>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    There was a problem displaying the chat messages.
                  </p>
                </div>
              }
            >
              <div className="w-full h-full overflow-hidden">
                <ChatMessages messages={messages} isLoading={isLoading} />
              </div>
            </ErrorBoundary>
          )}
        </Panel>
      </div>
    </ErrorBoundary>
  )
}

