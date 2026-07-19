# Architecture

```text
Next.js (Vercel)
  ├─ Convex client (Flights, stages, solvers)
  └─ Lace + proof client (claimWing)

Convex
  ├─ drops / flights / solvers tables
  ├─ Stage validation (drop-engine)
  └─ Credential release (actions only)

Midnight (Compact)
  ├─ registerFlightCommitment
  ├─ claimWing (private credential witness)
  └─ nullifier + badgeSeed ledger
```

## Flow

1. Player enters active Drop → Convex creates Flight with unique seed + credential commitment
2. Player completes 3 connected stages → Convex validates server-side
3. `flights.complete` action releases credential privately to client
4. Client proves credential possession (Midnight circuit or matching local proof)
5. Convex records claim with derived `badgeSeed` → Wing renders deterministically
6. Solver board shows alias + Wing preview only

## Repository layout

- `apps/web` — Next.js product UI
- `convex/` — game backend
- `packages/contracts` — Midnight Compact + devnet tooling
- `packages/drop-engine` — puzzle generation/validation
- `packages/wing-generator` — SVG Wings
- `drops/sample-drop` — public sample content
