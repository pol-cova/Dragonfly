import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadIbmPlexMono } from "@remotion/google-fonts/IBMPlexMono";

export const displayFont = loadSpaceGrotesk("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

export const monoFont = loadIbmPlexMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});
