<p align="center">
  <img src="docs/assets/dragon-banner.png" alt="Dragonfly — private CTF drops on Midnight" width="100%" />
</p>

# Dragonfly

**Solve the challenge. Prove it privately. Claim the Wing.**

Privacy-first CTF **Drops**: timed events with personalized puzzles, private completion proofs on **Midnight**, and unique **Wing** badges on a public solver board.

**Stack:** Next.js · Convex · Midnight Compact · TypeScript monorepo (`apps/web`, `convex/`, `packages/`)

More detail: [architecture](docs/architecture.md) · [privacy model](docs/privacy-model.md) · [judge runbook](docs/judge-runbook.md) · [deploy](docs/deploy.md)

## Quick start

**Requires:** Node 22+, pnpm 10+, [Convex](https://convex.dev)

```bash
git clone https://github.com/pol-cova/Dragonfly.git
cd Dragonfly
pnpm install

npx convex dev          # terminal 1
pnpm convex:sync-env    # after convex dev
pnpm dev                # terminal 2
```

Open [localhost:3000](http://localhost:3000).

```bash
pnpm test                                      # unit tests
cd packages/contracts && pnpm setup            # optional: Midnight contract
```

See [.env.example](.env.example) for environment variables.

## Pitch video (Remotion)

A 2-minute kinetic demo lives in [`demo/`](demo/) — preview with `cd demo && npm run dev`, render with `npx remotion render DragonflyPitch out/dragonfly-pitch.mp4`. See [demo/README.md](demo/README.md).

## Contributing

PRs welcome — please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening one.

**Do not commit:**
- Live Drop answers or solver payloads
- `.env` files or other secrets

**Maintainers:** [@pol-cova](https://github.com/pol-cova) · [@mitosky07](https://github.com/mitosky07)

| | |
|---|---|
| [Security](SECURITY.md) | Report vulnerabilities |
| [Code of Conduct](CODE_OF_CONDUCT.md) | Community standards |
| [MIT License](LICENSE) | Open-source terms |
