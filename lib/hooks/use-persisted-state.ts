"use client"

import { useState, useEffect } from "react"
import { Storage } from "@/lib/storage"

export function usePersistedState<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Only access localStorage after component has mounted
  const [state, setState] = useState<T>(initialValue)
  const [hasMounted, setHasMounted] = useState(false)

  // Load the value from localStorage on mount
  useEffect(() => {
    setHasMounted(true)
    const storedValue = Storage.get(key)
    if (storedValue !== null) {
      setState(storedValue)
    }
  }, [key])

  // Update localStorage when the state changes
  const setPersistedState = (value: T) => {
    setState(value)
    if (hasMounted) {
      Storage.set(key, value)
    }
  }

  return [state, setPersistedState]
}

