"use client"

import { useState } from "react"
import { useDevice } from "@/lib/hooks/use-device"
import { useNoteStore } from "@/lib/stores/note-store"

export function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { isMobile } = useDevice()
  const { saveNote } = useNoteStore()

  // Don't render on desktop
  if (!isMobile) return null

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleSave = async () => {
    await saveNote()
    setIsExpanded(false)
  }

  return (
    <div className="fixed bottom-16 right-4 z-10">
      {isExpanded && (
        <div className="flex flex-col-reverse gap-2 mb-2">
          <button
            onClick={handleSave}
            className="w-12 h-12 rounded-full bg-amber-600 text-white shadow-lg flex items-center justify-center"
            aria-label="Save note"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          </button>
        </div>
      )}

      <button
        onClick={toggleExpanded}
        className="w-14 h-14 rounded-full bg-stone-800 dark:bg-stone-700 text-white shadow-lg flex items-center justify-center"
        aria-label={isExpanded ? "Close actions" : "Open actions"}
      >
        {isExpanded ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )}
      </button>
    </div>
  )
}

