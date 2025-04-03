"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import NoteEditor from "@/components/note-editor"
import ChatPanel from "@/components/chat-panel"
import { PanelContainer } from "@/components/mobile/panel-container"
import { FloatingActionButton } from "@/components/mobile/floating-action-button"
import { DebugPanel } from "@/components/debug-panel"
import { AIDebug } from "@/components/debug/ai-debug"
import { useNoteStore } from "@/lib/stores/note-store"
import { useChatStore } from "@/lib/stores/chat-store"
import { useSettingsStore } from "@/lib/stores/settings-store"
import { ErrorBoundary } from "@/components/common/error-boundary"
import { NetworkStatus } from "@/components/common/network-status"
import { ErrorLogger, ErrorType } from "@/lib/error/error-logger"
import { NotificationContainer } from "@/components/common/notification-container"
import { Notification } from "@/components/common/notification"
import { ErrorMessage } from "@/components/common/error-message"

export default function Home() {
  const { initializeNote } = useNoteStore()
  const { initializeChat } = useChatStore()
  const { initializeSettings } = useSettingsStore()
  const [isInitialized, setIsInitialized] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const [showApiKeyMissing, setShowApiKeyMissing] = useState(false)
  const [showEnvKeyMessage, setShowEnvKeyMessage] = useState(false)
  const [showValidatingKey, setShowValidatingKey] = useState(false)
  const [showInvalidKey, setShowInvalidKey] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [chatError, setChatError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.SAVE)
  const [isSaving, setIsSaving] = useState(false)

  const handleRetrySave = () => {
    // Implement retry logic here
    console.log("Retrying save...")
  }

  const handleDismissError = () => {
    setSaveError(null)
    setChatError(null)
  }

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

        ErrorLogger.logError({
          type: ErrorType.INITIALIZATION,
          severity: "CRITICAL",
          message: "Failed to initialize application",
          originalError: error instanceof Error ? error : new Error(String(error)),
          context: {
            component: "Home",
            action: "init",
            timestamp: Date.now(),
          },
        })

        setInitError(error instanceof Error ? error.message : "Failed to initialize application")
      }
    }

    init()
  }, [initializeNote, initializeChat, initializeSettings])

  if (initError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Initialization Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            There was a problem loading the application: {initError}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This could be due to browser storage issues or corrupted data.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => {
                localStorage.clear()
                window.location.reload()
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Reset App Data
            </button>
          </div>
        </div>
      </div>
    )
  }

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
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center h-screen bg-red-50 dark:bg-red-900/20 p-6">
          <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Application Error</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Something went wrong with the application.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Header />
        <PanelContainer notePanel={<NoteEditor />} chatPanel={<ChatPanel />} />
        <FloatingActionButton />
        <DebugPanel />
        <AIDebug />

        {/* API Key Status Messages */}
        <NotificationContainer>
          {showApiKeyMissing && (
            <Notification
              type="warning"
              message="Please add your OpenAI API key in the settings to enable AI responses."
              visible={true}
            />
          )}

          {showEnvKeyMessage && (
            <Notification
              type="success"
              message="Using environment API key for AI responses."
              visible={true}
              autoHideDuration={5000}
            />
          )}

          {showValidatingKey && (
            <Notification type="loading" message="Validating your OpenAI API key..." visible={true} />
          )}

          {showInvalidKey && (
            <Notification
              type="error"
              message="Your OpenAI API key appears to be invalid. Please check your settings."
              visible={true}
            />
          )}

          {/* Error message display */}
          {(saveError || chatError) && (
            <ErrorMessage
              type={saveError ? errorType : ErrorType.AI_SERVICE}
              message={saveError || chatError || "An error occurred"}
              onRetry={saveError ? handleRetrySave : undefined}
              onDismiss={handleDismissError}
            />
          )}

          {/* Saving indicator - now handled by the SavingIndicator component */}
          {isSaving && !saveError && (
            <Notification type="loading" message="Saving and processing changes..." visible={true} />
          )}

          <NetworkStatus />
        </NotificationContainer>
      </div>
    </ErrorBoundary>
  )
}

