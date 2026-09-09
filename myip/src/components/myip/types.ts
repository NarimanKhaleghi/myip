"use client";

/** Client-side mirror of the server's AggregatedIPInfo. */
export interface IPInfo {
  ip: string;
  version: "IPv4" | "IPv6";
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
  isp?: string;
  org?: string;
  asn?: string;
  asnNumber?: number;
  asnOrg?: string;
  domain?: string;
  timezone?: string;
  timezoneAbbr?: string;
  utcOffset?: string;
  currentTime?: string;
  hostname?: string;
  currencyCode?: string;
  isProxy?: boolean;
  isHosting?: boolean;
  isMobile?: boolean;
  riskScore?: number;
  bogonLabels: string[];
  sourcesUsed: string[];
  sourcesFailed: string[];
  fetchedAt: string;
  cached?: boolean;
}

export interface DNSBLItem {
  blacklist: string;
  listed: boolean;
  status: string;
}

export interface IPExtra {
  ip: string;
  ptr: string | null;
  dnsbl: DNSBLItem[];
  dnsblListedCount: number;
}

export interface HeadersInfo {
  ip: string | null;
  headers: Record<string, string>;
}

export interface DualStack {
  ipv4: string | null;
  ipv6: string | null;
}
