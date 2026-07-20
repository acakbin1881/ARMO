import { motion } from "motion/react"
import { useEffect, useState } from "react"

export type DeckSlide = { id: string; label: string }

type DeckRailProps = {
  slides: DeckSlide[]
}

/**
 * Right-edge slide indicator. White dashes under mix-blend-difference so they
 * invert automatically over light and dark slides.
 */
export function DeckRail({ slides }: DeckRailProps) {
  const [active, setActive] = useState(slides[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { threshold: 0.55 }
    )
    for (const { id } of slides) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [slides])

  return (
    <nav
      aria-label="Slides"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 mix-blend-difference md:flex lg:right-8"
    >
      {slides.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-label={`Go to ${label}`}
          aria-current={active === id ? "true" : undefined}
          onClick={() =>
            document
              .getElementById(id)
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="flex h-4 cursor-pointer items-center"
        >
          <motion.span
            className="block h-[3px] rounded-full bg-paper"
            animate={{
              width: active === id ? 32 : 14,
              opacity: active === id ? 1 : 0.4,
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          />
        </button>
      ))}
    </nav>
  )
}
