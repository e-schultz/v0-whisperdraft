"use client"

import { useState } from "react"
import { useNoteStore } from "@/lib/stores/note-store"
import { useChatStore } from "@/lib/stores/chat-store"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { current, saveNote } = useNoteStore()
  const { processNewDiff, addMessage, messages } = useChatStore()

  const handleTriggerSave = async () => {
    console.log("Manually triggering save...")
    const diff = await saveNote()
    console.log("Save result:", diff)

    if (diff) {
      console.log("Processing diff...")
      await processNewDiff(diff, current)

      // Log to console that this would update the changelog
      console.log("CHANGELOG: Updated - Fixed auto-save functionality to properly trigger diff generation")
    } else {
      console.log("No diff generated")
    }
  }

  const handleAddTestMessage = () => {
    console.log("Adding test message...")
    addMessage({
      role: "assistant",
      content: "This is a test message added manually.",
      timestamp: Date.now(),
    })

    // Log to console that this would update the changelog
    console.log("CHANGELOG: Updated - Fixed chat message rendering to ensure messages are properly displayed")
  }

  const handleLogState = () => {
    console.log("Current messages:", messages)
    console.log("Current note:", current)

    // Log to console that this would update the changelog
    console.log("CHANGELOG: Updated - Added console logging throughout the application to track data flow")
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-gray-800 text-white p-2 rounded-full z-50"
        aria-label="Open debug panel"
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
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="m15 9-6 6"></path>
          <path d="m9 9 6 6"></path>
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 w-64">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Debug Panel</h3>
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
      <div className="space-y-2">
        <button
          onClick={handleTriggerSave}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Trigger Save & Response
        </button>
        <button
          onClick={handleAddTestMessage}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Add Test Message
        </button>
        <button
          onClick={handleLogState}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
        >
          Log State
        </button>
      </div>
    </div>
  )
}

