import type { VercelRequest, VercelResponse } from "@vercel/node"

import { ensureSchema, sql } from "./_lib/db"
import { sendEmail, sendSms } from "./_lib/notify"
import { parseContact } from "./_lib/validate"

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed" })
  }

  // Vercel parses JSON bodies automatically; fall back for string bodies.
  const body =
    typeof req.body === "string" ? safeParse(req.body) : req.body ?? {}
  const { email, phone, hp } = body as {
    email?: string
    phone?: string
    hp?: string
  }

  // Honeypot: real users never fill this. Pretend success to bots.
  if (typeof hp === "string" && hp.trim() !== "") {
    return res.status(200).json({ ok: true })
  }

  const contact = parseContact(email ?? phone)
  if (!contact) {
    return res
      .status(400)
      .json({ ok: false, error: "Enter a valid email or phone number." })
  }

  try {
    await ensureSchema()

    const ip =
      (req.headers["x-forwarded-for"] as string | undefined)
        ?.split(",")[0]
        ?.trim() ?? null
    const userAgent = (req.headers["user-agent"] as string | undefined) ?? null

    const inserted = await sql`
      INSERT INTO signups (contact, channel, ip, user_agent)
      VALUES (${contact.value}, ${contact.channel}, ${ip}, ${userAgent})
      ON CONFLICT (contact) DO NOTHING
      RETURNING id
    `

    // Only send a confirmation for a genuinely new signup (empty on dupe).
    const isNew = inserted.length > 0
    if (isNew) {
      try {
        if (contact.channel === "email") await sendEmail(contact.value)
        else await sendSms(contact.value)
      } catch (notifyErr) {
        // Signup is stored — a failed confirmation shouldn't fail the request.
        console.error("[early-access] confirmation send failed:", notifyErr)
      }
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error("[early-access] error:", err)
    return res
      .status(500)
      .json({ ok: false, error: "Something went wrong. Please try again." })
  }
}

function safeParse(input: string): Record<string, unknown> {
  try {
    return JSON.parse(input)
  } catch {
    return {}
  }
}
