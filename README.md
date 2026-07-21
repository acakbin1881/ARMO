# ARMO

Landing site for ARMO — *Make Fitness Fun.* Get addicted to fitness with an
Apple Watch.

## Stack

- **React 19 + TypeScript** on **Vite**
- **Tailwind CSS v4** (CSS-first config in `src/index.css`) with **shadcn/ui**
  primitives (`src/components/ui`)
- **Motion** (Framer Motion) for staggered reveals, springy headline pops, and
  the count-up retention bars — all reveals are transform-only so content is
  never left invisible
- **Lucide** icons, **react-router** (`/` landing deck, `/docs`)

### Design system

Volt `#ccff00` on ink `#0a0a0a` and paper white. Type is the **Apple system
stack** — SF Pro for display and text, SF Mono for telemetry labels, and New
York italic for editorial accents on Apple hardware, with metric-compatible
fallbacks elsewhere (no webfont requests). Semantic tokens live in
`src/index.css` (`@theme` + shadcn CSS variables).

## Pages

- `/` — four-slide scroll deck (Hero video, Science, Tutorial, Vision) with
  CSS scroll-snap, a right-edge slide rail, and a floating frosted-capsule nav
- `/docs` — the full breakdown, with a reading-progress spine (desktop) that
  collapses to a chip nav + hairline progress bar on mobile

## Develop

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build
```

## Deploy

Vercel builds with `npm run build` and serves `dist/` (see `vercel.json`,
which also rewrites all routes to `index.html` for the SPA and redirects the
legacy `/docs.html` URL to `/docs`). Pushing to the default branch triggers a
deployment.
