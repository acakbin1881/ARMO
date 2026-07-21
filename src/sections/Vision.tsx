import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { pop, rise, stagger, VIEWPORT } from "@/lib/motion"

export function Vision() {
  return (
    <section
      id="vision"
      className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden bg-volt px-[clamp(20px,5vw,80px)] py-[clamp(56px,8vh,110px)] text-ink"
    >
      <div className="mx-auto w-full max-w-[1180px]">
        <motion.h2
          className="text-[clamp(36px,5.8vw,84px)] font-black uppercase leading-[0.95] tracking-[-0.01em]"
          variants={stagger(0.1, 0.06)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {"Built for everyone".split(" ").map((word) => (
            <motion.span
              key={word}
              variants={pop}
              className="inline-block whitespace-pre"
            >
              {word}{" "}
            </motion.span>
          ))}
          <span className="block">
            {"the gym lost.".split(" ").map((word) => (
              <motion.span
                key={word}
                variants={pop}
                className="text-outline-ink inline-block whitespace-pre"
              >
                {word}{" "}
              </motion.span>
            ))}
          </span>
        </motion.h2>

        <motion.div
          className="mt-[clamp(24px,4vh,48px)] grid items-start gap-[clamp(24px,5vw,72px)] border-t border-ink/20 pt-[clamp(16px,2.4vh,26px)] md:grid-cols-2"
          variants={stagger(0.1, 0.14)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={rise}>
            <span className="block text-[clamp(46px,6vw,86px)] font-black leading-[0.95] tracking-[-0.02em]">
              1 in 3
            </span>
            <p className="mt-3 text-[clamp(15px,1.25vw,19px)] leading-normal text-ink/70 [text-wrap:pretty]">
              <strong className="font-semibold text-ink">
                adults worldwide don&rsquo;t move enough.
              </strong>{" "}
              Games keep billions glued to screens &mdash; the same psychology
              can get them moving.
            </p>
          </motion.div>
          <motion.p
            variants={rise}
            className="self-center text-[clamp(24px,2.8vw,42px)] font-semibold leading-tight tracking-[-0.02em] [text-wrap:balance]"
          >
            <span className="text-ink/45">We&rsquo;re not fighting screens.</span>
            <br />
            <span className="bg-ink px-1.5 text-volt [box-decoration-break:clone]">
              We&rsquo;re putting them to work.
            </span>
          </motion.p>
        </motion.div>

        <motion.div
          className="dark mt-[clamp(20px,3vh,36px)] flex flex-wrap items-center justify-between gap-x-[clamp(20px,3vw,40px)] gap-y-5 rounded-3xl bg-ink p-[clamp(20px,2.6vw,32px)] text-paper shadow-[0_18px_50px_rgb(10_10_10/0.25)]"
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          <div className="flex min-w-0 max-w-2xl flex-col gap-1.5">
            <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-paper/50">
              Documentation
            </span>
            <span className="text-[clamp(19px,2vw,29px)] font-semibold leading-tight tracking-[-0.015em] [text-wrap:balance]">
              Want the full breakdown? The science, the market strategy &amp;
              more.
            </span>
          </div>
          <Button asChild size="lg">
            <Link to="/docs">
              Read the docs <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </motion.div>

        <div className="mt-[clamp(16px,2.4vh,28px)] flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-ink/55">
          <span>Armo &mdash; Make Fitness Fun</span>
          <span>&copy; 2026</span>
        </div>
      </div>
    </section>
  )
}
