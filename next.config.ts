import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // A parent pnpm lockfile otherwise causes Next.js to infer the wrong root.
    root: process.cwd(),
  },
};

export default nextConfig;
