"use client";

import { Globe, Github, Mail, Lock, Code2, Zap, Gift } from "lucide-react";
import { useI18n } from "./i18n-provider";

export function Footer() {
  const { t, dict } = useI18n();

  const badges = [
    { icon: <Lock className="size-3.5" />, text: t("noLogging") },
    { icon: <Code2 className="size-3.5" />, text: t("openSource") },
    { icon: <Zap className="size-3.5" />, text: t("edgePowered") },
    { icon: <Gift className="size-3.5" />, text: t("freeForever") },
  ];

  return (
    <footer className="mt-auto border-t border-border/40 bg-muted/20 no-print">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="grid place-items-center size-8 rounded-lg bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#10B981] text-white">
                <Globe className="size-4" />
              </span>
              <span className="ip-mono text-sm font-bold">myip<span className="text-primary">.thepm.ir</span></span>
            </div>
            <p className="text-xs text-muted-foreground leading-6 max-w-xs">
              {t("footerAbout")}
            </p>
            <div className="flex flex-wrap gap-2">
              {badges.map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
                >
                  <span className="text-primary">{b.icon}</span>
                  {b.text}
                </span>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Lock className="size-4 text-primary" />
              {t("privacy")}
            </h3>
            <p className="text-xs text-muted-foreground leading-6">
              {t("privacyText")}
            </p>
            <p className="text-[10px] text-muted-foreground/70 leading-5">
              IP data comes from public third-party APIs (ipwho.is, ip-api.com, ipinfo.io,
              ipwhois.app, ipapi.is) and OpenStreetMap. Lookups are anonymous.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{dict.brandTitle}</h3>
            <nav className="flex flex-col gap-2 text-xs">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="size-3.5" />
                {t("github")}
              </a>
              <a
                href="/api/v1/ip"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Code2 className="size-3.5" />
                {t("api")} — /api/v1/ip
              </a>
              <a
                href="mailto:hi@thepm.ir"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="size-3.5" />
                {t("contact")} — hi@thepm.ir
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-[11px] text-muted-foreground" suppressHydrationWarning>
            © {new Date().getFullYear()} myip.thepm.ir — {t("madeWith")}
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            IPv4 · IPv6 · <span className="ip-mono">Cloudflare-ready</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
