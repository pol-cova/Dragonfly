/**
 * Capture short usage GIFs from the live Dragonfly app.
 *
 *   cd demo && npm run capture:gifs
 *
 * Requires: playwright (dev), ffmpeg on PATH.
 * Output: demo/gif/*.gif
 */
import { chromium } from "playwright";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMO_ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(DEMO_ROOT, "gif");
const TMP_DIR = path.join(DEMO_ROOT, ".gif-capture-tmp");

const BASE_URL = process.env.DEMO_URL ?? "https://dragonfly.paulcontre.com";
const VIEWPORT = { width: 1280, height: 720 };

function framesToGif(framesDir, frameCount, output) {
  execSync(
    `ffmpeg -y -framerate 10 -i "${framesDir}/frame_%03d.png" -frames:v ${frameCount} -vf "fps=12,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" -loop 0 "${output}"`,
    { stdio: "inherit" },
  );
}

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true, channel: "chrome" });
  } catch {
    return await chromium.launch({ headless: true });
  }
}

async function snap(page, framesDir, index) {
  const file = path.join(framesDir, `frame_${String(index).padStart(3, "0")}.png`);
  await page.screenshot({ path: file, type: "png" });
  return index + 1;
}

async function smoothScroll(page, framesDir, startIndex, maxY, step = 90, pauseMs = 280) {
  let i = startIndex;
  for (let y = 0; y <= maxY; y += step) {
    await page.evaluate((top) => {
      window.scrollTo({ top, behavior: "auto" });
    }, y);
    await page.waitForTimeout(pauseMs);
    i = await snap(page, framesDir, i);
  }
  return i;
}

async function capture(name, fn) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const framesDir = path.join(TMP_DIR, name);
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  const browser = await launchBrowser();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: "dark",
  });
  const page = await context.newPage();

  let frameCount = 0;
  try {
    frameCount = await fn(page, framesDir);
  } finally {
    await context.close();
    await browser.close();
  }

  if (frameCount < 2) {
    throw new Error(`Not enough frames for ${name} (${frameCount})`);
  }

  const gifPath = path.join(OUT_DIR, `${name}.gif`);
  framesToGif(framesDir, frameCount, gifPath);
  fs.rmSync(framesDir, { recursive: true, force: true });
  const sizeKb = Math.round(fs.statSync(gifPath).size / 1024);
  console.log(`✓ ${gifPath} (${frameCount} frames, ${sizeKb} KB)`);
}

async function captureSafe(name, fn) {
  try {
    await capture(name, fn);
  } catch (error) {
    console.error(`✗ ${name}: ${error instanceof Error ? error.message : error}`);
  }
}

async function waitForDrops(page, framesDir, index) {
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("text=Cipher Nest", { timeout: 45000 });
  await page.waitForTimeout(500);
  return snap(page, framesDir, index);
}

async function main() {
  console.log(`Capturing from ${BASE_URL} → ${OUT_DIR}\n`);

  const only = process.env.GIF_ONLY?.split(",").map((s) => s.trim());
  const shouldRun = (name) => !only || only.includes(name);

  if (shouldRun("01-browse-drops")) {
    await captureSafe("01-browse-drops", async (page, framesDir) => {
      let i = await waitForDrops(page, framesDir, 0);
      i = await smoothScroll(page, framesDir, i, 420);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
      await page.waitForTimeout(400);
      return snap(page, framesDir, i);
    });
  }

  if (shouldRun("02-open-drop")) {
    await captureSafe("02-open-drop", async (page, framesDir) => {
      let i = await waitForDrops(page, framesDir, 0);
      const row = page.locator("li").filter({ hasText: "Cipher Nest" });
      await row.locator("text=open").first().hover();
      i = await snap(page, framesDir, i);
      await row.locator("text=open").first().click();
      await page.waitForURL("**/drop/**", { timeout: 20000 });
      await page.waitForSelector("text=begin flight", { timeout: 20000 });
      await page.waitForTimeout(400);
      i = await snap(page, framesDir, i);
      await page.waitForTimeout(600);
      return snap(page, framesDir, i);
    });
  }

  if (shouldRun("03-begin-flight")) {
    await captureSafe("03-begin-flight", async (page, framesDir) => {
      await page.goto(`${BASE_URL}/drop/drop-003`, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForSelector("text=begin flight", { timeout: 30000 });
      let i = await snap(page, framesDir, 0);
      await page.getByRole("button", { name: /begin flight/i }).click();
      await page.waitForSelector("text=stage 1", { timeout: 30000 });
      await page.waitForTimeout(500);
      i = await snap(page, framesDir, i);
      await page.waitForTimeout(700);
      return snap(page, framesDir, i);
    });
  }

  if (shouldRun("04-solve-stage")) {
    await captureSafe("04-solve-stage", async (page, framesDir) => {
      await page.goto(`${BASE_URL}/drop/drop-003`, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      const begin = page.getByRole("button", { name: /begin flight/i });
      let i = await snap(page, framesDir, 0);
      if (await begin.isVisible({ timeout: 8000 }).catch(() => false)) {
        await begin.click();
        await page.waitForTimeout(1200);
        i = await snap(page, framesDir, i);
      }
      await page.waitForSelector("text=/stage 1/i", { timeout: 45000 });
      await page.waitForSelector('input[name="command"]', { timeout: 15000 });
      i = await snap(page, framesDir, i);
      const inspect = page.getByRole("button", { name: /inspect metadata/i });
      if (await inspect.isVisible({ timeout: 3000 }).catch(() => false)) {
        await inspect.click();
        await page.waitForTimeout(500);
        i = await snap(page, framesDir, i);
      }
      const input = page.locator('input[name="command"]');
      await input.click();
      for (const char of "DRGN") {
        await input.press(char);
        await page.waitForTimeout(180);
        i = await snap(page, framesDir, i);
      }
      await page.waitForTimeout(500);
      return snap(page, framesDir, i);
    });
  }

  if (shouldRun("05-solvers-board")) {
    await captureSafe("05-solvers-board", async (page, framesDir) => {
      await page.goto(`${BASE_URL}/solvers`, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForTimeout(900);
      let i = await snap(page, framesDir, 0);
      i = await smoothScroll(page, framesDir, i, 280, 80, 260);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
      await page.waitForTimeout(400);
      return snap(page, framesDir, i);
    });
  }

  if (shouldRun("06-claim-sandbox")) {
    await captureSafe("06-claim-sandbox", async (page, framesDir) => {
      await page.goto(`${BASE_URL}/sandbox/claim`, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForTimeout(1200);
      let i = await snap(page, framesDir, 0);
      const runBtn = page.getByRole("button", { name: /run slice/i });
      if (await runBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await runBtn.hover();
        await page.waitForTimeout(400);
        i = await snap(page, framesDir, i);
        await runBtn.click();
        await page
          .waitForSelector("canvas, svg", { timeout: 10000 })
          .catch(() => null);
        await page.waitForTimeout(800);
        i = await snap(page, framesDir, i);
      }
      await page.waitForTimeout(600);
      return snap(page, framesDir, i);
    });
  }

  console.log("\nDone.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
