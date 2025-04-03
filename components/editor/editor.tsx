"use client"

import { useState, useRef, useCallback } from "react"
import { TipTapEditor } from "./tiptap-editor"
import { markdownToHtml, htmlToMarkdown } from "@/lib/editor/html-converter"
import { ErrorLogger } from "@/lib/error/error-logger"

export interface EditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function Editor({ content, onChange, placeholder, className = "" }: EditorProps) {
  // For TipTap editor, we need to convert markdown to HTML
  const [htmlContent, setHtmlContent] = useState<string>(() => (content ? markdownToHtml(content) : "<p></p>"))
  const [conversionError, setConversionError] = useState<string | null>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)
  // Add a flag to track if we're currently updating from internal changes
  const isUpdatingRef = useRef(false)

  // Create a memoized onChange handler to avoid unnecessary conversions
  const handleEditorChange = useCallback(
    (html: string) => {
      if (isUpdatingRef.current) return

      try {
        isUpdatingRef.current = true

        // Handle empty editor case - if it's just an empty paragraph, convert to empty string
        if (html === "<p></p>" || html === "") {
          onChange("")
          setHtmlContent(html)
          setConversionError(null)
          isUpdatingRef.current = false
          return
        }

        // Only convert and update if the HTML has actually changed
        if (html !== htmlContent) {
          // Convert HTML to markdown for storage
          const markdown = htmlToMarkdown(html)
          onChange(markdown)
          setHtmlContent(html)
          setConversionError(null)
        }
      } catch (error) {
        ErrorLogger.logUIError(
          "Failed to convert HTML to markdown",
          "Editor",
          error instanceof Error ? error : new Error(String(error)),
          { htmlLength: html.length },
        )

        // Don't update the content if conversion fails
        setConversionError("Failed to save rich text changes.")
      } finally {
        isUpdatingRef.current = false
      }
    },
    [onChange, htmlContent],
  )

  // We don't need the useEffect to update HTML content when markdown changes
  // because we're only using TipTap now, and the initial HTML content is set
  // in the useState initialization

  // If there's a conversion error, show an error message
  if (conversionError) {
    return (
      <div className="flex flex-col" ref={editorContainerRef}>
        <div className="p-2 mb-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-sm border border-yellow-200 dark:border-yellow-800 rounded">
          {conversionError}
        </div>
        <TipTapEditor
          content={htmlContent}
          onChange={handleEditorChange}
          placeholder={placeholder}
          className={className}
        />
      </div>
    )
  }

  return (
    <div ref={editorContainerRef}>
      <TipTapEditor
        content={htmlContent}
        onChange={handleEditorChange}
        placeholder={placeholder}
        className={className}
      />
    </div>
  )
}

