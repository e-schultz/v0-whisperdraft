"use client"

import { type ReactNode, useState } from "react"
import { useDevice } from "@/lib/hooks/use-device"
import { PanelNavigation, type PanelType } from "./panel-navigation"
import { useSwipe } from "@/lib/hooks/use-swipe"

interface PanelContainerProps {
  notePanel: ReactNode
  chatPanel: ReactNode
}

function SwipeIndicator({ direction }: { direction: "left" | "right" }) {
  return <div className="text-gray-500">{direction === "left" ? "<" : ">"}</div>
}

export function PanelContainer({ notePanel, chatPanel }: PanelContainerProps) {
  const [activePanel, setActivePanel] = useState<PanelType>("note")
  const { isMobile } = useDevice()

  const handleSwipeLeft = () => {
    if (activePanel === "note") {
      setActivePanel("chat")
    }
  }

  const handleSwipeRight = () => {
    if (activePanel === "chat") {
      setActivePanel("note")
    }
  }

  const swipeHandlers = useSwipe(handleSwipeLeft, handleSwipeRight)

  // On desktop, render both panels side by side
  if (!isMobile) {
    return (
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r border-gray-200 dark:border-gray-700 overflow-hidden">{notePanel}</div>
        <div className="flex-1 overflow-hidden">{chatPanel}</div>
      </div>
    )
  }

  // On mobile, render only the active panel with navigation
  return (
    <div className="flex flex-col flex-1 overflow-hidden relative" {...swipeHandlers}>
      <div className="flex-1 overflow-hidden">{activePanel === "note" ? notePanel : chatPanel}</div>

      {activePanel === "note" && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <SwipeIndicator direction="left" />
        </div>
      )}

      {activePanel === "chat" && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <SwipeIndicator direction="right" />
        </div>
      )}

      <PanelNavigation activePanel={activePanel} onChange={setActivePanel} />
    </div>
  )
}

