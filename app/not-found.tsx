"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function NotFound() {
  // Only access localStorage after component has mounted (client-side)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-md transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  )
}

