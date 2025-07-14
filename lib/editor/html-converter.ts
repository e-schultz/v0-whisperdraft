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
  if (!markdown) return ""
  try {
    return marked.parse(markdown)
  } catch (error) {
    console.error("Error converting markdown to HTML:", error)
    return markdown // Return original content on error
  }
}

// Convert HTML to Markdown
export function htmlToMarkdown(html: string): string {
  if (!html) return ""
  try {
    return turndownService.turndown(html)
  } catch (error) {
    console.error("Error converting HTML to markdown:", error)
    return html // Return original content on error
  }
}

