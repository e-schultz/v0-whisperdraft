"use client"

import { useState } from "react"
import { useDevice } from "@/lib/hooks/use-device"
import { useNoteStore } from "@/lib/stores/note-store"
import { motion, AnimatePresence } from "framer-motion"
import { ANIMATION_PRESETS, Z_INDICES } from "@/lib/animation/constants"

export function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { isMobile } = useDevice()
  const { saveNote } = useNoteStore()

  // Don't render on desktop
  if (!isMobile) return null

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleSave = async () => {
    await saveNote()
    setIsExpanded(false)
  }

  // Animation variants for the menu items
  const menuVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        ...ANIMATION_PRESETS.spring.default,
        delay: custom * 0.05,
      },
    }),
  }

  return (
    <div className="fixed bottom-16 right-4 z-10" style={{ zIndex: Z_INDICES.floatingButtons }}>
      <AnimatePresence>
        {isExpanded && (
          <div className="flex flex-col-reverse gap-2 mb-2">
            <motion.button
              onClick={handleSave}
              className="w-12 h-12 rounded-full bg-amber-600 text-white shadow-lg flex items-center justify-center"
              aria-label="Save note"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              custom={0}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleExpanded}
        className="w-14 h-14 rounded-full bg-stone-800 dark:bg-stone-700 text-white shadow-lg flex items-center justify-center"
        aria-label={isExpanded ? "Close actions" : "Open actions"}
        aria-expanded={isExpanded}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isExpanded ? { rotate: 45 } : { rotate: 0 }}
        transition={ANIMATION_PRESETS.tween.default}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </motion.button>
    </div>
  )
}

