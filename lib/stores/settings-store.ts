import { create } from "zustand"
import { Storage } from "@/lib/storage"

const DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant."

interface SettingsState {
  autoSaveInterval: number
  diffThreshold: number

  // Actions
  setAutoSaveInterval: (interval: number) => void
  setDiffThreshold: (threshold: number) => void
  initializeSettings: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  autoSaveInterval: 30000, // 30 seconds
  diffThreshold: 3, // Process every 3 diffs

  setAutoSaveInterval: (interval) => {
    set({ autoSaveInterval: interval })
    Storage.set("settings.autoSaveInterval", interval)
  },

  setDiffThreshold: (threshold) => {
    set({ diffThreshold: threshold })
    Storage.set("settings.diffThreshold", threshold)
  },

  initializeSettings: async () => {
    console.log("Initializing settings store")
    try {
      const settings = Storage.get("settings") || {}
      set({
        autoSaveInterval: settings.autoSaveInterval || 30000,
        maxDiffQueue: settings.maxDiffQueue || 5,
        systemPrompt: settings.systemPrompt || DEFAULT_SYSTEM_PROMPT,
      })
    } catch (error) {
      console.error("Error initializing settings store:", error)
      // Set defaults if there's an error
      set({
        autoSaveInterval: 30000,
        maxDiffQueue: 5,
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
      })
    }
  },
}))

