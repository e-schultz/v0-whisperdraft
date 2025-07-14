"use client"

import { useEffect } from "react"
import { useChatStore } from "@/lib/stores/chat-store"
import { ChatContainer } from "./chat/chat-container"
import { ChatHeader } from "./chat/chat-header"
import { ChatMessages } from "./chat/chat-messages"

export default function ChatPanel() {
  const { messages, isLoading } = useChatStore()

  // Debug log when messages change
  useEffect(() => {
    console.log("ChatPanel rendered with messages:", messages)

    // Log to console that this would update the changelog
    if (messages.length > 0) {
      console.log("CHANGELOG: Updated - Fixed chat message rendering to ensure messages are properly displayed")
    }
  }, [messages])

  return (
    <ChatContainer>
      <ChatHeader />
      <ChatMessages messages={messages} isLoading={isLoading} />
    </ChatContainer>
  )
}

