/**
 * Client-side self-IP detection with multi-source racing.
 *
 * WHY THIS EXISTS
 * On dual-stack networks (very common on Iranian mobile ISPs) the browser
 * prefers IPv6, so it reaches myip.thepm.ir over IPv6 and the server's
 * `CF-Connecting-IP` is the visitor's IPv6 address — even though the
 * "real" public IPv4 is what the user expects to see (the behaviour of
 * ipnumberia.com and similar tools). Additionally, the previous
 * single-source detector (ipify) is unreachable from some networks, which
 * made the UI fall back to that wrong IPv6 address.
 *
 * STRATEGY
 * Probe endpoints that are only reachable over ONE address family, so the
 * connection itself guarantees the family of the returned address:
 *   - IPv4-only: the IP literal `https://1.1.1.1/cdn-cgi/trace` (an IPv4
 *     literal cannot be reached over IPv6), `ipv4.icanhazip.com`,
 *     `api-ipv4.ip.sb`, `v4.ident.me`, `ipv4.wtfismyip.com`,
 *     `api-ipv4.ipify.org` — all hostnames with A records only.
 *   - IPv6-only: the IP literal `https://[2606:4700:4700::1111]/cdn-cgi/trace`
 *     and equivalent v6-only hostnames.
 * All endpoints are public, keyless and send `Access-Control-Allow-Origin: *`.
 *
 * All sources race in parallel; the first syntactically-valid answer wins
 * and the losing requests are aborted. Each request has its own timeout,
 * so a fully unreachable family resolves to `null` within TIMEOUT_MS.
 */

import { isIPv4, isIPv6 } from "./ip-utils";

const TIMEOUT_MS = 4000;

/** A probe returns the raw address string (or null when it fails). */
type Probe = (signal: AbortSignal) => Promise<string | null>;

interface Source {
  probe: Probe;
  isValid: (value: string) => boolean;
}

/* ------------------------------------------------------------------ */
/* Probe builders                                                      */
/* ------------------------------------------------------------------ */

/** Plain-text endpoint whose whole body is the address. */
const textProbe = (url: string): Probe => async (signal) => {
  const res = await fetch(url, { signal, cache: "no-store" });
  if (!res.ok) return null;
  const body = (await res.text()).trim();
  return body || null;
};

/** Cloudflare `cdn-cgi/trace` endpoint — parse the `ip=` line. */
const traceProbe = (url: string): Probe => async (signal) => {
  const res = await fetch(url, { signal, cache: "no-store" });
  if (!res.ok) return null;
  const body = await res.text();
  const line = body.split("\n").find((l) => l.startsWith("ip="));
  return line ? line.slice(3).trim() : null;
};

/** ipify-style JSON endpoint — `{ "ip": "..." }`. */
const jsonProbe = (url: string): Probe => async (signal) => {
  const res = await fetch(url, { signal, cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as { ip?: unknown };
  return typeof data?.ip === "string" ? data.ip : null;
};

/* ------------------------------------------------------------------ */
/* Source lists (IPv4-only / IPv6-only endpoints)                      */
/* ------------------------------------------------------------------ */

const IPV4_SOURCES: Source[] = [
  // IP literal → the connection is forced over IPv4. Cloudflare's 1.1.1.1
  // is reachable from virtually every network, including Iran.
  { probe: traceProbe("https://1.1.1.1/cdn-cgi/trace"), isValid: isIPv4 },
  { probe: textProbe("https://ipv4.icanhazip.com"), isValid: isIPv4 },
  { probe: textProbe("https://api-ipv4.ip.sb/ip"), isValid: isIPv4 },
  { probe: textProbe("https://v4.ident.me"), isValid: isIPv4 },
  { probe: textProbe("https://ipv4.wtfismyip.com/text"), isValid: isIPv4 },
  { probe: jsonProbe("https://api-ipv4.ipify.org?format=json"), isValid: isIPv4 },
];

const IPV6_SOURCES: Source[] = [
  // IPv6 literal → the connection is forced over IPv6.
  { probe: traceProbe("https://[2606:4700:4700::1111]/cdn-cgi/trace"), isValid: isIPv6 },
  { probe: textProbe("https://ipv6.icanhazip.com"), isValid: isIPv6 },
  { probe: textProbe("https://api-ipv6.ip.sb/ip"), isValid: isIPv6 },
  { probe: textProbe("https://v6.ident.me"), isValid: isIPv6 },
  { probe: textProbe("https://ipv6.wtfismyip.com/text"), isValid: isIPv6 },
  { probe: jsonProbe("https://api-ipv6.ipify.org?format=json"), isValid: isIPv6 },
];

/* ------------------------------------------------------------------ */
/* Race helper                                                         */
/* ------------------------------------------------------------------ */

/**
 * Run every source in parallel; the first fulfilled AND valid answer wins,
 * every other in-flight request is aborted. Resolves `null` only when all
 * sources failed or timed out.
 */
function raceValid(sources: Source[]): Promise<string | null> {
  return new Promise((resolve) => {
    let settled = false;
    let pending = sources.length;
    const controllers = sources.map(() => new AbortController());

    const done = (value: string | null) => {
      if (settled) return;
      settled = true;
      for (const c of controllers) c.abort(); // cancel the losers
      resolve(value);
    };

    const settleFailure = () => {
      if (--pending === 0) done(null);
    };

    sources.forEach((source, i) => {
      const timer = setTimeout(() => controllers[i].abort(), TIMEOUT_MS);
      source
        .probe(controllers[i].signal)
        .then(
          (value) => {
            clearTimeout(timer);
            if (value && source.isValid(value)) done(value);
            else settleFailure();
          },
          () => {
            clearTimeout(timer);
            settleFailure();
          }
        )
        .catch(() => undefined); // the race must never reject
    });
  });
}

/* ------------------------------------------------------------------ */
/* Public API — module-level caches (one probe set per page load)      */
/* ------------------------------------------------------------------ */

export interface SelfIPs {
  ipv4: string | null;
  ipv6: string | null;
}

let ipv4Cache: Promise<string | null> | null = null;
let ipv6Cache: Promise<string | null> | null = null;

/**
 * The visitor's real public IPv4 (probed over IPv4-only endpoints).
 * Resolves `null` when the network has no IPv4 route at all (e.g. an
 * IPv6-only network) — callers should then fall back to the server's
 * connection address.
 */
export function detectSelfIPv4(): Promise<string | null> {
  if (!ipv4Cache) {
    ipv4Cache =
      typeof window === "undefined"
        ? Promise.resolve(null)
        : raceValid(IPV4_SOURCES).catch(() => null);
  }
  return ipv4Cache;
}

/**
 * The visitor's public IPv6 (probed over IPv6-only endpoints).
 * Resolves `null` on IPv4-only networks.
 */
export function detectSelfIPv6(): Promise<string | null> {
  if (!ipv6Cache) {
    ipv6Cache =
      typeof window === "undefined"
        ? Promise.resolve(null)
        : raceValid(IPV6_SOURCES).catch(() => null);
  }
  return ipv6Cache;
}

/** Both addresses at once (each cached independently). */
export function detectSelfIPs(): Promise<SelfIPs> {
  return Promise.all([detectSelfIPv4(), detectSelfIPv6()]).then(
    ([ipv4, ipv6]) => ({ ipv4, ipv6 })
  );
}
