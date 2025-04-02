// Simple diff implementation
// This could be replaced with a more sophisticated diff algorithm in the future

export function createDiff(oldText: string, newText: string): string | null {
  // If texts are identical, return null (no changes)
  if (oldText === newText) return null

  // For now, we'll use a simple line-based diff
  const oldLines = oldText.split("\n")
  const newLines = newText.split("\n")

  const diff: string[] = []

  // Find added or modified lines
  newLines.forEach((line, i) => {
    if (i >= oldLines.length) {
      diff.push(`+ ${line}`)
    } else if (line !== oldLines[i]) {
      diff.push(`- ${oldLines[i]}`)
      diff.push(`+ ${line}`)
    }
  })

  // Find removed lines
  if (oldLines.length > newLines.length) {
    for (let i = newLines.length; i < oldLines.length; i++) {
      diff.push(`- ${oldLines[i]}`)
    }
  }

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
    }
  })

  return result.join("\n")
}

