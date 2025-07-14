import { marked } from "marked"
import TurndownService from "turndown"

// Initialize turndown service for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
})

// Convert Markdown to HTML
export function markdownToHtml(markdown: string): string {
  if (!markdown || markdown.trim() === "") return "<p></p>" // Return empty paragraph for empty content

  try {
    // Normalize line endings to prevent inconsistencies
    const normalizedMarkdown = markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
    return marked.parse(normalizedMarkdown)
  } catch (error) {
    console.error("Error converting markdown to HTML:", error)
    return "<p></p>" // Return empty paragraph on error
  }
}

// Convert HTML to Markdown
export function htmlToMarkdown(html: string): string {
  if (!html || html === "<p></p>" || html === "<p></p>\n" || html.trim() === "") return "" // Return empty string for empty paragraph

  try {
    // Normalize the HTML to prevent inconsistencies
    const normalizedHtml = html.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
    return turndownService.turndown(normalizedHtml)
  } catch (error) {
    console.error("Error converting HTML to markdown:", error)
    return "" // Return empty string on error to avoid breaking the editor
  }
}

