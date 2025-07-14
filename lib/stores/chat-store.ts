import { create } from "zustand"
import { Storage } from "@/lib/storage"
import { AIClient } from "@/lib/ai/ai-client"
import { AIServiceError } from "@/lib/ai/errors"
import { ErrorLogger, ErrorType } from "@/lib/error/error-logger"
import { useSettingsStore } from "@/lib/stores/settings-store"
import { buildDiffPrompt } from "@/lib/ai/prompt-builder"
import type { Diff } from "@/lib/stores/note-store"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  diffId?: string // Reference to the diff that triggered this message
  originalPrompt?: string // Store the original prompt sent to the API
}

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  lastDiff: Diff | null
  lastNoteContent: string | null

  // Actions
  addMessage: (message: Omit<ChatMessage, "id">) => void
  setError: (error: string | null) => void
  processNewDiff: (diff: Diff, noteContent: string) => Promise<void>
  initializeChat: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  lastDiff: null,
  lastNoteContent: null,

  addMessage: (message) => {
    // Generate a unique ID using timestamp + random string to avoid collisions
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    const newMessage = {
      ...message,
      id: uniqueId,
    }

    set((state) => ({
      messages: [...state.messages, newMessage],
    }))

    // Save to localStorage
    try {
      const messages = [...get().messages, newMessage]
      Storage.set("chat.messages", messages)
    } catch (error) {
      console.error("Failed to save messages to storage:", error)
    }
  },

  setError: (error) => {
    set({ error })
  },

  processNewDiff: async (diff, noteContent) => {
    console.log("Chat Store: Processing diff")
    set({
      isLoading: true,
      error: null,
      lastDiff: diff,
      lastNoteContent: noteContent,
    })

    try {
      // Check if we have an API key
      const { AIServiceFactory } = await import("@/lib/ai/ai-service-factory")
      const hasApiKey = await AIServiceFactory.hasApiKey()
      if (!hasApiKey) {
        throw new AIServiceError("OpenAI API key is required. Please add it in the settings.", "missing_api_key")
      }

      // Get the system prompt from settings
      const systemPrompt = useSettingsStore.getState().systemPrompt

      // Get the last few diffs to provide context
      const diffQueue = Storage.get("note.diffQueue") || []
      const recentDiffs = [...diffQueue.slice(-3), diff]

      console.log("Chat Store: Processing diffs:", recentDiffs.length)

      // Build the prompt
      const prompt = buildDiffPrompt(recentDiffs, noteContent, systemPrompt)

      // Use the AI client to generate a response based on the diffs
      const response = await AIClient.retryWithBackoff(
        () => AIClient.generateDiffResponse(recentDiffs, noteContent, systemPrompt),
        2, // maxRetries
        1000, // initialDelay
      )

      console.log("Chat Store: Received AI response, length:", response.length)

      // Add the response to the chat
      get().addMessage({
        role: "assistant",
        content: response,
        timestamp: Date.now(),
        diffId: diff.id, // Link this message to the diff that triggered it
        originalPrompt: prompt, // Store the original prompt
      })
    } catch (error) {
      console.error("Chat Store: Error processing diff:", error)

      // Log the error with context
      ErrorLogger.logError({
        type: ErrorType.AI_SERVICE,
        severity: "ERROR",
        message: "Failed to process changes",
        originalError: error instanceof Error ? error : new Error(String(error)),
        context: {
          component: "ChatStore",
          action: "processNewDiff",
          timestamp: Date.now(),
          additionalData: {
            diffLength: diff.changes.length,
            noteContentLength: noteContent.length,
          },
        },
      })

      // Set the error state with a user-friendly message
      let errorMessage = "I had trouble processing your recent changes. Please try again later."

      if (error instanceof AIServiceError) {
        // Provide more specific error messages for known error types
        if (error.code === "rate_limit_exceeded") {
          errorMessage = "I'm receiving too many requests right now. Please try again in a moment."
        } else if (error.code === "context_length_exceeded") {
          errorMessage = "Your document is getting quite long. I might not be able to process all of it at once."
        } else if (error.code === "missing_api_key") {
          errorMessage = "Please add your OpenAI API key in the settings to enable AI responses."
        }
      }

      set({
        error: errorMessage,
      })

      // Add an error message to the chat with a unique ID
      const uniqueId = `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

      get().addMessage({
        role: "assistant",
        content: errorMessage,
        timestamp: Date.now(),
        diffId: diff.id,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  initializeChat: () => {
    console.log("Initializing chat store")
    try {
      const messages = Storage.get("chat.messages") || []
      set({ messages })
    } catch (error) {
      console.error("Failed to initialize chat store:", error)
      // Set empty messages if there's an error
      set({ messages: [] })
    }
  },
}))

