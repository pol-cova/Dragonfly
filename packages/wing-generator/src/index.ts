export interface WingParams {
  geometry: number;
  veins: number;
  glow: number;
  symbol: number;
  texture: number;
  rarity: string;
  primaryColor: string;
  accentColor: string;
}

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedToInt(hex: string): number {
  const slice = hex.replace(/^0x/, "").slice(0, 8);
  return parseInt(slice || "0", 16) || 1;
}

const SYMBOLS = ["◈", "◇", "✦", "⬡", "◉", "✶", "⬢"];
const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
const PALETTES = [
  { primary: "#0ea5e9", accent: "#f59e0b" },
  { primary: "#22d3ee", accent: "#f97316" },
  { primary: "#38bdf8", accent: "#eab308" },
  { primary: "#06b6d4", accent: "#fb7185" },
  { primary: "#14b8a6", accent: "#a3e635" },
];

export function deriveWingParams(badgeSeed: string): WingParams {
  const rand = mulberry32(seedToInt(badgeSeed));
  const palette = PALETTES[Math.floor(rand() * PALETTES.length)];

  return {
    geometry: Math.floor(rand() * 5),
    veins: Math.floor(rand() * 8),
    glow: 0.4 + rand() * 0.6,
    symbol: Math.floor(rand() * SYMBOLS.length),
    texture: Math.floor(rand() * 4),
    rarity: RARITIES[Math.floor(rand() * RARITIES.length)],
    primaryColor: palette.primary,
    accentColor: palette.accent,
  };
}

export function generateWingSvg(badgeSeed: string, size = 240): string {
  const p = deriveWingParams(badgeSeed);
  const symbol = SYMBOLS[p.symbol];
  const cx = size / 2;
  const cy = size / 2;
  const wingPath = [
    `M ${cx} ${cy - 80}`,
    `C ${cx + 90} ${cy - 60}, ${cx + 110} ${cy + 20}, ${cx + 40} ${cy + 70}`,
    `C ${cx + 10} ${cy + 90}, ${cx - 10} ${cy + 90}, ${cx - 40} ${cy + 70}`,
    `C ${cx - 110} ${cy + 20}, ${cx - 90} ${cy - 60}, ${cx} ${cy - 80}`,
    "Z",
  ].join(" ");

  const veins = Array.from({ length: p.veins }, (_, i) => {
    const angle = (Math.PI * 2 * i) / p.veins;
    const x2 = cx + Math.cos(angle) * (60 + p.geometry * 8);
    const y2 = cy + Math.sin(angle) * (40 + p.geometry * 6);
    return `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${p.accentColor}" stroke-opacity="0.35" stroke-width="1" />`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <radialGradient id="glow-${badgeSeed.slice(0, 8)}" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${p.primaryColor}" stop-opacity="${p.glow}" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
    <filter id="blur-${badgeSeed.slice(0, 8)}">
      <feGaussianBlur stdDeviation="8" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#020617" rx="12" />
  <circle cx="${cx}" cy="${cy}" r="100" fill="url(#glow-${badgeSeed.slice(0, 8)})" filter="url(#blur-${badgeSeed.slice(0, 8)})" />
  <path d="${wingPath}" fill="${p.primaryColor}" fill-opacity="0.85" stroke="${p.accentColor}" stroke-width="2" />
  ${veins}
  <text x="${cx}" y="${cy + 8}" text-anchor="middle" font-size="28" fill="${p.accentColor}">${symbol}</text>
  <text x="${cx}" y="${size - 16}" text-anchor="middle" font-size="10" fill="#94a3b8">${p.rarity}</text>
</svg>`;
}

export { SYMBOLS, RARITIES };
