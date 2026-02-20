import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal self-contained server in .next/standalone
  // — required for the multi-stage Docker build
  output: "standalone",
};

export default nextConfig;
