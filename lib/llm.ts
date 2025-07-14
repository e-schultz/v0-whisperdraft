import { useSettingsStore } from "@/lib/stores/settings-store"
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/constants"

// Call the LLM with a prompt
export async function callLLM(prompt: string): Promise<string> {
  try {
    console.log("Calling LLM with prompt:", prompt.substring(0, 100) + "...")

    // Get the system prompt from settings with fallback
    const systemPrompt = useSettingsStore.getState().systemPrompt || DEFAULT_SYSTEM_PROMPT
    console.log("Using system prompt:", systemPrompt.substring(0, 100) + "...")

    // Check if we're in the browser
    const isBrowser = typeof window !== "undefined"

    if (isBrowser) {
      // In browser context, use the API endpoint instead of direct calls
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          systemPrompt,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data.text
    } else {
      // Server-side context (should not happen in this implementation)
      throw new Error("Server-side LLM calls not implemented in this function")
    }
  } catch (error: any) {
    console.error("Error calling LLM:", error)
    return "I noticed your changes, but I'm having trouble formulating a response right now. Please continue writing."
  }
}

// Generate a summary of the note
export async function generateSummary(content: string): Promise<string> {
  if (!content.trim()) return ""

  try {
    // Check if we're in the browser
    const isBrowser = typeof window !== "undefined"

    if (isBrowser) {
      // In browser context, use the API endpoint
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data.text
    } else {
      // Server-side context (should not happen in this implementation)
      throw new Error("Server-side summary generation not implemented in this function")
    }
  } catch (error: any) {
    console.error("Error generating summary:", error)
    return "Unable to generate summary"
  }
}

