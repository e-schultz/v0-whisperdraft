import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Call the LLM with a prompt
export async function callLLM(prompt: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "You are a thoughtful writing companion called Whisperdraft. You respond to the user's writing with quiet, present, and attentive reflections. You don't lead or direct, just witness, reflect, and gently echo back. Keep your responses brief, insightful, and supportive.",
    })

    return text
  } catch (error) {
    console.error("Error calling LLM:", error)
    return "I noticed your changes, but I'm having trouble formulating a response right now."
  }
}

// Generate a summary of the note
export async function generateSummary(content: string): Promise<string> {
  if (!content.trim()) return ""

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Summarize the following text in 2-3 sentences:\n\n${content}`,
      system: "You are a helpful assistant that summarizes text concisely and accurately.",
    })

    return text
  } catch (error) {
    console.error("Error generating summary:", error)
    return "Unable to generate summary"
  }
}

