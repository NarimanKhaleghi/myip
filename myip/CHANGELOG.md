# Changelog

All notable changes to **myip** are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.2.1] — 2026-09-15

### Fixed — mobile responsive layout (cards overflowing the screen)

- **Root cause:** CSS grid items default to `min-width: auto`, so a single
  card containing a long unbreakable string inflated the whole grid track.
  On a 390 px phone the User-Agent card forced an **826 px** track — every
  card in the Basic-info section stretched past the left edge of the screen
  (RTL), and long IPv6 history entries pushed the Tools cards out the same
  way.
  - `SectionCard` now carries `min-w-0`: every section grid keeps its cards
    at container width on any screen; long content truncates or wraps
    *inside* the card instead of blowing out the layout.
  - `CopyChip` gets `min-w-0` so chips used as flex items (IP history rows,
    InfoRow values) can shrink below their content and ellipsize.
- **Compare tool on phones:** result blocks stack in one column below `sm`
  (side-by-side above), the summary pills row uses `sm:col-span-2` (the old
  unconditional `col-span-2` forced a phantom second column that squeezed
  the two IP cards to ~97 px / ~215 px), ISP names ellipsize via
  `block truncate` instead of painting across the card border, and both
  inputs get `min-w-0` for very narrow screens.
- **Header on narrow phones (≤ 360 px):** the search box can now shrink
  (`min-w-0` on its wrapper) and the GitHub icon hides below `sm` (it stays
  available in the hero and footer), so nothing pokes past the viewport —
  verified at 390 px, 375 px-class and 320 px.
- Verified: 0 layout offenders and `scrollWidth === viewport` on 390 px &
  320 px, FA (RTL) and EN (LTR), with long-IPv6 history + IPv6 compare
  results; desktop 1280 px unchanged (2-column grids, full-width API card).

## [1.2.0] — 2026-09-15

### Changed — single-page report (tabs removed)

- **No more tab switching:** all five report sections — Overview, Geolocation,
  Network & ISP, Security, Tools — now render stacked on ONE page, ordered by
  importance to the visitor. Everything is visible, scrollable and printable
  in one pass (the print/PDF export now captures the full report instead of
  just the active tab).
  - New `src/components/myip/report-sections.tsx` — numbered engineering
    section headers (01–05, kicker + Lalezar display title + one-line
    description) wrapping the existing section components unchanged.
  - **Sticky jump-nav** below the main header: five anchor links
    (`#info`…`#tools`) with scroll-spy highlighting, horizontal-scrollable on
    mobile, RTL-aware. It sticks only while the report area is in view.
    Clicking a link highlights it immediately and locks the spy for the
    duration of the smooth scroll (dynamic content can shift section
    positions mid-scroll).
  - `src/components/myip/tabs.tsx` and the unused `ui/tabs.tsx` were removed;
    per-section loading skeletons, fade-ins and all data flows are unchanged.
  - Sections get `scroll-mt-28` so anchor jumps land below the sticky bars.
- **Phantom-overflow guard:** `html { overflow-x: clip }` — the footer
  marquee's animated items inside `overflow:hidden` still inflate
  `documentElement.scrollWidth` in Chromium (RTL), which made tooling report
  a 452px horizontal "overflow" at 390px that users could never actually
  scroll (verified by a programmatic scroll probe). Clipping the root kills
  even the metric.
- README (en/fa): new "Single-page report" feature row, tab wording updated,
  fresh monochrome screenshots of the new layout.

## [1.1.1] — 2026-09-15

### Fixed — true IPv4 detection on dual-stack networks & long-IP layout

- **Wrong IP on dual-stack networks:** on networks where the browser prefers
  IPv6 (common on mobile ISPs), the whole report was keyed to the visitor's
  IPv6 address, because the server only sees the connection address
  (`CF-Connecting-IP`). myip now probes the visitor's **real public IPv4 in
  the browser** via six racing IPv4-only endpoints (`1.1.1.1/cdn-cgi/trace`,
  `ipv4.icanhazip.com`, `api-ipv4.ip.sb`, `v4.ident.me`,
  `ipv4.wtfismyip.com`, `api-ipv4.ipify.org`) and keys the entire own-IP
  report to it — the same behaviour as classic IP tools. The IPv6 address is
  detected separately (six v6-only endpoints) and shown as a secondary line;
  IPv6-only networks fall back to the server's connection address.
  - New `src/lib/self-ip.ts` — multi-source racing detector: first valid
    answer wins, losing requests are aborted, 4 s timeout, module-level
    cache, strict IPv4/IPv6 validation.
  - `useDualStack` (single-source ipify, display-only) replaced by
    `useSelfIP`; `useIPInfo` gained an `enabled` gate so the own-IP query
    waits for detection instead of flashing an IPv6-keyed report first.
- **Layout overflow with long addresses:** a full IPv6 (up to 39 characters)
  pushed the hero IP card out of the viewport (left side on RTL) and broke
  the page structure. The IP slab now scales its type by address length,
  wraps with `overflow-wrap: anywhere`, is capped at `max-w-full` and forced
  `dir="ltr"`, and the page gained an `overflow-x: clip` guard. Info rows,
  copy chips, the QR dialog title and the compare-tool cards are wrap-safe
  as well.

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
