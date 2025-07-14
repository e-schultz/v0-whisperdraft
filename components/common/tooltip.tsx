"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ANIMATION_PRESETS, Z_INDICES } from "@/lib/animation/constants"

interface TooltipProps {
  text: string
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
}

export function Tooltip({ text, children, position = "top", delay = 500 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  const positionStyles = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  }

  const arrowPositions = {
    top: "top-full -mt-1 left-1/2 -translate-x-1/2",
    bottom: "bottom-full -mb-1 left-1/2 -translate-x-1/2",
    left: "left-full -ml-1 top-1/2 -translate-y-1/2",
    right: "right-full -mr-1 top-1/2 -translate-y-1/2",
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute ${positionStyles[position]} z-50 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap`}
            style={{ zIndex: Z_INDICES.tooltips }}
            initial={{
              opacity: 0,
              scale: 0.8,
              y: position === "top" ? 10 : position === "bottom" ? -10 : 0,
              x: position === "left" ? 10 : position === "right" ? -10 : 0,
            }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            transition={ANIMATION_PRESETS.tween.default}
            role="tooltip"
          >
            {text}
            <motion.div
              className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${arrowPositions[position]}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

