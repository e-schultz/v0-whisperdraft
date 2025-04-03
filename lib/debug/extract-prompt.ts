export function extractPromptFromMessage(message: any): string | null {
  // Check if the message already has an originalPrompt property
  if (message.originalPrompt) {
    return message.originalPrompt
  }

  // If not, try to extract it from the message content
  // This is a fallback and might not always work
  if (message.content && typeof message.content === "string") {
    // Look for patterns that might indicate a prompt
    const promptIndicators = ["The user is writing a document", "Recent changes:", "Please provide a thoughtful"]

    // If any of these indicators are in the message, it might be a prompt
    if (promptIndicators.some((indicator) => message.content.includes(indicator))) {
      return message.content
    }
  }

  return null
}

