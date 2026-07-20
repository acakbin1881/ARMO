import { animate, useInView, useReducedMotion } from "motion/react"
import { useEffect, useRef } from "react"

import { EASE } from "@/lib/motion"

type CountUpProps = {
  to: number
  suffix?: string
  duration?: number
  className?: string
}

/** Number that counts up from zero the first time it scrolls into view. */
export function CountUp({
  to,
  suffix = "",
  duration = 1.4,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !inView) return
    if (reduced) {
      el.textContent = `${to}${suffix}`
      return
    }
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, reduced, to, suffix, duration])

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}
