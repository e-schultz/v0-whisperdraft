"use client"

interface EditorHeaderProps {
  onSave: () => void
}

export function EditorHeader({ onSave }: EditorHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Note</h1>
      <button
        onClick={onSave}
        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                  dark:text-gray-200 rounded-md transition-colors"
        aria-label="Save note"
      >
        Save
      </button>
    </div>
  )
}

