"use client";

import { Building2, ExternalLink, Hash, Network, Server } from "lucide-react";
import { SectionCard, InfoRow, Shimmer } from "./ui-bits";
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
                {info.isMobile && <span className="tag text-[10px] py-0.5">{t("connMobile")}</span>}
                {info.isHosting && <span className="tag text-[10px] py-0.5">{t("connHosting")}</span>}
                {!info.isMobile && !info.isHosting && info.isProxy === false && (
                  <span className="tag text-[10px] py-0.5">{t("connBroadband")}</span>
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
              className="flex items-center justify-between gap-2 border border-border bg-muted/40 px-3 py-2.5 text-sm font-medium transition-all hover:bg-foreground hover:text-background hover:border-foreground"
            >
              <span className="flex items-center gap-2">
                <Hash className="size-4" />
                ipinfo.io
              </span>
              <ExternalLink className="size-3.5" />
            </a>
            <a
              href={whoisUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 border border-border bg-muted/40 px-3 py-2.5 text-sm font-medium transition-all hover:bg-foreground hover:text-background hover:border-foreground"
            >
              <span className="flex items-center gap-2">
                <Network className="size-4" />
                ARIN WHOIS
              </span>
              <ExternalLink className="size-3.5" />
            </a>
            <a
              href={ripeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 border border-border bg-muted/40 px-3 py-2.5 text-sm font-medium transition-all hover:bg-foreground hover:text-background hover:border-foreground"
            >
              <span className="flex items-center gap-2">
                <Server className="size-4" />
                RIPEstat
              </span>
              <ExternalLink className="size-3.5" />
            </a>
            <a
              href={asnUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 border border-border bg-muted/40 px-3 py-2.5 text-sm font-medium transition-all hover:bg-foreground hover:text-background hover:border-foreground"
            >
              <span className="flex items-center gap-2">
                <Building2 className="size-4" />
                {t("bgpView")}
              </span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            {t("dataFrom", { n: String(info.sourcesUsed.length) })} — {info.country ? countryName(info.country, info.countryCode) : ""}
          </p>
        </SectionCard>

        <SectionCard title={t("sourcesUsed")} icon={<Network className="size-4" />} className="fade-in fade-in-2">
          <div className="flex flex-wrap gap-2">
            {info.sourcesUsed.map((s) => (
              <span key={s} className="tag--ok ip-mono text-[10.5px]">
                <span className="inline-block size-1.5 bg-current rotate-45" />
                {s}
              </span>
            ))}
            {info.sourcesFailed.map((s) => (
              <span key={s} className="tag ip-mono text-[10.5px] opacity-50">
                <span className="inline-block size-1.5 bg-current" />
                {s}
              </span>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
