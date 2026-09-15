import type { NextConfig } from "next";

/**
 * Dual-target build configuration:
 *
 *  1. Cloudflare Workers (default) — `output: "standalone"`, bundled by
 *     OpenNext (`opennextjs-cloudflare build`) into an edge Worker with SSR
 *     and the public REST API under /api/v1.
 *
 *  2. GitHub Pages (static) — `BUILD_TARGET=static next build` produces a
 *     fully static export in `./out` with `basePath` set to the Pages
 *     sub-path (default "/myip", override with NEXT_PUBLIC_BASE_PATH).
 *     The app then runs in pure client-side mode (see src/lib/static-mode.ts).
 */
const isStatic = process.env.BUILD_TARGET === "static";

const basePath = isStatic
  ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "/myip")
  : (process.env.NEXT_PUBLIC_BASE_PATH || "");

const nextConfig: NextConfig = {
  ...(isStatic
    ? {
        output: "export" as const,
        images: { unoptimized: true },
      }
    : {
        // OpenNext (Cloudflare Workers) builds on top of the Next.js
        // standalone server output.
        output: "standalone" as const,
      }),
  ...(basePath ? { basePath } : {}),
  reactStrictMode: false,
  // Deploy resilience: CI runs `bun run lint` and `bun run typecheck`
  // separately, so the production build itself never fails on type warnings.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
