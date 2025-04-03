"use client"
import { useNoteStore } from "@/lib/stores/note-store"
import { useChatStore } from "@/lib/stores/chat-store"
import { DebugPanel as CommonDebugPanel } from "./common/debug-panel"

export function DebugPanel() {
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

  const debugIcon = (
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
  )

  return (
    <CommonDebugPanel title="Debug Panel" icon={debugIcon} position="left">
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
    </CommonDebugPanel>
  )
}

