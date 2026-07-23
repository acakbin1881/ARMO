import { Route, Routes } from "react-router-dom"

import Admin from "@/pages/Admin"
import Docs from "@/pages/Docs"
import Landing from "@/pages/Landing"

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-volt px-5 py-2 font-mono text-xs font-bold tracking-widest text-ink uppercase focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  )
}
