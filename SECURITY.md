# Security Policy

## Reporting

Do not open public issues for live Drop answer leaks or credential exposure. Contact maintainers privately.

## Secrets

Never commit:

- `.env` / `.env.local`
- Live Drop answers or completion credentials
- Production signing keys
- Convex admin keys
- Wallet seeds
- Midnight operator secrets

## Credential handling

- Completion credentials are 32-byte random values
- Stored plaintext at rest on Convex under `completionCredential`
- Released only via Convex `flights.complete` after Stage 3, bound to `walletSessionId`
- Never logged, never returned by queries
- Commitments only are public

## Drop seeding

Drop windows are seeded server-side via `internal.drops.ensureSeeded`. Public clients cannot rewrite Drop windows.

## Live Drops

Use `DRAGONFLY_ACTIVE_DROP_PATH` or Convex env for live puzzle secrets. Archive closed Drops separately if publishing solutions.

## CTF safety

All challenges are simulated inside Dragonfly. No external exploitation targets.
