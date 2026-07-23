import { neon } from "@neondatabase/serverless"

/**
 * Connection string injected by the Vercel Postgres / Neon integration.
 * `DATABASE_URL` is the current Neon-native var; `POSTGRES_URL` covers the
 * legacy Vercel Postgres naming so this keeps working on either setup.
 */
const CONNECTION_STRING =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL

if (!CONNECTION_STRING) {
  // Surfaced at cold start in the function logs if the DB isn't wired up yet.
  console.warn("[db] No database connection string set (DATABASE_URL/POSTGRES_URL).")
}

export const sql = neon(CONNECTION_STRING ?? "")

let schemaReady = false

/** Create the signups table if it doesn't exist. Idempotent + cached per warm instance. */
export async function ensureSchema(): Promise<void> {
  if (schemaReady) return
  await sql`
    CREATE TABLE IF NOT EXISTS signups (
      id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      contact    TEXT NOT NULL UNIQUE,
      channel    TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      ip         TEXT,
      user_agent TEXT
    )
  `
  schemaReady = true
}
