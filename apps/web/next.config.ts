import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  turbopack: {
    // App package root — next resolves from apps/web/node_modules.
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  transpilePackages: [
    "@dragonfly/shared",
    "@dragonfly/drop-engine",
    "@dragonfly/wing-generator",
  ],
};

export default nextConfig;
