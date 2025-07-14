"use client"

import { useEffect, useRef, useState } from "react"
import { useNoteStore } from "@/lib/stores/note-store"
import { useChatStore } from "@/lib/stores/chat-store"
import { useSettingsStore } from "@/lib/stores/settings-store"
import { Panel } from "./common/panel"
import { Editor } from "./editor/editor"
import { ErrorBoundary } from "./common/error-boundary"
import { useRetry } from "@/lib/hooks/use-retry"
import { ErrorType } from "@/lib/error/error-logger"
import { lazy } from "react"
import { AIClient } from "@/lib/ai/ai-client"
import { AIServiceFactory } from "@/lib/ai/ai-service-factory"
import { SavingIndicator } from "./saving-indicator"
import { useKeyboardShortcut } from "@/lib/hooks/use-keyboard-shortcut"

// Lazy load the AIServiceFactory to avoid circular dependencies
const AIServiceFactoryLoader = lazy(() =>
  import("@/lib/ai/ai-service-factory").then((mod) => ({
    default: () => mod.AIServiceFactory,
  })),
)

export default function NoteEditor() {
  const { current, setContent, saveNote } = useNoteStore()
  const { processNewDiff, error: chatError, setError } = useChatStore()
  const { updateSettings } = useSettingsStore()
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.UNKNOWN)
  // Update the state to track API key status
  const [apiKeyStatus, setApiKeyStatus] = useState<"missing" | "validating" | "valid" | "invalid">("missing")
  const [hasEnvApiKey, setHasEnvApiKey] = useState<boolean>(false)
  const [hasServerApi, setHasServerApi] = useState<boolean>(false)

  // Add keyboard shortcut for saving with Ctrl+S or Command+S
  useKeyboardShortcut({
    key: "s",
    ctrlKey: true,
    callback: (e) => {
      e.preventDefault() // Prevent browser's default save behavior
      handleManualSave()
    },
  })

  // Also add a second shortcut for macOS users with Command key
  useKeyboardShortcut({
    key: "s",
    metaKey: true,
    callback: (e) => {
      e.preventDefault() // Prevent browser's default save behavior
      handleManualSave()
    },
  })

  // Function to check server API availability
  const checkServerApiAvailability = async () => {
    try {
      const response = await fetch("/api/ai/health")
      if (response.ok) {
        const data = await response.json()
        setHasServerApi(data.available)
        return data.available
      }
      return false
    } catch (error) {
      console.error("Error checking server API availability:", error)
      return false
    }
  }

  // Update the useEffect that checks for API key to also validate it
  useEffect(() => {
    const validateApiKey = async () => {
      try {
        // Check if we have an environment API key
        const envKeyAvailable = await AIServiceFactory.hasEnvironmentApiKey()
        setHasEnvApiKey(envKeyAvailable)

        // Check if server API is available
        const serverApiAvailable = await checkServerApiAvailability()
        setHasServerApi(serverApiAvailable)

        const hasKey = await AIServiceFactory.hasApiKey()

        if (!hasKey && !serverApiAvailable) {
          setApiKeyStatus("missing")
          return
        }

        // If we have a key or server API, validate it
        setApiKeyStatus("validating")
        const isValid = await AIClient.isAvailable()
        setApiKeyStatus(isValid ? "valid" : "invalid")
      } catch (error) {
        console.error("Error validating API key:", error)
        setApiKeyStatus("invalid")
      }
    }

    validateApiKey()
  }, [useSettingsStore.getState().openaiApiKey]) // Re-run when API key changes

  // Set up auto-save timer
  useEffect(() => {
    console.log("Note Editor: Setting up auto-save timer")

    // Clear any existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    // Set up new timer
    autoSaveTimerRef.current = setInterval(async () => {
      console.log("Note Editor: Auto-save timer triggered")

      // Skip if already saving
      if (isSaving) {
        console.log("Note Editor: Already saving, skipping auto-save")
        return
      }

      try {
        setIsSaving(true)
        const diff = await saveNote()
        console.log("Note Editor: Auto-save result:", diff ? "Changes detected" : "No changes")

        if (diff) {
          console.log("Note Editor: Processing diff from auto-save")
          await processNewDiff(diff, current)
          setLastSaveTime(new Date())
          setSaveError(null)
        }
      } catch (error) {
        console.error("Note Editor: Error during auto-save:", error)
        setSaveError(error instanceof Error ? error.message : "Failed to auto-save")
        setErrorType(ErrorType.STORAGE)
      } finally {
        setIsSaving(false)
      }
    }, 30000) // 30 seconds

    return () => {
      console.log("Note Editor: Cleaning up auto-save timer")
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [saveNote, processNewDiff, current, isSaving])

  const handleContentChange = (content: string) => {
    setContent(content)
  }

  // Use the retry hook for manual save
  const [executeSave, saveState, resetSaveState] = useRetry(
    async () => {
      const diff = await saveNote()

      if (diff) {
        await processNewDiff(diff, current)
        setLastSaveTime(new Date())
      }

      return diff
    },
    {
      maxRetries: 2,
      initialDelay: 1000,
      errorType: ErrorType.STORAGE,
      component: "NoteEditor",
      action: "manualSave",
    },
  )

  const handleManualSave = async () => {
    console.log("Note Editor: Manual save triggered")

    // Skip if already saving
    if (isSaving) {
      console.log("Note Editor: Already saving, skipping manual save")
      return
    }

    setSaveError(null)
    setError(null)
    setIsSaving(true)

    try {
      await executeSave()

      if (saveState.error) {
        setSaveError("Failed to save note after multiple attempts")
        setErrorType(ErrorType.STORAGE)
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Create header actions
  const headerActions = (
    <button
      onClick={handleManualSave}
      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 
              dark:text-gray-200 rounded-md transition-colors shadow-sm"
      aria-label="Save note"
      disabled={isSaving}
    >
      {isSaving ? "Saving..." : "Save"}
    </button>
  )

  // Handle retry for save errors
  const handleRetrySave = () => {
    resetSaveState()
    setSaveError(null)
    handleManualSave()
  }

  // Handle dismissing errors
  const handleDismissError = () => {
    setSaveError(null)
    setError(null)
  }

  // Determine if we should show API key notifications
  const showApiKeyMissing = apiKeyStatus === "missing" && !hasEnvApiKey && !hasServerApi
  const showEnvKeyMessage = apiKeyStatus === "missing" && (hasEnvApiKey || hasServerApi)
  const showValidatingKey = apiKeyStatus === "validating"
  const showInvalidKey = apiKeyStatus === "invalid"

  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md m-4">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Editor Error</h3>
          <p className="text-sm text-red-700 dark:text-red-400">
            There was a problem loading the editor. Try refreshing the page.
          </p>
        </div>
      }
    >
      <Panel title="Note" headerActions={headerActions}>
        <ErrorBoundary
          fallback={
            <div className="p-4 m-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Editor Content Error</h3>
              <p className="text-sm text-red-700 dark:text-red-400">
                There was a problem with the editor content. You can try switching editor modes or refreshing the page.
              </p>
              <div className="mt-3 flex space-x-2"></div>
            </div>
          }
        >
          <Editor
            content={current}
            onChange={handleContentChange}
            placeholder="Start writing here..."
            className="flex-1"
          />
        </ErrorBoundary>

        {lastSaveTime && (
          <div className="text-xs text-gray-500 dark:text-gray-400 p-3 text-right border-t border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30">
            Last saved: {lastSaveTime.toLocaleTimeString()}
          </div>
        )}
      </Panel>

      {/* Saving indicator positioned absolutely to prevent layout shift */}
      <SavingIndicator />
    </ErrorBoundary>
  )
}

