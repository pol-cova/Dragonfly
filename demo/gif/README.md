# Dragonfly usage GIFs

Animated captures of the live app at [dragonfly.paulcontre.com](https://dragonfly.paulcontre.com).

| File | What it shows |
|------|----------------|
| `01-browse-drops.gif` | Home — scroll through active Drops |
| `02-open-drop.gif` | Hover + open Cipher Nest |
| `03-begin-flight.gif` | Start a Flight on Cipher Nest |
| `04-solve-stage.gif` | Stage 1 puzzle (inspect metadata + answer) |
| `05-solvers-board.gif` | Solvers leaderboard |
| `06-claim-sandbox.gif` | Claim sandbox — run slice + Wing preview |

`04-solve-stage.gif` uses a Ken Burns pass from `public/product/03-stage1.png` when live stage capture is unavailable.

## Regenerate

```bash
cd demo
npm run capture:gifs
```

Re-capture a subset:

```bash
GIF_ONLY=05-solvers-board npm run capture:gifs
```

Offline fallback (Ken Burns from `public/product/` screenshots):

```bash
npm run capture:gifs:fallback
```
