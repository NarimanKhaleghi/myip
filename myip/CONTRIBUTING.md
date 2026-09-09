# Contributing to myip

First off, thanks for taking the time to contribute! ⚫⚪

This document is the short guide for getting your changes merged.

## Development setup

```bash
git clone https://github.com/NarimanKhaleghi/myip.git
cd myip
npm install
npm run dev            # → http://localhost:3000
```

| Command | What it does |
|:--------|:-------------|
| `npm run dev` | Next.js dev server with hot reload |
| `npm run lint` | ESLint on `src/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build:worker` | Full OpenNext (Cloudflare Workers) production build |
| `npm run preview:worker` | Runs the built Worker on the real workerd runtime → http://localhost:8787 |

## Ground rules

1. **CI must pass.** Every PR runs lint, typecheck and a full Workers build (`.github/workflows/ci.yml`).
2. **Strictly black & white UI.** The design system uses only `#0a0a0a` / `#f5f5f5`. Status must be expressed with *patterns* (filled / hatched / dashed), never with color. Do not add any hue.
3. **Bilingual UI.** Every user-facing string must exist in **both** dictionaries in `src/lib/i18n.ts` (fa + en). Persian text should use proper نیم‌فاصله (ZWNJ).
4. **Fail-soft everything.** Upstream API calls must have timeouts and must never throw into a 500. A dead source degrades the report, it never breaks it.
5. **Privacy is a feature.** No cookies, no logging, no accounts, no analytics. Browser-only persistence (localStorage) is the only acceptable storage.
6. **No new required config.** The project deploys with zero environment variables. New features must work out of the box; optional keys go in `wrangler.jsonc` as commented blocks.

## Where things live

| Area | Path |
|:-----|:-----|
| IP data source adapters | `src/lib/ip-sources.ts` (register in `ALL_SOURCES`) |
| Aggregation / merge / risk score | `src/lib/ip-aggregator.ts` |
| DNS (PTR + DNSBL over DoH) | `src/lib/dns.ts` |
| IP validation / formats | `src/lib/ip-utils.ts` |
| API routes | `src/app/api/v1/**` |
| UI components | `src/components/myip/**` |
| Design tokens (monochrome) | `src/app/globals.css` |
| i18n dictionaries | `src/lib/i18n.ts` + `src/lib/articles.ts` |

## Adding a new IP data source

1. Write an adapter in `src/lib/ip-sources.ts`:

   ```ts
   export async function fromExample(ip: string): Promise<SourceResult> {
     const data = await fetchJSON(`https://example.com/${ip}`);
     if (!data || data.error) return { source: "example.com", ok: false };
     return { source: "example.com", ok: true, data };
   }
   ```

2. Register it in `ALL_SOURCES`.
3. Map its fields in `src/lib/ip-aggregator.ts` (pick per-source priority order).
4. Test with `npm run preview:worker` + `curl localhost:8787/api/v1/ip/8.8.8.8` and check `sourcesUsed`.

## Commit style & PRs

- Conventional-ish commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`.
- Branch from `main`: `feat/tor-exit-check`, `fix/dnsbl-timeout`, …
- Keep PRs small and focused; describe *why*, link issues.
- UI changes: attach a dark-mode **and** light-mode screenshot.

## Reporting bugs

Open an [issue](https://github.com/NarimanKhaleghi/myip/issues) with:
the URL/page, the IP you looked up (if public), expected vs actual behavior,
and your browser/OS. Security issues: see [`SECURITY.md`](SECURITY.md) — do **not** open public issues for them.
