import { create } from "zustand"
import { Storage } from "@/lib/storage"
import type { Diff } from "./note-store"
import { callLLM } from "@/lib/llm"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean

  // Actions
  initializeChat: () => void
  addMessage: (message: Omit<ChatMessage, "id">) => void
  processNewDiff: (diff: Diff, noteContent: string) => Promise<void>
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,

  initializeChat: async () => {
    console.log("Initializing chat store")
    try {
      const messages = Storage.get("chat.log") || []
      console.log("Loaded messages from storage:", messages)
      set({ messages })
    } catch (error) {
      console.error("Error initializing chat store:", error)
      // Set empty messages if there's an error
      set({ messages: [] })
    }
  },

  addMessage: (message) => {
    const newMessage = {
      ...message,
      id: crypto.randomUUID(),
    }

    console.log("Adding new message:", newMessage)
    const updatedMessages = [...get().messages, newMessage]
    set({ messages: updatedMessages })
    Storage.set("chat.log", updatedMessages)
  },

  processNewDiff: async (diff, noteContent) => {
    console.log("Processing diff:", diff)
    set({ isLoading: true })

    try {
      // Create a prompt for the LLM based on the diff and current note
      const prompt = `
The user is writing a document. Here's the current content:
---
${noteContent}
---

Recent changes:
${diff.changes}

Please provide a thoughtful, quiet response to these changes. Be attentive and present, but not intrusive.
Offer gentle suggestions, reflections, or questions that might help the writer.
Keep your response brief and supportive.
      `.trim()

      console.log("Sending prompt to LLM:", prompt.substring(0, 100) + "...")
      // Call the LLM using our consistent AI SDK implementation
      const response = await callLLM(prompt)
      console.log("Received LLM response:", response.substring(0, 100) + "...")

      // Add the response to the chat
      get().addMessage({
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error("Error processing diff:", error)

      // Add an error message
      get().addMessage({
        role: "assistant",
        content: "I had trouble processing your recent changes. Please continue writing.",
        timestamp: Date.now(),
      })
    } finally {
      set({ isLoading: false })
    }
  },

  clearMessages: () => {
    set({ messages: [] })
    Storage.set("chat.log", [])
  },
}))

