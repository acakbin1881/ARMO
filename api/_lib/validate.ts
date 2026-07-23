/**
 * Server-side contact parsing — mirrors parseContact in the EarlyAccessDialog,
 * but also normalizes phone numbers to E.164 for Twilio.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ParsedContact =
  | { channel: "email"; value: string }
  | { channel: "phone"; value: string }

/**
 * Normalize a raw phone entry to E.164 (+15551234567), or null if implausible.
 * Assumes US (+1) when given exactly 10 national digits with no country code.
 */
function toE164(raw: string): string | null {
  const trimmed = raw.trim()
  const hasPlus = trimmed.startsWith("+")
  const digits = trimmed.replace(/\D/g, "")

  if (hasPlus) {
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null
  }
  if (digits.length === 10) return `+1${digits}` // assume US
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`
  return null
}

/** Classify + normalize a raw entry, or return null if it's neither valid form. */
export function parseContact(raw: unknown): ParsedContact | null {
  if (typeof raw !== "string") return null
  const value = raw.trim()
  if (!value) return null

  if (value.includes("@")) {
    return EMAIL_RE.test(value)
      ? { channel: "email", value: value.toLowerCase() }
      : null
  }

  const e164 = toE164(value)
  return e164 ? { channel: "phone", value: e164 } : null
}
