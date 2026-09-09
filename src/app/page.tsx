"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "@/components/myip/header";
import { Hero } from "@/components/myip/hero";
import { QuickStats, SourcesBar } from "@/components/myip/quick-stats";
import { InfoTabs } from "@/components/myip/tabs";
import { SeoContent, Faq } from "@/components/myip/seo-content";
import { Footer } from "@/components/myip/footer";
import { useIPInfo, haversineKm } from "@/components/myip/hooks";
import { pushHistory } from "@/components/myip/tab-tools";
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

  // The always-on "self" query powers history + distance reference.
  // React Query dedupes it with the visible query when target === null.
  const { data: ownInfo } = useIPInfo(null);
  const { data: info, isLoading, isError } = useIPInfo(target);
  const isOwn = target === null;

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
      <Header onSearch={onSearch} onReset={onReset} isOwnIp={isOwn} />
      <main className="flex-1">
        <Hero info={info} isLoading={isLoading} isOwn={isOwn} />
        <QuickStats info={info} isLoading={isLoading} />
        <SourcesBar sources={info?.sourcesUsed ?? []} />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          {isError ? (
            <div className="glass rounded-2xl p-8 text-center space-y-3">
              <p className="text-destructive font-medium">Failed to load IP data</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-primary underline underline-offset-4"
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
