"use client"

import { useEffect, useRef, useState } from "react"
import { useNoteStore } from "@/lib/stores/note-store"
import { useChatStore } from "@/lib/stores/chat-store"
import { EditorContainer } from "./editor/editor-container"
import { EditorHeader } from "./editor/editor-header"
import { EditorContent } from "./editor/editor-content"

export default function NoteEditor() {
  const { current, setContent, saveNote } = useNoteStore()
  const { processNewDiff } = useChatStore()
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)

  // Set up auto-save timer
  useEffect(() => {
    console.log("Setting up auto-save timer")

    // Clear any existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    // Set up new timer
    autoSaveTimerRef.current = setInterval(async () => {
      console.log("Auto-save timer triggered")
      try {
        const diff = await saveNote()
        console.log("Auto-save result:", diff)

        if (diff) {
          console.log("Processing diff from auto-save")
          await processNewDiff(diff, current)
          setLastSaveTime(new Date())

          // Log to console that this would update the changelog
          console.log("CHANGELOG: Updated - Fixed auto-save functionality to properly trigger diff generation")
        } else {
          console.log("No diff generated from auto-save")
        }
      } catch (error) {
        console.error("Error during auto-save:", error)
      }
    }, 30000) // 30 seconds

    return () => {
      console.log("Cleaning up auto-save timer")
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [saveNote, processNewDiff, current])

  const handleChange = (content: string) => {
    setContent(content)
  }

  const handleManualSave = async () => {
    console.log("Manual save triggered")
    try {
      const diff = await saveNote()
      console.log("Manual save result:", diff)

      if (diff) {
        console.log("Processing diff from manual save")
        await processNewDiff(diff, current)
        setLastSaveTime(new Date())

        // Log to console that this would update the changelog
        console.log("CHANGELOG: Updated - Fixed manual save functionality to properly trigger diff generation")
      } else {
        console.log("No diff generated from manual save")
      }
    } catch (error) {
      console.error("Error during manual save:", error)
    }
  }

  return (
    <EditorContainer>
      <EditorHeader onSave={handleManualSave} />
      <EditorContent content={current} onChange={handleChange} />
      {lastSaveTime && (
        <div className="text-xs text-gray-500 dark:text-gray-400 p-2 text-right">
          Last saved: {lastSaveTime.toLocaleTimeString()}
        </div>
      )}
    </EditorContainer>
  )
}

