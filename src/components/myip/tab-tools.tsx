"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import {
  GitCompareArrows,
  History,
  Download,
  Gauge,
  Braces,
  FileJson,
  FileSpreadsheet,
  Printer,
  Trash2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard, Pill, Shimmer, CopyChip, InfoRow } from "./ui-bits";
import { useI18n } from "./i18n-provider";
import { useIPInfo, haversineKm } from "./hooks";
import { isIP } from "@/lib/ip-utils";
import type { IPInfo } from "./types";

export function TabTools({ info, userCoords }: { info?: IPInfo; userCoords?: { lat: number; lon: number } | null }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CompareTool />
      <HistoryTool />
      <SpeedTest />
      <ExportTool info={info} userCoords={userCoords} />
      <ApiDocs info={info} />
    </div>
  );
}

/* ---------------- IP Compare ---------------- */

function CompareTool() {
  const { t, countryName } = useI18n();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [targetA, setTargetA] = useState<string | null>(null);
  const [targetB, setTargetB] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const { data: infoA, isLoading: loadingA } = useIPInfo(targetA, {
    onlyExplicit: true,
  });
  const { data: infoB, isLoading: loadingB } = useIPInfo(targetB, {
    onlyExplicit: true,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const va = a.trim();
    const vb = b.trim();
    if (va && vb && isIP(va) && isIP(vb)) {
      setTargetA(va);
      setTargetB(vb);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  const done = infoA && infoB;
  const distance =
    done &&
    infoA.latitude !== undefined &&
    infoA.longitude !== undefined &&
    infoB.latitude !== undefined &&
    infoB.longitude !== undefined
      ? haversineKm(infoA.latitude, infoA.longitude, infoB.latitude, infoB.longitude)
      : null;

  return (
    <SectionCard title={t("toolCompare")} icon={<GitCompareArrows className="size-4" />} className="fade-in">
      <form onSubmit={submit} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-4">
        <Input
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder={t("ipOne")}
          className="ip-mono text-sm"
          dir="ltr"
        />
        <Input
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder={t("ipTwo")}
          className="ip-mono text-sm"
          dir="ltr"
        />
        <Button type="submit" size="sm" className="px-4">
          {t("compareBtn")}
        </Button>
      </form>
      {error && <p className="text-xs text-destructive mb-2">{t("searchInvalid")}</p>}

      {(loadingA || loadingB) && <Shimmer className="h-32" />}

      {done && !loadingA && !loadingB && (
        <div className="grid grid-cols-2 gap-3">
          {[infoA, infoB].map((inf, idx) => (
            <div key={idx} className="rounded-xl border border-border/50 bg-muted/20 p-3">
              <p className="ip-mono num text-sm font-bold text-primary mb-1">{inf.ip}</p>
              <div className="space-y-0.5 text-xs">
                <InfoRow label={t("country")} value={`${inf.flagEmoji ?? "🌍"} ${countryName(inf.country, inf.countryCode)}`} />
                <InfoRow label={t("city")} value={inf.city ?? "—"} />
                <InfoRow label={t("isp")} value={<span className="truncate">{inf.isp ?? inf.org ?? "—"}</span>} />
                <InfoRow label="ASN" value={inf.asn ?? "—"} mono />
              </div>
            </div>
          ))}
          <div className="col-span-2 flex flex-wrap items-center gap-2 text-xs">
            <Pill>{infoA.version === infoB.version ? t("sameVersion") : t("diffVersion")}</Pill>
            <Pill>{infoA.countryCode === infoB.countryCode ? t("sameCountry") : t("diffCountry")}</Pill>
            <Pill>{infoA.isp === infoB.isp ? t("sameIsp") : t("diffIsp")}</Pill>
            {distance !== null && (
              <Pill className="border-primary/30 bg-primary/10">
                <Zap className="size-3" />
                {t("distanceBetween")}: <span className="ip-mono num">{distance.toLocaleString("en-US")} km</span>
              </Pill>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}

/* ---------------- IP History (localStorage as external store) ---------------- */

const HISTORY_KEY = "myip-history";
const HISTORY_EVENT = "myip:history";

export interface HistoryEntry {
  ip: string;
  ts: number;
}

let cachedRaw: string | null = null;
let cachedList: HistoryEntry[] = [];

function getHistorySnapshot(): HistoryEntry[] {
  const raw = window.localStorage.getItem(HISTORY_KEY) ?? "[]";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedList = JSON.parse(raw) as HistoryEntry[];
    } catch {
      cachedList = [];
    }
  }
  return cachedList;
}

function subscribeHistory(onChange: () => void) {
  window.addEventListener(HISTORY_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(HISTORY_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useHistory(): HistoryEntry[] {
  return useSyncExternalStore(subscribeHistory, getHistorySnapshot, () => []);
}

export function pushHistory(ip: string) {
  if (typeof window === "undefined") return;
  try {
    const list = getHistorySnapshot();
    const next = [{ ip, ts: Date.now() }, ...list.filter((x) => x.ip !== ip)].slice(0, 10);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(HISTORY_EVENT));
  } catch {
    /* noop */
  }
}

function HistoryTool() {
  const { t } = useI18n();
  const items = useHistory();

  const clear = () => {
    window.localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new Event(HISTORY_EVENT));
  };

  return (
    <SectionCard
      title={t("toolHistory")}
      icon={<History className="size-4" />}
      className="fade-in fade-in-1"
      action={
        items.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={clear} className="h-7 gap-1.5 text-xs text-destructive hover:text-destructive">
            <Trash2 className="size-3.5" />
            {t("clearHistory")}
          </Button>
        ) : undefined
      }
    >
      <p className="text-[11px] text-muted-foreground mb-3">{t("historyHint")}</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noHistory")}</p>
      ) : (
        <div className="max-h-64 overflow-y-auto custom-scroll space-y-2 pe-1">
          {items.map((h) => (
            <div key={h.ip} className="flex items-center gap-2">
              <CopyChip value={h.ip} className="flex-1 justify-between" />
              <span className="text-[10px] text-muted-foreground ip-mono num shrink-0">
                {new Date(h.ts).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

/* ---------------- Speed test ---------------- */

function SpeedTest() {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [ping, setPing] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);

  const run = async () => {
    setState("running");
    setPing(null);
    setSpeed(null);

    // 1) Latency — 5 requests to our health endpoint, take the median
    const pings: number[] = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      try {
        await fetch(`/api/v1/health?_=${Date.now()}`, { cache: "no-store" });
        pings.push(performance.now() - t0);
      } catch {
        /* ignore */
      }
    }
    if (pings.length) {
      pings.sort((x, y) => x - y);
      setPing(Math.round(pings[Math.floor(pings.length / 2)]));
    }

    // 2) Download speed via Cloudflare speed endpoint (CORS enabled)
    try {
      const bytes = 2_000_000; // 2 MB
      const t0 = performance.now();
      const res = await fetch(`https://speed.cloudflare.com/__down?bytes=${bytes}`, {
        cache: "no-store",
      });
      await res.arrayBuffer();
      const secs = (performance.now() - t0) / 1000;
      const mbps = (bytes * 8) / 1_000_000 / secs;
      setSpeed(Math.round(mbps * 100) / 100);
    } catch {
      setSpeed(null);
    }

    setState("done");
  };

  return (
    <SectionCard title={t("toolSpeed")} icon={<Gauge className="size-4" />} className="fade-in fade-in-2">
      <p className="text-[11px] text-muted-foreground mb-3">{t("speedHint")}</p>
      <Button onClick={run} disabled={state === "running"} size="sm" className="gap-2 mb-4">
        <Gauge className={`size-4 ${state === "running" ? "animate-pulse" : ""}`} />
        {state === "running" ? t("testing") : t("startTest")}
      </Button>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border/50 bg-muted/20 p-3 text-center">
          <p className="text-[11px] text-muted-foreground mb-1">{t("latency")}</p>
          {state === "running" && ping === null ? (
            <Shimmer className="h-8 w-16 mx-auto" />
          ) : (
            <p className="ip-mono num text-xl font-bold text-primary">
              {ping !== null ? `${ping}` : "—"}
              <span className="text-xs text-muted-foreground">{ping !== null ? " ms" : ""}</span>
            </p>
          )}
        </div>
        <div className="rounded-xl border border-border/50 bg-muted/20 p-3 text-center">
          <p className="text-[11px] text-muted-foreground mb-1">{t("download")}</p>
          {state === "running" && speed === null ? (
            <Shimmer className="h-8 w-16 mx-auto" />
          ) : (
            <p className="ip-mono num text-xl font-bold text-emerald-500">
              {speed !== null ? `${speed}` : "—"}
              <span className="text-xs text-muted-foreground">{speed !== null ? " Mbps" : ""}</span>
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

/* ---------------- Export ---------------- */

function ExportTool({ info, userCoords }: { info?: IPInfo; userCoords?: { lat: number; lon: number } | null }) {
  const { t, lang } = useI18n();

  if (!info) return null;

  const payload = () => ({
    app: "myip.thepm.ir",
    lang,
    generatedAt: new Date().toISOString(),
    ip: info,
    userAgent: typeof window !== "undefined" ? navigator.userAgent : undefined,
    screen: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : undefined,
    userCoords: userCoords ?? undefined,
  });

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(payload(), null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `myip-${info.ip}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadCsv = () => {
    const rows: Array<[string, string]> = [
      ["ip", info.ip],
      ["version", info.version],
      ["country", info.country ?? ""],
      ["country_code", info.countryCode ?? ""],
      ["region", info.region ?? ""],
      ["city", info.city ?? ""],
      ["postal", info.postal ?? ""],
      ["latitude", info.latitude?.toString() ?? ""],
      ["longitude", info.longitude?.toString() ?? ""],
      ["timezone", info.timezone ?? ""],
      ["isp", info.isp ?? ""],
      ["org", info.org ?? ""],
      ["asn", info.asn ?? ""],
      ["hostname", info.hostname ?? ""],
      ["is_proxy", info.isProxy?.toString() ?? ""],
      ["is_hosting", info.isHosting?.toString() ?? ""],
      ["is_mobile", info.isMobile?.toString() ?? ""],
      ["risk_score", info.riskScore?.toString() ?? ""],
      ["sources", info.sourcesUsed.join(" | ")],
      ["fetched_at", info.fetchedAt],
    ];
    const csv = rows.map(([k, v]) => `${k},"${v.replace(/"/g, '""')}"`).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `myip-${info.ip}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <SectionCard title={t("toolExport")} icon={<Download className="size-4" />} className="fade-in fade-in-3">
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={downloadJson} variant="outline" size="sm" className="gap-2 flex-col h-auto py-3">
          <FileJson className="size-5 text-primary" />
          <span className="text-xs">JSON</span>
        </Button>
        <Button onClick={downloadCsv} variant="outline" size="sm" className="gap-2 flex-col h-auto py-3">
          <FileSpreadsheet className="size-5 text-emerald-500" />
          <span className="text-xs">CSV</span>
        </Button>
        <Button
          onClick={() => window.print()}
          variant="outline"
          size="sm"
          className="gap-2 flex-col h-auto py-3"
        >
          <Printer className="size-5 text-violet-500" />
          <span className="text-xs">{t("exportPdf")}</span>
        </Button>
      </div>
    </SectionCard>
  );
}

/* ---------------- API docs ---------------- */

function ApiDocs({ info }: { info?: IPInfo }) {
  const { t } = useI18n();
  const sample = info
    ? JSON.stringify(
        {
          ip: info.ip,
          version: info.version,
          country: info.country ?? "…",
          countryCode: info.countryCode ?? "…",
          city: info.city ?? "…",
          latitude: info.latitude ?? "…",
          longitude: info.longitude ?? "…",
          isp: info.isp ?? "…",
          asn: info.asn ?? "…",
          isProxy: info.isProxy ?? "…",
          riskScore: info.riskScore ?? "…",
        },
        null,
        2
      )
    : "{ … }";

  const endpoints = [
    { method: "GET", path: "/api/v1/ip", desc: t("yourIp") },
    { method: "GET", path: `/api/v1/ip/${info?.ip ?? "{address}"}`, desc: t("search") },
    { method: "GET", path: `/api/v1/dnsbl/${info?.ip ?? "{address}"}`, desc: t("blacklistCheck") },
    { method: "GET", path: "/api/v1/health", desc: "status" },
  ];

  return (
    <SectionCard title={t("apiTitle")} icon={<Braces className="size-4" />} className="fade-in fade-in-4 md:col-span-2">
      <p className="text-xs text-muted-foreground mb-3">
        {t("apiDesc")} <Pill className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{t("apiNoKey")}</Pill>
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          {endpoints.map((e) => (
            <div
              key={e.path}
              className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2"
            >
              <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 ip-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                {e.method}
              </span>
              <code className="ip-mono text-xs truncate flex-1" dir="ltr">
                {e.path}
              </code>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border/50 bg-muted/20 p-3 max-h-56 overflow-auto custom-scroll">
          <p className="text-[10px] uppercase text-muted-foreground mb-2">{t("apiExample")}</p>
          <pre className="ip-mono text-[11px] leading-relaxed whitespace-pre" dir="ltr">
            {sample}
          </pre>
        </div>
      </div>
    </SectionCard>
  );
}
