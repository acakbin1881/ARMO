import { cn } from "@/lib/utils"

type EyebrowProps = {
  code: string
  label: string
  className?: string
}

/** Mono section stamp — "■ S01 / Science" — the deck's wayfinding mark. */
export function Eyebrow({ code, label, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-xs font-bold tracking-[0.24em] uppercase",
        className
      )}
    >
      <span className="volt-marker inline-block" aria-hidden="true" />
      <span>
        {code} <span className="opacity-40">/</span> {label}
      </span>
    </p>
  )
}
