"use client"
import { useEffect, useRef, useState } from "react"
import type { ChatMessage } from "@/lib/stores/chat-store"

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showPrompts, setShowPrompts] = useState(false)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-gray-200 dark:border-gray-700/50 flex justify-end">
        <label className="flex items-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={showPrompts}
            onChange={(e) => setShowPrompts(e.target.checked)}
            className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          Show Prompts
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 dark:text-gray-500"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Start writing in the note panel. I'll respond to your changes here.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={`message-${message.id}`}
            className={`rounded-lg ${
              message.role === "assistant"
                ? "bg-gray-100 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 shadow-sm"
                : "bg-amber-50 dark:bg-amber-900/20 text-gray-900 dark:text-gray-100 shadow-sm"
            }`}
          >
            {/* Display the original prompt if showPrompts is true and the prompt exists */}
            {showPrompts && message.originalPrompt && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-900/30 rounded-t-lg">
                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-500 dark:text-gray-400 font-medium">
                    Prompt Sent to API
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-gray-800 dark:text-gray-300 text-xs whitespace-pre-wrap">
                    {message.originalPrompt}
                  </pre>
                </details>
              </div>
            )}

            <div className="p-4">
              <div className="text-base leading-relaxed whitespace-pre-line">{message.content}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 shadow-sm">
            <div className="flex space-x-2 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        )}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

