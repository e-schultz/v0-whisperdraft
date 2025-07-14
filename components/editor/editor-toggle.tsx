"use client"

interface EditorToggleProps {
  useExperimentalEditor: boolean
  onToggle: (useExperimentalEditor: boolean) => void
}

export function EditorToggle({ useExperimentalEditor, onToggle }: EditorToggleProps) {
  return (
    <div className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
      <span>Editor Mode:</span>
      <button
        onClick={() => onToggle(false)}
        className={`px-2 py-1 rounded ${!useExperimentalEditor ? "bg-gray-200 dark:bg-gray-700 font-medium" : ""}`}
        aria-pressed={!useExperimentalEditor}
      >
        Classic
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`px-2 py-1 rounded ${useExperimentalEditor ? "bg-gray-200 dark:bg-gray-700 font-medium" : ""}`}
        aria-pressed={useExperimentalEditor}
      >
        Rich Text (Experimental)
      </button>
    </div>
  )
}

