# Deploying for judges

Host Convex + Next.js so judges can play without cloning the repo.

## Prerequisites

- [Convex](https://convex.dev) account
- [Vercel](https://vercel.com) account (or any Next.js host)
- Node 22+, pnpm 10+

## 1. Convex (backend)

```bash
pnpm install
npx convex login
npx convex deploy
```

Note the deployment URL (e.g. `https://your-project.convex.cloud`).

On first deploy, drops are seeded when a judge opens the home page (`bootstrapActiveDrop`). Judge windows for **Cipher Nest** and **The Silent Signal** are extended automatically on each bootstrap.

To re-seed a **fresh** deployment before judging:

1. Open the Convex dashboard → Data → delete `drops` rows (optional clean slate)
2. Load the deployed site once, or run `pnpm smoke:judge` against the deployment URL

## 2. Vercel (frontend)

1. Import the GitHub repo in Vercel
2. Set **Root Directory** to `apps/web`
3. Add environment variable:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_CONVEX_URL` | Your Convex deployment URL from step 1 |

4. Deploy

The included [`apps/web/vercel.json`](../apps/web/vercel.json) runs install/build from the monorepo root.

## 3. Verify before judges arrive

```bash
export NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
pnpm smoke:judge
```

All checks should pass. Then open the Vercel URL and play **Cipher Nest** (`/drop/drop-003`) end-to-end.

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex deployment URL |
| `NEXT_PUBLIC_MIDNIGHT_*` | No | Not used by claim UX today (local referee) |
| `DRAGONFLY_ACTIVE_DROP_PATH` | No | Reserved; catalog is seeded from code |

## Local dev (unchanged)

```bash
npx convex dev          # terminal 1
pnpm convex:sync-env    # sync URL to apps/web
pnpm dev                # terminal 2
```
