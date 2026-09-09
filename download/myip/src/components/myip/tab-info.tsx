"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Braces, Info, Binary, MonitorSmartphone } from "lucide-react";
import { SectionCard, InfoRow, CopyChip, Shimmer } from "./ui-bits";
import { useI18n } from "./i18n-provider";
import { useIPHeaders } from "./hooks";
import type { IPInfo, HeadersInfo } from "./types";
import {
  ipv4ToDecimal,
  ipv4ToHex,
  ipv4ToBinary,
  ipv4ToIPv6Mapped,
  reverseDNS,
  classifyIPv4,
  isIPv4,
} from "@/lib/ip-utils";

/** Parse a UA string into browser/os/engine parts. */
function parseUA(ua: string) {
  const browser =
    ua.match(/Edg(?:e|A|iOS)?\/([\d.]+)/)
      ? "Microsoft Edge"
      : ua.match(/OPR\/([\d.]+)/)
      ? "Opera"
      : ua.match(/Firefox\/([\d.]+)/)
      ? `Firefox ${ua.match(/Firefox\/([\d.]+)/)?.[1] ?? ""}`
      : ua.match(/Chrome\/([\d.]+)/)
      ? `Chrome ${ua.match(/Chrome\/([\d.]+)/)?.[1]?.split(".")[0] ?? ""}`
      : ua.match(/Safari\/([\d.]+)/) && ua.match(/Version\/([\d.]+)/)
      ? `Safari ${ua.match(/Version\/([\d.]+)/)?.[1] ?? ""}`
      : "Unknown";

  const os =
    ua.includes("Windows NT 10")
      ? "Windows 10/11"
      : ua.includes("Windows")
      ? "Windows"
      : ua.includes("Android")
      ? `Android ${ua.match(/Android ([\d.]+)/)?.[1] ?? ""}`
      : ua.includes("iPhone") || ua.includes("iPad")
      ? `iOS ${ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, ".") ?? ""}`
      : ua.includes("Mac OS X")
      ? `macOS ${ua.match(/Mac OS X ([\d_.]+)/)?.[1]?.replace(/_/g, ".") ?? ""}`
      : ua.includes("Linux")
      ? "Linux"
      : "Unknown";

  const platform =
    ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")
      ? "Mobile"
      : "Desktop";

  return { browser, os, platform };
}

/** Browser environment snapshot — hydration-safe (server renders null). */
interface NavInfo {
  language: string;
  cookieEnabled: boolean;
  maxTouchPoints: number;
  screen: string;
}

let navCache: NavInfo | null = null;

function getNavSnapshot(): NavInfo | null {
  if (!navCache) {
    navCache = {
      language: navigator.language || navigator.languages?.[0] || "",
      cookieEnabled: navigator.cookieEnabled,
      maxTouchPoints: navigator.maxTouchPoints ?? 0,
      screen: `${screen.width}x${screen.height}`,
    };
  }
  return navCache;
}

const noopSubscribe = () => () => undefined;

function useNavInfo(): NavInfo | null {
  return useSyncExternalStore(noopSubscribe, getNavSnapshot, () => null);
}

