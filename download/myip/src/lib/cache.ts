/**
 * In-memory TTL cache with lazy cleanup.
 * Used to cache aggregated IP lookups (24h) and reduce
 * outbound calls to third-party APIs (rate-limit protection).
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

const MAX_ENTRIES = 5000;

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  // Simple eviction: if cache is full, drop the oldest ~10% entries.
  if (store.size >= MAX_ENTRIES) {
    const drop = Math.ceil(MAX_ENTRIES * 0.1);
    let i = 0;
    for (const k of store.keys()) {
      store.delete(k);
      if (++i >= drop) break;
    }
  }
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/** Cache-aside helper. */
export async function cached<T>(
  key: string,
  ttlMs: number,
  producer: () => Promise<T>
): Promise<T> {
  const hit = cacheGet<T>(key);
  if (hit !== null) return hit;
  const value = await producer();
  cacheSet(key, value, ttlMs);
  return value;
}
