"use client";

import { MapPin, Building2, Network, Clock, Layers, Globe2, Hash } from "lucide-react";
import { useI18n } from "./i18n-provider";
import { useLocalTime } from "./hooks";
import { SectionCard, Shimmer } from "./ui-bits";
import type { IPInfo } from "./types";

export function QuickStats({ info, isLoading }: { info?: IPInfo; isLoading: boolean }) {
  const { t, countryName } = useI18n();
  const localTime = useLocalTime(info?.timezone);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="h-28" />
        ))}
      </div>
    );
  }
  if (!info) return null;

  const items = [
    {
      icon: <Globe2 className="size-5" />,
      label: t("country"),
      value: (
        <span className="flex items-center gap-1.5 justify-center">
          <span className="text-lg leading-none">{info.flagEmoji ?? "🌍"}</span>
          <span className="truncate">{countryName(info.country, info.countryCode)}</span>
        </span>
      ),
    },
    {
      icon: <MapPin className="size-5" />,
      label: t("city"),
      value: info.city ? `${info.city}${info.region ? " · " + info.region : ""}` : t("unknown"),
    },
    {
      icon: <Building2 className="size-5" />,
      label: t("isp"),
      value: <span className="truncate max-w-full">{info.isp ?? info.org ?? t("unknown")}</span>,
    },
    {
      icon: <Hash className="size-5" />,
      label: t("asn"),
      value: info.asn ? (
        <span className="ip-mono num">{info.asn}</span>
      ) : (
        t("unknown")
      ),
    },
    {
      icon: <Clock className="size-5" />,
      label: t("timezone"),
      value: info.timezone ? (
        <span title={info.timezone} className="truncate">
          <span className="ip-mono num">{localTime ? localTime.split(",")[0] : info.timezoneAbbr ?? ""}</span>
        </span>
      ) : (
        t("unknown")
      ),
    },
    {
      icon: <Layers className="size-5" />,
      label: t("protocol"),
      value: info.version,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item, i) => (
        <SectionCard key={i} className={`fade-in fade-in-${Math.min(i + 1, 5)} !p-4`}>
          <div className="flex flex-col items-center text-center gap-1.5">
            <span className="text-primary/80">{item.icon}</span>
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</span>
            <span className="text-sm font-semibold flex items-center gap-1 min-w-0 max-w-full">
              {item.value}
            </span>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

export function SourcesBar({ sources }: { sources: string[] }) {
  const { t } = useI18n();
  if (!sources.length) return null;
  return (
    <div className="mx-auto max-w-6xl px-4 mt-4 flex items-center justify-center gap-2 flex-wrap text-xs text-muted-foreground">
      <Network className="size-3.5 text-emerald-500" />
      <span>{t("dataFrom", { n: String(sources.length) })}</span>
      {sources.map((s) => (
        <span
          key={s}
          className="rounded-full border border-border/50 bg-muted/30 px-2 py-0.5 ip-mono text-[10px]"
        >
          {s}
        </span>
      ))}
    </div>
  );
}
