import { create } from "zustand"
import { Storage } from "@/lib/storage"
import { createDiff } from "@/lib/diff"
import { WELCOME_NOTE } from "@/lib/constants"

export interface Diff {
  id: string
  timestamp: number
  changes: string
}

interface NoteState {
  current: string
  base: string
  diffQueue: Diff[]
  lastSaveTime: number
  isDirty: boolean

  // Actions
  setContent: (content: string) => void
  saveNote: () => Promise<Diff | null>
  initializeNote: () => void
  generateAndSaveDiff: () => Promise<Diff | null>
}

export const useNoteStore = create<NoteState>((set, get) => ({
  current: "",
  base: "",
  diffQueue: [],
  lastSaveTime: Date.now(),
  isDirty: false,

  setContent: (content) => {
    set({ current: content, isDirty: true })
    // Save to localStorage immediately to prevent data loss
    Storage.set("note.current", content)
  },

  saveNote: async () => {
    const { current, base, isDirty } = get()
    console.log("Saving note. Current length:", current.length, "Base length:", base.length, "isDirty:", isDirty)

    // Only save if content has changed
    if (current !== base) {
      console.log("Content has changed, generating diff")
      const diff = await get().generateAndSaveDiff()

      // Update base to current after saving
      set({
        base: current,
        lastSaveTime: Date.now(),
        isDirty: false,
      })

      // Save to localStorage
      Storage.set("note.current", current)
      Storage.set("note.base", current)

      return diff
    } else {
      console.log("No changes detected, skipping diff generation")
    }

    return null
  },

  generateAndSaveDiff: async () => {
    const { current, base, diffQueue } = get()

    // Generate diff between current and base
    const changes = createDiff(base, current)
    console.log("Generated diff:", changes)

    // Only proceed if there are actual changes
    if (changes) {
      const newDiff: Diff = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        changes,
      }

      console.log("Created new diff:", newDiff)

      // Add to queue, keeping only the last 5 diffs
      const updatedQueue = [...diffQueue, newDiff].slice(-5)

      set({ diffQueue: updatedQueue })
      Storage.set("note.diffQueue", updatedQueue)

      return newDiff
    }

    return null
  },

  initializeNote: async () => {
    console.log("Initializing note store")
    try {
      const current = Storage.get("note.current") || WELCOME_NOTE
      const base = Storage.get("note.base") || current
      const diffQueue = Storage.get("note.diffQueue") || []

      console.log("Loaded from storage - Current length:", current.length, "Base length:", base.length)
      set({ current, base, diffQueue })
    } catch (error) {
      console.error("Error initializing note store:", error)
      // Set defaults if there's an error
      set({
        current: WELCOME_NOTE,
        base: WELCOME_NOTE,
        diffQueue: [],
      })
    }
  },
}))

