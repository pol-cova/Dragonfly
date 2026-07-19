# Two-Minute Demo Script

## 0:00–0:12 — Hook

> "We are Paul Contreras and Manuel Contreras — and this is our submission for the Midnight Hackathon. Dragonfly turns CTF challenges into limited-time Drops where players prove completion without publicly revealing their solution."

Show active Drop and countdown on home page.

## 0:12–0:42 — Gameplay

Show active Drops, then start a Flight — recommend **Cipher Nest** (beginner judge path).

- Stage 1: Find Fragment A in transmission metadata
- Stage 2: Decode cipher with Flight-specific key
- Stage 3: Reconstruct signal in terminal

Note that another player / another Flight receives different cipher values.

## 0:42–1:15 — Privacy proof

Complete Stage 3 → Claim screen → Prove and Claim.

> "Convex validated my stages privately. The completion credential is released only to my session — never published on the solver board. Claim uses a local commitment check today; our Midnight `claimWing` circuit is built and ready to wire for on-chain verification."

Do **not** say Midnight verifies on-chain unless the team has deployed that path.

## 1:15–1:38 — Reward

Reveal Wing, alias, verified state, solver board entry.

## 1:38–1:52 — Scarcity

Show closed Drop state (or explain closing window).

## 1:52–2:00 — Vision

> "Dragonfly can power recurring CTF events, university challenges, security training, and private technical competitions."

## Judge link

Share [judge-runbook.md](./judge-runbook.md) and the deployed URL before judging.

## Remotion pitch (optional)

For a motion-graphic version of this script, see [`demo/`](../demo/) — `npm run dev` in that folder opens Remotion Studio. Render with:

```bash
cd demo && npx remotion render DragonflyPitch out/dragonfly-pitch.mp4
```

If you record voiceover over the render, still say the hackathon name at the start.
