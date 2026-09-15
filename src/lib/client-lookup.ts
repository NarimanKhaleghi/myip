/**
 * Browser-side IP intelligence for the static GitHub Pages build.
 *
 * On GitHub Pages there is no server, so the browser aggregates data directly
 * from CORS-enabled public APIs (no keys, no tracking) and performs DNS
 * lookups over DNS-over-HTTPS. The merge logic is shared with the server
 * aggregator in `ip-aggregator.ts`, so both deployments produce the exact
 * same record shape.
 */

import type { IPExtra, IPInfo, HeadersInfo } from "@/components/myip/types";
import {
  mergeSourceResults,
  computeRiskScore,
} from "./ip-aggregator";
import type { SourceResult } from "./ip-sources";
import { lookupPTR, checkDNSBL } from "./dns";

/* ------------------------------------------------------------------ */
/* Sources (CORS-enabled only — callable from the browser)             */
/* ------------------------------------------------------------------ */

/** Providers that send `Access-Control-Allow-Origin` and need no API key. */
const CLIENT_SOURCES: Array<{
  name: string;
  url: (ip: string | null) => string;
  valid: (d: Record<string, unknown>) => boolean;
}> = [
  {
    name: "ipwho.is",
    url: (ip) => `https://ipwho.is/${ip ?? ""}`,
    valid: (d) => d.success !== false,
  },
  {
    name: "ipwhois.app",
    url: (ip) => `https://ipwhois.app/json/${ip ?? ""}`,
    valid: (d) => d.success !== false,
  },
  {
    name: "ipinfo.io",
    url: (ip) => (ip ? `https://ipinfo.io/${ip}/json` : "https://ipinfo.io/json"),
    valid: (d) => !d.error,
  },
  {
    name: "ipapi.is",
    url: (ip) => (ip ? `https://api.ipapi.is/?q=${ip}` : "https://api.ipapi.is/"),
    valid: (d) => typeof d.ip === "string",
  },
];

async function fetchJSON(
  url: string,
  timeoutMs = 7000
): Promise<Record<string, unknown> | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const json = await res.json();
    if (json && typeof json === "object") {
      return json as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Heuristic hosting / proxy detection (client-side fallback)          */
/* ------------------------------------------------------------------ */

const HOSTING_PATTERN =
  /(host|hosting|server|datacenter|data center|dedicated|colocation|vps|cloud|aws|amazon|google llc|microsoft|azure|digitalocean|linode|akamai|ovh|hetzner|vultr|m247|contabo|leaseweb|choopa|packethub|zenlayer|oracle|alibaba|tencent|scaleway|upcloud|frantech|private internet access|mullvad|nordvpn|surfshark|expressvpn|proton|windscribe)/i;

const VPN_PATTERN =
  /(vpn|proxy|tor|exit node|relay|tunnel|anonymous|surfshark|nordvpn|mullvad|proton|private internet access|expressvpn)/i;

/** Refine security flags using org/ISP keywords when ip-api.com is unavailable. */
function refineSecurityHeuristics(info: IPInfo): IPInfo {
  const text = [info.org, info.isp, info.asnOrg, info.domain]
    .filter(Boolean)
    .join(" ");
  if (!text) return info;
  if (VPN_PATTERN.test(text)) info.isProxy = true;
  if (HOSTING_PATTERN.test(text)) info.isHosting = true;
  info.riskScore = computeRiskScore(
    info.isProxy,
    info.isHosting,
    info.bogonLabels.length > 0
  );
  return info;
}

/* ------------------------------------------------------------------ */
/* Public client-side lookups                                          */
/* ------------------------------------------------------------------ */

/** Aggregate an IP lookup (or the visitor's own IP when `target` is null). */
export async function clientLookupIP(target: string | null): Promise<IPInfo> {
  const results = await Promise.all(
    CLIENT_SOURCES.map(async (src): Promise<SourceResult> => {
      const data = await fetchJSON(src.url(target));
      if (!data || !src.valid(data)) {
        return { source: src.name, ok: false };
      }
      return { source: src.name, ok: true, data };
    })
  );

  // The address being looked up (needed for bogon/version classification).
  let ip = target ?? "";
  if (!ip) {
    for (const r of results) {
      if (r.ok && typeof r.data?.ip === "string") {
        ip = r.data.ip as string;
        break;
      }
    }
  }

  const merged = mergeSourceResults(ip, results) as unknown as IPInfo;
  refineSecurityHeuristics(merged);
  return { ...merged, cached: false };
}

/** PTR + DNSBL checks straight from the browser via DNS-over-HTTPS. */
export async function clientLookupExtra(ip: string): Promise<IPExtra> {
  const [ptr, dnsbl] = await Promise.all([
    lookupPTR(ip),
    checkDNSBL(ip),
  ]);
  return {
    ip,
    ptr,
    dnsbl,
    dnsblListedCount: dnsbl.filter((d) => d.listed).length,
  };
}

/** Browser-visible request information (no server on GitHub Pages). */
export function clientBrowserHeaders(): HeadersInfo {
  if (typeof navigator === "undefined") return { ip: null, headers: {} };
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    doNotTrack?: string;
  };
  const headers: Record<string, string> = {
    "user-agent": nav.userAgent,
    "accept-language": nav.languages?.join(", ") ?? nav.language,
    "sec-ch-ua-platform": nav.platform || "—",
    "x-browser-timezone":
      Intl.DateTimeFormat().resolvedOptions().timeZone || "—",
    "x-browser-screen":
      typeof screen !== "undefined"
        ? `${screen.width}x${screen.height}`
        : "—",
    "x-browser-viewport":
      typeof window !== "undefined"
        ? `${window.innerWidth}x${window.innerHeight}`
        : "—",
    "x-browser-dpr":
      typeof window !== "undefined"
        ? String(window.devicePixelRatio)
        : "—",
    "x-browser-cookies": String(nav.cookieEnabled),
    "x-browser-do-not-track": nav.doNotTrack || "—",
    "x-browser-cpu-cores": String(nav.hardwareConcurrency ?? "—"),
    "x-browser-device-memory": nav.deviceMemory
      ? `${nav.deviceMemory} GB`
      : "—",
  };
  return { ip: null, headers };
}
