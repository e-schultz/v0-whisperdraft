"use client"

import type React from "react"

import { useState, useCallback } from "react"

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: () => void
}

export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  options = { threshold: 50, preventDefault: true },
): SwipeHandlers {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (options.preventDefault) {
        // Only prevent default if we're detecting a significant horizontal swipe
        const currentX = e.targetTouches[0].clientX
        const diff = touchStart ? Math.abs(touchStart - currentX) : 0

        if (diff > options.threshold / 2) {
          e.preventDefault()
        }
      }
      setTouchEnd(e.targetTouches[0].clientX)
    },
    [touchStart, options],
  )

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > options.threshold
    const isRightSwipe = distance < -options.threshold

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    }

    if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }, [touchStart, touchEnd, onSwipeLeft, onSwipeRight, options.threshold])

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}

