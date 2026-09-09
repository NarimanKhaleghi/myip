"use client";

import dynamic from "next/dynamic";
import { Compass, Coins, MapPin, Phone, Users } from "lucide-react";
import { SectionCard, InfoRow, Shimmer, Pill } from "./ui-bits";
import { useI18n } from "./i18n-provider";
import { useLocalTime, haversineKm } from "./hooks";
import type { IPInfo } from "./types";

const MapView = dynamic(() => import("./map-view"), {
  ssr: false,
  loading: () => <Shimmer className="h-72 sm:h-96 w-full rounded-2xl" />,
});

export function TabGeo({
  info,
  isLoading,
  distanceKm,
}: {
  info?: IPInfo;
  isLoading: boolean;
  distanceKm?: number | null;
}) {
  const { t, countryName } = useI18n();
  const localTime = useLocalTime(info?.timezone);

  if (isLoading || !info) {
    return (
      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <Shimmer className="h-96" />
        <Shimmer className="h-96" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[380px_1fr] items-start">
      {/* Geo details */}
      <SectionCard title={t("geoDetails")} icon={<Compass className="size-4" />} className="fade-in">
        <div className="space-y-0.5">
          <InfoRow
            label={t("country")}
            value={`${info.flagEmoji ?? ""} ${countryName(info.country, info.countryCode)}${info.countryCode ? ` (${info.countryCode})` : ""}`.trim()}
          />
          <InfoRow label={t("continent")} value={info.continent ?? "—"} />
          <InfoRow label={t("region")} value={info.region ?? "—"} />
          <InfoRow label={t("city")} value={info.city ?? "—"} />
          <InfoRow label={t("postalCode")} value={info.postal ?? "—"} mono />
          <InfoRow
            label={t("coordinates")}
            value={
              info.latitude !== undefined && info.longitude !== undefined ? (
                <span className="ip-mono num">
                  {info.latitude.toFixed(4)}, {info.longitude.toFixed(4)}
                </span>
              ) : (
                "—"
              )
            }
          />
          <InfoRow label={t("timezone")} value={info.timezone ?? "—"} mono />
          <InfoRow label={t("localTime")} value={localTime ? <span className="ip-mono num">{localTime}</span> : "—"} />
          <InfoRow label="UTC" value={info.utcOffset ?? "—"} mono />
          {info.isEU !== undefined && <InfoRow label={t("isEU")} value={info.isEU ? t("yes") : t("no")} />}
        </div>

        {/* Currency & dialing */}
        <div className="flex flex-wrap gap-2 mt-4">
          {info.currencyCode && (
            <Pill>
              <Coins className="size-3.5 text-primary" />
              <span className="ip-mono">{info.currencyCode}</span>
            </Pill>
          )}
          {info.callingCode && (
            <Pill>
              <Phone className="size-3.5 text-primary" />
              <span className="ip-mono num">+{info.callingCode}</span>
            </Pill>
          )}
          {info.capital && (
            <Pill>
              <MapPin className="size-3.5 text-primary" />
              {info.capital}
            </Pill>
          )}
        </div>

        {info.borders && info.borders.length > 0 && (
          <div className="mt-3">
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
              <Users className="size-3.5" />
              {t("neighbors")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {info.borders.map((c) => (
                <Pill key={c} className="ip-mono text-[10px] py-0.5">
                  {c}
                </Pill>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* Map */}
      <SectionCard
        title={t("yourLocation")}
        icon={<MapPin className="size-4" />}
        className="fade-in fade-in-1"
      >
        <MapView info={info} distanceKm={distanceKm} />
      </SectionCard>
    </div>
  );
}
