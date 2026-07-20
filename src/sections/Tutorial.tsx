import { motion } from "motion/react"

import { Eyebrow } from "@/components/Eyebrow"
import { Marquee } from "@/components/Marquee"
import { pop, rise, stagger, VIEWPORT } from "@/lib/motion"

const STEPS = [
  { num: "01", title: "Wear your Apple Watch.", sub: null },
  { num: "02", title: "Pick a game.", sub: "Curl to fly. Punch to fight." },
  { num: "03", title: "Move to play.", sub: "Good form scores. Cheating crashes." },
]

export function Tutorial() {
  return (
    <section
      id="tutorial"
      className="dark relative flex min-h-svh w-full snap-start flex-col justify-center overflow-hidden bg-ink px-[clamp(20px,5vw,80px)] pt-[clamp(48px,7vh,96px)] pb-[clamp(88px,12vh,128px)] text-paper"
    >
      <div className="mx-auto w-full max-w-[1240px]">
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <Eyebrow code="S02" label="Tutorial" />
        </motion.div>

        <motion.h2
          className="stretch-expanded mt-[clamp(14px,2vh,24px)] text-[clamp(34px,5.2vw,74px)] font-extrabold leading-[0.98] tracking-[-0.02em]"
          variants={stagger(0.1, 0.06)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {"Your reps are the".split(" ").map((word) => (
            <motion.span
              key={word}
              variants={pop}
              className="inline-block whitespace-pre"
            >
              {word}{" "}
            </motion.span>
          ))}
          <motion.span variants={pop} className="inline-block text-volt">
            controller.
          </motion.span>
        </motion.h2>

        <div className="mt-[clamp(26px,4vh,48px)] grid items-center gap-[clamp(28px,5vw,72px)] md:grid-cols-[0.78fr_1.22fr]">
          <motion.div
            className="relative aspect-4/5 w-full max-w-[340px] justify-self-center overflow-hidden rounded-[30px] bg-paper shadow-[0_30px_70px_rgb(0_0_0/0.45)]"
            initial={{ scale: 0.92 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ rotate: -1.5, scale: 1.02 }}
          >
            <div className="animate-float absolute inset-0 flex items-center justify-center">
              <img
                src="/assets/apple-watch-black.png"
                alt="Apple Watch running an ARMO game"
                className="h-full w-auto max-w-none"
              />
            </div>
          </motion.div>

          <motion.ol
            className="flex flex-col gap-[clamp(14px,2.2vh,24px)]"
            variants={stagger(0.2, 0.14)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            {STEPS.map(({ num, title, sub }) => (
              <motion.li
                key={num}
                variants={rise}
                className="grid grid-cols-[auto_1fr] items-baseline gap-[clamp(16px,1.6vw,26px)] border-t border-paper/15 pt-[clamp(14px,1.8vh,20px)]"
              >
                <span className="font-mono text-[clamp(18px,1.9vw,28px)] leading-none font-bold text-volt">
                  {num}
                </span>
                <div>
                  <h3 className="text-[clamp(18px,1.65vw,25px)] font-semibold leading-tight tracking-[-0.012em]">
                    {title}
                  </h3>
                  {sub && (
                    <p className="mt-1 text-[clamp(14px,1.2vw,18px)] text-paper/60">
                      {sub}
                    </p>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>

        <motion.p
          className="mt-[clamp(22px,3.4vh,42px)] border-t border-paper/15 pt-[clamp(14px,1.8vh,20px)] text-[clamp(14px,1.2vw,18px)] text-paper/60 [text-wrap:pretty]"
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          The game levels up as you get stronger.
        </motion.p>
      </div>

      {/* The game loop, looping */}
      <div className="absolute inset-x-0 bottom-0 border-t border-paper/15 py-4">
        <Marquee
          items={["Open", "Play", "Train", "Repeat"]}
          className="font-mono text-[13px] font-bold tracking-[0.22em] uppercase text-paper/70"
        />
      </div>
    </section>
  )
}
