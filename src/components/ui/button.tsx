import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-sans font-bold tracking-[0.1em] uppercase whitespace-nowrap transition-all duration-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-volt text-ink hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgb(204_255_0/0.35)]",
        ink: "bg-ink text-paper hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgb(10_10_10/0.3)]",
        outline:
          "border-[1.5px] border-current bg-transparent hover:-translate-y-0.5 hover:bg-volt hover:border-volt hover:text-ink",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-5 text-[11px] [&_svg]:size-3.5",
        lg: "h-12 px-7 text-[13px] [&_svg]:size-4",
        sm: "h-8 px-4 text-[10px] [&_svg]:size-3",
        icon: "size-10 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
