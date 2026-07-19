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

## Credential handling

- Completion credentials are 32-byte random values
- Released only via Convex `flights.complete` action after Stage 3
- Never logged, never returned by queries
- Commitments only are public

## Live Drops

Use `DRAGONFLY_ACTIVE_DROP_PATH` or Convex env for live puzzle secrets. Archive closed Drops separately if publishing solutions.

## CTF safety

All challenges are simulated inside Dragonfly. No external exploitation targets.
