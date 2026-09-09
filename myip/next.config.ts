import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // OpenNext (Cloudflare Workers) builds on top of Next.js standalone server output.
  output: "standalone",
  reactStrictMode: false,
  // Deploy resilience: CI runs `npm run lint` and `npm run typecheck` separately,
  // so the production build itself never fails on type warnings.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
