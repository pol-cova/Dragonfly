# Dragonfly

**Solve the challenge. Prove it privately. Claim the Wing.**

Privacy-first CTF **Drops**: timed events with personalized puzzles, private completion proofs on **Midnight**, and unique **Wing** badges on a public solver board.

**Stack:** Next.js · Convex · Midnight Compact · TypeScript monorepo (`apps/web`, `convex/`, `packages/`)

More detail: [architecture](docs/architecture.md) · [privacy model](docs/privacy-model.md)

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

## Contributing

PRs welcome — read [CONTRIBUTING.md](CONTRIBUTING.md). Do not commit live Drop answers or `.env` files.

[Security](SECURITY.md) · [Code of Conduct](CODE_OF_CONDUCT.md) · [MIT License](LICENSE) © [pol-cova](https://github.com/pol-cova)
