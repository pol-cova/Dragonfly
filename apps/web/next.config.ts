import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "../..",
  },
  transpilePackages: [
    "@dragonfly/shared",
    "@dragonfly/drop-engine",
    "@dragonfly/wing-generator",
  ],
};

export default nextConfig;
