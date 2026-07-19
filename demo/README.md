# Dragonfly pitch video (Remotion)

2-minute kinetic pitch for the Midnight Hackathon — SF terminal vibe, honest privacy story.

Standalone Remotion project (not part of the pnpm workspace). Uses its own `npm` install.

## Quick start

```bash
cd demo
npm install
npm run dev          # Remotion Studio — preview & scrub timeline
```

## Render MP4

```bash
cd demo
npx remotion render DragonflyPitch out/dragonfly-pitch.mp4
```

Sanity-check a single frame:

```bash
npx remotion still DragonflyPitch out/still.png --frame=90 --scale=0.25
```

## Edit copy

All on-screen text lives in [`src/lib/copy.ts`](src/lib/copy.ts) — presenter name, hackathon line, live URL, privacy wording.

## Scene timeline (~120s @ 30fps)

| Scene | Duration | Content |
|-------|----------|---------|
| Intro | 0:00–0:14 | **Paul + Manuel** — Midnight Hackathon intro + DRAGONFLY |
| Hook | 0:14–0:22 | Drops / Flights / Wings |
| Product demo | 0:22–1:00 | **Real app screenshots** (home → flight → solvers) |
| Privacy | 1:00–1:26 | Convex referee + honest Midnight note |
| Wing | 1:26–1:44 | Badge reveal + solver board |
| Close | 1:44–2:00 | Vision + live URL |

Product screenshots live in `public/product/` — recapture from [dragonfly.paulcontre.com](https://dragonfly.paulcontre.com) if the UI changes.

## Usage GIFs

Short animated captures of the live app live in [`gif/`](gif/).

```bash
cd demo
npm install
npx playwright install chromium   # first time only
npm run capture:gifs              # records from https://dragonfly.paulcontre.com
```

Offline fallback (Ken Burns from screenshots):

```bash
npm run capture:gifs:fallback
```

| GIF | Flow |
|-----|------|
| `01-browse-drops.gif` | Home — scroll active Drops |
| `02-open-drop.gif` | Open Cipher Nest |
| `03-begin-flight.gif` | Start a Flight |
| `04-solve-stage.gif` | Inspect metadata + type answer |
| `05-solvers-board.gif` | Solvers leaderboard |
| `06-claim-sandbox.gif` | Claim sandbox UI |

## Recording for Devpost

The composition is **text + motion only** (no baked voiceover). Either:

1. **Record a voiceover** while scrubbing in Studio, matching the on-screen lines, or  
2. **Screen-record** the rendered MP4 and speak over it.

**Required:** Open with the intro voiceover — *"We are Paul Contreras and Manuel Contreras — and this is our submission for the Midnight Hackathon!"*

Live URL: **https://dragonfly.paulcontre.com**

Do **not** claim on-chain Midnight verification unless you've wired it.

## Skills

Remotion agent skills were added via:

```bash
npx skills add remotion-dev/skills
```

See `.agents/skills/` at repo root.
