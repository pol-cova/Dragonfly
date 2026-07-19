/**
 * Build a simple animated GIF from a PNG (Ken Burns lite).
 * Usage: node scripts/png-to-gif.mjs <input.png> <output.gif> [frames=12]
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMO_ROOT = path.join(__dirname, "..");
const TMP = path.join(DEMO_ROOT, ".gif-capture-tmp", "png-to-gif");

const [inputArg, outputArg, framesArg] = process.argv.slice(2);
if (!inputArg || !outputArg) {
  console.error("Usage: node scripts/png-to-gif.mjs <input.png> <output.gif> [frames]");
  process.exit(1);
}

const input = path.resolve(inputArg);
const output = path.resolve(outputArg);
const frames = Number(framesArg ?? 12);

if (!fs.existsSync(input)) {
  console.error(`Missing input: ${input}`);
  process.exit(1);
}

fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });

for (let i = 0; i < frames; i += 1) {
  const zoom = 1 + i * 0.004;
  const out = path.join(TMP, `frame_${String(i).padStart(3, "0")}.png`);
  const cropW = Math.round(960 / zoom);
  const cropH = Math.round(540 / zoom);
  execSync(
    `ffmpeg -y -i "${input}" -vf "scale=960:-1:flags=lanczos,crop=${cropW}:${cropH}:(iw-${cropW})/2:(ih-${cropH})/2,scale=960:540" -frames:v 1 "${out}"`,
    { stdio: "pipe" },
  );
}

execSync(
  `ffmpeg -y -framerate 8 -i "${TMP}/frame_%03d.png" -frames:v ${frames} -vf "fps=10,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" -loop 0 "${output}"`,
  { stdio: "inherit" },
);

fs.rmSync(TMP, { recursive: true, force: true });
console.log(`✓ ${output} (${Math.round(fs.statSync(output).size / 1024)} KB)`);
