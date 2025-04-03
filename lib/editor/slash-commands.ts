export function parseSlashCommands(text: string): { command: string; args: string }[] {
  const commands: { command: string; args: string }[] = []

  // Look for patterns like /summarize or /tone gentle
  const commandRegex = /\/(\w+)(?:\s+([^\n]*))?/g
  let match

  while ((match = commandRegex.exec(text)) !== null) {
    const [_, command, args = ""] = match
    commands.push({ command, args })
  }

  return commands
}

/**
 * Executes a slash command and returns the result
 */
export async function executeSlashCommand(command: string, args: string, noteContent: string): Promise<string> {
  // Import here to avoid circular dependencies
  const { AIClient } = await import("@/lib/ai/ai-client")

  switch (command.toLowerCase()) {
    case "summarize":
      return await AIClient.generateSummary(noteContent)

    case "tone":
      return `I'll use a ${args || "neutral"} tone in my responses.`

    case "focus":
      return `I'll focus on ${args || "general feedback"} in my responses.`

    case "help":
      return `
Available commands:
/summarize - Generate a summary of your document
/tone [gentle|critical|curious|...] - Set the tone for AI responses
/focus [summary|questions|suggestions|...] - Set the focus for AI responses
/help - Show this help message
      `.trim()

    default:
      return `Unknown command: /${command}. Type /help for available commands.`
  }
}

