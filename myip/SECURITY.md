# Security Policy

## Supported versions

| Version | Supported |
|:--------|:----------|
| 1.0.x   | ✅        |

## Reporting a vulnerability

Please report vulnerabilities **privately** — do not open a public GitHub issue.

- **Email:** [pm@thepm.ir](mailto:pm@thepm.ir) (preferred — please use a clear subject like `[SEC] myip — <summary>`)
- Or use GitHub's **private vulnerability reporting** on the repo's Security tab.

Please include: a description, reproduction steps, impact assessment, and (if possible) a suggested fix. You will get an acknowledgement within 72 hours and a status update at least every 7 days until resolved.

## Scope

- The myip Worker code and build pipeline in this repository.
- The public API endpoints (`/api/v1/*`) as deployed at `myip.thepm.ir`.

## Out of scope

- Vulnerabilities in third-party data providers (ipwho.is, ip-api.com, …) — report to them.
- Rate-limit exhaustion / DoS concerns on the free tier.
- Theoretical issues requiring control of Cloudflare's own edge network.

## Data handling

myip keeps **no logs and no database**. Lookups are proxied to public geo-IP APIs with 6-second timeouts and a 24h in-memory cache, and nothing is persisted to disk anywhere in the pipeline.
