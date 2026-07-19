/**
 * Build usage GIFs from static product screenshots (offline fallback).
 *
 *   cd demo && node scripts/fallback-gifs.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMO_ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(DEMO_ROOT, "public");
const OUT_DIR = path.join(DEMO_ROOT, "gif");
const TMP_DIR = path.join(DEMO_ROOT, ".gif-capture-tmp");

const slides = [
  {
    name: "01-browse-drops",
    image: "product/01-home.png",
    caption: "Browse active Drops",
  },
  {
    name: "02-open-drop",
    image: "product/02-drop.png",
    caption: "Open Cipher Nest",
  },
  {
    name: "04-solve-stage",
    image: "product/03-stage1.png",
    caption: "Solve stage 1 — inspect metadata",
  },
  {
    name: "05-solvers-board",
    image: "product/04-solvers.png",
    caption: "Solvers board",
  },
];

function pngKenBurnsGif(name, input, seconds = 3.5) {
  const frames = Math.round(seconds * 12);
  const out = path.join(OUT_DIR, `${name}.gif`);
  execSync(
    `ffmpeg -y -loop 1 -i "${input}" -vf "zoompan=z='min(zoom+0.0008,1.06)':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=960x540:fps=12,format=yuv420p,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" -t ${seconds} -loop 0 "${out}"`,
    { stdio: "inherit" },
  );
  return out;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

for (const slide of slides) {
  const input = path.join(PUBLIC, slide.image);
  if (!fs.existsSync(input)) {
    console.warn(`Skip ${slide.name}: missing ${input}`);
    continue;
  }
  const out = pngKenBurnsGif(slide.name, input);
  const sizeKb = Math.round(fs.statSync(out).size / 1024);
  console.log(`✓ ${out} (${sizeKb} KB) — ${slide.caption}`);
}

console.log("\nFallback GIFs ready.");
