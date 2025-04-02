"use client"
import { useDevice } from "@/lib/hooks/use-device"

export type PanelType = "note" | "chat"

interface PanelNavigationProps {
  activePanel: PanelType
  onChange: (panel: PanelType) => void
}

export function PanelNavigation({ activePanel, onChange }: PanelNavigationProps) {
  const { isMobile } = useDevice()

  // Don't render on desktop
  if (!isMobile) return null

  return (
    <div className="flex items-center justify-center p-2 bg-stone-100 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700">
      <div className="flex rounded-md overflow-hidden shadow-sm">
        <button
          onClick={() => onChange("note")}
          className={`px-4 py-2 ${
            activePanel === "note"
              ? "bg-amber-600 text-white"
              : "bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200"
          } transition-colors`}
          aria-pressed={activePanel === "note"}
        >
          Note
        </button>
        <button
          onClick={() => onChange("chat")}
          className={`px-4 py-2 ${
            activePanel === "chat"
              ? "bg-amber-600 text-white"
              : "bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200"
          } transition-colors`}
          aria-pressed={activePanel === "chat"}
        >
          Chat
        </button>
      </div>
    </div>
  )
}

