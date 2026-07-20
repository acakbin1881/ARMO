import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger(
  props: React.ComponentProps<typeof SheetPrimitive.Trigger>
) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetTitle(props: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title data-slot="sheet-title" {...props} />
}

function SheetDescription(
  props: React.ComponentProps<typeof SheetPrimitive.Description>
) {
  return <SheetPrimitive.Description data-slot="sheet-description" {...props} />
}

function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content>) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm",
          "data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out"
        )}
      />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "dark fixed inset-y-0 right-0 z-50 flex w-[86vw] max-w-sm flex-col bg-ink text-paper shadow-2xl",
          "data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          className="absolute top-5 right-5 rounded-full p-2 text-paper/70 transition-colors hover:bg-paper/10 hover:text-volt"
          aria-label="Close menu"
        >
          <XIcon className="size-6" />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
}
