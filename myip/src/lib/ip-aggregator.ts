/**
 * Aggregates results from multiple free IP APIs into one unified record.
 * Merge policy: field-by-field with source priority; first truthy value wins
 * based on the source ordering defined in ALL_SOURCES.
 */

import { classifyIPv4 } from "./ip-utils";
import {
  ALL_SOURCES,
  ipVersionOf,
  type SourceResult,
} from "./ip-sources";

export interface AggregatedIPInfo {
  ip: string;
  version: "IPv4" | "IPv6";

  // Geolocation
  country?: string;
  countryCode?: string;
  continent?: string;
  region?: string;
  city?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  isEU?: boolean;
  flagEmoji?: string;
  flagImg?: string;
  capital?: string;
  callingCode?: string;
  borders?: string[];

  // Network / ISP
  isp?: string;
  org?: string;
  asn?: string;
  asnNumber?: number;
  asnOrg?: string;
  domain?: string;

  // Timezone
  timezone?: string;
  timezoneAbbr?: string;
  utcOffset?: string;
  currentTime?: string;

  // Extra
  hostname?: string;
  currencyCode?: string;

  // Security & classification
  isProxy?: boolean;
  isHosting?: boolean;
  isMobile?: boolean;
  riskScore?: number;
  bogonLabels: string[];

  // Meta
  sourcesUsed: string[];
  sourcesFailed: string[];
  fetchedAt: string;
}

function s(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}
function n(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}
function b(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

/** Normalize one source payload into partial AggregatedIPInfo. */
function normalize(src: SourceResult): Partial<AggregatedIPInfo> | null {
  if (!src.ok || !src.data) return null;
  const d = src.data;
  switch (src.source) {
    case "ipwho.is": {
      const conn = (d.connection ?? {}) as Record<string, unknown>;
      const tz = (d.timezone ?? {}) as Record<string, unknown>;
      const flag = (d.flag ?? {}) as Record<string, unknown>;
      return {
        country: s(d.country),
        countryCode: s(d.country_code),
        continent: s(d.continent),
        region: s(d.region),
        city: s(d.city),
        postal: s(d.postal),
        latitude: n(d.latitude),
        longitude: n(d.longitude),
        isEU: b(d.is_eu),
        flagEmoji: s(flag.emoji),
        flagImg: s(flag.img),
        capital: s(d.capital),
        callingCode: s(d.calling_code),
        borders: s(d.borders)?.split(",").map((x) => x.trim()),
        isp: s(conn.isp),
        org: s(conn.org),
        asnNumber: n(conn.asn),
        domain: s(conn.domain),
        timezone: s(tz.id),
        timezoneAbbr: s(tz.abbr),
        utcOffset: s(tz.utc),
        currentTime: s(tz.current_time),
      };
    }
    case "ipwhois.app": {
      return {
        country: s(d.country),
        countryCode: s(d.country_code),
        continent: s(d.continent),
        region: s(d.region),
        city: s(d.city),
        postal: s(d.postal),
        latitude: n(d.latitude),
        longitude: n(d.longitude),
        isp: s(d.isp),
        org: s(d.org),
        asn: s(d.asn),
        capital: s(d.country_capital),
        callingCode: s(d.country_phone),
        flagImg: s(d.country_flag),
        timezone: s(d.timezone),
        timezoneAbbr: s(d.timezone_name),
        utcOffset: s(d.timezone_utc),
        currencyCode: s(d.currency),
      };
    }
    case "ip-api.com": {
      const as = s(d.as);
      const asnMatch = as?.match(/^(AS\d+)\s*(.*)$/);
      return {
        country: s(d.country),
        countryCode: s(d.countryCode),
        continent: s(d.continent),
        region: s(d.regionName),
        city: s(d.city),
        postal: s(d.zip),
        latitude: n(d.lat),
        longitude: n(d.lon),
        isp: s(d.isp),
        org: s(d.org),
        asn: asnMatch ? asnMatch[1] : undefined,
        asnOrg: asnMatch ? asnMatch[2] : undefined,
        hostname: s(d.reverse),
        timezone: s(d.timezone),
        isProxy: b(d.proxy),
        isHosting: b(d.hosting),
        isMobile: b(d.mobile),
        currencyCode: s(d.currency),
      };
    }
    case "ipinfo.io": {
      const loc = s(d.loc)?.split(",");
      const org = s(d.org);
      const asnMatch = org?.match(/^(AS\d+)\s*(.*)$/);
      return {
        country: s(d.country),
        countryCode: s(d.country),
        region: s(d.region),
        city: s(d.city),
        postal: s(d.postal),
        latitude: loc ? n(Number(loc[0])) : undefined,
        longitude: loc ? n(Number(loc[1])) : undefined,
        hostname: s(d.hostname),
        timezone: s(d.timezone),
        org: asnMatch ? asnMatch[2] : org,
        asn: asnMatch ? asnMatch[1] : undefined,
      };
    }
    case "ipapi.is": {
      const asn = s(d.asn);
      const asnMatch = asn?.match(/^(AS\d+)\s*(.*)$/);
      return {
        country: s(d.country),
        region: s(d.region),
        city: s(d.city),
        latitude: n(d.lat),
        longitude: n(d.lon),
        org: s(d.company),
        asn: asnMatch ? asnMatch[1] : undefined,
        asnOrg: asnMatch ? asnMatch[2] : undefined,
        timezone: s(d.timezone),
      };
    }
    default:
      return null;
  }
}

/** Risk score 0-100 heuristic from available signals. */
function computeRiskScore(
  isProxy?: boolean,
  isHosting?: boolean,
  bogon: boolean = false
): number {
  let score = 0;
  if (isProxy) score += 55;
  if (isHosting) score += 30;
  if (bogon) score = 5;
  return Math.min(100, Math.max(0, score));
}

export async function aggregateIPInfo(ip: string): Promise<AggregatedIPInfo> {
  const results = await Promise.all(
    ALL_SOURCES.map(async (src) => {
      try {
        return await src.fetch(ip);
      } catch {
        return { source: src.name, ok: false } as SourceResult;
      }
    })
  );

  const merged: AggregatedIPInfo = {
    ip,
    version: ipVersionOf(ip),
    bogonLabels: [],
    sourcesUsed: [],
    sourcesFailed: [],
    fetchedAt: new Date().toISOString(),
  };

  // Bogon classification (IPv4 only for now)
  if (ip.includes(".") && !ip.includes(":")) {
    const cls = classifyIPv4(ip);
    if (cls.isBogon) merged.bogonLabels = cls.labels;
  }

  for (const r of results) {
    if (r.ok && r.data) {
      merged.sourcesUsed.push(r.source);
    } else {
      merged.sourcesFailed.push(r.source);
    }
  }

  // Merge with source priority (ALL_SOURCES order = priority order)
  const target = merged as unknown as Record<string, unknown>;
  for (const r of results) {
    const partial = normalize(r);
    if (!partial) continue;
    for (const [key, value] of Object.entries(partial)) {
      if (value === undefined || value === null) continue;
      const current = target[key];
      if (current === undefined || current === null || current === "") {
        target[key] = value;
      }
    }
  }

  // Fill ASN from number if only number available
  if (!merged.asn && merged.asnNumber) {
    merged.asn = `AS${merged.asnNumber}`;
  }
  if (!merged.asnNumber && merged.asn) {
    const m = merged.asn.match(/^AS(\d+)/);
    if (m) merged.asnNumber = Number(m[1]);
  }

  merged.riskScore = computeRiskScore(
    merged.isProxy,
    merged.isHosting,
    merged.bogonLabels.length > 0
  );

  return merged;
}
