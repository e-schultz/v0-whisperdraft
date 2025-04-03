"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"
import { useEffect, useState, useCallback } from "react"

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

// Helper component to show Markdown shortcuts
const MarkdownShortcutHint = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Hide after 15 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 15000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded shadow-md text-xs text-gray-600 dark:text-gray-300 max-w-xs">
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">Markdown Shortcuts</span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
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
      <ul className="space-y-1">
        <li>
          <code>-</code> or <code>*</code> for bullet lists
        </li>
        <li>
          <code>1.</code> for numbered lists
        </li>
        <li>
          <code>#</code> for headings
        </li>
        <li>
          <code>**text**</code> for bold
        </li>
        <li>
          <code>*text*</code> for italic
        </li>
      </ul>
    </div>
  )
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Start writing here...",
  className = "",
}: TipTapEditorProps) {
  // Simplify state management
  const [lastContent, setLastContent] = useState(content)
  const [isInternalUpdate, setIsInternalUpdate] = useState(false)

  // Create a memoized onUpdate handler to avoid recreating the editor on every render
  const handleUpdate = useCallback(
    ({ editor }: { editor: any }) => {
      if (!isInternalUpdate) {
        const html = editor.getHTML()
        // Only update if content actually changed
        if (html !== lastContent) {
          onChange(html)
          setLastContent(html)
        }
      }
    },
    [onChange, isInternalUpdate, lastContent],
  )

  // Initialize TipTap editor with enhanced Markdown support
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the built-in list extensions since we're adding them separately
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-amber-600 dark:text-amber-400 underline",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      // Add these extensions with markdown input rules
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-4",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-4",
        },
      }),
      ListItem,
    ],
    content: content || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base max-w-none p-6 focus:outline-none min-h-[300px] h-full overflow-auto prose-headings:font-semibold prose-p:leading-relaxed prose-a:text-amber-600 dark:prose-a:text-amber-400",
      },
    },
    onUpdate: handleUpdate,
  })

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== lastContent && !isInternalUpdate) {
      // Set internal update flag to prevent onChange from being triggered
      setIsInternalUpdate(true)

      // Only update content if it's actually different from what the editor has
      const currentContent = editor.getHTML()
      if (content !== currentContent) {
        editor.commands.setContent(content || "<p></p>")
      }

      // Update our last known content
      setLastContent(content)

      // Clear the internal update flag
      setIsInternalUpdate(false)
    }
  }, [content, editor, lastContent, isInternalUpdate])

  // REMOVE THIS EFFECT - it's causing unnecessary content resets
  // Ensure the editor always has content
  // useEffect(() => {
  //   if (editor?.isEmpty) {
  //     editor.commands.clearContent(false)
  //     editor.commands.setContent("<p></p>")
  //   }
  // }, [editor])

  return (
    <div className={`tiptap-editor-container ${className}`}>
      <div className="tiptap-toolbar bg-gray-100 dark:bg-gray-800/60 p-2 border-b border-gray-200 dark:border-gray-700/50 flex flex-wrap gap-1">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor?.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Bold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700 dark:text-gray-300"
          >
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor?.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Italic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700 dark:text-gray-300"
          >
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor?.isActive("heading", { level: 1 }) ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Heading 1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700 dark:text-gray-300"
          >
            <path d="M4 12h8"></path>
            <path d="M4 18V6"></path>
            <path d="M12 18V6"></path>
            <path d="M17 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0z"></path>
          </svg>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor?.isActive("heading", { level: 2 }) ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Heading 2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700 dark:text-gray-300"
          >
            <path d="M4 12h8"></path>
            <path d="M4 18V6"></path>
            <path d="M12 18V6"></path>
            <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"></path>
          </svg>
        </button>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor?.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Bullet List"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700 dark:text-gray-300"
          >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor?.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Ordered List"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700 dark:text-gray-300"
          >
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </button>
        <button
          onClick={() => {
            const url = window.prompt("URL")
            if (url) {
              editor?.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor?.isActive("link") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Link"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700 dark:text-gray-300"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </button>
      </div>
      <EditorContent editor={editor} />
      <MarkdownShortcutHint />
    </div>
  )
}

