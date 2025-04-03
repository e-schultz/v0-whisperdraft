"use client"

import { useState, type ReactNode } from "react"

export interface DebugPanelProps {
  title: string
  icon: ReactNode
  position?: "left" | "right"
  children: ReactNode
  className?: string
  buttonClassName?: string
}

export function DebugPanel({
  title,
  icon,
  position = "left",
  children,
  className = "",
  buttonClassName = "",
}: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const positionClass = position === "left" ? "left-4" : "right-4"

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 ${positionClass} bg-gray-800 text-white p-2 rounded-full z-50 ${buttonClassName}`}
        aria-label={`Open ${title}`}
      >
        {icon}
      </button>
    )
  }

  return (
    <div
      className={`fixed bottom-4 ${positionClass} bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 w-80 max-h-[80vh] overflow-auto ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      {children}
    </div>
  )
}

