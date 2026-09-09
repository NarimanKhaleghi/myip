"use client";

import { useState } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Gauge,
  ListX,
  Server,
  Globe,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard, InfoRow, StatusPill, Pill, Shimmer, CopyChip } from "./ui-bits";
import { useI18n } from "./i18n-provider";
import { useIPExtra } from "./hooks";
import type { IPInfo } from "./types";

export function TabSecurity({ info, isLoading }: { info?: IPInfo; isLoading: boolean }) {
  const { t } = useI18n();
  const { data: extra, isLoading: extraLoading } = useIPExtra(info?.ip, !!info);

  if (isLoading || !info) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-56" />
        ))}
      </div>
    );
  }

  const risk = info.riskScore ?? 0;
  const riskLevel = risk < 20 ? "low" : risk < 50 ? "medium" : "high";
  const riskColor =
    riskLevel === "low"
      ? "text-emerald-500"
      : riskLevel === "medium"
      ? "text-amber-500"
      : "text-red-500";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Detection summary */}
      <SectionCard title={t("securityStatus")} icon={<Shield className="size-4" />} className="fade-in">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">{t("proxyDetection")}</span>
            <StatusPill
              ok={!info.isProxy}
              textOk={t("proxyNotDetected")}
              textBad={t("proxyDetected")}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">{t("connHosting")}</span>
            <StatusPill
              ok={!info.isHosting}
              textOk={t("hostingNotDetected")}
              textBad={t("hostingDetected")}
            />
          </div>
          {info.isMobile !== undefined && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">{t("mobileIp")}</span>
              <StatusPill ok={!info.isMobile} textOk={t("no")} textBad={t("yes")} />
            </div>
          )}
          {info.bogonLabels.length > 0 && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">Bogon</span>
              <Pill className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                {info.bogonLabels.join(" · ")}
              </Pill>
            </div>
          )}
        </div>

        {/* Risk score */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Gauge className="size-4" />
              {t("riskScore")}
            </span>
            <span className={`ip-mono num text-2xl font-bold ${riskColor}`}>{risk}<span className="text-sm text-muted-foreground">/100</span></span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                riskLevel === "low"
                  ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                  : riskLevel === "medium"
                  ? "bg-gradient-to-r from-amber-400 to-orange-500"
                  : "bg-gradient-to-r from-orange-500 to-red-500"
              }`}
              style={{ width: `${Math.max(risk, 4)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">{t("riskHint")}</p>
          <div className="mt-1">
            <Pill
              className={
                riskLevel === "low"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : riskLevel === "medium"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
              }
            >
              {riskLevel === "low" ? t("riskLow") : riskLevel === "medium" ? t("riskMedium") : t("riskHigh")}
            </Pill>
          </div>
        </div>
      </SectionCard>

      {/* PTR record */}
      <SectionCard title={t("ptrRecord")} icon={<Globe className="size-4" />} className="fade-in fade-in-1">
        {extraLoading ? (
          <Shimmer className="h-12" />
        ) : extra?.ptr ? (
          <div className="space-y-2">
            <CopyChip value={extra.ptr} label="PTR" className="w-full justify-between" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              {info.ip} → <span className="ip-mono">{extra.ptr}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldAlert className="size-4 text-amber-500" />
            {t("noPtr")}
          </div>
        )}

        {/* WebRTC leak test */}
        <div className="mt-6 border-t border-border/40 pt-4">
          <h4 className="flex items-center gap-1.5 text-sm font-semibold mb-3">
            <Radio className="size-4 text-primary" />
            {t("webrtcLeak")}
          </h4>
          <WebRTCTest publicIP={info.ip} />
        </div>
      </SectionCard>

      {/* DNSBL */}
      <SectionCard
        title={t("blacklistCheck")}
        icon={<ListX className="size-4" />}
        className="fade-in fade-in-2 md:col-span-2"
      >
        {extraLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Shimmer key={i} className="h-10" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {extra?.dnsbl.map((d) => (
                <div
                  key={d.blacklist}
                  className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs ${
                    d.listed
                      ? "border-red-500/30 bg-red-500/10"
                      : "border-border/50 bg-muted/30"
                  }`}
                >
                  <span className="ip-mono font-medium truncate">{d.blacklist}</span>
                  {d.listed ? (
                    <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold shrink-0">
                      <Server className="size-3.5" />
                      {t("blacklisted")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <ShieldCheck className="size-3.5" />
                      {t("notBlacklisted")}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              {t("dnsblHint", { n: String(extra?.dnsbl.length ?? 6) })}
            </p>
          </>
        )}
      </SectionCard>
    </div>
  );
}

/** Client-side WebRTC leak detection. */
function WebRTCTest({ publicIP }: { publicIP: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [leaked, setLeaked] = useState<string[] | null>(null);

  const run = async () => {
    setState("running");
    setLeaked(null);
    const found: string[] = [];

    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.createDataChannel("probe");

      pc.onicecandidate = (e) => {
        if (!e.candidate) {
          pc.close();
          setState("done");
          setLeaked(found);
          return;
        }
        const m = e.candidate.candidate.match(
          /candidate:\S+ \d \S+ \d+ (\S+) \d+ typ srflx/
        );
        if (m) {
          const ip = m[1];
          if (!found.includes(ip)) found.push(ip);
        }
      };

      // Timeout safety
      setTimeout(() => {
        try {
          pc.close();
        } catch { /* noop */ }
        setState("done");
        setLeaked(found);
      }, 5000);

      await pc.createOffer();
      await pc.setLocalDescription(await pc.createOffer());
    } catch {
      setState("done");
      setLeaked(null);
    }
  };

  const isSupported =
    typeof window !== "undefined" && typeof RTCPeerConnection !== "undefined";

  return (
    <div className="space-y-3">
      <Button
        onClick={run}
        disabled={state === "running" || !isSupported}
        size="sm"
        variant="outline"
        className="gap-2"
      >
        <Radio className={`size-4 ${state === "running" ? "animate-pulse text-primary" : ""}`} />
        {state === "running" ? t("webrtcRunning") : state === "idle" ? t("webrtcStart") : t("webrtcStart")}
      </Button>

      {state === "done" && leaked !== null && (
        <div
          className={`rounded-lg border p-3 text-xs space-y-1 ${
            leaked.length
              ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {leaked.length === 0 && (
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4" />
              {t("webrtcNoLeak")}
            </span>
          )}
          {leaked.length > 0 && (
            <>
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldAlert className="size-4" />
                {t("webrtcLeakFound")}
              </span>
              {leaked.map((ip) => (
                <span key={ip} className="ip-mono num block ps-5">
                  {ip}
                  {ip === publicIP ? " (= your public IP)" : ""}
                </span>
              ))}
            </>
          )}
        </div>
      )}

      {state === "done" && leaked !== null && leaked.length === 0 && (
        <p className="text-[11px] text-muted-foreground">{t("webrtcPrivateOnly")}</p>
      )}

      {!isSupported && (
        <p className="text-[11px] text-muted-foreground">{t("webrtcUnsupported")}</p>
      )}
    </div>
  );
}
