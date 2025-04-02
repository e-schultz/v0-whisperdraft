"use client"

import { useEffect, useState } from "react"
import { useDevice } from "@/lib/hooks/use-device"

interface SwipeIndicatorProps {
  direction: "left" | "right"
}

export function SwipeIndicator({ direction }: SwipeIndicatorProps) {
  const { isMobile } = useDevice()
  const [isVisible, setIsVisible] = useState(true)

  // Hide the indicator after 5 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  // Don't render on desktop or if hidden
  if (!isMobile || !isVisible) return null

  return (
    <div className="absolute top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-20 rounded-full p-2 animate-pulse">
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
    </div>
  )
}

