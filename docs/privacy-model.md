# Privacy Model

## Public

- Drop window (opens/closes)
- Credential **commitments** (not credentials)
- Anonymous aliases on solver board
- Badge seeds and Wing visuals after verified claim
- Nullifiers (prevent duplicate claims without revealing identity linkage beyond one Drop)

## Private

- Puzzle answers and failed attempts
- Per-Flight seeds and variations
- Completion credentials (until single release after Stage 3)
- Player strategy

## Midnight role

The `claimWing` circuit accepts `completionCredential` and `privatePlayerSecret` as witnesses. The chain verifies commitment match and records a nullifier without publishing the credential.

## Convex role

Convex is the trusted game referee for stage validation. It never exposes credentials via queries. The `complete` action returns the credential once to the Flight owner (`walletSessionId`).

## Limitations

This MVP is not a fully trustless CTF engine. Stage correctness is enforced by Convex. Midnight enforces private credential claims when the chain path is wired. Credentials are stored plaintext at rest on Convex.
