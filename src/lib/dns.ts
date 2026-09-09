/**
 * DNS-over-HTTPS utilities (Google + Cloudflare JSON APIs).
 * Used for reverse DNS (PTR) lookups and DNSBL blacklist checks.
 */

import { expandIPv6, isIPv4, isIPv6 } from "./ip-utils";

interface DoHAnswer {
  name: string;
  type: number;
  data: string;
}

async function dohQuery(
  name: string,
  type: "PTR" | "A",
  provider: "google" | "cloudflare" = "google"
): Promise<DoHAnswer[]> {
  const urls =
    provider === "google"
      ? `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`
      : `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(urls, {
      signal: controller.signal,
      headers: { Accept: "application/dns-json" },
      cache: "no-store",
    });
    clearTimeout(t);
    if (!res.ok) return [];
    const json = (await res.json()) as { Answer?: DoHAnswer[] };
    return json.Answer ?? [];
  } catch {
    return [];
  }
}

/** Reverse DNS (PTR) lookup for an IP. */
export async function lookupPTR(ip: string): Promise<string | null> {
  let arpa: string | null = null;
  if (isIPv4(ip)) {
    arpa = `${ip.split(".").reverse().join(".")}.in-addr.arpa`;
  } else {
    const full = expandIPv6(ip);
    if (!full) return null;
    arpa = `${full.replace(/:/g, "").split("").reverse().join(".")}.ip6.arpa`;
  }

  const answers = await dohQuery(arpa, "PTR");
  const ptr = answers.find((a) => a.type === 12);
  return ptr ? ptr.data.replace(/\.$/, "") : null;
}

export interface DNSBLResult {
  blacklist: string;
  listed: boolean;
  status: string;
}

/** Popular public DNSBL zones to check. */
const DNSBL_ZONES: Array<{ zone: string; label: string }> = [
  { zone: "bl.spamcop.net", label: "SpamCop" },
  { zone: "dnsbl.sorbs.net", label: "SORBS" },
  { zone: "zen.spamhaus.org", label: "Spamhaus ZEN" },
  { zone: "b.barracudacentral.org", label: "Barracuda" },
  { zone: "dnsbl.dronebl.org", label: "DroneBL" },
  { zone: "spam.dnsbl.sorbs.net", label: "SORBS Spam" },
];

/** Check an IPv4 address against popular DNSBLs via DoH. */
export async function checkDNSBL(ip: string): Promise<DNSBLResult[]> {
  if (!isIPv4(ip)) {
    return DNSBL_ZONES.map((z) => ({
      blacklist: z.label,
      listed: false,
      status: "IPv6 not supported",
    }));
  }
  const reversed = ip.split(".").reverse().join(".");

  const checks = await Promise.all(
    DNSBL_ZONES.map(async (z) => {
      // Alternate between Google and Cloudflare DoH to spread load
      const provider = Math.random() > 0.5 ? "google" : "cloudflare";
      const answers = await dohQuery(
        `${reversed}.${z.zone}`,
        "A",
        provider as "google" | "cloudflare"
      );
      const aRecords = answers.filter((a) => a.type === 1);
      return {
        blacklist: z.label,
        listed: aRecords.length > 0,
        status:
          aRecords.length > 0
            ? `Listed (${aRecords[0].data})`
            : "Clean",
      } satisfies DNSBLResult;
    })
  );
  return checks;
}
