"use client";

/**
 * Single-page report layout.
 *
 * All five report sections (Overview, Geolocation, Network & ISP, Security,
 * Tools) render stacked on ONE page in order of importance to the visitor —
 * no tab switching. A slim sticky anchor bar (with scroll-spy) lets users
 * jump between sections; every section stays visible and printable.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Compass, Info, Network, Shield, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "./i18n-provider";
import { TabInfo } from "./tab-info";
import { TabGeo } from "./tab-geo";
import { TabNetwork } from "./tab-network";
import { TabSecurity } from "./tab-security";
import { TabTools } from "./tab-tools";
import type { IPInfo } from "./types";

/** The report sections, ordered by importance to the visitor. */
export const REPORT_SECTIONS = [
  { id: "info", num: "01", icon: Info },
  { id: "geo", num: "02", icon: Compass },
  { id: "network", num: "03", icon: Network },
  { id: "security", num: "04", icon: Shield },
  { id: "tools", num: "05", icon: Wrench },
] as const;

type SectionId = (typeof REPORT_SECTIONS)[number]["id"];

/* ------------------------------------------------------------------ */
/* Sticky section nav (scroll-spy, RTL-aware, mobile-scrollable)       */
/* ------------------------------------------------------------------ */

function SectionNav() {
  const { t } = useI18n();
  const [active, setActive] = useState<SectionId>("info");
  // While an anchor jump's smooth scroll is in flight, the spy would keep
  // reporting the section being scrolled PAST. Lock it briefly so the
  // clicked link stays highlighted until the scroll settles.
  const spyLockUntil = useRef(0);

  const labels: Record<SectionId, string> = {
    info: t("tabInfo"),
    geo: t("tabGeo"),
    network: t("tabNetwork"),
    security: t("tabSecurity"),
    tools: t("tabTools"),
  };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (Date.now() < spyLockUntil.current) return; // anchor scroll in flight
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // The line the "current" section is measured against: sticky
        // header (64px) + this nav (~48px) + a little breathing room.
        const line = window.scrollY + 150;
        let current: SectionId = "info";
        for (const s of REPORT_SECTIONS) {
          const el = document.getElementById(s.id);
          if (el && el.offsetTop <= line) current = s.id;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav
      aria-label={t("secJumpTo")}
      className="sticky top-16 z-30 w-full border-y-[1.5px] border-border bg-background/95 backdrop-blur-sm no-print"
    >
      <div className="mx-auto max-w-6xl px-4 flex items-center gap-1.5 overflow-x-auto custom-scroll py-2">
        {REPORT_SECTIONS.map((s) => {
          const Icon = s.icon;
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => {
                // Highlight immediately and hold through the smooth scroll;
                // dynamic content (map/DNSBL) can shift section positions
                // mid-scroll, so the spy alone would lag behind the intent.
                setActive(s.id);
                spyLockUntil.current = Date.now() + 900;
              }}
              className={cn(
                "shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold border transition-all duration-200",
                isActive
                  ? "bg-foreground text-background border-foreground"
                  : "border-border bg-card text-foreground/80 hover:border-foreground hover:text-foreground hover:-translate-y-px"
              )}
            >
              <span className="ip-mono text-[10px] opacity-70" aria-hidden="true">
                {s.num}
              </span>
              <Icon className="size-3.5" aria-hidden="true" />
              {labels[s.id]}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Section wrapper — numbered engineering header + content            */
/* ------------------------------------------------------------------ */

function ReportSection({
  id,
  num,
  icon,
  title,
  desc,
  children,
}: {
  id: SectionId;
  num: string;
  icon: ReactNode;
  title: string;
  desc: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <header className="mb-5 sm:mb-6">
        <p className="kicker mb-3">
          <code>{num}</code>
          <span className="flex items-center gap-1.5">
            {icon}
            {t("secReportKicker")}
          </span>
        </p>
        <h2 id={`${id}-heading`} className="display text-2xl sm:text-3xl">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-xl leading-relaxed">{desc}</p>
      </header>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The full single-page report                                         */
/* ------------------------------------------------------------------ */

export function ReportSections({
  info,
  isLoading,
  userCoords,
  distanceKm,
}: {
  info?: IPInfo;
  isLoading: boolean;
  userCoords?: { lat: number; lon: number } | null;
  distanceKm?: number | null;
}) {
  const { t } = useI18n();

  const descs: Record<SectionId, string> = {
    info: t("secInfoDesc"),
    geo: t("secGeoDesc"),
    network: t("secNetworkDesc"),
    security: t("secSecurityDesc"),
    tools: t("secToolsDesc"),
  };

  return (
    <div>
      {/* Sticky only while the report area itself is in view */}
      <SectionNav />

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-10 pb-4">
        <div className="space-y-14 sm:space-y-16">
          <ReportSection
            id="info"
            num="01"
            icon={<Info className="size-3.5" />}
            title={t("tabInfo")}
            desc={descs.info}
          >
            <TabInfo info={info} isLoading={isLoading} />
          </ReportSection>

          <ReportSection
            id="geo"
            num="02"
            icon={<Compass className="size-3.5" />}
            title={t("tabGeo")}
            desc={descs.geo}
          >
            <TabGeo info={info} isLoading={isLoading} distanceKm={distanceKm} />
          </ReportSection>

          <ReportSection
            id="network"
            num="03"
            icon={<Network className="size-3.5" />}
            title={t("tabNetwork")}
            desc={descs.network}
          >
            <TabNetwork info={info} isLoading={isLoading} />
          </ReportSection>

          <ReportSection
            id="security"
            num="04"
            icon={<Shield className="size-3.5" />}
            title={t("tabSecurity")}
            desc={descs.security}
          >
            <TabSecurity info={info} isLoading={isLoading} />
          </ReportSection>

          <ReportSection
            id="tools"
            num="05"
            icon={<Wrench className="size-3.5" />}
            title={t("tabTools")}
            desc={descs.tools}
          >
            <TabTools info={info} userCoords={userCoords} />
          </ReportSection>
        </div>
      </div>
    </div>
  );
}
