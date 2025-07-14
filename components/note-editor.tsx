"use client"

import { useEffect, useRef, useState } from "react"
import { useNoteStore } from "@/lib/stores/note-store"
import { useChatStore } from "@/lib/stores/chat-store"
import { useSettingsStore } from "@/lib/stores/settings-store"
import { EditorContainer } from "./editor/editor-container"
import { EditorHeader } from "./editor/editor-header"
import { EditorContent } from "./editor/editor-content"
import { TipTapEditor } from "./editor/tiptap-editor"
import { EditorToggle } from "./editor/editor-toggle"
import { markdownToHtml, htmlToMarkdown } from "@/lib/editor/html-converter"

export default function NoteEditor() {
  const { current, setContent, saveNote } = useNoteStore()
  const { processNewDiff } = useChatStore()
  const { useExperimentalEditor, setUseExperimentalEditor } = useSettingsStore()
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)

  // For TipTap editor, we need to convert markdown to HTML
  const [htmlContent, setHtmlContent] = useState(() => markdownToHtml(current))

  // Update HTML content when current markdown changes
  useEffect(() => {
    if (!useExperimentalEditor) return
    setHtmlContent(markdownToHtml(current))
  }, [current, useExperimentalEditor])

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

  const handleClassicEditorChange = (content: string) => {
    setContent(content)
  }

  const handleTipTapEditorChange = (html: string) => {
    // Convert HTML to markdown for storage
    const markdown = htmlToMarkdown(html)
    setContent(markdown)
    setHtmlContent(html)
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
      } else {
        console.log("No diff generated from manual save")
      }
    } catch (error) {
      console.error("Error during manual save:", error)
    }
  }

  const handleEditorToggle = (useExperimental: boolean) => {
    setUseExperimentalEditor(useExperimental)
  }

  return (
    <EditorContainer>
      <EditorHeader onSave={handleManualSave} />
      <EditorToggle useExperimentalEditor={useExperimentalEditor} onToggle={handleEditorToggle} />

      {useExperimentalEditor ? (
        <TipTapEditor content={htmlContent} onChange={handleTipTapEditorChange} className="flex-1" />
      ) : (
        <EditorContent content={current} onChange={handleClassicEditorChange} />
      )}

      {lastSaveTime && (
        <div className="text-xs text-gray-500 dark:text-gray-400 p-2 text-right">
          Last saved: {lastSaveTime.toLocaleTimeString()}
        </div>
      )}
    </EditorContainer>
  )
}

