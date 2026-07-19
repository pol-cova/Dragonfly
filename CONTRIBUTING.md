# Contributing to Dragonfly

Thank you for your interest in contributing! Dragonfly is an open-source CTF Drop platform built for the Midnight Hackathon.

## Philosophy

- **Open engine, protected live Drops** — engine code, UI, and sample content are open; live puzzle secrets and credentials are not.
- **Privacy by design** — keep credential release, claim math, and Compact contract logic aligned.
- **Honest trust model** — document what Convex vs Midnight enforce when changing validation.

## Getting started

1. Fork the repository
2. Clone your fork and create a branch: `git checkout -b feat/my-feature`
3. Install dependencies:

```bash
pnpm install
npx convex dev    # in one terminal
pnpm dev          # in another
```

4. Run tests before submitting:

```bash
pnpm test
pnpm --filter @dragonfly/web build
```

## What to contribute

| Area | Path | Notes |
| --- | --- | --- |
| Puzzle engine | `packages/drop-engine` | Add tests for new stage types |
| Convex backend | `convex/` | Follow argument validators + auth patterns |
| Web UI | `apps/web` | shadcn/Tailwind, accessible components |
| Wings | `packages/wing-generator` | Deterministic SVG from badge seed |
| Midnight contract | `packages/contracts` | Keep hash domains in sync with `packages/shared` |
| Docs | `docs/` | Architecture, demo script, privacy model |
| Sample Drop | `drops/sample-drop/` | No live secrets |

## What not to commit

- `.env` / `.env.local` files
- Live Drop 001 answers or completion credentials
- Production signing keys, Convex admin keys, wallet seeds
- Files under `drops/live-drop/`

## Pull request checklist

- [ ] Tests pass (`pnpm test`)
- [ ] Web build succeeds (`pnpm --filter @dragonfly/web build`)
- [ ] No secrets or live answers in the diff
- [ ] Claim/hash domains stay aligned across shared, Compact, and client if touched
- [ ] Trust/privacy docs updated if behavior changes

## Code style

- TypeScript strict mode — no `any`
- Match existing naming and file layout
- Keep Convex mutations thin; put logic in plain functions
- Use `returns` validators on public Convex functions

## Reporting issues

- **Bugs & features:** [GitHub Issues](https://github.com/pol-cova/Dragonfly/issues)
- **Security vulnerabilities:** see [SECURITY.md](SECURITY.md) — do not open public issues for credential leaks

## Code of conduct

All contributors must follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Questions

Open a [Discussion](https://github.com/pol-cova/Dragonfly/discussions) or issue with the `question` label.
