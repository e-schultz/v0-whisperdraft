"use client"

import { useEffect, useState } from "react"
import { useNoteStore } from "@/lib/stores/note-store"

// Update the SavingIndicator component to use the notification container
export function SavingIndicator() {
  const { isDirty, lastSaveTime, saveError } = useNoteStore()
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isDirty) {
      setStatus("saving")
      setVisible(true)
    } else if (saveError) {
      setStatus("error")
      setVisible(true)
    } else if (lastSaveTime > 0) {
      setStatus("saved")
      setVisible(true)

      // Hide the "Saved" indicator after 2 seconds
      const timer = setTimeout(() => {
        setVisible(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isDirty, lastSaveTime, saveError])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center items-center p-2 pointer-events-none">
      <div className="pointer-events-auto">
        {status === "saving" && (
          <div className="flex items-center bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-md text-xs border border-amber-200 dark:border-amber-800">
            <div className="w-2 h-2 mr-1.5 rounded-full bg-amber-500 animate-pulse"></div>
            <span>Saving...</span>
          </div>
        )}

        {status === "saved" && (
          <div className="flex items-center bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-2 py-1 rounded-md text-xs border border-green-200 dark:border-green-800">
            <div className="w-2 h-2 mr-1.5 rounded-full bg-green-500"></div>
            <span>Saved</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 px-2 py-1 rounded-md text-xs border border-red-200 dark:border-red-800">
            <div className="w-2 h-2 mr-1.5 rounded-full bg-red-500"></div>
            <span>Save failed</span>
          </div>
        )}
      </div>
    </div>
  )
}

