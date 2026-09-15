# Worklog — myip.thepm.ir

---
Task ID: 1
Agent: Super Z (main)
Task: Build "myip.thepm.ir" — a comprehensive IP intelligence SPA (Persian/English) per the user's PRD.

Work Log:
- Initialized fullstack env (Next.js 16 + TS + Tailwind 4 + shadcn/ui).
- Tested external free APIs from sandbox: ipwho.is, ip-api.com, ipwhois.app, ipinfo.io, api.ipapi.is (all OK), dns.google + cloudflare-dns DoH (PTR/DNSBL), speed.cloudflare.com, api.ipify.org, OSM tiles, Google Fonts.
- Installed leaflet + qrcode.
- Backend (src/lib + src/app/api/v1):
  - ip-sources.ts: 5 API adapters with timeouts/fail-soft.
  - ip-aggregator.ts: field-by-field merge with source priority, risk-score heuristic, bogon classification.
  - cache.ts: in-memory TTL cache (24h lookups).
  - dns.ts: DoH PTR + 6 DNSBL zones (SpamCop/SORBS/Spamhaus/Barracuda/DroneBL).
  - ip-utils.ts: IPv4/IPv6 validation, full expandIPv6, decimal/hex/binary/mapped/reverse-DNS formats, bogon classifier, client-IP extraction (CF-aware).
  - Routes: /api/v1/ip (+?ip=,?raw=), /api/v1/ip/[address], /api/v1/dnsbl/[address], /api/v1/headers, /api/v1/health.
