# Dragonfly

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-10.14-orange)](package.json)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](apps/web)
[![Convex](https://img.shields.io/badge/Convex-backend-FF6B6B)](https://convex.dev)
[![Midnight Hackathon](https://img.shields.io/badge/Midnight-Hackathon-7C3AED)](https://midnight.network)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](package.json)

**Solve the challenge. Prove it privately. Claim the Wing.**

> **TL;DR** — Dragonfly is a privacy-first CTF *Drop* platform built for the **Midnight Hackathon**. Players enter a timed event, solve three personalized puzzle stages, then use **Midnight** to prove they hold a completion credential **without publishing answers**. Winners claim a unique **Wing** badge and appear on a public solver board.

---

## What is Dragonfly?

Dragonfly turns capture-the-flag into a **live, limited-time Drop** — closer to a game event than a static puzzle site.

| Traditional CTF | Dragonfly Drop |
| --- | --- |
| Answers often leak in write-ups | Answers stay private; only commitments are public |
| Same puzzle for everyone | Each **Flight** gets a personalized variation |
| Proof = paste the flag | Proof = private credential + optional on-chain claim |
| Reward = points on a board | Reward = a **Wing** (deterministic SVG badge) |

**Drop 001 — *The Silent Signal*** is the hackathon demo: recon → cryptography → terminal reconstruction, then a private claim flow.

---

## How it works

```text
Player → Convex (game referee)     Midnight (private claim layer)
         ├── Start Flight           ├── Witness: completion credential
         ├── 3 puzzle stages        ├── Verify commitment match
         ├── Release credential     ├── Nullifier (no double-claim)
         └── Solver board           └── Badge seed → Wing
```

| Layer | Role |
| --- | --- |
| **Next.js** (`apps/web`) | UI — Drop, Flight, claim, Wing reveal, solver board |
| **Convex** (`convex/`) | Game referee — puzzles, validation, credential release |
| **Midnight Compact** (`packages/contracts`) | Private claim — commitment verification, nullifiers |
| **drop-engine** | Personalized puzzle generation per Flight |
| **wing-generator** | Deterministic SVG Wings from badge seed |

See [docs/architecture.md](docs/architecture.md) and [docs/privacy-model.md](docs/privacy-model.md) for the trust model.

---

## Quick start

### Prerequisites

- **Node.js 22+** and **pnpm 10+**
- **Convex** account (or local anonymous mode for dev)
- Optional (on-chain claims): Docker, Compact compiler 0.31, Lace wallet

### Run locally

```bash
git clone https://github.com/pol-cova/Dragonfly.git
cd Dragonfly
pnpm install

# Terminal 1 — Convex backend
npx convex dev

# Terminal 2 — sync env + web app
pnpm convex:sync-env
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The home page seeds Drop 001 automatically.

Set `NEXT_PUBLIC_CONVEX_URL` in `apps/web/.env.local` (or run `pnpm convex:sync-env` after `convex dev`).

### Tests

```bash
pnpm test
```

### Midnight contract (optional)

```bash
cd packages/contracts && pnpm setup
```

Copy the contract address to `apps/web/.env.local` — see [.env.example](.env.example).

---

## Project structure

```text
dragonfly/
├── apps/web/              # Next.js App Router frontend
├── convex/                # Convex schema + game API
├── packages/
│   ├── contracts/         # Midnight Compact (dragonfly.compact)
│   ├── drop-engine/       # Puzzle generation & validation
│   ├── shared/            # Schemas, domain-separated hashing
│   └── wing-generator/    # SVG Wing renderer
├── drops/sample-drop/     # Public sample manifest (no live secrets)
└── docs/                  # Architecture, demo script, privacy model
```

---

## Hackathon demo flow

1. **Home** — active Drop, countdown, solver count  
2. **Flight** — three connected stages (Recon → Crypto → Core)  
3. **Claim** — prove possession of credential via Midnight  
4. **Wing** — reveal your badge; check the solver board  

Full script: [docs/demo-script.md](docs/demo-script.md)

---

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

**Do not commit** live Drop answers, `.env` files, or completion credentials.

---

## Security

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities and credential handling rules.

---

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be respectful and constructive.

---

## License

[MIT](LICENSE) © 2026 [pol-cova](https://github.com/pol-cova)

---

## Links

- [Midnight Network](https://midnight.network)
- [Convex](https://convex.dev)
- [Sample Drop manifest](drops/sample-drop/)
