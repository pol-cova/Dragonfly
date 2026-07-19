import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const rootEnvPath = join(root, ".env.local");
const webEnvPath = join(root, "apps/web/.env.local");

function parseEnv(content) {
  const values = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    values[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return values;
}

if (!existsSync(rootEnvPath)) {
  console.error("Missing .env.local — run `npx convex dev` first.");
  process.exit(1);
}

const rootEnv = parseEnv(readFileSync(rootEnvPath, "utf8"));
const convexUrl =
  rootEnv.NEXT_PUBLIC_CONVEX_URL || rootEnv.CONVEX_URL || "";

if (!convexUrl) {
  console.error("No CONVEX_URL in .env.local — run `npx convex dev` first.");
  process.exit(1);
}

const existing = existsSync(webEnvPath) ? parseEnv(readFileSync(webEnvPath, "utf8")) : {};

const merged = {
  NEXT_PUBLIC_CONVEX_URL: convexUrl,
  NEXT_PUBLIC_MIDNIGHT_NETWORK:
    existing.NEXT_PUBLIC_MIDNIGHT_NETWORK || "undeployed",
  NEXT_PUBLIC_MIDNIGHT_CONTRACT_ADDRESS:
    existing.NEXT_PUBLIC_MIDNIGHT_CONTRACT_ADDRESS || "",
};

const lines = [
  "# Auto-synced from root .env.local — run `pnpm convex:sync-env` after convex dev",
  `NEXT_PUBLIC_CONVEX_URL=${merged.NEXT_PUBLIC_CONVEX_URL}`,
  `NEXT_PUBLIC_MIDNIGHT_NETWORK=${merged.NEXT_PUBLIC_MIDNIGHT_NETWORK}`,
  `NEXT_PUBLIC_MIDNIGHT_CONTRACT_ADDRESS=${merged.NEXT_PUBLIC_MIDNIGHT_CONTRACT_ADDRESS}`,
  "",
];

writeFileSync(webEnvPath, lines.join("\n"));
console.log(`Synced Convex URL to apps/web/.env.local (${convexUrl})`);
