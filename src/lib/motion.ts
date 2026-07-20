import type { Variants } from "motion/react"

/** Signature ease — fast start, long soft landing. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const VIEWPORT = { once: true, amount: 0.35 } as const

/**
 * Reveals are TRANSFORM-ONLY (opacity stays 1) so content can never be left
 * invisible if IntersectionObserver stalls in a capture/reader context.
 */

/** Block reveal: settles up from below. */
export const rise: Variants = {
  hidden: { y: 30 },
  show: { y: 0, transition: { duration: 0.7, ease: EASE } },
}

/** Headline word: springy arcade pop from the baseline. */
export const pop: Variants = {
  hidden: { y: 26, scale: 0.55 },
  show: {
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 340, damping: 26 },
  },
}

/** Parent orchestrator for staggered children. */
export const stagger = (delayChildren = 0, staggerChildren = 0.08): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
})
