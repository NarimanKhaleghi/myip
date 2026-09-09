/**
 * Shared IP utilities — pure functions, usable on both server and client.
 */

export function isIPv4(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    if (!/^\d{1,3}$/.test(p)) return false;
    const n = Number(p);
    return n >= 0 && n <= 255 && String(n) === String(Number(p));
  });
}

export function isIPv6(ip: string): boolean {
  if (!ip.includes(":")) return false;
  if (/[^0-9a-fA-F:.]/.test(ip)) return false;
  // Handle embedded IPv4 (e.g. ::ffff:1.2.3.4)
  const normalized = ip.toLowerCase().includes("::ffff:")
    ? expandIPv6Mapped(ip)
    : ip;
  const parts = normalized.split(":");
  // Must have at least 3 colons-groups (::) or full 8 groups
  const doubleColon = (normalized.match(/::/g) || []).length;
  if (doubleColon > 1) return false;
  if (doubleColon === 0 && parts.length !== 8) return false;
  if (doubleColon === 1 && parts.length > 9) return false;
  return parts.every((p) => p === "" || /^[0-9a-fA-F]{1,4}$/.test(p));
}

export function isIP(ip: string): boolean {
  return isIPv4(ip) || isIPv6(ip);
}

/** Expand IPv4-mapped IPv6 (::ffff:1.2.3.4) into full IPv6 form. */
export function expandIPv6Mapped(ip: string): string {
  const lower = ip.toLowerCase();
  const match = lower.match(/^(.*:)((\d{1,3}\.){3}\d{1,3})$/);
  if (!match) return ip;
  const prefix = match[1];
  const v4 = match[2].split(".").map(Number);
  const hex =
    ((v4[0] << 8) | v4[1]).toString(16).padStart(4, "0") +
    ((v4[2] << 8) | v4[3]).toString(16).padStart(4, "0");
  return `${prefix}${hex}`;
}

/** Fully expand any IPv6 (incl. :: compression and embedded IPv4) into 8 groups. */
export function expandIPv6(ip: string): string | null {
  let addr = ip.toLowerCase().trim();
  if (!addr.includes(":")) return null;

  // Convert an embedded IPv4 tail into two hex groups.
  const v4match = addr.match(/^(.*:)((\d{1,3}\.){3}\d{1,3})$/);
  if (v4match) {
    const oct = v4match[2].split(".").map(Number);
    if (oct.some((n) => n > 255)) return null;
    const hex =
      (((oct[0] << 8) | oct[1]).toString(16).padStart(4, "0")) +
      (((oct[2] << 8) | oct[3]).toString(16).padStart(4, "0"));
    addr = `${v4match[1]}${hex}`;
  }

  const dcolon = (addr.match(/::/g) || []).length;
  if (dcolon > 1) return null;

  let groups: string[];
  if (dcolon === 1) {
    const [head, tail] = addr.split("::");
    const hg = head ? head.split(":").filter(Boolean) : [];
    const tg = tail ? tail.split(":").filter(Boolean) : [];
    const missing = 8 - hg.length - tg.length;
    if (missing < 0) return null;
    groups = [...hg, ...Array<string>(missing).fill("0"), ...tg];
  } else {
    groups = addr.split(":");
    if (groups.length !== 8) return null;
  }

  if (groups.length !== 8) return null;
  if (!groups.every((g) => /^[0-9a-f]{1,4}$/.test(g))) return null;
  return groups.map((g) => g.padStart(4, "0")).join(":");
}

/** IPv4 -> 32-bit unsigned integer (decimal notation). */
export function ipv4ToDecimal(ip: string): number | null {
  if (!isIPv4(ip)) return null;
  const [a, b, c, d] = ip.split(".").map(Number);
  return ((a << 24) | (b << 16) | (c << 8) | d) >>> 0;
}

/** IPv4 -> hexadecimal (0xXXXXXXXX). */
export function ipv4ToHex(ip: string): string | null {
  const dec = ipv4ToDecimal(ip);
  if (dec === null) return null;
  return "0x" + dec.toString(16).padStart(8, "0").toUpperCase();
}

/** IPv4 -> binary string. */
export function ipv4ToBinary(ip: string): string | null {
  if (!isIPv4(ip)) return null;
  return ip
    .split(".")
    .map((o) => Number(o).toString(2).padStart(8, "0"))
    .join(".");
}

/** IPv4 -> IPv6-mapped representation (::ffff:a.b.c.d). */
export function ipv4ToIPv6Mapped(ip: string): string | null {
  if (!isIPv4(ip)) return null;
  return `::ffff:${ip}`;
}

/** Reverse DNS (in-addr.arpa / ip6.arpa) notation. */
export function reverseDNS(ip: string): string | null {
  if (isIPv4(ip)) {
    return `${ip.split(".").reverse().join(".")}.in-addr.arpa`;
  }
  const full = expandIPv6(ip);
  if (!full) return null;
  return full.replace(/:/g, "").split("").reverse().join(".") + ".ip6.arpa";
}

/** Convert integer to dotted quad. */
export function decimalToIPv4(dec: number): string | null {
  if (dec < 0 || dec > 4294967295) return null;
  return [
    (dec >>> 24) & 255,
    (dec >>> 16) & 255,
    (dec >>> 8) & 255,
    dec & 255,
  ].join(".");
}

/** Classification of special/bogon ranges. */
export interface IPClassification {
  isPrivate: boolean;
  isLoopback: boolean;
  isLinkLocal: boolean;
  isReserved: boolean;
  isMulticast: boolean;
  isDocumentation: boolean;
  isBogon: boolean;
  labels: string[];
}

export function classifyIPv4(ip: string): IPClassification {
  const [a, b] = ip.split(".").map(Number);
  const labels: string[] = [];
  const isPrivate = a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
  const isLoopback = a === 127;
  const isLinkLocal = a === 169 && b === 254;
  const isReserved =
    a === 0 || a === 100 && b >= 64 && b <= 127 || a === 198 && (b === 18 || b === 19) || a >= 240;
  const isMulticast = a >= 224 && a <= 239;
  const isDocumentation = a === 192 && b === 0 || a === 198 && b === 51 || a === 203 && b === 0;
  const isBroadcast = a === 255 && b === 255 && ip === "255.255.255.255";

  if (isPrivate) labels.push("private");
  if (isLoopback) labels.push("loopback");
  if (isLinkLocal) labels.push("link-local");
  if (isReserved) labels.push("reserved");
  if (isMulticast) labels.push("multicast");
  if (isDocumentation) labels.push("documentation");
  if (isBroadcast) labels.push("broadcast");

  return {
    isPrivate,
    isLoopback,
    isLinkLocal,
    isReserved,
    isMulticast,
    isDocumentation,
    isBogon: labels.length > 0,
    labels,
  };
}

/** Extract client IP from request headers (Cloudflare / proxy aware). */
export function getClientIP(headers: Headers): string | null {
  const candidates = [
    "cf-connecting-ip",
    "x-real-ip",
    "x-forwarded-for",
    "x-client-ip",
  ];
  for (const h of candidates) {
    const v = headers.get(h);
    if (v) {
      const first = v.split(",")[0].trim();
      if (first && isIP(first)) return first;
    }
  }
  return null;
}
