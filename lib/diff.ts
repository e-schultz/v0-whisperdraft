// Enhanced diff implementation
// This provides more context for the AI to understand the changes

export function createDiff(oldText: string, newText: string): string | null {
  // If texts are identical, return null (no changes)
  if (oldText === newText) return null

  // For now, we'll use a simple line-based diff with context
  const oldLines = oldText.split("\n")
  const newLines = newText.split("\n")

  const diff: string[] = []
  const contextLines = 2 // Number of lines of context to include

  // Find added, modified, or removed lines
  let changes = false
  for (let i = 0; i < Math.max(oldLines.length, newLines.length); i++) {
    const oldLine = i < oldLines.length ? oldLines[i] : null
    const newLine = i < newLines.length ? newLines[i] : null

    if (oldLine === null) {
      // Line was added
      changes = true
      diff.push(`+ ${newLine}`)

      // Add context after
      for (let j = 1; j <= contextLines; j++) {
        if (i + j < newLines.length) {
          diff.push(`  ${newLines[i + j]}`)
        }
      }
    } else if (newLine === null) {
      // Line was removed
      changes = true
      diff.push(`- ${oldLine}`)

      // No context needed for removed lines at the end
    } else if (oldLine !== newLine) {
      // Line was modified
      changes = true

      // Add context before
      for (let j = 1; j <= contextLines; j++) {
        if (i - j >= 0) {
          const contextLine = oldLines[i - j]
          if (!diff.includes(`  ${contextLine}`)) {
            diff.unshift(`  ${contextLine}`)
          }
        }
      }

      diff.push(`- ${oldLine}`)
      diff.push(`+ ${newLine}`)

      // Add context after
      for (let j = 1; j <= contextLines; j++) {
        if (i + j < newLines.length) {
          diff.push(`  ${newLines[i + j]}`)
        }
      }
    }
  }

  // If no changes were detected, return null
  if (!changes) return null

  return diff.join("\n")
}

export function applyDiff(baseText: string, diffText: string): string {
  const baseLines = baseText.split("\n")
  const diffLines = diffText.split("\n")

  const result = [...baseLines]

  // Apply each diff line
  let lineOffset = 0

  diffLines.forEach((line) => {
    if (line.startsWith("+ ")) {
      const content = line.substring(2)
      result.splice(lineOffset, 0, content)
      lineOffset++
    } else if (line.startsWith("- ")) {
      result.splice(lineOffset, 1)
      lineOffset--
    } else if (line.startsWith("  ")) {
      // Context line, ignore
    }
  })

  return result.join("\n")
}

/**
 * Summarizes the changes in a diff
 */
export function summarizeDiff(diffText: string): string {
  if (!diffText) return "No changes"

  const lines = diffText.split("\n")
  let addedLines = 0
  let removedLines = 0
  let modifiedSections = 0

  let inModification = false

  for (const line of lines) {
    if (line.startsWith("+ ")) {
      addedLines++
      if (!inModification) {
        modifiedSections++
        inModification = true
      }
    } else if (line.startsWith("- ")) {
      removedLines++
      if (!inModification) {
        modifiedSections++
        inModification = true
      }
    } else {
      inModification = false
    }
  }

  return `${modifiedSections} section(s) modified with ${addedLines} addition(s) and ${removedLines} removal(s)`
}

