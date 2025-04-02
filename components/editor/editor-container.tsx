"use client"

import type { ReactNode } from "react"

interface EditorContainerProps {
  children: ReactNode
}

export function EditorContainer({ children }: EditorContainerProps) {
  return <div className="flex flex-col h-full">{children}</div>
}

