import { ArrowLeft } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState, type ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"

import { Eyebrow } from "@/components/Eyebrow"
import { SiteHeader } from "@/components/SiteHeader"
import { rise } from "@/lib/motion"
import { cn } from "@/lib/utils"

/* ── Section map ─────────────────────────────────────────────── */

type NavEntry = { id: string; label: string; subs?: { id: string; label: string }[] }

const NAV: NavEntry[] = [
  { id: "welcome", label: "Welcome" },
  { id: "exercise", label: "A new way to exercise" },
  {
    id: "science",
    label: "Science",
    subs: [
      { id: "sci-easier", label: "Why games feel easier" },
      { id: "sci-bodybrain", label: "Body & brain together" },
      { id: "sci-strength", label: "Real strength gains" },
      { id: "sci-who", label: "Who benefits most" },
      { id: "sci-vs", label: "Games vs. workouts" },
      { id: "sci-wrap", label: "Wrap-up" },
    ],
  },
  {
    id: "market",
    label: "Market Strategy",
    subs: [
      { id: "mkt-competitors", label: "Competitor analysis" },
      { id: "mkt-app", label: "Launching as an app" },
      { id: "mkt-bands", label: "Wearable bands" },
    ],
  },
]

const ALL_IDS = NAV.flatMap((s) => [s.id, ...(s.subs?.map((x) => x.id) ?? [])])
const PARENT_OF = Object.fromEntries(
  NAV.flatMap((s) => s.subs?.map((x) => [x.id, s.id] as const) ?? [])
)

const SPY_LINE = 120

/* ── Scroll hooks ────────────────────────────────────────────── */

function useReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const paint = () => {
      const max = document.body.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    paint()
    window.addEventListener("scroll", paint, { passive: true })
    window.addEventListener("resize", paint)
    return () => {
      window.removeEventListener("scroll", paint)
      window.removeEventListener("resize", paint)
    }
  }, [])
  return progress
}

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const paint = () => {
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top - SPY_LINE <= 0) current = id
      }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        current = ids[ids.length - 1]
      }
      setActive(current)
    }
    paint()
    window.addEventListener("scroll", paint, { passive: true })
    window.addEventListener("resize", paint)
    return () => {
      window.removeEventListener("scroll", paint)
      window.removeEventListener("resize", paint)
    }
  }, [ids])
  return active
}

/* ── Building blocks ─────────────────────────────────────────── */

function FadeIn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

