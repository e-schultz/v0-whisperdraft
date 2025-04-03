import { create } from "zustand"
import { Storage } from "@/lib/storage"
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/constants"

interface SettingsState {
  autoSaveInterval: number
  diffThreshold: number
  systemPrompt: string
  maxDiffQueue: number
  useExperimentalEditor: boolean
  openaiApiKey: string
  aiModel: string

  // Actions
  updateSettings: (settings: Partial<SettingsState>) => void
  initializeSettings: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  autoSaveInterval: 30000, // 30 seconds
  diffThreshold: 3, // Process every 3 diffs
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  maxDiffQueue: 5,
  useExperimentalEditor: false,
  openaiApiKey: "",
  aiModel: "gpt-4o",

  updateSettings: (settings) => {
    set((state) => ({ ...state, ...settings }))

    // Save each setting to storage
    if (settings.autoSaveInterval !== undefined) {
      Storage.set("settings.autoSaveInterval", settings.autoSaveInterval)
    }

    if (settings.diffThreshold !== undefined) {
      Storage.set("settings.diffThreshold", settings.diffThreshold)
    }

    if (settings.systemPrompt !== undefined) {
      Storage.set("settings.systemPrompt", settings.systemPrompt)
    }

    if (settings.maxDiffQueue !== undefined) {
      Storage.set("settings.maxDiffQueue", settings.maxDiffQueue)
    }

    if (settings.useExperimentalEditor !== undefined) {
      Storage.set("settings.useExperimentalEditor", settings.useExperimentalEditor)
    }

    if (settings.openaiApiKey !== undefined) {
      Storage.set("settings.openaiApiKey", settings.openaiApiKey)
    }

    if (settings.aiModel !== undefined) {
      Storage.set("settings.aiModel", settings.aiModel)
    }

    console.log("Settings updated:", settings)
  },

  initializeSettings: async () => {
    console.log("Initializing settings store")
    try {
      const autoSaveInterval = Storage.get("settings.autoSaveInterval") || 30000
      const diffThreshold = Storage.get("settings.diffThreshold") || 3
      const systemPrompt = Storage.get("settings.systemPrompt") || DEFAULT_SYSTEM_PROMPT
      const maxDiffQueue = Storage.get("settings.maxDiffQueue") || 5
      const useExperimentalEditor = Storage.get("settings.useExperimentalEditor") || false
      const openaiApiKey = Storage.get("settings.openaiApiKey") || ""
      const aiModel = Storage.get("settings.aiModel") || "gpt-4o"

      set({
        autoSaveInterval,
        diffThreshold,
        systemPrompt,
        maxDiffQueue,
        useExperimentalEditor,
        openaiApiKey,
        aiModel,
      })

      console.log("Settings loaded:", {
        autoSaveInterval,
        diffThreshold,
        systemPrompt,
        maxDiffQueue,
        useExperimentalEditor,
        hasApiKey: !!openaiApiKey,
        aiModel,
      })
    } catch (error) {
      console.error("Error initializing settings store:", error)
      // Set defaults if there's an error
      set({
        autoSaveInterval: 30000,
        diffThreshold: 3,
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        maxDiffQueue: 5,
        useExperimentalEditor: false,
        openaiApiKey: "",
        aiModel: "gpt-4o",
      })
    }
  },
}))

