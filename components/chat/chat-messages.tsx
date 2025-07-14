"use client"
import { useEffect, useRef } from "react"
import type { ChatMessage } from "@/lib/stores/chat-store"

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Debug log when messages change
  useEffect(() => {
    console.log("ChatMessages rendered with messages:", messages)
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && !isLoading && (
        <div className="text-gray-500 dark:text-gray-400 italic">
          Start writing in the note panel. I&apos;ll respond to your changes here.
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-3 rounded-lg ${
            message.role === "assistant"
              ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          }`}
        >
          {message.content}
        </div>
      ))}

      {isLoading && (
        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
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
  )
}

