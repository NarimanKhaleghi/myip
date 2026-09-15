"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "@/components/myip/header";
import { Hero } from "@/components/myip/hero";
import { QuickStats, SourcesBar } from "@/components/myip/quick-stats";
import { InfoTabs } from "@/components/myip/tabs";
import { SeoContent, Faq } from "@/components/myip/seo-content";
import { Footer } from "@/components/myip/footer";
import { useIPInfo, useSelfIP, haversineKm } from "@/components/myip/hooks";
import { pushHistory } from "@/components/myip/tab-tools";
import { CursorFx } from "@/components/myip/cursor-fx";
import { isIP } from "@/lib/ip-utils";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});

/* ---- URL ?ip= param as an external store (shareable lookups) ---- */

const URL_EVENT = "myip:url";

function subscribeUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_EVENT, onChange);
  };
}

function getUrlTarget(): string | null {
  const param = new URLSearchParams(window.location.search).get("ip");
  return param && isIP(param) ? param : null;
}

function navigateTarget(ip: string | null) {
  const url = new URL(window.location.href);
  if (ip) url.searchParams.set("ip", ip);
  else url.searchParams.delete("ip");
  window.history.pushState(null, "", url.toString());
  window.dispatchEvent(new Event(URL_EVENT));
}

function App() {
  const [activeTab, setActiveTab] = useState("info");
  const target = useSyncExternalStore(
    subscribeUrl,
    getUrlTarget,
    () => null
  );

  /*
   * Self-IP detection (client-side, IPv4-only endpoints — see
   * lib/self-ip.ts). On dual-stack networks the browser reaches us over
   * IPv6, so the server's connection IP is the visitor's IPv6 address.
   * The visitor's real public IPv4 is probed in the browser instead, and
   * the whole "own IP" report is keyed to it — matching what classic IP
   * tools (ipnumberia & co.) show.
   *
   * `ownIP` is tri-state:
   *   undefined → detection still running (own-IP queries on hold)
   *   null      → no IPv4 route (IPv6-only network) → server fallback
   *   "1.2.3.4" → real public IPv4 → explicit lookup
   */
  const self = useSelfIP();
  const ownIP = self.ready ? self.ipv4 : undefined;

  // The always-on "self" query powers history + distance reference.
  // React Query dedupes it with the visible query when target === null.
  const { data: ownInfo } = useIPInfo(ownIP ?? null, {
    enabled: ownIP !== undefined,
  });

  const isOwn = target === null;
  const visibleTarget = isOwn ? (ownIP ?? null) : target;
  const { data: info, isLoading: rawLoading, isError } = useIPInfo(
    visibleTarget,
    { enabled: isOwn ? ownIP !== undefined : true }
  );
  // While self-detection is running the report is intentionally on hold so
  // the page never flashes an IPv6-keyed report before the real IPv4 lands.
  const isLoading = isOwn ? !self.ready || rawLoading : rawLoading;

  // Persist own IP into local history (pure external side effect, no setState).
  useEffect(() => {
    if (ownInfo?.ip) pushHistory(ownInfo.ip);
  }, [ownInfo?.ip]);

  // Derived values — cheap to compute, no memoization needed.
  const userCoords =
    ownInfo?.latitude !== undefined && ownInfo?.longitude !== undefined
      ? { lat: ownInfo.latitude, lon: ownInfo.longitude }
      : null;

  const distanceKm =
    !isOwn &&
    userCoords &&
    info?.latitude !== undefined &&
    info?.longitude !== undefined
      ? haversineKm(userCoords.lat, userCoords.lon, info.latitude, info.longitude)
      : null;

  const onSearch = useCallback((ip: string) => {
    navigateTarget(ip);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onReset = useCallback(() => {
    navigateTarget(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <CursorFx />
      <Header onSearch={onSearch} onReset={onReset} isOwnIp={isOwn} />
      <main className="flex-1">
        <Hero info={info} isLoading={isLoading} isOwn={isOwn} self={self} />
        <QuickStats info={info} isLoading={isLoading} />
        <SourcesBar sources={info?.sourcesUsed ?? []} />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          {isError ? (
            <div className="border-[1.5px] border-border bg-card p-8 text-center space-y-3 shadow-[8px_8px_0_var(--shadow)]">
              <p className="font-bold">Failed to load IP data</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm font-bold underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          ) : (
            <InfoTabs
              info={info}
              isLoading={isLoading}
              userCoords={userCoords}
              distanceKm={distanceKm}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
        </div>

        <SeoContent />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