- Frontend (src/components/myip + src/app):
  - i18n-provider.tsx: FA/EN dictionary + RTL/LTR + country names FA (useSyncExternalStore on localStorage).
  - layout.tsx: Vazirmatn/Inter/JetBrains Mono via next/font, full SEO metadata, OG/Twitter, JSON-LD (WebApplication, WebSite, SearchAction).
  - globals.css: PRD palette (#6366F1/#8B5CF6/#10B981, bg #0F172A), glass-morphism, aurora hero, scrollbars, leaflet dark filter, print styles.
  - Components: Header (search/theme/lang), Hero (big gradient IP, copy/QR/share, dual-stack via ipify), QuickStats, 5 tabs (Info with IP formats + UA + headers, Geo with Leaflet map + live clock, Network with WHOIS/BGP links + RIR, Security with proxy/risk/DNSBL/WebRTC-leak, Tools with compare/history/export/speed-test/API-docs), 10 bilingual SEO articles, FAQ accordion + FAQPage schema, Footer.
  - page.tsx: URL-store (?ip= shareable links), TanStack Query data flow, distance calc, history in localStorage.
  - sitemap.ts + robots.ts + favicon.svg (removed conflicting public/robots.txt).
- Fixed during verification:
  1. react-hooks/set-state-in-effect lint errors → refactored to useSyncExternalStore / queueMicrotask patterns.
  2. Hydration mismatch (theme title, navigator access) → useMounted + useSyncExternalStore server snapshots.
  3. ReferenceError expandIPv6 → implemented full expandIPv6() and shared it with dns.ts.
  4. TS strict errors (CopyChip value, aggregator casts).
  5. Compare tool initial state (::1 vs ::1) → onlyExplicit queries.
- E2E verified with agent-browser + Playwright debug script: search 8.8.8.8 (5/5 sources), map tiles + marker, DNSBL clean results, speed test (7ms ping / 152 Mbps), compare 8.8.8.8 vs 78.39.200.1 (11,865 km), QR dialog, article/FAQ accordions, FA/EN toggle (rtl/ltr), dark/light toggle, mobile 390px no overflow, sticky header, footer pushed naturally.
- VLM visual review: 9/10, no overlaps, glass-morphism + gradient confirmed; map screenshot fully rendered.

Stage Summary:
- Deliverable: full SPA at `/` (Next.js 16, TypeScript strict, Tailwind 4, shadcn/ui).
- Public API: /api/v1/ip, /api/v1/ip/{address}, /api/v1/dnsbl/{address}, /api/v1/headers, /api/v1/health — no key, 24h cache.
- Data aggregated from 5 free sources + DoH (PTR/DNSBL) + ipify (dual-stack) + Cloudflare speed.
- Zero logging policy: no DB, no request logs; history only in browser localStorage.
- lint: clean; tsc: clean; dev server: no errors; verified interactive in browser.

---
Task ID: 2
Agent: Super Z (main)
Task: Deep visual redesign of myip.thepm.ir to a PURE black & white monochrome design system (user-uploaded "design system.html" — Neo-brutalism Monochrome × Swiss Typography × Blueprint), plus GitHub open-source integration and maker credit.

Work Log:
- Parsed uploaded design system (upload/design system.html): tokens, mono dark/light palettes, hard offset shadows, 0 border-radius (pill only for chips), invert-on-hover interactions, Lalezar/Vazirmatn/JetBrains Mono typography, 72px engineering grid, grain, custom cursor (mix-blend difference), kicker pattern, agent prompt rules (SEC.35).
- globals.css: complete rewrite — pure grayscale tokens (dark: #0a0a0a/#f5f5f5 fg; light: #f5f5f5/#101010), shadcn semantic remap (primary=fg → inverted buttons), --radius=0, [data-slot] overrides for button/input/tabs/dialog/toast (hover = invert + shift -2px,-2px + hard shadow), .kicker/.display/.tag/.tag--ok/.tag--bad/.tag--warn/.hatch-fill utilities, body::before 72px grid + body::after 4% grain, inverted ::selection, mono scrollbars, print/reduced-motion, Leaflet mono overrides. Status semantics = PATTERN not color (filled=ok, hatched=alert, dashed=warn).
- layout.tsx: added Lalezar display font; themeColor #0a0a0a/#f5f5f5; author/creator = Nariman Khaleghi; JSON-LD: author + MIT license + isAccessibleForFree.
- i18n.ts: new keys — openSourceHeading/openSourceFull/viewOnGitHub/githubRepo/mitLicense/contactEmail(pdm@thepm.ir → pm@thepm.ir)/madeByNariman (FA "ساخته شده با ❤️ توسط نریمان" / EN "Made with ❤️ by Nariman", heart split out for grayscale filter).
- New cursor-fx.tsx: design-system custom cursor (dot+ring, mix-blend-mode: difference, pointer:fine only, reduced-motion safe).
- Restyled all components: header (bordered mono brand mark, GitHub icon link), hero (kicker + live-dot + giant mono IP slab with hard shadow press interaction, mono tags, open-source line with GitHub logo + repo), ui-bits (SectionCard = thin border + hover shadow; StatusPill = tag--ok/tag--bad; CopyChip hover-invert), quick-stats, tabs (active tab = inverted), tab-security (mono risk bar with hatch, DNSBL pattern states, WebRTC mono results), tab-network/geo/info/tools (removed ALL emerald/red/amber/violet/gradient/glass), seo-content (kickers + Lalezar display titles + numbered mono article rows), map-view (grayscale OSM tiles, blueprint black-square marker, inline style block beats leaflet.css), page.tsx (mono error card + CursorFx), toast.tsx (de-colored destructive).
- Footer fully redesigned: mono marquee ticker (MIT/OPEN SOURCE/NO LOGS/…), open-source card (GitHub logo, MIT tag, solid View-on-GitHub button, repo link), links with pm@thepm.ir email, bottom bar maker credit (heart grayscale-filtered).
- Fixed during verification:
  1. Stale Turbopack CSS chunks (globals.css edits not propagating) → restarted dev server; also inlined critical Leaflet mono rules in map-view.tsx <style> so they always beat leaflet.css.
  2. Leaflet attribution showed colored solidarity flag → .leaflet-attribution-flag display:none (also in inline block).
  3. Colored emojis (📱🏢🏠 in tab-info, ❤️ in credit, 🌍/flags) → removed or grayscale-filtered (flags keep country info, rendered gray).
  4. MultiEdit partial-apply mishap in tab-security (riskColor removed but block not) → repaired by re-applying remaining edits.
- Verification: lint clean, tsc clean (src), dev server fresh; agent-browser E2E: 8.8.8.8 lookup (5 sources), geo tab grayscale map + marker, security tab patterns, FA↔EN toggle ("Made with ❤️ by Nariman" confirmed), dark↔light, mobile 390px no overflow.
- Pixel-level color audit (PIL): full-page dark + light screenshots → 0/1,242,000 saturated pixels each = PURE MONOCHROME. (VLM "red heart" reports disproven by pixel data — semantic hallucination.)

Stage Summary:
- myip.thepm.ir is now strictly black & white per the uploaded design system: sharp corners, hard shadows, invert-on-hover, engineering grid + grain, Lalezar display type, mono tags with pattern-based status.
- GitHub integration: github.com/NarimanKhaleghi/myip with GitHub logo in header, hero, footer (+ open-source MIT statement); contact email pm@thepm.ir; footer credit "ساخته شده با ❤️ توسط نریمان" / "Made with ❤️ by Nariman" (grayscale heart).
- All functionality preserved: 5 API sources, DNSBL, WebRTC test, speed test, compare, history, export, QR, bilingual RTL/LTR, dark/light.

---
Task ID: 3
Agent: Super Z (main)
Task: Prepare myip for GitHub + Cloudflare Workers auto-deploy; write bilingual READMEs (fa/en) matching the user's Markdown_Converter style; add all GitHub/Cloudflare files.

Work Log:
- Cleaned repo at /home/z/my-project/myip: 76 files — src (app/components/lib, prisma+db.ts removed as unused), pruned ui/ to the 7 components actually imported, deps slimmed to 16 runtime + 10 dev.
- Cloudflare Workers adaptation: @opennextjs/cloudflare 1.20.6 + wrangler 4.130.0; fixed peer conflict by upgrading next 16.1.1 → 16.3.4; next.config.ts (standalone, build ignores), wrangler.jsonc (nodejs_compat, .open-next/worker.js, assets binding, optional custom-domain + KV blocks commented), open-next.config.ts.
- SEO/PWA additions: layout.tsx manifest + apple icon + OG/Twitter images (1200x630), public/manifest.webmanifest (fa/rtl), PIL-generated mono icons (192/512/apple) + og-image.png + new B&W favicon.svg (old one still had colored gradient!) + logo.svg wordmark.
- VALIDATED on the real workerd runtime (opennextjs-cloudflare preview): build OK; / (82KB HTML), /api/v1/ip, /api/v1/ip/8.8.8.8 (full report saved to docs/sample-response.json), IPv6 lookup 5/5 sources, /api/v1/dnsbl (6 zones), /api/v1/headers, invalid-input 400, all 8 static assets 200. tsc clean; eslint src clean; npm ci dry-run in sync.
- README.md + README_FA.md: Markdown_Converter style (centered header, lang badges cross-linking each other + a one-line note in the other language, social/tech badges, live-demo badge, screenshots from verified session, features/tables, full REST API docs + sample JSON, 3 deploy paths incl. detailed git-push + Cloudflare-connect steps, architecture mermaid, mono design system, privacy, Google Search Console submission guide, roadmap, contributing, FAQ, contact pm@thepm.ir, MIT, "ساخته شده با ❤️ توسط نریمان / Made with ❤️ by Nariman" footer).
- GitHub files: CI workflow (npm ci + lint + typecheck + build:worker), bug/feature issue templates, PR template, dependabot (next minor pinned for OpenNext compat), LICENSE (MIT 2026), CONTRIBUTING, SECURITY (pm@thepm.ir), CHANGELOG 1.0.0.
- Delivered: /home/z/my-project/download/myip/ (clean, node_modules/.next/.open-next excluded) + myip-github-repo.zip (1.9 MB).

Stage Summary:
- Repo is push-and-forget: connect it in Cloudflare dashboard (build: npx opennextjs-cloudflare build / deploy: npx opennextjs-cloudflare deploy) and every push to main auto-deploys. No env vars, no DB, no keys.
- Deploy button: https://deploy.workers.cloudflare.com/?url=https://github.com/NarimanKhaleghi/myip
- Chat delivered 3 step-by-step Persian guides: git push from local machine, Cloudflare Workers Git connection + custom domain + optional KV, Google Search Console submission.

---
Task ID: 4
Agent: Super Z (main)
Task: Fix Cloudflare build failure, add full GitHub Pages support, put README/docs at repo root, full project re-review.

Work Log:
- Diagnosed CF failure from user's build log: the pushed repo was the WORKSPACE ROOT (858 deps, next 16.1.3, .env, no @opennextjs/cloudflare) → `npx opennextjs-cloudflare build` = "could not determine executable to run".
- Made the project root itself the push-ready repo:
  - package.json rewritten: name myip v1.1.0, 16 runtime + 11 dev deps, added @opennextjs/cloudflare 1.20.6 + wrangler (bun install OK, lockfile regenerated, 298 packages). db:push = no-op echo (sandbox dev.sh compatibility). Dev script kept for platform.
  - Sandbox registry lacks radix-tabs 1.2.x → pinned exact verified versions (tabs 1.1.13 etc.); next 16.1.3→16.3.4 + eslint-config-next 16.3.4 (OpenNext peer >=16.3.3).
  - Pruned 41 unused shadcn ui components + db.ts + use-mobile.ts; copied public assets (manifest/icons/og) + docs/ from mirror; added wrangler.jsonc, open-next.config.ts, LICENSE, CONTRIBUTING, SECURITY, CHANGELOG, README.md, README_FA.md, comprehensive .gitignore (excludes myip/, download/, upload/, scripts/, tests/, examples/, mini-services/, db/, prisma/, Caddyfile, worklog, .zscripts).
  - tsconfig excludes workspace dirs (examples/skills/...).
- GitHub Pages static mode (NEW):
  - next.config.ts dual-target: BUILD_TARGET=static → output:export + basePath /myip + unoptimized images; else standalone.
  - src/lib/static-mode.ts (IS_STATIC_BUILD / BASE_PATH / withBasePath / API_BASE_URL) + src/lib/client-lookup.ts (CORS sources: ipwho.is, ipwhois.app, ipinfo.io, ipapi.is — all verified ACAO:*; reuses shared normalize/merge/risk from ip-aggregator; hosting/VPN keyword heuristics; client DoH DNSBL+PTR; browser headers).
  - hooks.ts branches for static build; tab-tools speed test pings speed.cloudflare.com in static mode, API docs prefixed with canonical URL; tab-info static headers note; footer API link → canonical; app/manifest.ts (replaces static manifest file) with base-path-aware icons/start_url; robots.ts + sitemap.ts force-static (export requirement).
  - .github/workflows/deploy-pages.yml (bun install → rm api dir → BUILD_TARGET=static build → .nojekyll → upload-pages-artifact → deploy-pages; auto basePath = /<repo-name>).
  - ci.yml rewritten for bun + fixed Task-3 typo (branches: ain] → [main]).
- VALIDATION:
  - Root: lint clean, tsc clean, dev server restarted on next 16.3.4, agent-browser server-mode regression (search 8.8.8.8: ASN 15169, FA country, sources, footer).
  - Mirror (myip/, exact repo copy): lint+tsc clean; `npx opennextjs-cloudflare build` SUCCESS (the exact failing CF command); workerd preview: / 200, /manifest.webmanifest 200 (fa RTL), /api/v1/health ok, /api/v1/ip/78.39.200.1 full 5-source report.
  - Static export: BUILD_TARGET=static build SUCCESS (after force-static fixes); served at /myip on :4173; agent-browser E2E: self-IP (client aggregation), search 8.8.8.8 (Google ASN), security tab (Spamhaus/SpamCop via browser DoH, PTR, WebRTC), info tab (browser headers + static note), tools (canonical API docs), geo (9 tiles + marker). All asset/manifest/icon hrefs correctly /myip-prefixed.
- README.md + README_FA.md updated: GitHub Pages badge + demo badge, "Deploy — 4 Ways" with GH Pages path + dual-target table, architecture dual-build note, bun commands, v1.1.0. CHANGELOG 1.1.0 entry.
- Deliverables refreshed: /home/z/my-project/download/myip/ (clean repo) + myip-github-repo.zip (2.0 MB).

Stage Summary:
- ROOT CAUSE FIXED: repo now contains @opennextjs/cloudflare + wrangler + wrangler.jsonc + open-next.config.ts + lockfile in sync → "select repo & deploy" on CF Workers Builds works with npx opennextjs-cloudflare build / deploy.
- NEW: one-command GitHub Pages deploy via Actions (Settings → Pages → Source: GitHub Actions).
- README.md/README_FA.md + all docs at repo root for full GitHub display.
- Verified end-to-end: worker build, workerd runtime, static export, both data modes in browser.

---
Task ID: 5
Agent: Super Z (main)
Task: Fix wrong IPv6 shown as "your IP" on dual-stack networks (user sees 2a01:5ec0:... instead of real IPv4 5.112.129.46) + fix page layout breaking when a long IPv6 overflows the hero card from the left (RTL).

Work Log:
- Root cause 1 (wrong IP): the whole own-IP report was keyed to the server's CF-Connecting-IP — on dual-stack networks (Irancell etc.) the browser connects over IPv6, so the report showed the visitor's IPv6. The old useDualStack (single-source ipify) only patched the hero number and ipify itself is unreachable from some networks (verified: ipify times out from this sandbox), making the UI fall back to the wrong IPv6.
- Root cause 2 (layout): hero IP slab (text-7xl, no max-width, no wrap) could not fit a 39-char IPv6 → horizontal overflow (left side on RTL) breaking the page.
- NEW src/lib/self-ip.ts: multi-source racing self-IP detection. IPv4 probes (IPv4-only endpoints, connection itself guarantees family): 1.1.1.1/cdn-cgi/trace (IP literal, CORS *), ipv4.icanhazip.com, api-ipv4.ip.sb, v4.ident.me, ipv4.wtfismyip.com, api-ipv4.ipify.org — all curl-verified ACAO:*. IPv6 probes: [2606:4700:4701::1111] literal trace + 5 v6-only hostnames. First valid answer wins (strict isIPv4/isIPv6 validation), losers aborted, 4s timeout, module-level promise caches, SSR-guarded.
- hooks.ts: useDualStack → useSelfIP (ipv4-gated `ready` + independent `v6Ready`); useIPInfo gained `enabled` gate. types.ts: DualStack → SelfIPState.
- page.tsx: tri-state ownIP (undefined=detecting/hold queries, null=no IPv4 route→server fallback, string=real IPv4→explicit /api/v1/ip/{v4} lookup) — the ENTIRE report (hero, stats, tabs, map, security, history) is now keyed to the real public IPv4; isLoading covers the detection hold so no IPv6-keyed flash.
- hero.tsx: mainIP = self.ipv4 ?? info.ip; dynamic slab sizing by address length (≤16 / ≤30 / >30 chars) + max-w-full + [overflow-wrap:anywhere] + dir="ltr"; IPv6 line deduped vs slab; QR title wrap-safe.
- Overflow-proofing: ui-bits CopyChip min-w-0 + InfoRow value [overflow-wrap:anywhere]; tab-tools compare card IP wrap; globals.css body overflow-x: clip (sticky-safe).
- E2E (agent-browser, in-session dev server): self load → slab 8.212.10.159 (real IPv4), kicker IPV4, report fetched via EXPLICIT /api/v1/ip/8.212.10.159 (not bare self) ✓; long IPv6 2a01:5ec0:1004:3a64:502f:9b2f:30a4:2c1 → slabFits true + overflowX 0 on desktop 1280 AND mobile 390 RTL ✓ (VLM visual review: wraps neatly, layout intact); fallback test with ALL 7 probe domains network-blocked → falls back to bare /api/v1/ip, renders ::1 (localhost connection IP), zero errors ✓; 8.8.8.8 regression ✓.
- Static (GitHub Pages) E2E: build:static with api/ removed (as the workflow does), out/ nested under /myip like Pages artifact → hero shows real IPv4 47.57.242.119, assetsOk true, 0 errors. Also confirmed out/ structure is correct for upload-pages-artifact (artifact root = /myip mount).
- Mirror validation: myip/ copy — npx opennextjs-cloudflare build SUCCESS (exact CF command); BUILD_TARGET=static build SUCCESS. lint + tsc clean on root.
- Workflow "branches: ain]" investigation: FALSE ALARM — display layer of this sandbox eats the literal sequence "[m" (ANSI-reset-like), so "[main]" RENDERS as "ain]" in tool outputs. Byte-level verification (od + char codes) proves all 6 workflow copies contain branches: [main]. Previous worklog's "typo fix ain]→ain]" was the same artifact. No real bug.
- Version 1.1.0 → 1.1.1; CHANGELOG 1.1.1 entry; README.md + README_FA.md feature/architecture rows updated (racing self-IP probes instead of ipify). Synced root → myip/ + download/myip/; myip-github-repo.zip regenerated (1.9 MB, 102 entries).

Stage Summary:
- "Your IP" now always shows the visitor's real public IPv4 (like ipnumberia/ipmyp) even on dual-stack networks where the browser connects over IPv6; IPv6 shown as secondary line; IPv6-only networks fall back to server connection IP.
- Long IPv6 addresses wrap inside the hero card — no more horizontal overflow / broken layout (desktop + mobile RTL verified).
- Deliverables refreshed: /home/z/my-project/download/myip/ + myip-github-repo.zip (v1.1.1, worker + static builds re-validated).

---
Task ID: 6
Agent: Super Z (main)
Task: Remove the tab-based report UI — render all five sections (Overview, Geolocation, Network & ISP, Security, Tools) on ONE clean, ordered single page per user request.

Work Log:
- Replaced tabs with a continuous single-page report: new src/components/myip/report-sections.tsx with numbered engineering headers (01–05 kicker + Lalezar display title + one-line FA/EN description) wrapping the five existing section components unchanged (zero changes to their internals → zero data-flow regressions). Sections ordered by user importance: info → geo → network → security → tools, spaced space-y-14/16, anchor ids #info…#tools with scroll-mt-28.
- Sticky jump-nav under the main header (top-16, sticks only while report area in view): 5 anchor links, numbered mono chips, invert-on-active, scroll-spy (rAF-throttled passive scroll listener, line = scrollY+150), horizontal scroll on mobile, RTL-aware, aria-label. Click → immediate active + 900ms spy lock (dynamic map/DNSBL content shifts sections mid-smooth-scroll; verified toolsTop landed exactly 112px = scroll-mt-28).
- Removed myip/tabs.tsx + unused ui/tabs.tsx (verified no other importers); page.tsx lost activeTab state, error block restyled into the new flow.
- i18n: added secReportKicker/secJumpTo/secInfoDesc…secToolsDesc (fa+en); tab* keys reused as section titles.
- Investigated mobile scrollWidth 842px @390px: NOT a real overflow — DOM walk found 0 unclipped offenders; programmatic scrollBy probe moved 0px; cause = footer marquee's transformed items inside overflow:hidden inflating documentElement.scrollWidth (Chromium RTL quirk). Added html{overflow-x:clip} guard (metric hygiene; body clip already prevented user scrolling).
- E2E (agent-browser, dev server): all 5 sections + 0 [role=tab] nodes on one page; nav spy + anchor click verified (desktop + mobile 390 RTL, nav scrolls horizontally); long-IPv6 regression overflow-safe; FA↔EN toggle (EN titles: Overview/Geolocation/Network & ISP/Security/Tools, dir=ltr); no page errors. Static GitHub Pages build served at /myip/: sections render, anchor lands /myip/#security at 112px, assets OK, real IPv4 in slab.
- VLM visual review: 8.5/10 — sections stacked cleanly with numbered headers, sticky nav visible desktop+mobile, no overlaps/cut-offs/misalignment. (Its "red 1 Issue button" note = agent-browser extension overlay, not the site. Pixel audit: visible-saturation 0.42%/0.19% = grain noise residue only, visually pure monochrome.)
- README.md/README_FA.md: new "Single-page report / گزارش تک‌صفحه‌ای" feature row, "security tab"→section wording, design table tabs→section links; regenerated monochrome docs/screenshot-dark.png + screenshot-light.png (1280x1600, new layout).
- Version 1.1.1 → 1.2.0; CHANGELOG 1.2.0 entry; synced root → myip/ + download/myip/ (with tabs.tsx deletions); mirror re-validated: npx opennextjs-cloudflare build SUCCESS + BUILD_TARGET=static build SUCCESS; myip-github-repo.zip regenerated (1.8 MB, 101 entries).

Stage Summary:
- Report is now a single scrollable page: every section visible at once in importance order, numbered engineering headers, sticky scroll-spy jump-nav, fully printable in one pass.
- No tabs anywhere (component + unused shadcn tabs removed); all data flows, loading skeletons and features unchanged.
- Both deploy targets re-validated (Workers + GitHub Pages static); deliverables refreshed at /home/z/my-project/download/myip/ + myip-github-repo.zip (v1.2.0).

---
Task ID: 7
Agent: Super Z (main)
Task: Fix mobile responsive layout — basic-info tables and tools cards overflowing the left edge of the screen on phones (user report), deliver new version.

Work Log:
- Reproduced at 390px: ALL 4 basic-info cards were 826px wide (grid track blown out), sticking 452px past the left edge (RTL). Isolation testing (hide-one-card loop) pinpointed the User-Agent card; drilling in pinned it to the UA CopyChip: its value span is white-space:nowrap (truncate), and during the grid's intrinsic min-content sizing the span contributes its FULL ~706px text width — overflow:hidden/min-w-0 only zero the USED size in a definite-width flex container, not the intrinsic contribution. Tools section: IPv6 history entries pushed chips past the card border (flex-1 item, min-width:auto content floor).
- Fixes (src/components/myip):
  - ui-bits.tsx SectionCard: + min-w-0 (grid items cap min-content → every section grid keeps cards at container width; long content truncates/wraps inside cards).
  - ui-bits.tsx CopyChip button: + min-w-0 (flex-item chips — history rows, InfoRow values — shrink below content and ellipsize).
  - tab-tools.tsx compare: results grid-cols-2 → grid-cols-1 sm:grid-cols-2; pills row col-span-2 → sm:col-span-2 (unconditional span-2 forced a phantom 2nd column on mobile, squeezing IP cards to 97/215px); ISP span truncate → block truncate (inline span can't truncate and painted across the border); inputs + result divs min-w-0.
  - header.tsx: search wrapper + min-w-0; GitHub icon hidden below sm (still in hero/footer) — header no longer pokes out at ≤360px.
  - tab-tools.tsx useHistory: getServerSnapshot () => [] → module-level EMPTY_HISTORY (killed the "getServerSnapshot should be cached" console errors; 0 console errors now).
- E2E (agent-browser, dev server): 390px FA/EN — 0 unclipped offenders, scrollW=viewport, info/tools cards exactly 358px; long-IPv6 history chips truncate inside cards; compare of two IPv6s → single stacked column, ISP readable (197px), worst overflow 0-1px; 320px — 0 offenders (input 59px but usable); 1280px desktop — GitHub visible, 2×552px grids, full-width API card, compare 2×245px + spanning pills row. Pixel audit of screenshots: only full-bleed header/nav borders touch screen edges (by design). VLM "IPv6 overflow" claim disproven by DOM metrics (its known hallucination + extension-overlay badge).
- Housekeeping: mirror myip/ + download/myip/ were STALE (missing report-sections.tsx, static-mode.ts, self-ip.ts, client-lookup.ts, manifest.ts, deploy-pages.yml, bun.lock from Tasks 4-6) — fully resynced: src trees now identical, all root configs/.github/public/docs/lockfile in sync; bun install --frozen-lockfile verified in mirror (lock ↔ package.json 1.2.1 in sync).
- Validation: root lint clean + tsc clean (only pre-existing tailwind.config.ts workspace artifact); mirror npx opennextjs-cloudflare build SUCCESS; mirror BUILD_TARGET=static build SUCCESS (with api/ removed as the workflow does, restored after).
- Version 1.2.0 → 1.2.1; CHANGELOG 1.2.1 entry; myip-github-repo.zip regenerated (100 files, 1.8 MB, bun.lock included).

Stage Summary:
- Mobile layout fully fixed: no card/table/chip overflows the viewport on any phone width (320-844px tested), FA RTL + EN LTR, with worst-case content (39-char IPv6 history + IPv6 compare results). Desktop unchanged.
- Deliverables refreshed: /home/z/my-project/download/myip/ (complete, incl. bun.lock) + myip-github-repo.zip v1.2.1; both deploy targets (Cloudflare Workers + GitHub Pages) build-validated.
