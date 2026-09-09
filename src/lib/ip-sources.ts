/**
 * Server-side adapters for free IP intelligence APIs.
 * Each adapter normalizes its provider's payload into the unified schema.
 * All requests run with timeouts and fail soft (never throw).
 */

import { isIPv4, isIPv6 } from "./ip-utils";

export interface SourceResult {
  source: string;
  ok: boolean;
  data?: Record<string, unknown>;
}

const UA =
  "Mozilla/5.0 (compatible; myip-thepm-ir/1.0; +https://myip.thepm.ir)";

async function fetchJSON(
  url: string,
  timeoutMs = 6000
): Promise<Record<string, unknown> | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": UA, Accept: "application/json" },
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

/** 1) ipwho.is — HTTPS, comprehensive geo + connection + flag. */
export async function fromIpWhoIs(ip: string): Promise<SourceResult> {
  const data = await fetchJSON(`https://ipwho.is/${ip}`);
  if (!data || data.success === false) return { source: "ipwho.is", ok: false };
  return { source: "ipwho.is", ok: true, data };
}

/** 2) ipwhois.app — HTTPS, geo + connection. */
export async function fromIpWhoisApp(ip: string): Promise<SourceResult> {
  const data = await fetchJSON(`https://ipwhois.app/json/${ip}`);
  if (!data || data.success === false) return { source: "ipwhois.app", ok: false };
  return { source: "ipwhois.app", ok: true, data };
}

/** 3) ip-api.com — HTTP, geo + proxy/hosting/mobile security flags. */
export async function fromIpApiCom(ip: string): Promise<SourceResult> {
  const fields =
    "status,message,country,countryCode,continent,continentCode,region,regionName,city,zip,lat,lon,timezone,offset,currency,isp,org,as,reverse,mobile,proxy,hosting,query";
  const data = await fetchJSON(`http://ip-api.com/json/${ip}?fields=${fields}`);
  if (!data || data.status !== "success") return { source: "ip-api.com", ok: false };
  return { source: "ip-api.com", ok: true, data };
}

/** 4) ipinfo.io — HTTPS, basic geo + hostname. */
export async function fromIpinfoIO(ip: string): Promise<SourceResult> {
  const data = await fetchJSON(`https://ipinfo.io/${ip}/json`);
  if (!data || data.error) return { source: "ipinfo.io", ok: false };
  return { source: "ipinfo.io", ok: true, data };
}

/** 5) api.ipapi.is — HTTPS, company/asn + bogon. */
export async function fromIpapiIs(ip: string): Promise<SourceResult> {
  const data = await fetchJSON(`https://api.ipapi.is/?q=${ip}`);
  if (!data || !data.ip) return { source: "ipapi.is", ok: false };
  return { source: "ipapi.is", ok: true, data };
}

export function ipVersionOf(ip: string): "IPv4" | "IPv6" {
  return isIPv4(ip) ? "IPv4" : isIPv6(ip) ? "IPv6" : "IPv4";
}

export const ALL_SOURCES: Array<{
  name: string;
  fetch: (ip: string) => Promise<SourceResult>;
}> = [
  { name: "ipwho.is", fetch: fromIpWhoIs },
  { name: "ip-api.com", fetch: fromIpApiCom },
  { name: "ipwhois.app", fetch: fromIpWhoisApp },
  { name: "ipinfo.io", fetch: fromIpinfoIO },
  { name: "ipapi.is", fetch: fromIpapiIs },
];
