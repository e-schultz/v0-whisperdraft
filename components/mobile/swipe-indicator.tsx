"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDevice } from "@/lib/hooks/use-device"
import { ANIMATION_PRESETS } from "@/lib/animation/constants"

interface SwipeIndicatorProps {
  direction: "left" | "right"
  isVisible?: boolean
}

export function SwipeIndicator({ direction, isVisible: propIsVisible }: SwipeIndicatorProps) {
  const { isMobile } = useDevice()
  const [isVisible, setIsVisible] = useState(true)
  const [hasBeenSeen, setHasBeenSeen] = useState(false)

  // Show the indicator for 5 seconds initially, and when explicitly made visible
  useEffect(() => {
    if (propIsVisible !== undefined) {
      setIsVisible(propIsVisible)
      return
    }

    if (isVisible && !hasBeenSeen) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setHasBeenSeen(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, propIsVisible, hasBeenSeen])

  // Don't render on desktop or if hidden
  if (!isMobile || (!isVisible && propIsVisible === undefined)) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-20 rounded-full p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1, opacity: 1 }}
          aria-hidden="true" // This is decorative, so hide from screen readers
        >
          <motion.div animate={ANIMATION_PRESETS.keyframes.swipe(direction)}>
            {direction === "left" ? (
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
                className="text-white dark:text-black"
              >
                <path d="m9 18 6-6-6-6" />
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
                className="text-white dark:text-black"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