export function TabInfo({ info, isLoading }: { info?: IPInfo; isLoading: boolean }) {
  const { t } = useI18n();
  const { data: headersData, isLoading: headersLoading } = useIPHeaders();

  const formats = useMemo(() => {
    if (!info) return [];
    const ip = info.ip;
    const rows: Array<{ label: string; value: string }> = [];
    if (isIPv4(ip)) {
      const dec = ipv4ToDecimal(ip);
      rows.push({ label: t("formatDecimal"), value: String(dec ?? "—") });
      rows.push({ label: t("formatHex"), value: ipv4ToHex(ip) ?? "—" });
      rows.push({ label: t("formatBinary"), value: ipv4ToBinary(ip) ?? "—" });
      rows.push({ label: t("formatIpv6Mapped"), value: ipv4ToIPv6Mapped(ip) ?? "—" });
      rows.push({ label: t("formatInteger"), value: `${dec ?? 0} (uint32)` });
    }
    const rev = reverseDNS(ip);
    if (rev) rows.push({ label: t("formatReverseDns"), value: rev });
    return rows;
  }, [info, t]);

  const cls = info && isIPv4(info.ip) ? classifyIPv4(info.ip) : null;

  if (isLoading || !info) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-56" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Basic info */}
      <SectionCard title={t("basicInfo")} icon={<Info className="size-4" />} className="fade-in">
        <div className="space-y-0.5">
          <InfoRow label="IP" value={info.ip} copyable mono />
          <InfoRow label={t("protocol")} value={info.version} mono />
          {info.hostname && <InfoRow label="Hostname / PTR" value={info.hostname} copyable mono />}
          {info.domain && <InfoRow label="Domain" value={info.domain} copyable mono />}
          <InfoRow
            label={t("connection")}
            value={
              <span className="flex items-center gap-2 flex-wrap justify-end">
                {info.isMobile && <span className="tag text-[10px] py-0.5">{t("connMobile")}</span>}
                {info.isHosting && <span className="tag text-[10px] py-0.5">{t("connHosting")}</span>}
                {!info.isMobile && !info.isHosting && info.isProxy === false && (
                  <span className="tag text-[10px] py-0.5">{t("connBroadband")}</span>
                )}
              </span>
            }
          />
          {cls && cls.isBogon && (
            <InfoRow
              label="Bogon"
              value={cls.labels.join(", ")}
            />
          )}
        </div>
      </SectionCard>

      {/* IP formats */}
      <SectionCard title={t("ipFormats")} icon={<Binary className="size-4" />} className="fade-in fade-in-1">
        {formats.length ? (
          <div className="space-y-2">
            {formats.map((f) => (
              <CopyChip key={f.label} label={f.label} value={f.value} className="w-full justify-between" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </SectionCard>

      {/* User agent */}
      <UserAgentCard headersData={headersData} />

      {/* HTTP headers */}
      <HeadersCard data={headersData} loading={headersLoading} />
    </div>
  );
}

function UserAgentCard({ headersData }: { headersData?: HeadersInfo }) {
  const { t } = useI18n();
  const ua = headersData?.headers["user-agent"];
  const nav = useNavInfo();

  const parsed = useMemo(() => (ua ? parseUA(ua) : null), [ua]);

  return (
    <SectionCard
      title={t("userAgent")}
      icon={<MonitorSmartphone className="size-4" />}
      className="fade-in fade-in-2"
    >
      {parsed ? (
        <>
          <div className="space-y-0.5 mb-3">
            <InfoRow label={t("browser")} value={parsed.browser} />
            <InfoRow label={t("os")} value={parsed.os} />
            <InfoRow label={t("platform")} value={parsed.platform} />
            {nav && (
              <>
                <InfoRow label={t("language")} value={nav.language || "—"} />
                <InfoRow label={t("screen")} value={<span className="ip-mono num">{nav.screen}</span>} />
                <InfoRow label={t("cookies")} value={nav.cookieEnabled ? t("yes") : t("no")} />
                <InfoRow label={t("touch")} value={nav.maxTouchPoints > 0 ? t("yes") : t("no")} />
              </>
            )}
          </div>
          {ua && <CopyChip value={ua} label="User-Agent" className="w-full justify-between" />}
        </>
      ) : (
        <Shimmer className="h-40" />
      )}
    </SectionCard>
  );
}

function HeadersCard({ data, loading }: { data?: HeadersInfo; loading: boolean }) {
  const { t } = useI18n();
  const entries = Object.entries(data?.headers ?? {}).filter(([k]) => k !== "user-agent");

  return (
    <SectionCard
      title={t("httpHeaders")}
      icon={<Braces className="size-4" />}
      className="fade-in fade-in-3"
    >
      <p className="text-[11px] text-muted-foreground mb-3">{t("headersHint")}</p>
      {loading ? (
        <Shimmer className="h-48" />
      ) : (
        <div className="max-h-64 overflow-y-auto custom-scroll space-y-1.5 pe-1">
          {entries.map(([k, v]) => (
            <div key={k} className="text-xs border-b border-border/30 pb-1.5">
              <span className="font-bold ip-mono text-foreground">{k}</span>
              <span className="text-muted-foreground">: </span>
              <span className="text-foreground/80 break-all ip-mono">{v}</span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
