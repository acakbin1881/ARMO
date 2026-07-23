import type { VercelRequest, VercelResponse } from "@vercel/node"

import { ensureSchema, sql } from "./_lib/db"

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).json({ ok: false, error: "Method not allowed" })
  }

  const adminToken = process.env.ADMIN_TOKEN
  if (!adminToken) {
    return res
      .status(500)
      .json({ ok: false, error: "ADMIN_TOKEN is not configured." })
  }

  const auth = req.headers.authorization ?? ""
  const provided = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  if (provided !== adminToken) {
    return res.status(401).json({ ok: false, error: "Unauthorized" })
  }

  try {
    await ensureSchema()

    const [totals] = await sql`
      SELECT
        COUNT(*)::int                                          AS total,
        COUNT(*) FILTER (WHERE channel = 'email')::int         AS emails,
        COUNT(*) FILTER (WHERE channel = 'phone')::int         AS phones
      FROM signups
    `
    const recent = await sql`
      SELECT contact, channel, created_at
      FROM signups
      ORDER BY created_at DESC
      LIMIT 50
    `

    return res.status(200).json({
      ok: true,
      total: totals.total,
      emails: totals.emails,
      phones: totals.phones,
      recent,
    })
  } catch (err) {
    console.error("[stats] error:", err)
    return res.status(500).json({ ok: false, error: "Failed to load stats." })
  }
}
