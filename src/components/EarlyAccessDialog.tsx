import { ArrowRight, Check, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

/** Same-origin serverless endpoint (api/early-access.ts) that stores the
 * signup and sends the confirmation email/SMS. */
const ENDPOINT = "/api/early-access"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+()\-.\s\d]{7,}$/

type Contact = { field: "email" | "phone"; value: string }

/** Classify a raw entry as an email or a phone number, or reject it. */
function parseContact(raw: string): Contact | null {
  const value = raw.trim()
  if (value.includes("@")) {
    return EMAIL_RE.test(value) ? { field: "email", value } : null
  }
  const digits = value.replace(/\D/g, "")
  return PHONE_RE.test(value) && digits.length >= 7
    ? { field: "phone", value }
    : null
}

type Status = "idle" | "submitting" | "success" | "error"

type EarlyAccessDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EarlyAccessDialog({
  open,
  onOpenChange,
}: EarlyAccessDialogProps) {
  const [value, setValue] = useState("")
  const [hp, setHp] = useState("") // honeypot — must stay empty for humans
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)

  // Reset the form a beat after the dialog closes so the reset isn't visible
  // during the exit animation.
  useEffect(() => {
    if (open) return
    const timer = setTimeout(() => {
      setValue("")
      setHp("")
      setStatus("idle")
      setError(null)
    }, 300)
    return () => clearTimeout(timer)
  }, [open])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (status === "submitting") return

    const contact = parseContact(value)
    if (!contact) {
      setError("Enter a valid email or phone number.")
      return
    }

    setStatus("submitting")
    setError(null)
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ [contact.field]: contact.value, hp }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      setStatus("success")
    } catch {
      setStatus("error")
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-volt text-ink">
              <Check className="size-7" strokeWidth={3} aria-hidden="true" />
            </span>
            <DialogTitle>You&rsquo;re on the list.</DialogTitle>
            <DialogDescription className="max-w-xs">
              We&rsquo;ll reach out the moment your spot opens. Keep an eye on
              your inbox — or your phone.
            </DialogDescription>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.18em] text-volt-deep uppercase">
                <span className="volt-marker inline-block" aria-hidden="true" />
                Early Access
              </span>
              <DialogTitle>Skip the line.</DialogTitle>
              <DialogDescription>
                Drop your email or phone number and we&rsquo;ll reach out when
                your spot opens.
              </DialogDescription>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
              {/* Honeypot: hidden from humans, tempting to bots. Kept empty = real. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <Input
                type="text"
                inputMode="email"
                autoComplete="email"
                aria-label="Email or phone number"
                aria-invalid={error ? true : undefined}
                placeholder="you@gmail.com  or  +1 555 000 0000"
                value={value}
                disabled={status === "submitting"}
                onChange={(e) => {
                  setValue(e.target.value)
                  if (error) setError(null)
                }}
                autoFocus
              />
              {error ? (
                <p role="alert" className="px-1 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Requesting&hellip;
                  </>
                ) : (
                  <>
                    Request Access
                    <ArrowRight aria-hidden="true" />
                  </>
                )}
              </Button>
              <p className="px-1 text-center text-xs text-muted-foreground">
                By joining you agree to receive a one-time confirmation message.
                No spam &mdash; we&rsquo;ll only reach out about your access.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
