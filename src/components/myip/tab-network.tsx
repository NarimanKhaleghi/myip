"use client";

import { Building2, ExternalLink, Hash, Network, Server } from "lucide-react";
import { SectionCard, InfoRow, Pill, Shimmer } from "./ui-bits";
import { useI18n } from "./i18n-provider";
import { detectRIR } from "@/lib/i18n";
import type { IPInfo } from "./types";

export function TabNetwork({ info, isLoading }: { info?: IPInfo; isLoading: boolean }) {
  const { t, countryName } = useI18n();

  if (isLoading || !info) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Shimmer className="h-72" />
        <Shimmer className="h-72" />
      </div>
    );
  }

  const rir = detectRIR(info.ip);
  const asnUrl = info.asnNumber
    ? `https://bgp.he.net/AS${info.asnNumber}`
    : "https://bgp.he.net";
  const whoisUrl = `https://whois.arin.net/rest/nets;q=${info.ip}?showDetails=true`;
  const ripeUrl = `https://apps.db.ripe.net/db-web-ui/#/query?searchtext=${info.ip}`;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Network details */}
      <SectionCard title={t("networkDetails")} icon={<Network className="size-4" />} className="fade-in">
        <div className="space-y-0.5">
          <InfoRow label={t("isp")} value={info.isp ?? info.org ?? "—"} />
          <InfoRow label={t("org")} value={info.org ?? info.isp ?? "—"} />
          <InfoRow label="ASN" value={info.asn ?? "—"} copyable mono />
          <InfoRow label={t("asnName")} value={info.asnOrg ?? info.org ?? "—"} />
          {info.domain && <InfoRow label={t("domain")} value={info.domain} copyable mono />}
          <InfoRow label={t("rir")} value={rir} />
          <InfoRow
            label={t("connectionType")}
            value={
              <span className="flex items-center gap-2 flex-wrap justify-end">
                {info.isMobile && <Pill className="text-[10px] py-0.5">📱 {t("connMobile")}</Pill>}
                {info.isHosting && <Pill className="text-[10px] py-0.5">🏢 {t("connHosting")}</Pill>}
                {!info.isMobile && !info.isHosting && info.isProxy === false && (
                  <Pill className="text-[10px] py-0.5">🏠 {t("connBroadband")}</Pill>
                )}
              </span>
            }
          />
          {info.hostname && <InfoRow label="Hostname" value={info.hostname} copyable mono />}
        </div>
      </SectionCard>

      {/* External resources */}
      <div className="grid gap-4">
        <SectionCard title={t("whoisLinks")} icon={<ExternalLink className="size-4" />} className="fade-in fade-in-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={`https://ipinfo.io/${info.ip}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 text-sm hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <span className="flex items-center gap-2">
                <Hash className="size-4 text-primary" />
                ipinfo.io
              </span>
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>
            <a
              href={whoisUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 text-sm hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <span className="flex items-center gap-2">
                <Network className="size-4 text-primary" />
                ARIN WHOIS
              </span>
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>
            <a
              href={ripeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 text-sm hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <span className="flex items-center gap-2">
                <Server className="size-4 text-primary" />
                RIPEstat
              </span>
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>
            <a
              href={asnUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 text-sm hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <span className="flex items-center gap-2">
                <Building2 className="size-4 text-primary" />
                {t("bgpView")}
              </span>
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            {t("dataFrom", { n: String(info.sourcesUsed.length) })} — {info.country ? countryName(info.country, info.countryCode) : ""}
          </p>
        </SectionCard>

        <SectionCard title={t("sourcesUsed")} icon={<Network className="size-4" />} className="fade-in fade-in-2">
          <div className="flex flex-wrap gap-2">
            {info.sourcesUsed.map((s) => (
              <Pill key={s} className="ip-mono text-[11px] border-emerald-500/30 bg-emerald-500/5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {s}
              </Pill>
            ))}
            {info.sourcesFailed.map((s) => (
              <Pill key={s} className="ip-mono text-[11px] border-border/30 opacity-50">
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                {s}
              </Pill>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
