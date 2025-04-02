"use client"

import { useChatStore } from "@/lib/stores/chat-store"

interface ChatHeaderProps {
  title?: string
}

export function ChatHeader({ title = "Chat" }: ChatHeaderProps) {
  const { addMessage } = useChatStore()

  const handleAddTestMessage = () => {
    console.log("Adding test message from header")
    addMessage({
      role: "assistant",
      content: "This is a test message added from the chat header.",
      timestamp: Date.now(),
    })
  }

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h1>
      <button
        onClick={handleAddTestMessage}
        className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300"
        aria-label="Add test message"
      >
        Test
      </button>
    </div>
  )
}

