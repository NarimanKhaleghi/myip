import { aggregateIPInfo } from "@/lib/ip-aggregator";
import { cacheGet, cacheSet } from "@/lib/cache";

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

/** Lookup with 24h in-memory cache. */
export async function lookupWithCache(target: string): Promise<Record<string, unknown>> {
  const cacheKey = `lookup:${target}`;
  const cached = cacheGet<Record<string, unknown>>(cacheKey);
  if (cached) return { ...cached, cached: true };
  const info = await aggregateIPInfo(target);
  const payload = { ...info, cached: false } as unknown as Record<string, unknown>;
  cacheSet(cacheKey, payload, CACHE_TTL);
  return payload;
}
