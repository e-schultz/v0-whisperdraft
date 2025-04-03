"use client"

import { useState, useEffect } from "react"

export function SlashCommandsHelp() {
  const [isVisible, setIsVisible] = useState(true)

  // Hide the help after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 15000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="absolute bottom-16 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs z-10 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">Slash Commands</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try these commands in the editor:</p>
      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <li>
          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">/help</span> - Show available commands
        </li>
        <li>
          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">/summarize</span> - Summarize your
          document
        </li>
        <li>
          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">/tone gentle</span> - Change AI response
          tone
        </li>
        <li>
          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">/focus questions</span> - Set AI focus
          area
        </li>
      </ul>
    </div>
  )
}

