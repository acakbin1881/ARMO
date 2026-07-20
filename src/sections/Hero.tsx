import { motion } from "motion/react"

import { SiteHeader } from "@/components/SiteHeader"
import { EASE } from "@/lib/motion"

const LINES = [
  { text: "Make", className: "text-outline-paper" },
  { text: "Fitness", className: "text-outline-paper" },
  { text: "Fun.", className: "text-volt" },
]

export function Hero() {
  return (
    <section
      id="hero"
      className="dark relative flex min-h-svh w-full snap-start flex-col overflow-hidden bg-ink text-paper"
    >
      <motion.video
        className="absolute inset-0 z-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        <source src="/assets/hero-bg.mp4" type="video/mp4" />
      </motion.video>
      <div
        className="absolute inset-x-0 bottom-0 z-0 h-3/5 bg-gradient-to-t from-ink to-transparent"
        aria-hidden="true"
      />

      <SiteHeader variant="landing" />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-[clamp(20px,5vw,72px)] pt-20 pb-6">
        <motion.h1
          aria-label="Make Fitness Fun"
          className="stretch-expanded flex flex-col items-start font-black uppercase leading-[0.92] tracking-[-0.01em]"
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.13, delayChildren: 0.25 }}
        >
          {LINES.map(({ text, className }) => (
            <span key={text} className="overflow-hidden py-[0.04em]">
              <motion.span
                className={`block text-[clamp(52px,10.5vw,164px)] ${className}`}
                variants={{
                  hidden: { y: "110%" },
                  show: {
                    y: 0,
                    transition: { duration: 0.9, ease: EASE },
                  },
                }}
              >
                {text}
              </motion.span>
            </span>
          ))}
        </motion.h1>
      </div>

      <motion.div
        className="relative z-10 max-w-xl px-[clamp(20px,5vw,72px)] pb-[clamp(28px,5vh,56px)]"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
      >
        <h2 className="text-[clamp(26px,3.2vw,42px)] font-semibold leading-[1.08] tracking-[-0.012em]">
          Get{" "}
          <em className="font-serif font-medium italic text-volt">addicted</em>{" "}
          to fitness
          <span className="block font-normal text-paper/55">
            with an Apple Watch
          </span>
        </h2>
        <p className="mt-4 text-[clamp(16px,1.4vw,20px)] leading-normal text-paper/85 [text-wrap:pretty]">
          We bridge the &lsquo;dopamine gap&rsquo;. Every curl and every hold
          delivers immediate digital rewards, creating a powerful reinforcement
          loop that makes you actually crave your next workout.
        </p>
      </motion.div>
    </section>
  )
}
