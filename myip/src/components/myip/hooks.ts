"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { IPExtra, IPInfo, HeadersInfo, DualStack } from "./types";
import { IS_STATIC_BUILD } from "@/lib/static-mode";
import {
  clientLookupIP,
  clientLookupExtra,
  clientBrowserHeaders,
} from "@/lib/client-lookup";

/** Aggregated lookup for a given IP (or the caller's own IP when null). */
export function useIPInfo(
  target: string | null,
  opts?: { onlyExplicit?: boolean }
) {
  return useQuery<IPInfo>({
    queryKey: ["ip-info", target ?? "self"],
    queryFn: async () => {
      // Static build (GitHub Pages): aggregate directly from CORS-enabled
      // public APIs in the browser.
      if (IS_STATIC_BUILD) return clientLookupIP(target);

      const url = target
        ? `/api/v1/ip/${encodeURIComponent(target)}`
        : "/api/v1/ip";
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `HTTP ${res.status}`);
      }
      return res.json();
    },
    enabled: opts?.onlyExplicit ? target !== null : true,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

/** Slow enrichment data: PTR + DNSBL. */
export function useIPExtra(ip: string | undefined, enabled: boolean) {
  return useQuery<IPExtra>({
    queryKey: ["ip-extra", ip],
    queryFn: async () => {
      // Static build: DNS-over-HTTPS straight from the browser.
      if (IS_STATIC_BUILD) return clientLookupExtra(ip!);

      const res = await fetch(`/api/v1/dnsbl/${encodeURIComponent(ip!)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    enabled: enabled && !!ip,
    staleTime: 10 * 60 * 1000,
    retry: 0,
  });
}

/** Request headers echoed back (browser-visible info on the static build). */
export function useIPHeaders() {
  return useQuery<HeadersInfo>({
    queryKey: ["ip-headers"],
    queryFn: async () => {
      if (IS_STATIC_BUILD) return clientBrowserHeaders();

      const res = await fetch("/api/v1/headers");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
}

/** Client-side dual-stack detection via ipify (v4 + v6). */
export function useDualStack(enabled: boolean): DualStack & { loading: boolean } {
  const [state, setState] = useState<DualStack & { loading: boolean }>({
    ipv4: null,
    ipv6: null,
    loading: true,
  });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const fetchJSON = async (url: string): Promise<string | null> => {
      try {
        const c = new AbortController();
        const t = setTimeout(() => c.abort(), 6000);
        const res = await fetch(url, { signal: c.signal, cache: "no-store" });
        clearTimeout(t);
        const json = await res.json();
        return typeof json.ip === "string" ? json.ip : null;
      } catch {
        return null;
      }
    };

    (async () => {
      const [v4, v6] = await Promise.all([
        fetchJSON("https://api-ipv4.ipify.org?format=json"),
        fetchJSON("https://api-ipv6.ipify.org?format=json"),
      ]);
      if (!cancelled) setState({ ipv4: v4, ipv6: v6, loading: false });
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return state;
}

/** Live ticking clock for a given IANA timezone. */
export function useLocalTime(timezone: string | undefined): string | null {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (!timezone) return;
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    // First paint via microtask (async callback — effect body stays pure),
    // then refresh every second.
    queueMicrotask(tick);
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  return timezone ? time : null;
}

/** Haversine distance in km between two coordinates. */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}
