"use client"

import { useState, useEffect } from "react"
import { Notification } from "./notification-container"

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)
  const [showReconnectedMessage, setShowReconnectedMessage] = useState(false)

  useEffect(() => {
    // Initial state based on navigator.onLine
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
      setShowReconnectedMessage(true)

      // Hide the reconnected message after 5 seconds
      setTimeout(() => {
        setShowReconnectedMessage(false)
      }, 5000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
      setShowReconnectedMessage(false)
    }

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showOfflineMessage && !showReconnectedMessage) {
    return null
  }

  return (
    <>
      {showOfflineMessage && !isOnline && (
        <Notification
          type="error"
          message="You're offline. Changes saved locally."
          visible={true}
          onDismiss={() => setShowOfflineMessage(false)}
        />
      )}

      {showReconnectedMessage && isOnline && (
        <Notification
          type="success"
          message="Connection restored."
          visible={true}
          autoHideDuration={5000}
          onDismiss={() => setShowReconnectedMessage(false)}
        />
      )}
    </>
  )
}

