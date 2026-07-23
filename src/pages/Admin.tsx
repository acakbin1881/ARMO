import { Loader2, LogOut, Mail, Phone, RefreshCw, Users } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const TOKEN_KEY = "armo_admin_token"

type Signup = { contact: string; channel: "email" | "phone"; created_at: string }
type Stats = {
  total: number
  emails: number
  phones: number
  recent: Signup[]
}

type Load = "idle" | "loading" | "ready" | "error"

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? "")
  const [draft, setDraft] = useState("")
  const [stats, setStats] = useState<Stats | null>(null)
  const [load, setLoad] = useState<Load>("idle")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = "ARMO — Early Access Admin"
  }, [])

  const fetchStats = useCallback(async (t: string) => {
    setLoad("loading")
    setError(null)
    try {
      const res = await fetch("/api/stats", {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (res.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        setToken("")
        setError("That token was rejected. Try again.")
        setLoad("idle")
        return
      }
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = (await res.json()) as Stats
      setStats(data)
      setLoad("ready")
    } catch {
      setError("Couldn't load stats. Please try again.")
      setLoad("error")
    }
  }, [])

  // Auto-load if a token is already stored.
  useEffect(() => {
    if (token) fetchStats(token)
  }, [token, fetchStats])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const t = draft.trim()
    if (!t) return
    localStorage.setItem(TOKEN_KEY, t)
    setToken(t)
    setDraft("")
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken("")
    setStats(null)
    setLoad("idle")
  }

  if (!token) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-fog px-4">
        <form
          onSubmit={handleLogin}
          className="flex w-full max-w-sm flex-col gap-4 rounded-[calc(var(--radius)+6px)] bg-paper p-8 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_24px_48px_-12px_rgb(0_0_0/0.18)]"
        >
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.18em] text-volt-deep uppercase">
              <span className="volt-marker inline-block" aria-hidden="true" />
              ARMO Admin
            </span>
            <h1 className="text-2xl font-extrabold text-ink">Early access dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Enter the admin token to view signups.
            </p>
          </div>
          <Input
            type="password"
            placeholder="Admin token"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Admin token"
            autoFocus
          />
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button type="submit" size="lg" className="w-full">
            View dashboard
          </Button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-fog px-4 py-12 sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.18em] text-volt-deep uppercase">
              <span className="volt-marker inline-block" aria-hidden="true" />
              ARMO Admin
            </span>
            <h1 className="text-3xl font-extrabold text-ink">Early Access</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchStats(token)}
              disabled={load === "loading"}
            >
              <RefreshCw
                className={load === "loading" ? "animate-spin" : undefined}
                aria-hidden="true"
              />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </header>

        {load === "loading" && !stats ? (
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            Loading&hellip;
          </div>
        ) : null}

        {error && load === "error" ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {stats ? (
          <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard icon={<Users />} label="Total signups" value={stats.total} accent />
              <StatCard icon={<Mail />} label="Email" value={stats.emails} />
              <StatCard icon={<Phone />} label="Phone" value={stats.phones} />
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-mono text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
                Recent signups
              </h2>
              <div className="overflow-hidden rounded-2xl bg-paper shadow-[0_1px_2px_rgb(0_0_0/0.06)]">
                {stats.recent.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No signups yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {stats.recent.map((s, i) => (
                      <li
                        key={`${s.contact}-${i}`}
                        className="flex items-center justify-between gap-3 px-5 py-3"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          {s.channel === "email" ? (
                            <Mail className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          ) : (
                            <Phone className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          )}
                          <span className="truncate text-sm font-medium text-ink">
                            {s.contact}
                          </span>
                        </span>
                        <time className="shrink-0 font-mono text-xs text-muted-foreground">
                          {new Date(s.created_at).toLocaleString()}
                        </time>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  )
}

function StatCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div
      className={
        accent
          ? "flex flex-col gap-3 rounded-2xl bg-ink p-5 text-paper"
          : "flex flex-col gap-3 rounded-2xl bg-paper p-5 text-ink shadow-[0_1px_2px_rgb(0_0_0/0.06)]"
      }
    >
      <span
        className={
          accent
            ? "flex size-9 items-center justify-center rounded-full bg-volt text-ink [&_svg]:size-4"
            : "flex size-9 items-center justify-center rounded-full bg-fog text-ink [&_svg]:size-4"
        }
      >
        {icon}
      </span>
      <span className="text-4xl font-extrabold tabular-nums">{value}</span>
      <span
        className={
          accent
            ? "font-mono text-[11px] font-bold tracking-[0.14em] text-paper/60 uppercase"
            : "font-mono text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase"
        }
      >
        {label}
      </span>
    </div>
  )
}
