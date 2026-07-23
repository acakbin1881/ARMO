import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-full border-[1.5px] border-input bg-fog px-5 text-sm text-ink",
        "transition-colors duration-200 outline-none placeholder:text-muted-foreground",
        "focus-visible:border-ink focus-visible:bg-paper",
        "aria-invalid:border-destructive",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
