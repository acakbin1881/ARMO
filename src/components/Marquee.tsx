import { cn } from "@/lib/utils"

type MarqueeProps = {
  items: string[]
  className?: string
}

/** Infinite arcade ticker. Two identical copies slide -50% for a seamless loop. */
export function Marquee({ items, className }: MarqueeProps) {
  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      <div className="animate-marquee flex w-max shrink-0 items-center">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex items-center"
          >
            {items.map((item) => (
              <span key={item} className="flex items-center">
                <span className="px-7">{item}</span>
                <span
                  className="size-2 shrink-0 bg-volt"
                  aria-hidden="true"
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
