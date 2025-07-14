// Animation presets for consistent animations across components
export const ANIMATION_PRESETS = {
  // Spring animations for natural movement
  spring: {
    default: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
    gentle: {
      type: "spring",
      stiffness: 200,
      damping: 25,
    },
    responsive: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
  // Tween animations for controlled timing
  tween: {
    default: {
      type: "tween",
      duration: 0.3,
      ease: "easeInOut",
    },
    fast: {
      type: "tween",
      duration: 0.15,
      ease: "easeOut",
    },
    slow: {
      type: "tween",
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  // Keyframe animations for complex sequences
  keyframes: {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      },
    },
    bounce: {
      y: ["0%", "-10%", "0%"],
      transition: {
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      },
    },
    swipe: (direction: "left" | "right") => ({
      x: direction === "left" ? [0, 5, 0] : [0, -5, 0],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
      },
    }),
  },
}

// Drag constraints and thresholds
export const DRAG_SETTINGS = {
  swipeThreshold: 0.3, // Percentage of width required to trigger a panel change
  velocityThreshold: 500, // Velocity required to trigger a panel change regardless of distance
  dragElastic: 0.7, // Elasticity of the drag (0 = no elasticity, 1 = full elasticity)
  dragTransition: {
    bounceStiffness: 300,
    bounceDamping: 30,
  },
}

// Z-index values for consistent layering
export const Z_INDICES = {
  base: 0,
  panels: 10,
  resizeHandle: 20,
  floatingButtons: 30,
  tooltips: 40,
  modals: 50,
}

