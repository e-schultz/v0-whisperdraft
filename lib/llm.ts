export async function callLLM(prompt: string): Promise<string> {
  console.log("LLM service called with prompt:", prompt.substring(0, 100) + "...")

  try {
    // In a real implementation, this would call an actual LLM API
    // For now, we'll simulate a response

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, generate a simple response
    // In production, this would call OpenAI or another LLM provider
    const response = simulateResponse(prompt)
    console.log("LLM response generated:", response.substring(0, 50) + "...")
    return response
  } catch (error) {
    console.error("Error calling LLM:", error)
    return "I encountered an error while processing your writing. Please continue, and I'll try to respond to your next changes."
  }
}

// Temporary function to simulate LLM responses
function simulateResponse(prompt: string): string {
  const responses = [
    "I notice you're developing your thoughts here. The structure is coming along nicely.",
    "That's an interesting point you just added. Have you considered exploring it further?",
    "Your writing has a good rhythm to it. I like how you're connecting these ideas.",
    "This reminds me of something you mentioned earlier. There might be a connection worth exploring.",
    "I see you're refining your argument. The clarity is improving with each edit.",
    "That's a compelling addition. It strengthens your overall narrative.",
    "I'm noticing a theme emerging in your recent edits. It seems important to your thinking.",
    "The way you've phrased that last part is quite elegant. It flows naturally from what came before.",
    "You've added some nuance here that wasn't present before. It adds depth to your perspective.",
    "This is developing in an interesting direction. I'm curious to see where you take it next.",
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

