export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const sceneDurations = {
  intro: 14 * FPS,
  hook: 8 * FPS,
  productDemo: 38 * FPS,
  privacy: 26 * FPS,
  wing: 18 * FPS,
  close: 16 * FPS,
} as const;

export const TOTAL_DURATION_FRAMES = Object.values(sceneDurations).reduce(
  (sum, value) => sum + value,
  0,
);

export const colors = {
  bg: "#030806",
  bgMid: "#07100c",
  panel: "#0a1612",
  fg: "#6dffb0",
  fgBright: "#8cffc8",
  fgDim: "#3a6b55",
  amber: "#ffb020",
  amberDim: "#8a5a12",
  border: "#1a4032",
  fog: "rgba(109, 255, 176, 0.06)",
} as const;

export const fonts = {
  display: "Space Grotesk, system-ui, sans-serif",
  mono: "IBM Plex Mono, ui-monospace, monospace",
} as const;

export function secondsToFrames(seconds: number): number {
  return Math.round(seconds * FPS);
}
