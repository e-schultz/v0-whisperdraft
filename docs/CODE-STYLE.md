# Whisperdraft Code Style Guide

This document outlines the coding standards and best practices for the Whisperdraft project.

## General Principles

1. **Simplicity**: Keep code simple and readable
2. **Consistency**: Follow established patterns
3. **Modularity**: Create small, focused components and functions
4. **Documentation**: Document complex logic and component interfaces

## Component Structure

### Functional Components

```typescript
// Import statements
import { useState, useEffect } from "react"
import { useNoteStore } from "@/lib/stores/note-store"

// Component interface
interface MyComponentProps {
  title: string
  onAction: () => void
}

// Component implementation
export function MyComponent({ title, onAction }: MyComponentProps) {
  // State hooks
  const [isActive, setIsActive] = useState(false)
  
  // Store hooks
  const { content } = useNoteStore()
  
  // Effects
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    }
  }, [dependencies])
  
  // Event handlers
  const handleClick = () => {
    setIsActive(true)
    onAction()
  }
  
  // Render
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={handleClick}>
        {isActive ? "Active" : "Inactive"}
      </button>
    </div>
  )
}

