"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import NoteEditor from "@/components/note-editor"
import ChatPanel from "@/components/chat-panel"
import { PanelContainer } from "@/components/mobile/panel-container"
import { FloatingActionButton } from "@/components/mobile/floating-action-button"
import { DebugPanel } from "@/components/debug-panel"
import { useNoteStore } from "@/lib/stores/note-store"
import { useChatStore } from "@/lib/stores/chat-store"
import { useSettingsStore } from "@/lib/stores/settings-store"

export default function Home() {
  const { initializeNote } = useNoteStore()
  const { initializeChat } = useChatStore()
  const { initializeSettings } = useSettingsStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize stores with data from localStorage
    const init = async () => {
      console.log("Starting app initialization")

      try {
        await initializeNote()
        console.log("Note store initialized")

        await initializeChat()
        console.log("Chat store initialized")

        await initializeSettings()
        console.log("Settings store initialized")

        setIsInitialized(true)
        console.log("App fully initialized")
      } catch (error) {
        console.error("Error during initialization:", error)
      }
    }

    init()
  }, [initializeNote, initializeChat, initializeSettings])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="flex space-x-2 justify-center items-center mb-4">
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse delay-150"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading Whisperdraft...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Header />
      <PanelContainer notePanel={<NoteEditor />} chatPanel={<ChatPanel />} />
      <FloatingActionButton />
      <DebugPanel />
    </div>
  )
}

