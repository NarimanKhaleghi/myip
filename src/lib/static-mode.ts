/**
 * Build-target helpers.
 *
 * The same codebase produces two artifacts:
 *  1. Cloudflare Workers build (default) — full SSR + REST API via OpenNext.
 *  2. GitHub Pages static build (`BUILD_TARGET=static`) — pure client-side
 *     mode: the browser talks directly to CORS-enabled public APIs.
 *
 * `NEXT_PUBLIC_STATIC_BUILD` is inlined at build time by the bundler, so the
 * dead branch is tree-shaken out of each artifact.
 */

export const IS_STATIC_BUILD = process.env.NEXT_PUBLIC_STATIC_BUILD === "1";

/** Base path used by the static GitHub Pages build (e.g. "/myip"). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative asset path with the deploy base path. */
export function withBasePath(path: string): string {
  if (!BASE_PATH) return path;
  return `${BASE_PATH}${path}`;
}

/**
 * Absolute base URL of the public REST API. On the Workers deployment the
 * endpoints are same-origin; on the static GitHub Pages mirror they live on
 * the canonical Cloudflare deployment.
 */
export const API_BASE_URL = IS_STATIC_BUILD ? "https://myip.thepm.ir" : "";
