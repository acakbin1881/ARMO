import { motion } from "motion/react"

import { CountUp } from "@/components/CountUp"
import { Eyebrow } from "@/components/Eyebrow"
import { EASE, pop, rise, stagger, VIEWPORT } from "@/lib/motion"

function PoppedWords({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={pop}
          className="inline-block whitespace-pre"
        >
          {word}{" "}
        </motion.span>
      ))}
    </span>
  )
}

const PILLARS = [
  {
    title: "Focus",
    body: (
      <>
        When your mind is locked on the game, the burn fades. In studies, heart
        rates said <strong className="font-medium text-ink-2">&ldquo;hard&rdquo;</strong>{" "}
        &mdash; players said{" "}
        <strong className="font-medium text-ink-2">&ldquo;light.&rdquo;</strong>
      </>
    ),
  },
  {
    title: "Form",
    body: (
      <>
        And you can&rsquo;t cheat. Sloppy reps crash the run. Clean form is the
        only way to score.
      </>
    ),
  },
]

export function Science() {
  return (
    <section
      id="science"
      className="relative flex min-h-svh w-full snap-start flex-col justify-center overflow-hidden bg-paper px-[clamp(20px,5vw,80px)] py-[clamp(56px,9vh,120px)] text-ink-2"
    >
      <div className="mx-auto w-full max-w-[1180px]">
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <Eyebrow code="S01" label="Science" />
        </motion.div>

        <motion.h2
          className="stretch-expanded mt-[clamp(18px,2.4vh,30px)] text-[clamp(36px,5.6vw,80px)] font-extrabold leading-[0.98] tracking-[-0.02em]"
          variants={stagger(0.1, 0.06)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <PoppedWords text="Hard on your muscles." className="block" />
          <PoppedWords text="Easy on your brain." className="block text-ink-2/25" />
        </motion.h2>

        <motion.div
          className="mt-[clamp(30px,4.6vh,56px)] grid gap-[clamp(24px,4vw,64px)] sm:grid-cols-2"
          variants={stagger(0.15, 0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {PILLARS.map(({ title, body }) => (
            <motion.div
              key={title}
              variants={rise}
              className="border-t border-border pt-5"
            >
              <h3 className="text-xs font-bold tracking-[0.16em] uppercase">
                {title}
              </h3>
              <p className="mt-2.5 text-[clamp(16px,1.25vw,20px)] leading-normal text-muted-foreground [text-wrap:pretty]">
                {body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-[clamp(30px,4.6vh,58px)] grid items-center gap-[clamp(24px,4vw,60px)] border-t border-border pt-[clamp(20px,3vh,30px)] lg:grid-cols-[1.5fr_1fr]"
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="dark flex flex-col gap-6 rounded-3xl bg-ink p-[clamp(20px,2.6vw,32px)]">
            <div>
              <div className="mb-2.5 flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs tracking-[0.1em] uppercase text-paper/45">
                  Traditional
                </span>
                <span className="text-[clamp(16px,1.3vw,20px)] font-semibold text-paper/45">
                  <CountUp to={50} suffix="%" /> quit
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#26262a]">
                <motion.div
                  className="h-full rounded-full bg-[#46464c]"
                  initial={{ width: 0 }}
                  whileInView={{ width: "50%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2.5 flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-paper">
                  Gamified
                </span>
                <span className="text-[clamp(16px,1.3vw,20px)] font-bold text-volt">
                  <CountUp to={80} suffix="%" />+ stay
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#26262a]">
                <motion.div
                  className="h-full rounded-full bg-volt"
                  initial={{ width: 0 }}
                  whileInView={{ width: "84%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
                />
              </div>
            </div>
          </div>
          <p className="text-[clamp(22px,2vw,32px)] font-semibold leading-tight tracking-[-0.018em] [text-wrap:balance]">
            So we made training{" "}
            <em className="bg-volt px-1.5 font-serif italic [box-decoration-break:clone]">
              a game.
            </em>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
