# Judge runbook

Play Dragonfly in ~3–5 minutes. No repo setup required if a hosted URL is provided.

## Start here

1. Open the deployed app URL (from the team / README)
2. On the home page, pick **Cipher Nest** (`drop-003`) — beginner-friendly
3. Click **open** → **begin flight**

Alternative: **The Silent Signal** (`drop-001`) — same mechanics, intermediate copy.

## Solve (3 stages)

| Stage | What to do |
|-------|------------|
| 1 | Click **inspect metadata** → submit the revealed fragment |
| 2 | Decode the cipher using the **flight key** shown on screen |
| 3 | Reconstruct `A:B:tail:clue` from the panel values |

Each Flight gets unique cipher values. Wrong answers shake the input; you can retry.

## Claim your Wing

1. After stage 3 you are redirected to **claim wing**
2. Click **prove and claim**
3. View your Wing → check **solvers** board for your alias

No Lace wallet or Midnight setup is required for this demo path.

## What is verified today

| Layer | Role |
|-------|------|
| **Convex** | Stage answers, credential release, solver board |
| **Local claim math** | BLAKE2b commitment → badge seed (browser + Convex) |
| **Midnight chain** | Contract exists; on-chain `claimWing` is **not** wired in the web UI yet |

Answers and credentials are never shown on the public solver board — only alias + Wing.

## If something breaks

- **“drop unavailable”** — Convex backend not running or wrong `NEXT_PUBLIC_CONVEX_URL`
- **“Drop is not open”** — reload home once (bootstrap extends judge windows); contact team if still closed
- **“Drop closed”** on claim — window expired; team should re-sync judge windows

## For presenters

See [demo-script.md](./demo-script.md) for the 2-minute pitch. Do **not** claim Midnight verifies on-chain unless the team has wired the chain path.
