# ARMO

Landing page for ARMO — *Make Fitness Fun.* Get addicted to fitness with an Apple Watch.

Static site (no build step). The page is rendered by `support.js`, a self-contained
runtime that loads React from a CDN at runtime and mounts the `<x-dc>` template in
`index.html`.

A full-page deck of four sections — **Hero**, **Science**, **Tutorial**, and **Vision** —
navigated one slide per scroll gesture (wheel / arrow keys / swipe / nav links), with a
right-edge progress indicator and scroll-triggered reveal animations.

## Run locally

Serve the folder with any static server, e.g.:

```bash
npx serve .
```

Then open the printed URL. (Opening `index.html` directly via `file://` may block the
CDN/font requests in some browsers — prefer a local server.)

## Deploy

Deployed on Vercel as a static site — no framework, no build command. Pushing to the
default branch triggers a new deployment.

## Files

- `index.html` — page markup + reveal/deck navigation logic
- `support.js` — Claude Design runtime (renders the template)
- `image-slot.js` — user-fillable image placeholder custom element
- `assets/` — background video (`hero-bg.mp4`) and product imagery (`apple-watch-black.png`)
