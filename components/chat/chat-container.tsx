"use client"

import { type ReactNode, useEffect, useRef } from "react"

interface ChatContainerProps {
  children: ReactNode
}

export function ChatContainer({ children }: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if container is visible
    const checkVisibility = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const isVisible =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)

        console.log("Chat container visibility:", isVisible, "Dimensions:", rect)
      }
    }

    checkVisibility()

    // Check visibility on resize
    window.addEventListener("resize", checkVisibility)
    return () => window.removeEventListener("resize", checkVisibility)
  }, [])

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      {children}
    </div>
  )
}

