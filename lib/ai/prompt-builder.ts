import type { Diff } from "@/lib/stores/note-store"

/**
 * Formats a collection of diffs into a prompt for the AI
 */
export function buildDiffPrompt(diffs: Diff[], currentContent: string, systemPrompt: string): string {
  // Start with a brief context about what the user is doing
  let prompt = `The user is writing a document. Here's the current content:
---
${currentContent.substring(0, 1500)}${currentContent.length > 1500 ? "..." : ""}
---

Recent changes:
`

  // Add each diff with a timestamp
  diffs.forEach((diff, index) => {
    const date = new Date(diff.timestamp).toLocaleTimeString()
    prompt += `
[Change at ${date}]:
${diff.changes}
`
  })

  // Add instructions for the AI
  prompt += `
Please provide a thoughtful, quiet response to these changes. Be attentive and present, but not intrusive.
Offer gentle suggestions, reflections, or questions that might help the writer.
Keep your response brief and supportive.`

  return prompt
}

