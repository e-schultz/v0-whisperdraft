"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useDevice } from "@/lib/hooks/use-device"
import { SwipeIndicator } from "./swipe-indicator"
import { useKeyboardShortcut } from "@/lib/hooks/use-keyboard-shortcuts"
import { Tooltip } from "@/components/common/tooltip"
import { usePersistedState } from "@/lib/hooks/use-persisted-state"
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from "framer-motion"
import { ANIMATION_PRESETS, DRAG_SETTINGS, Z_INDICES } from "@/lib/animation/constants"

interface PanelContainerProps {
  notePanel: React.ReactNode
  chatPanel: React.ReactNode
}

export type PanelType = "note" | "chat"

export function PanelContainer({ notePanel, chatPanel }: PanelContainerProps) {
  const [activePanel, setActivePanel] = useState<PanelType>("note")
  const [isChatVisible, setIsChatVisible] = usePersistedState("panel.chatVisible", true)
  const { isMobile } = useDevice()
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)

  // Default split is 50/50
  const [splitRatio, setSplitRatio] = usePersistedState("panel.splitRatio", 0.5)

  // State to track resize operation
  const [isResizing, setIsResizing] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)

  // Handle panel toggle (show/hide chat)
  const handlePanelToggle = () => {
    if (isMobile) {
      setActivePanel(activePanel === "note" ? "chat" : "note")
    } else {
      setIsChatVisible(!isChatVisible)
    }
  }

  // Keyboard shortcut for toggling panels
  useKeyboardShortcut({
    key: "\\",
    ctrlKey: true,
    callback: handlePanelToggle,
  })

  // Handle mobile swipe
  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && activePanel === "note") {
      setActivePanel("chat")
    } else if (direction === "right" && activePanel === "chat") {
      setActivePanel("note")
    }
  }

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    setIsResizing(true)
    setStartX(e.clientX)
    setStartWidth(containerRef.current.offsetWidth * splitRatio)

    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)

    // Prevent text selection during resize
    e.preventDefault()
  }

  // Handle resize move
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return

    const containerWidth = containerRef.current.offsetWidth
    const deltaX = e.clientX - startX
    const newWidth = Math.min(Math.max(startWidth + deltaX, containerWidth * 0.2), containerWidth * 0.8)
    const newRatio = newWidth / containerWidth

    setSplitRatio(newRatio)
  }

  // Handle resize end
  const handleResizeEnd = () => {
    setIsResizing(false)
    document.removeEventListener("mousemove", handleResizeMove)
    document.removeEventListener("mouseup", handleResizeEnd)
  }

  // Handle double-click to reset to 50/50
  const handleResizeDoubleClick = () => {
    setSplitRatio(0.5)
  }

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleResizeMove)
      document.removeEventListener("mouseup", handleResizeEnd)
    }
  }, [isResizing])

  // Mobile view - full screen panels that slide in/out with enhanced gestures
  if (isMobile) {
    // Use motion values to track drag position
    const dragX = useMotionValue(0)
    const noteControls = useAnimation()
    const chatControls = useAnimation()

    // Calculate panel opacity based on drag position
    const noteOpacity = useTransform(dragX, [-window.innerWidth * 0.5, 0, window.innerWidth * 0.5], [0.3, 1, 1])
    const chatOpacity = useTransform(dragX, [-window.innerWidth * 0.5, 0, window.innerWidth * 0.5], [1, 1, 0.3])

    // Handle drag end with velocity-based animation
    const handleDragEnd = (event: any, info: any) => {
      const { velocity, offset } = info
      const swipe = Math.abs(velocity.x) > DRAG_SETTINGS.velocityThreshold
      const swipeDirection = velocity.x < 0 ? "left" : "right"
      const offsetDirection = offset.x < 0 ? "left" : "right"

      // Determine if we should change panels based on velocity or distance
      const shouldChangePanels = swipe
        ? (swipeDirection === "left" && activePanel === "note") ||
          (swipeDirection === "right" && activePanel === "chat")
        : Math.abs(offset.x) > window.innerWidth * DRAG_SETTINGS.swipeThreshold &&
          ((offsetDirection === "left" && activePanel === "note") ||
            (offsetDirection === "right" && activePanel === "chat"))

      if (shouldChangePanels) {
        // Change panel with animation
        setActivePanel(activePanel === "note" ? "chat" : "note")

        // Reset drag position
        dragX.set(0)
      } else {
        // Animate back to original position
        if (activePanel === "note") {
          noteControls.start({ x: 0 })
          chatControls.start({ x: "100%" })
        } else {
          noteControls.start({ x: "-100%" })
          chatControls.start({ x: 0 })
        }
      }
    }

    // Update animations when active panel changes
    useEffect(() => {
      if (activePanel === "note") {
        noteControls.start({ x: 0 })
        chatControls.start({ x: "100%" })
      } else {
        noteControls.start({ x: "-100%" })
        chatControls.start({ x: 0 })
      }
    }, [activePanel, noteControls, chatControls])

    return (
      <div className="flex flex-col flex-1 overflow-hidden relative" aria-live="polite">
        <AnimatePresence initial={false}>
          <motion.div
            key="note-panel"
            className="absolute inset-0"
            style={{
              x: activePanel === "note" ? dragX : undefined,
              opacity: noteOpacity,
              zIndex: activePanel === "note" ? Z_INDICES.panels : Z_INDICES.base,
            }}
            animate={noteControls}
            initial={false}
            drag={activePanel === "note" ? "x" : false}
            dragConstraints={{ left: -100, right: 0 }}
            dragElastic={DRAG_SETTINGS.dragElastic}
            dragTransition={DRAG_SETTINGS.dragTransition}
            onDragEnd={handleDragEnd}
            transition={ANIMATION_PRESETS.spring.default}
            role="region"
            aria-label="Note editor panel"
          >
            {notePanel}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <SwipeIndicator direction="left" isVisible={activePanel === "note"} />
            </div>
          </motion.div>

          <motion.div
            key="chat-panel"
            className="absolute inset-0"
            style={{
              x: activePanel === "chat" ? dragX : undefined,
              opacity: chatOpacity,
              zIndex: activePanel === "chat" ? Z_INDICES.panels : Z_INDICES.base,
            }}
            animate={chatControls}
            initial={false}
            drag={activePanel === "chat" ? "x" : false}
            dragConstraints={{ left: 0, right: 100 }}
            dragElastic={DRAG_SETTINGS.dragElastic}
            dragTransition={DRAG_SETTINGS.dragTransition}
            onDragEnd={handleDragEnd}
            transition={ANIMATION_PRESETS.spring.default}
            role="region"
            aria-label="Chat panel"
          >
            {chatPanel}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <SwipeIndicator direction="right" isVisible={activePanel === "chat"} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // Desktop view - resizable panels with improved animations
  return (
    <div className="flex flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900" ref={containerRef}>
      {/* Note panel */}
      <motion.div
        className="h-full overflow-hidden"
        animate={{
          width: isChatVisible ? `${splitRatio * 100}%` : "100%",
        }}
        transition={isResizing ? ANIMATION_PRESETS.tween.fast : ANIMATION_PRESETS.spring.gentle}
        role="region"
        aria-label="Note editor panel"
      >
        {notePanel}
      </motion.div>

      {/* Resize handle */}
      {isChatVisible && (
        <motion.div
          ref={resizeHandleRef}
          className="relative h-full flex items-center justify-center cursor-col-resize z-10"
          style={{
            zIndex: Z_INDICES.resizeHandle,
            width: "20px", // Increased from 12px to 20px for an even larger hit area
            margin: "0 -10px", // Adjusted negative margin to center it
          }}
          onMouseDown={handleResizeStart}
          onDoubleClick={handleResizeDoubleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          role="separator"
          aria-label="Resize panels"
          aria-valuenow={Math.round(splitRatio * 100)}
          aria-valuemin={20}
          aria-valuemax={80}
          tabIndex={0}
          onKeyDown={(e) => {
            // Allow keyboard control of the resize handle
            if (e.key === "ArrowLeft") {
              setSplitRatio(Math.max(splitRatio - 0.05, 0.2))
              e.preventDefault()
            } else if (e.key === "ArrowRight") {
              setSplitRatio(Math.min(splitRatio + 0.05, 0.8))
              e.preventDefault()
            }
          }}
        >
          {/* Full-height vertical divider line */}
          <div className="absolute h-full w-px bg-gray-300 dark:bg-gray-600"></div>

          {/* Full-height hover indicator (invisible until hover) */}
          <div className="absolute h-full w-full hover:bg-gray-200 hover:bg-opacity-30 dark:hover:bg-gray-700 dark:hover:bg-opacity-30 transition-colors"></div>

          {/* Handle indicator - visible in the middle */}
          <motion.div
            className="absolute w-4 h-24 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            animate={{ opacity: isResizing ? 1 : 0.7 }}
          >
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-px h-4 bg-gray-400 dark:bg-gray-500"></div>
              <div className="w-px h-4 bg-gray-400 dark:bg-gray-500"></div>
              <div className="w-px h-4 bg-gray-400 dark:bg-gray-500"></div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {isChatVisible && (
          <motion.div
            className="h-full overflow-hidden"
            animate={{
              width: `${(1 - splitRatio) * 100}%`,
              opacity: 1,
            }}
            initial={{ width: 0, opacity: 0 }}
            exit={{ width: 0, opacity: 0 }}
            transition={isResizing ? ANIMATION_PRESETS.tween.fast : ANIMATION_PRESETS.spring.gentle}
            role="region"
            aria-label="Chat panel"
          >
            {chatPanel}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button for desktop */}
      <Tooltip text="Toggle chat panel (Ctrl+\)">
        <motion.button
          className="fixed right-3 bottom-3 z-10 p-2 bg-stone-800 dark:bg-stone-700 text-white rounded-full shadow-lg hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors"
          onClick={handlePanelToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ zIndex: Z_INDICES.floatingButtons }}
          aria-label={isChatVisible ? "Hide chat panel" : "Show chat panel"}
          aria-pressed={isChatVisible}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              rotate: isChatVisible ? 0 : 180,
            }}
            transition={ANIMATION_PRESETS.tween.default}
          >
            {isChatVisible ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
          </motion.svg>
        </motion.button>
      </Tooltip>
    </div>
  )
}

