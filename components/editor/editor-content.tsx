"use client"

import type React from "react"

interface EditorContentProps {
  content: string
  onChange: (content: string) => void
}

export function EditorContent({ content, onChange }: EditorContentProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <textarea
      className="flex-1 p-4 resize-none focus:outline-none font-mono text-gray-800 dark:text-gray-200 
                bg-white dark:bg-gray-900 w-full"
      value={content}
      onChange={handleChange}
      placeholder="Start writing here..."
      aria-label="Note editor"
    />
  )
}

