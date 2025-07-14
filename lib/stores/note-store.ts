import { create } from "zustand"
import { Storage } from "@/lib/storage"
import { createDiff } from "@/lib/diff"
import { WELCOME_NOTE } from "@/lib/constants"
import { ErrorLogger, ErrorType } from "@/lib/error/error-logger"

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
  saveError: string | null

  // Actions
  setContent: (content: string) => void
  saveNote: () => Promise<Diff | null>
  initializeNote: () => void
  generateAndSaveDiff: () => Promise<Diff | null>
  resetError: () => void
}

export const useNoteStore = create<NoteState>((set, get) => ({
  current: "",
  base: "",
  diffQueue: [],
  lastSaveTime: Date.now(),
  isDirty: false,
  saveError: null,

  setContent: (content) => {
    set({ current: content, isDirty: true })
    // Save to localStorage immediately to prevent data loss
    try {
      Storage.set("note.current", content)
    } catch (error) {
      ErrorLogger.logStorageError(
        "Failed to save current note content",
        "setContent",
        error instanceof Error ? error : new Error(String(error)),
        { contentLength: content.length },
      )
      // We don't set an error state here to avoid disrupting the user experience
    }
  },

  saveNote: async () => {
    const { current, base } = get()

    set({ saveError: null })

    // Only save if content has changed
    if (current !== base) {
      try {
        const diff = await get().generateAndSaveDiff()

        // Update base to current after saving
        set({
          base: current,
          lastSaveTime: Date.now(),
          isDirty: false,
        })

        // Save to localStorage
        const savedCurrent = Storage.set("note.current", current)
        const savedBase = Storage.set("note.base", current)

        if (!savedCurrent || !savedBase) {
          throw new Error("Failed to save note to storage")
        }

        return diff
      } catch (error) {
        ErrorLogger.logStorageError(
          "Failed to save note",
          "saveNote",
          error instanceof Error ? error : new Error(String(error)),
          {
            currentLength: current.length,
            baseLength: base.length,
            isDifferent: current !== base,
          },
        )

        set({
          saveError: error instanceof Error ? error.message : "Failed to save note",
        })

        throw error
      }
    }

    return null
  },

  generateAndSaveDiff: async () => {
    const { current, base, diffQueue } = get()

    try {
      // Generate diff between current and base
      const changes = createDiff(base, current)

      // Only proceed if there are actual changes
      if (changes) {
        const newDiff: Diff = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          changes,
        }

        // Add to queue, keeping only the last 5 diffs
        const updatedQueue = [...diffQueue, newDiff].slice(-5)

        set({ diffQueue: updatedQueue })

        const saved = Storage.set("note.diffQueue", updatedQueue)
        if (!saved) {
          throw new Error("Failed to save diff queue to storage")
        }

        return newDiff
      }
    } catch (error) {
      ErrorLogger.logError({
        type: ErrorType.STORAGE,
        severity: "ERROR",
        message: "Failed to generate and save diff",
        originalError: error instanceof Error ? error : new Error(String(error)),
        context: {
          component: "NoteStore",
          action: "generateAndSaveDiff",
          timestamp: Date.now(),
          additionalData: {
            currentLength: current.length,
            baseLength: base.length,
            diffQueueLength: diffQueue.length,
          },
        },
      })

      throw error
    }

    return null
  },

  initializeNote: async () => {
    try {
      const current = Storage.get("note.current") || WELCOME_NOTE
      const base = Storage.get("note.base") || current
      const diffQueue = Storage.get("note.diffQueue") || []

      set({ current, base, diffQueue, saveError: null })
    } catch (error) {
      ErrorLogger.logError({
        type: ErrorType.INITIALIZATION,
        severity: "ERROR",
        message: "Failed to initialize note store",
        originalError: error instanceof Error ? error : new Error(String(error)),
        context: {
          component: "NoteStore",
          action: "initializeNote",
          timestamp: Date.now(),
        },
      })

      // Set defaults if there's an error
      set({
        current: WELCOME_NOTE,
        base: WELCOME_NOTE,
        diffQueue: [],
        saveError: "Failed to load your notes. Starting with a welcome note instead.",
      })
    }
  },

  resetError: () => {
    set({ saveError: null })
  },
}))

