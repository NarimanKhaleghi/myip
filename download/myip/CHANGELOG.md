# Changelog

All notable changes to **myip** are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.0] — 2026-09-15

### Added — GitHub Pages support & reproducible Cloudflare builds

- **GitHub Pages deployment (static target):** the same codebase now builds a fully
  static export (`bun run build:static` → `./out`) that runs entirely client-side.
  - New `.github/workflows/deploy-pages.yml` — every push to `main` builds and
    publishes `https://<username>.github.io/myip/` automatically (after enabling
    **Settings → Pages → Source: GitHub Actions**).
  - `src/lib/client-lookup.ts` — browser-side aggregation from CORS-enabled
    providers (ipwho.is, ipwhois.app, ipinfo.io, ipapi.is) sharing the exact
    merge/risk logic with the server aggregator.
  - Client-side **DNSBL + PTR via DNS-over-HTTPS** (dns.google / cloudflare-dns),
    browser-visible header report, hosting/proxy keyword heuristics, speed test
    against the Cloudflare CDN, and API-docs/links pointing at the canonical
    Workers deployment.
  - `app/manifest.ts` (replaces the static manifest file) so PWA icons and
    `start_url` respect the `/myip` base path.
- **Reproducible Cloudflare Workers build:** `@opennextjs/cloudflare` and `wrangler`
  are now pinned devDependencies with a committed lockfile — `npx
  opennextjs-cloudflare build` works out of the box on Cloudflare Workers Builds
  (fixes `npm error could not determine executable to run`).
- **Dual-target `next.config.ts`:** `output: "standalone"` (Workers) vs
  `output: "export"` + `basePath` (Pages), selected by `BUILD_TARGET`.
- CI now runs on Bun (matching `bun.lock`) and includes the full OpenNext
  Workers build.

### Changed

- `robots.ts` / `sitemap.ts` marked `dynamic = "force-static"` (required by the
  static export; identical behaviour on Workers).
- Dependency set slimmed to the 16 runtime + 11 dev packages actually used.

## [1.0.0] — 2026-09-10

### Added — first public release 🎉

- **IP intelligence core:** bilingual (fa/en) SPA with instant "what is my IP" detection, full IPv4/IPv6 support and lookup of any address.
- **Multi-source aggregation:** 5 free providers (ipwho.is, ip-api.com, ipwhois.app, ipinfo.io, ipapi.is) merged field-by-field with fail-soft, timeouts and a 24h cache.
- **Security report:** proxy/VPN/hosting/mobile flags, heuristic risk score (0–100), 6 DNSBL blacklists + PTR via DNS-over-HTTPS, WebRTC leak test.
- **Network & geo:** ASN/ISP/org, reverse DNS, RIR/WHOIS/BGP links, Leaflet map with grayscale OpenStreetMap tiles, live local clock, currency/calling code/capital/borders.
- **Tools:** IP compare with haversine distance, localStorage history, JSON/CSV export, Cloudflare speed test, QR share, dual-stack detection via ipify.
- **Public REST API:** `/api/v1/ip`, `/api/v1/ip/{address}`, `/api/v1/dnsbl/{address}`, `/api/v1/headers`, `/api/v1/health` — no keys, CORS, 24h cache.
- **SEO:** sitemap.xml, robots.txt, canonical, Open Graph + Twitter cards, JSON-LD (WebApplication, WebSite + SearchAction), 10 bilingual articles, FAQ block.
- **Design:** strictly monochrome design system (Neo-brutalism × Swiss typography × Blueprint) — only `#0a0a0a` / `#f5f5f5`, pattern-based status, hard shadows, invert-on-hover, 72px engineering grid, custom blend-mode cursor.
- **PWA:** manifest + icons, installable.
- **Cloudflare Workers deployment:** OpenNext adapter, `wrangler.jsonc` (zero-config; optional custom domain + KV blocks), CI workflow (lint + typecheck + Workers build), one-click deploy button.
- **Open source:** MIT license, bilingual README (fa/en), CONTRIBUTING, SECURITY policy, issue/PR templates, dependabot.
