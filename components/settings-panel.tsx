"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSettingsStore } from "@/lib/stores/settings-store"
import { AIClient } from "@/lib/ai/ai-client"
import { AIServiceFactory } from "@/lib/ai/ai-service-factory"

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { autoSaveInterval, maxDiffQueue, systemPrompt, openaiApiKey, aiModel, updateSettings } = useSettingsStore()

  // Initialize localSettings with empty strings instead of undefined values
  const [localSettings, setLocalSettings] = useState({
    autoSaveInterval: autoSaveInterval || 30000,
    maxDiffQueue: maxDiffQueue || 5,
    systemPrompt: systemPrompt || "",
    openaiApiKey: openaiApiKey || "",
    aiModel: aiModel || "gpt-4o",
  })

  // Add state for API key validation
  const [isValidatingApiKey, setIsValidatingApiKey] = useState(false)
  const [apiKeyError, setApiKeyError] = useState<string | null>(null)
  const [hasEnvApiKey, setHasEnvApiKey] = useState(false)

  // Check if we have an environment API key
  useEffect(() => {
    setHasEnvApiKey(AIServiceFactory.hasEnvironmentApiKey())
  }, [])

  // Update local settings when store changes
  useEffect(() => {
    setLocalSettings({
      autoSaveInterval: autoSaveInterval || 30000,
      maxDiffQueue: maxDiffQueue || 5,
      systemPrompt: systemPrompt || "",
      openaiApiKey: openaiApiKey || "",
      aiModel: aiModel || "gpt-4o",
    })
  }, [autoSaveInterval, maxDiffQueue, systemPrompt, openaiApiKey, aiModel])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setLocalSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "autoSaveInterval" || name === "maxDiffQueue"
            ? Number.parseInt(value, 10)
            : value,
    }))
  }

  // Add a function to validate the API key
  const validateApiKey = async (key: string) => {
    console.log("Validating API key:", key ? "Key provided" : "No key provided")

    // If key is empty but we have an environment key, that's fine
    if (!key && hasEnvApiKey) {
      console.log("No user key provided, but environment key is available")
      return true
    }

    // If key is provided, validate it
    if (key && !key.startsWith("sk-")) {
      console.log("API key validation failed: Invalid format")
      setApiKeyError("Invalid API key format. It should start with 'sk-'")
      return false
    }

    // If no key is provided and no environment key, that's also fine (will use mock service)
    if (!key && !hasEnvApiKey) {
      console.log("No API key provided, will use mock service")
      return true
    }

    setIsValidatingApiKey(true)
    setApiKeyError(null)

    try {
      // Update settings with the new key
      console.log("Updating settings with new API key")
      updateSettings({ openaiApiKey: key })

      // Reset the AI service to force it to use the new key
      AIServiceFactory.resetService()

      // Wait a moment for the settings to update
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Test the key if one was provided
      if (key) {
        console.log("Testing API key with AIClient.isAvailable()")
        const isAvailable = await AIClient.isAvailable()
        setIsValidatingApiKey(false)

        if (!isAvailable) {
          console.log("API key validation failed: Service not available")
          setApiKeyError("API key validation failed. Please check your key and try again.")
          return false
        }
      } else {
        setIsValidatingApiKey(false)
      }

      console.log("API key validation successful")
      return true
    } catch (error) {
      console.error("Error validating API key:", error)
      setIsValidatingApiKey(false)
      setApiKeyError(error instanceof Error ? error.message : "Failed to validate API key")
      return false
    }
  }

  // Update the handleSubmit function to validate the API key
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting settings:", {
      ...localSettings,
      openaiApiKey: localSettings.openaiApiKey ? "[REDACTED]" : "",
    })

    // If the API key has changed, validate it
    if (localSettings.openaiApiKey !== openaiApiKey) {
      const isValid = await validateApiKey(localSettings.openaiApiKey)
      if (!isValid && localSettings.openaiApiKey) {
        // Don't close the settings panel if validation failed
        return
      }
    }

    // Update all other settings
    updateSettings({
      autoSaveInterval: localSettings.autoSaveInterval,
      maxDiffQueue: localSettings.maxDiffQueue,
      systemPrompt: localSettings.systemPrompt,
      aiModel: localSettings.aiModel,
      // Skip openaiApiKey as it was already updated during validation
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
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

            <div>
              <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span>OpenAI API Key</span>
                {hasEnvApiKey && (
                  <span className="text-green-600 dark:text-green-400 text-xs">Environment key available</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="openaiApiKey"
                  value={localSettings.openaiApiKey}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    apiKeyError ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                  } rounded-md 
                            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
                  placeholder={hasEnvApiKey ? "Using environment key (optional)" : "sk-..."}
                />
                {isValidatingApiKey && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                )}
              </div>
              {apiKeyError && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{apiKeyError}</p>}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {hasEnvApiKey
                  ? "An API key is already provided. You can optionally use your own key instead."
                  : "Your API key is stored locally and never sent to our servers."}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AI Model</label>
              <select
                name="aiModel"
                value={localSettings.aiModel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="gpt-4o">GPT-4o (Recommended)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster, less accurate)</option>
              </select>
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

