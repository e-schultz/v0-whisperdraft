"use client"

import type React from "react"

import { useState } from "react"
import { useSettingsStore } from "@/lib/stores/settings-store"

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { autoSaveInterval, maxDiffQueue, systemPrompt, updateSettings } = useSettingsStore()

  const [localSettings, setLocalSettings] = useState({
    autoSaveInterval,
    maxDiffQueue,
    systemPrompt,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLocalSettings((prev) => ({
      ...prev,
      [name]: name === "autoSaveInterval" || name === "maxDiffQueue" ? Number.parseInt(value, 10) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(localSettings)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Settings</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Auto-save Interval (ms)
              </label>
              <input
                type="number"
                name="autoSaveInterval"
                value={localSettings.autoSaveInterval}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                min="5000"
                step="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Diff Queue Size
              </label>
              <input
                type="number"
                name="maxDiffQueue"
                value={localSettings.maxDiffQueue}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                min="1"
                max="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">System Prompt</label>
              <textarea
                name="systemPrompt"
                value={localSettings.systemPrompt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 h-32"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                        dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-gray-800 dark:bg-gray-700 text-white rounded-md 
                        hover:bg-gray-700 dark:hover:bg-gray-600"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

