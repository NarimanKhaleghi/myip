"use client";

import { Globe, Github, Mail, Lock, Code2, Zap, Gift, Star, ExternalLink, FileJson } from "lucide-react";
import { useI18n } from "./i18n-provider";

const GITHUB_URL = "https://github.com/NarimanKhaleghi/myip";
const EMAIL = "pm@thepm.ir";

/** Mono marquee strip — signature design-system pattern. */
function Ticker() {
  const { t, dict } = useI18n();
  const words = [
    t("openSource"),
    dict.mitLicense,
    t("freeForever"),
    t("noLogging"),
    t("edgePowered"),
    "IPv4 · IPv6",
  ];
  const seq = [...words, ...words];
  return (
    <div
      className="border-y-[1.5px] border-border bg-background overflow-hidden py-2.5 no-print"
      aria-hidden="true"
    >
      <div className="ticker-track flex w-max">
        {seq.map((w, i) => (
          <span
            key={i}
            className="ip-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap px-5 flex items-center gap-5"
          >
            <span className="inline-block size-1.5 bg-foreground" />
            {w}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        [dir="rtl"] .ticker-track { animation: ticker-marquee 30s linear infinite reverse; }
        [dir="ltr"] .ticker-track { animation: ticker-marquee 30s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export function Footer() {
  const { t, dict } = useI18n();

  const badges = [
    { icon: <Lock className="size-3.5" />, text: t("noLogging") },
    { icon: <Code2 className="size-3.5" />, text: t("openSource") },
    { icon: <Zap className="size-3.5" />, text: t("edgePowered") },
    { icon: <Gift className="size-3.5" />, text: t("freeForever") },
  ];

  return (
    <footer className="mt-auto border-t-[1.5px] border-border bg-card no-print">
      <Ticker />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="grid place-items-center size-9 border-[1.5px] border-foreground display text-lg leading-none">
                M
              </span>
              <span className="ip-mono text-sm font-bold">myip<span className="text-muted-foreground">.thepm.ir</span></span>
            </div>
            <p className="text-xs text-muted-foreground leading-6 max-w-xs">
              {t("footerAbout")}
            </p>
            <div className="flex flex-wrap gap-2">
              {badges.map((b, i) => (
                <span key={i} className="tag px-2.5 py-1 text-[10px]">
                  {b.icon}
                  {b.text}
                </span>
              ))}
            </div>
          </div>

          {/* Open source — GitHub */}
          <div className="space-y-3 border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-dashed border-border">
              <Github className="size-5" />
              <h3 className="text-sm font-bold">{t("openSourceHeading")}</h3>
              <span className="tag tag--ok ms-auto">{dict.mitLicense}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-6">
              {t("openSourceFull")}
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 border-[1.5px] border-foreground bg-foreground text-background px-4 py-2.5 text-sm font-bold transition-all duration-200 hover:bg-transparent hover:text-foreground hover:shadow-[4px_4px_0_var(--shadow)] hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2.5">
                <Github className="size-4.5" />
                {t("viewOnGitHub")}
              </span>
              <Star className="size-4" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ExternalLink className="size-3 shrink-0" />
              <span className="ip-mono truncate" dir="ltr">
                github.com/{t("githubRepo")}
              </span>
            </a>
          </div>

          {/* Links + contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold">{dict.brandTitle}</h3>
            <nav className="flex flex-col gap-1.5 text-xs">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border px-2 py-2 hover:bg-muted/50"
              >
                <Github className="size-3.5" />
                {t("github")}
                <span className="ip-mono text-[10px] text-muted-foreground/70 ms-auto" dir="ltr">
                  NarimanKhaleghi/myip
                </span>
              </a>
              <a
                href="/api/v1/ip"
                className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border px-2 py-2 hover:bg-muted/50"
              >
                <FileJson className="size-3.5" />
                {t("api")}
                <span className="ip-mono text-[10px] text-muted-foreground/70 ms-auto" dir="ltr">
                  /api/v1/ip
                </span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border px-2 py-2 hover:bg-muted/50"
              >
                <Mail className="size-3.5" />
                {t("contact")}
                <span className="ip-mono text-[10px] text-muted-foreground/70 ms-auto" dir="ltr">
                  {EMAIL}
                </span>
              </a>
            </nav>
            <div className="border-t border-dashed border-border pt-4 space-y-2">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-3.5" />
                {t("privacyText")}
              </p>
              <p className="text-[10px] text-muted-foreground/70 leading-5">
                IP data comes from public third-party APIs (ipwho.is, ip-api.com, ipinfo.io,
                ipwhois.app, ipapi.is) and OpenStreetMap. Lookups are anonymous.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar — the maker credit */}
        <div className="mt-8 pt-5 border-t-[1.5px] border-border flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs font-bold flex items-center gap-2" suppressHydrationWarning>
            <span className="inline-block size-1.5 bg-foreground rotate-45" aria-hidden="true" />
            {t("madeByNariman").split("{heart}")[0]}
            <span className="grayscale contrast-125 inline-flex" aria-label="love">❤️</span>
            {t("madeByNariman").split("{heart}")[1]}
          </p>
          <p className="text-[11px] text-muted-foreground ip-mono">
            © {new Date().getFullYear()} myip.thepm.ir — <span dir="ltr">IPv4 · IPv6</span>
          </p>
        </div>
      </div>

      {/* Screen-reader / SEO text version of the open-source statement */}
      <div className="sr-only">
        <Globe className="hidden" />
        {t("openSourceFull")} — github.com/{t("githubRepo")}
      </div>
    </footer>
  );
}