function Body({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-[clamp(16px,1.15vw,18.5px)] leading-[1.72] text-[#3a3a3e] [text-wrap:pretty] first:mt-0 [&_strong]:font-semibold [&_strong]:text-ink">
      {children}
    </p>
  )
}

function Sub({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="mt-[clamp(30px,4vh,46px)] scroll-mt-32 text-[clamp(20px,1.9vw,26px)] font-semibold leading-tight tracking-[-0.014em] text-ink"
    >
      {children}
    </h3>
  )
}

function DocSection({
  id,
  code,
  title,
  lede,
  children,
}: {
  id: string
  code: string
  title: string
  lede?: ReactNode
  children?: ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-32 border-t border-border py-[clamp(42px,6vh,70px)] first:border-t-0 first:pt-2"
    >
      <FadeIn>
        <Eyebrow code={code} label="04" className="text-ink" />
        <h2 className="mt-[clamp(15px,2.2vh,22px)] text-[clamp(32px,4.6vw,56px)] font-extrabold leading-none tracking-[-0.02em] text-ink [text-wrap:balance]">
          {title}
        </h2>
        {lede && (
          <p className="mt-[clamp(16px,2vh,22px)] text-[clamp(18px,1.55vw,23px)] leading-normal tracking-[-0.012em] text-ink-2 [text-wrap:pretty]">
            {lede}
          </p>
        )}
      </FadeIn>
      {children}
    </section>
  )
}

/* ── Reading-progress spine (desktop) + chip nav (mobile) ────── */

function Rail({ progress, active }: { progress: number; active: string }) {
  const primaryActive = PARENT_OF[active] ?? active
  const activeIdx = NAV.findIndex((s) => s.id === primaryActive)

  useEffect(() => {
    // keep the active chip centered in the mobile strip
    document
      .querySelector(`[data-chip="${active}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center" })
  }, [active])

  return (
    <aside
      aria-label="Documentation sections"
      className={cn(
        "sticky z-40 bg-paper",
        "top-[78px] -mx-[clamp(20px,5vw,72px)] mb-6 flex items-center gap-4 border-b border-border px-[clamp(20px,5vw,72px)] py-2.5",
        "lg:top-24 lg:mx-0 lg:mb-0 lg:block lg:self-start lg:border-b-0 lg:bg-transparent lg:p-0"
      )}
    >
      {/* Meter */}
      <div className="flex shrink-0 items-baseline gap-2.5 lg:pb-6">
        <span className="text-[21px] font-extrabold tracking-[-0.03em] tabular-nums text-ink lg:text-[clamp(34px,3vw,44px)]">
          {Math.round(progress * 100)}%
        </span>
        <span className="hidden font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground lg:inline">
          Read
        </span>
      </div>

      {/* Nav — chips on mobile, spine on desktop */}
      <nav className="relative flex min-w-0 gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:block lg:overflow-visible lg:pl-[30px]">
        <div
          className="absolute top-2 bottom-2 left-[5px] hidden w-0.5 rounded-full bg-border lg:block"
          aria-hidden="true"
        >
          <div
            className="w-full rounded-full bg-volt transition-[height] duration-150 ease-linear"
            style={{ height: `${progress * 100}%` }}
          />
        </div>

        {NAV.map((section, i) => (
          <div key={section.id} className="contents lg:block">
            <a
              href={`#${section.id}`}
              data-chip={section.id}
              aria-current={primaryActive === section.id ? "true" : undefined}
              className={cn(
                "relative block shrink-0 px-3 py-2 text-sm whitespace-nowrap transition-colors lg:px-0 lg:py-2.5 lg:whitespace-normal",
                "border-b-2 lg:border-b-0",
                primaryActive === section.id
                  ? "border-volt font-bold text-ink"
                  : "border-transparent text-[#86868b] hover:text-ink"
              )}
            >
              <span
                className={cn(
                  "absolute top-1/2 -left-[28.5px] hidden size-[9px] -translate-y-1/2 transition-all lg:block",
                  i <= activeIdx
                    ? "bg-volt shadow-[0_0_0_1.5px_#0a0a0a]"
                    : "bg-paper shadow-[0_0_0_1.5px_#c6c6ce]"
                )}
                aria-hidden="true"
              />
              {section.label}
            </a>
            {section.subs?.map((sub) => (
              <a
                key={sub.id}
                href={`#${sub.id}`}
                className={cn(
                  "hidden py-1.5 pl-3.5 text-[12.5px] transition-colors lg:block",
                  active === sub.id
                    ? "font-semibold text-ink"
                    : "text-[#a8a8af] hover:text-ink"
                )}
              >
                {sub.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}

/* ── Page ────────────────────────────────────────────────────── */

export default function Docs() {
  const progress = useReadingProgress()
  const active = useScrollSpy(ALL_IDS)
  const { hash } = useLocation()

  useEffect(() => {
    document.title = "ARMO — Docs"
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) {
      requestAnimationFrame(() =>
        target.scrollIntoView({ behavior: "auto", block: "start" })
      )
    } else {
      window.scrollTo(0, 0)
    }
    // deep-link resolution should only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* Mobile-only hairline reading bar */}
      <div
        className="fixed top-0 left-0 z-[60] h-[3px] bg-volt transition-[width] duration-150 ease-linear lg:hidden"
        style={{ width: `${progress * 100}%` }}
        aria-hidden="true"
      />

      <SiteHeader variant="docs" />

      <div className="mx-auto grid max-w-[1160px] grid-cols-1 px-[clamp(20px,5vw,72px)] pt-14 pb-32 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-[clamp(40px,5.5vw,84px)] lg:pt-[clamp(90px,5vw,120px)]">
        <Rail progress={progress} active={active} />

        <main id="main" className="max-w-[740px]">
          <DocSection
            id="welcome"
            code="S01"
            title="Welcome"
            lede={
              <>
                This is the breakdown of healthtech start-up
                &ldquo;Armo&rdquo;. Today, there are countless products that
                track human health. But Armo is directly boosting human health
                by using something a lot of people already have. A smart watch
                and a laptop camera.
              </>
            }
          />

          <DocSection id="exercise" code="S02" title="A new way to exercise">
            <FadeIn className="mt-5">
              <Body>
                The reason most people quit the gym isn&rsquo;t laziness.
                Lifting the same weight, counting the same reps, staring at the
                same wall: the body could keep going, but the mind checks out.
                It&rsquo;s also painful for most people: A bunch of exercises,
                hours of sessions every week, slow progress.
              </Body>
              <Body>
                What if there was a way to feel less tired? What if there was a
                way to turn these repetitive exercises into a game and gain
                more progress directly? What if there was a way to make
                exercising addictive? We found a way. Therefore, all you need
                is an apple watch.
              </Body>
              <Body>
                Exergaming flips the problem on its head. Strap a small motion
                sensor to your arm, link it to a game, and every rep now does
                something: It flies a bird, clears an obstacle, scores a point.
                You&rsquo;re not exercising anymore; you&rsquo;re playing. And
                people don&rsquo;t quit games.
              </Body>
            </FadeIn>
          </DocSection>

          <DocSection id="science" code="S03" title="Science">
            <FadeIn>
              <Sub id="sci-easier">Why Games Make Exercise Feel Easier</Sub>
              <Body>
                Your brain has a limited amount of attention to spend. In a
                normal workout, all of it gets swallowed by the burn in your
                muscles, your breathing, and the rep count, so the effort feels
                brutal even when you&rsquo;ve got plenty left in the tank.
                Point that attention at a screen instead, and something
                remarkable happened in the studies: the same workout feels
                light. Your heart rate says &ldquo;hard,&rdquo; but your mind
                says &ldquo;easy.&rdquo; That gap is the secret weapon; it lets
                people train longer, harder, and more often without ever
                hitting the mental wall that ends most workouts early.
              </Body>
            </FadeIn>

            <FadeIn>
              <Sub id="sci-bodybrain">
                Working the Body and Brain at the Same Time
              </Sub>
              <Body>
                A standard weightlifting rep only asks one thing of you: move
                the weight. But the moment you have to react to a game while
                you lift (slow down to thread a gap, freeze to dodge an
                obstacle, decide in a split second) your brain and body are
                working as a team. That combination doesn&rsquo;t just burn
                more calories; it builds sharper focus, better memory, and
                stronger self control. You&rsquo;re not choosing between a
                workout and a brain-training app. You&rsquo;re getting both in
                the same motion.
              </Body>
            </FadeIn>

            <FadeIn>
              <Sub id="sci-strength">Real Muscle and Strength Gains</Sub>
              <Body>
                This isn&rsquo;t a glorified step counter. Because the sensor
                reads how fast and how smoothly you move, the game can insist
                on the things that actually build muscle and quietly refuse to
                reward you for cheating with momentum. As you improve, the game
                gets harder, which means your muscles never stop being
                challenged. The result is genuine strength and size, earned
                through a workout that felt like fun.
              </Body>
            </FadeIn>

            <FadeIn>
              <Sub id="sci-who">Who Benefits Most</Sub>
              <ul className="mt-5 flex flex-col gap-4">
                {[
                  <>
                    People who are willing to improve their health and body but
                    find exercising boring, painful and repetitive.
                  </>,
                  <>
                    <strong>Kids.</strong> Parents can prevent their children
                    from developing harmful habits, such as excessive screen
                    time, and guide them to physical exercise, thus improving
                    their health.
                  </>,
                  <>
                    <strong>Older Adults.</strong> The danger isn&rsquo;t just
                    weakness, it&rsquo;s the fall that weakness invites. Game
                    based strength training rebuilds the balance and leg
                    strength that keep people on their feet, while removing the
                    two barriers that stop most seniors from ever starting:
                    boredom and fear.
                  </>,
                  <>
                    <strong>Group Workouts.</strong> People can compete during
                    the group exercises, which makes workouts more engaging and
                    fun.
                  </>,
                ].map((item, i) => (
                  <li
                    key={i}
                    className="relative pl-[30px] text-[clamp(16px,1.15vw,18.5px)] leading-relaxed text-[#3a3a3e] [text-wrap:pretty] before:absolute before:top-[0.5em] before:left-0 before:size-2.5 before:bg-volt before:shadow-[0_0_0_1.5px_#0a0a0a] [&_strong]:font-semibold [&_strong]:text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn>
              <Sub id="sci-vs">Games vs. Regular Workouts</Sub>
              <Body>
                Put them side by side and it isn&rsquo;t close. Where ordinary
                programs lose most people within weeks, game-based training
                keeps the large majority coming back. Because it&rsquo;s
                enjoyable even when it&rsquo;s intense, which almost nothing
                else manages. And because the game keeps changing, your body
                never settles into autopilot. Same effort, dramatically better
                staying power.
              </Body>
            </FadeIn>

            <FadeIn>
              <Sub id="sci-wrap">Wrap-Up</Sub>
              <Body>
                Exercising becomes fun, easier, beneficial for memory and
                intelligent, more efficient, engaging. Also you don&rsquo;t
                need to get expensive and complicated set ups. For all these
                advantages, the only thing you need is to launch Armo on your
                apple watch.
              </Body>
            </FadeIn>
          </DocSection>

          <DocSection id="market" code="S04" title="Market Strategy">
            <FadeIn>
              <Sub id="mkt-competitors">Competitor analysis</Sub>
              <Body>
                Our main competitors are Stealth Core Trainer and Quell.
                Stealth proved demand by selling 500K+ units for $179 each, but
                it is limited to gamifying only one exercise. Quell showed
                people want immersive fitness gaming, but its $269 hardware,
                subscription, PC/TV setup, and content-heavy game made it too
                complex and led to its going out of business. We think the
                winner is a lightweight software layer on devices people
                already own, starting simple and expanding beyond one exercise.
              </Body>

              <figure className="mt-6 overflow-hidden rounded-2xl border border-border">
                <figcaption className="flex items-center gap-2.5 border-b border-border bg-[#fbfbfa] px-4.5 py-3 font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
                  <span className="size-2 bg-volt shadow-[0_0_0_1.5px_#0a0a0a]" aria-hidden="true" />
                  What the market already proved
                </figcaption>
                {[
                  {
                    name: "Stealth Core Trainer",
                    stat: "500K+ units · $179",
                    verdict: (
                      <>
                        <strong>Proved the demand</strong> &mdash; but gamifies
                        only one exercise.
                      </>
                    ),
                  },
                  {
                    name: "Quell",
                    stat: "$269 + subscription",
                    verdict: (
                      <>
                        <strong>Proved the appetite</strong> &mdash; but
                        hardware, a PC/TV setup, and heavy content made it too
                        complex. Shut down.
                      </>
                    ),
                  },
                ].map(({ name, stat, verdict }) => (
                  <div
                    key={name}
                    className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 border-t border-[#ededf0] px-4.5 py-4 first-of-type:border-t-0"
                  >
                    <span className="text-base font-bold tracking-[-0.01em] text-ink">
                      {name}
                    </span>
                    <span className="text-right font-mono text-[13.5px] font-bold whitespace-nowrap text-ink">
                      {stat}
                    </span>
                    <span className="col-span-2 text-sm leading-snug text-muted-foreground [&_strong]:font-semibold [&_strong]:text-ink">
                      {verdict}
                    </span>
                  </div>
                ))}
              </figure>
            </FadeIn>

            <FadeIn>
              <Sub id="mkt-app">Launching as an app</Sub>
              <Body>
                Armo will launch with a freemium subscription model as an app
                for all the smart watches. The free tier will let users try a
                few basic games and experience the core product. The premium
                tier will unlock a larger catalog of games, online
                leaderboards, multiplayer challenges, and personalized
                workouts.
              </Body>
            </FadeIn>

            <FadeIn>
              <Sub id="mkt-bands">
                Expanding into the market with wearable bands
              </Sub>
              <Body>
                People who don&rsquo;t own smartwatches will be able to buy
                cost-effective, simple, and stylish straps designed for daily
                use. These bands will feature accelerometers and Bluetooth,
                allowing users to enjoy the same experience as smartwatch
                users.
              </Body>
            </FadeIn>
          </DocSection>

          <footer className="mt-1.5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7">
            <span className="font-mono text-xs font-bold tracking-[0.16em] uppercase text-muted-foreground">
              Armo · Make Fitness Fun
            </span>
            <Link
              to="/"
              className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-[0.16em] uppercase text-ink transition-opacity hover:opacity-55"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" /> Back to home
            </Link>
          </footer>
        </main>
      </div>
    </>
  )
}
