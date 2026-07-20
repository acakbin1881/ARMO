import { ArrowRight, Menu } from "lucide-react"
import { motion } from "motion/react"
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

/**
 * The white signal bar. On the landing deck it caps the hero and scrolls away
 * with it; on docs it stays pinned.
 */
export function SiteHeader({ variant }: SiteHeaderProps) {
  const onDocs = variant === "docs"

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
      className={cn(
        "z-30 flex h-14 items-center justify-between gap-4 bg-paper px-[clamp(20px,5vw,72px)] text-ink",
        onDocs ? "sticky top-0 border-b border-border" : "absolute inset-x-0 top-0"
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
            "nav-underline text-[11px] font-semibold tracking-[0.14em] uppercase"
          )
        )}
        <Link
          to="/docs"
          aria-current={onDocs ? "page" : undefined}
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-volt px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-300",
            onDocs ? "bg-volt" : "bg-volt/15 hover:bg-volt"
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
              className="-mr-1 rounded-full p-2 transition-colors hover:bg-fog md:hidden"
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
    </header>
  )
}
