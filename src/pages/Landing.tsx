import { useEffect } from "react"
import { useLocation } from "react-router-dom"

import { Hero } from "@/sections/Hero"
import { Science } from "@/sections/Science"
import { Tutorial } from "@/sections/Tutorial"
import { Vision } from "@/sections/Vision"

export default function Landing() {
  const { hash } = useLocation()

  useEffect(() => {
    document.title = "ARMO — Make Fitness Fun"
  }, [])

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        // wait a frame so layout is settled after route mount
        requestAnimationFrame(() =>
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        )
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [hash])

  return (
    <main id="main">
      <Hero />
      <Science />
      <Tutorial />
      <Vision />
    </main>
  )
}
