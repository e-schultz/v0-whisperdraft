"use client"

import type { ReactNode } from "react"

export interface PanelProps {
  title?: string
  headerActions?: ReactNode
  children: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
}

export function Panel({
  title,
  headerActions,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
}: PanelProps) {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {(title || headerActions) && (
        <div
          className={`p-4 border-b border-gray-200 dark:border-gray-700/50 flex justify-between items-center
                     bg-white dark:bg-gray-800/40 backdrop-blur-sm sticky top-0 z-10 ${headerClassName}`}
        >
          {title && <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>}
          {headerActions}
        </div>
      )}
      <div className={`flex-1 overflow-auto ${contentClassName}`}>{children}</div>
    </div>
  )
}

