import { ArrowRight, Menu } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { EASE } from "@/lib/motion"
import { cn } from "@/lib/utils"

const SECTIONS = [
  { id: "science", label: "Science" },
  { id: "tutorial", label: "Tutorial" },
  { id: "vision", label: "Vision" },
]

type SiteHeaderProps = {
  variant: "landing" | "docs"
}

/** True once the page has left the very top — drives the float transition. */
function useLifted(threshold = 12) {
  const [lifted, setLifted] = useState(false)

  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      setLifted(window.scrollY > threshold)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [threshold])

  return lifted
}

/**
 * Pinned nav. At the top it sits flush against the page edge as part of the
 * layout; once scrolled it detaches into a floating, frosted glass capsule.
 */
export function SiteHeader({ variant }: SiteHeaderProps) {
  const onDocs = variant === "docs"
  const lifted = useLifted()
  /* Landing rides a dark hero video until the glass takes over. */
  const onDark = !onDocs && !lifted

  const sectionLink = (id: string, label: string, className: string) =>
    onDocs ? (
      <Link key={id} to={`/#${id}`} className={className}>
        {label}
      </Link>
    ) : (
      <a key={id} href={`#${id}`} className={className}>
        {label}
      </a>
    )

  return (
    <header
      data-lifted={lifted ? "" : undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[padding] duration-[650ms] ease-out-expo",
        lifted
          ? "px-[clamp(12px,3vw,26px)] pt-[clamp(10px,1.4vw,16px)]"
          : "px-0 pt-0"
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-14 max-w-[1320px] items-center justify-between gap-4 px-[clamp(20px,5vw,60px)]",
          "transition-[background-color,border-color,box-shadow,border-radius,backdrop-filter,max-width,color] duration-[650ms] ease-out-expo",
          "border border-transparent",
          lifted
            ? "max-w-[1140px] rounded-full border-black/[0.07] bg-white/65 text-ink shadow-[0_1px_1px_rgb(0_0_0/0.03),0_8px_28px_-12px_rgb(0_0_0/0.16)] backdrop-blur-2xl backdrop-saturate-150"
            : cn(
                "rounded-none shadow-none",
                onDocs
                  ? "border-b-border bg-paper text-ink"
                  : "bg-transparent text-paper"
              )
        )}
      >
        <Link
          to="/"
          aria-label="ARMO home"
          className="stretch-expanded text-lg font-black tracking-[0.04em]"
        >
          ARMO
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-[clamp(16px,2.5vw,30px)] md:flex"
        >
          {SECTIONS.map(({ id, label }) =>
            sectionLink(
              id,
              label,
              "nav-underline text-[11px] font-semibold tracking-[0.14em] uppercase opacity-80 transition-opacity duration-300 hover:opacity-100"
            )
          )}
          <Link
            to="/docs"
            aria-current={onDocs ? "page" : undefined}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-300",
              onDocs
                ? "border-volt bg-volt text-ink"
                : onDark
                  ? "border-white/25 bg-white/10 hover:border-volt hover:bg-volt hover:text-ink"
                  : "border-volt/60 bg-volt/15 hover:bg-volt"
            )}
          >
            Docs <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild className="hidden md:inline-flex">
            {onDocs ? (
              <Link to="/#science">Free Trial</Link>
            ) : (
              <a href="#science">Free Trial</a>
            )}
          </Button>

          {/* Mobile menu */}
          <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className={cn(
                "-mr-1 rounded-full p-2 transition-colors md:hidden",
                onDark ? "hover:bg-white/10" : "hover:bg-black/[0.05]"
              )}
            >
              <Menu className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent aria-describedby={undefined}>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav
              aria-label="Mobile"
              className="mt-24 flex flex-col gap-1 px-8"
            >
              {[...SECTIONS, { id: "docs", label: "Docs" }].map(
                ({ id, label }, i) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.14 + i * 0.07, duration: 0.55, ease: EASE }}
                  >
                    <SheetClose asChild>
                      {id === "docs" || onDocs ? (
                        <Link
                          to={id === "docs" ? "/docs" : `/#${id}`}
                          className="group flex items-baseline gap-4 py-3"
                        >
                          <span className="font-mono text-xs font-bold text-volt">
                            0{i + 1}
                          </span>
                          <span className="stretch-expanded text-4xl font-extrabold uppercase transition-colors group-hover:text-volt">
                            {label}
                          </span>
                        </Link>
                      ) : (
                        <a
                          href={`#${id}`}
                          className="group flex items-baseline gap-4 py-3"
                        >
                          <span className="font-mono text-xs font-bold text-volt">
                            0{i + 1}
                          </span>
                          <span className="stretch-expanded text-4xl font-extrabold uppercase transition-colors group-hover:text-volt">
                            {label}
                          </span>
                        </a>
                      )}
                    </SheetClose>
                  </motion.div>
                )
              )}
            </nav>
            <motion.div
              className="mt-auto px-8 pb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5, ease: EASE }}
            >
              <SheetClose asChild>
                <Button asChild size="lg" className="w-full">
                  {onDocs ? (
                    <Link to="/#science">Free Trial</Link>
                  ) : (
                    <a href="#science">Free Trial</a>
                  )}
                </Button>
              </SheetClose>
            </motion.div>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  )
}
