"use server"

/**
 * Server action to check if an environment API key is available
 * This keeps the actual key secure on the server
 */
export async function checkEnvironmentApiKey(): Promise<boolean> {
  const envApiKey = process.env.OPENAI_API_KEY || ""
  return !!envApiKey && envApiKey.startsWith("sk-")
}

/**
 * Server action to get the environment API key for server-side operations
 * This should ONLY be called from server components or other server actions
 */
export async function getEnvironmentApiKey(): Promise<string> {
  return process.env.OPENAI_API_KEY || ""
}

