"use client";

import { useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  Copy,
  QrCode,
  Share2,
  MapPin,
  Building2,
  ShieldCheck,
  ShieldAlert,
  Check,
  Clock,
  Github,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "./i18n-provider";
import { useLocalTime } from "./hooks";
import { Shimmer } from "./ui-bits";
import type { IPInfo, SelfIPState } from "./types";
import { toast } from "@/hooks/use-toast";

const GITHUB_URL = "https://github.com/NarimanKhaleghi/myip";

/**
 * Long addresses (a full IPv6 is up to 39 characters) must never overflow
 * the slab or the page — the type scales down progressively and the value
 * is allowed to wrap inside the button.
 */
function ipSlabClasses(ip: string | undefined): string {
  const len = ip?.length ?? 0;
  if (len <= 16)
    return "text-4xl sm:text-6xl lg:text-7xl px-6 sm:px-10"; // IPv4
  if (len <= 30)
    return "text-3xl sm:text-5xl lg:text-6xl px-5 sm:px-8"; // short IPv6
  return "text-[26px] leading-snug sm:text-4xl lg:text-5xl px-4 sm:px-6"; // full IPv6
}

export function Hero({
  info,
  isLoading,
  isOwn,
  self,
}: {
  info?: IPInfo;
  isLoading: boolean;
  isOwn: boolean;
  self: SelfIPState;
}) {
  const { t, lang, countryName } = useI18n();

  /*
   * Primary address = the visitor's real public IPv4, probed client-side
   * over IPv4-only endpoints (works even when the browser reached us over
   * IPv6 on a dual-stack network). Falls back to the report IP — an
   * explicit lookup, or the server's connection address (IPv6) on
   * IPv6-only networks where no IPv4 route exists.
   */
  const mainIP = isOwn ? self.ipv4 ?? info?.ip : info?.ip;

  /* The IPv6 hint line only adds information when it differs from the slab. */
  const ipv6Line =
    isOwn && self.ipv6 && self.ipv6 !== mainIP ? self.ipv6 : null;
  const v6Pending = isOwn && !self.v6Ready;

  const localTime = useLocalTime(info?.timezone);

  const copyIP = async () => {
    if (!mainIP) return;
    try {
      await navigator.clipboard.writeText(mainIP);
      toast({ title: t("ipCopied"), duration: 1800 });
    } catch {
      /* noop */
    }
  };

  const share = async () => {
    const url = `${window.location.origin}${info && !isOwn ? `/?ip=${info.ip}` : "/"}`;
    const text = `${t("shareText")} — ${mainIP ?? ""}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "myip.thepm.ir", text, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: t("copied"), duration: 1800 });
    }
  };

  return (
    <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-12">
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        {/* Kicker — mono eyebrow with live dot */}
        <p className="kicker justify-center mb-5 fade-in">
          <span className="live-dot" aria-hidden="true" />
          <span>{isOwn ? (lang === "fa" ? "آدرس IP شما" : "YOUR IP ADDRESS") : "IP LOOKUP"}</span>
          {isOwn && info?.version && <code>{info.version}</code>}
          {!isOwn && info?.ip && <code>{info.version ?? ""}</code>}
        </p>

        {/* The big IP — technical mono slab (wrap-safe for long IPv6) */}
        <div className="fade-in fade-in-1 max-w-full">
          {!mainIP && isLoading ? (
            <Shimmer className="h-20 sm:h-28 w-3/4 mx-auto" />
          ) : mainIP ? (
            <button
              onClick={copyIP}
              dir="ltr"
              className={`group ip-mono num mx-auto block max-w-full ${ipSlabClasses(
                mainIP
              )} font-bold tracking-tight text-foreground border-[2px] border-foreground bg-card py-4 sm:py-6 [overflow-wrap:anywhere] shadow-[10px_10px_0_var(--shadow)] hover:shadow-[4px_4px_0_var(--shadow)] hover:translate-x-[6px] hover:translate-y-[6px] active:shadow-none active:translate-x-[10px] active:translate-y-[10px] transition-all duration-300 cursor-pointer`}
              title={t("copy")}
            >
              {mainIP}
            </button>
          ) : (
            <p className="text-2xl font-bold">{t("ipNotFound")}</p>
          )}
        </div>

        {/* IPv6 line */}
        {isOwn && (
          <p className="mt-5 text-xs sm:text-sm text-muted-foreground fade-in fade-in-2 max-w-full [overflow-wrap:anywhere]">
            {v6Pending
              ? t("detecting")
              : ipv6Line
              ? `${t("yourIPv6")}: `
              : t("ipv6NotDetected")}
            {ipv6Line && (
              <span className="ip-mono num text-foreground/85">{ipv6Line}</span>
            )}
          </p>
        )}

        {/* Tags — mono technical chips */}
        {info && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 fade-in fade-in-3">
            <span className="tag px-3 py-1.5 text-xs">
              <span className="grayscale contrast-125 text-sm leading-none" aria-hidden="true">
                {info.flagEmoji ?? "🌐"}
              </span>
              {countryName(info.country, info.countryCode)}
            </span>
            {info.city && (
              <span className="tag px-3 py-1.5 text-xs">
                <MapPin className="size-3.5" />
                {info.city}
              </span>
            )}
            {info.isp && (
              <span className="tag px-3 py-1.5 text-xs max-w-full">
                <Building2 className="size-3.5 shrink-0" />
                <span className="max-w-48 truncate">{info.isp}</span>
              </span>
            )}
            {info.isProxy !== undefined && (
              <span className={`px-3 py-1.5 text-xs ${info.isProxy ? "tag--bad" : "tag--ok"}`}>
                {info.isProxy ? <ShieldAlert className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
                {info.isProxy ? t("proxyDetected") : t("proxyNotDetected")}
              </span>
            )}
            {info.timezone && (
              <span className="tag px-3 py-1.5 text-xs">
                <Clock className="size-3.5" />
                <span className="ip-mono num text-[11px]">{localTime ?? info.timezoneAbbr ?? info.timezone}</span>
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3 fade-in fade-in-4 no-print">
          <Button onClick={copyIP} disabled={!mainIP} size="lg" className="gap-2">
            <Copy className="size-4" />
            {t("copy")}
          </Button>

          <QrDialog ip={mainIP ?? ""} />

          <Button onClick={share} size="lg" variant="outline" className="gap-2">
            <Share2 className="size-4" />
            {t("share")}
          </Button>
        </div>

        {/* Open-source line */}
        <div className="mt-6 fade-in fade-in-5 no-print">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <Github className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span>{t("openSourceHeading")}</span>
            <span className="hidden sm:inline ip-mono text-[10.5px] text-muted-foreground/80 border border-dashed border-border px-2 py-0.5">
              {t("githubRepo")}
            </span>
            <Star className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function QrDialog({ ip }: { ip: string }) {
  const { t } = useI18n();
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const qrValue = useMemo(() => {
    if (!ip) return "";
    return JSON.stringify({ app: "myip.thepm.ir", ip, url: `https://myip.thepm.ir/?ip=${ip}` });
  }, [ip]);

  const generate = async (open: boolean) => {
    if (!open || !qrValue || dataUrl) return;
    const url = await QRCode.toDataURL(qrValue, {
      width: 280,
      margin: 2,
      color: { dark: "#0a0a0a", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
    setDataUrl(url);
  };

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `myip-${ip}.png`;
    a.click();
  };

  const shareQr = async () => {
    if (!dataUrl) return;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `myip-${ip}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "myip.thepm.ir" });
        return;
      }
    } catch {
      /* fallthrough */
    }
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      toast({ title: t("copied"), duration: 1500 });
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  return (
    <Dialog onOpenChange={generate}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="gap-2" disabled={!ip}>
          <QrCode className="size-4" />
          {t("qrCode")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap min-w-0">
            <QrCode className="size-5 shrink-0" />
            <span className="min-w-0 [overflow-wrap:anywhere]">
              {t("qrCode")} — <span className="ip-mono num">{ip}</span>
            </span>
          </DialogTitle>
          <DialogDescription className="sr-only">QR code for IP {ip}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt={`QR code for ${ip}`}
              width={280}
              height={280}
              className="border-[1.5px] border-foreground shadow-[8px_8px_0_var(--shadow)]"
            />
          ) : (
            <Shimmer className="size-[280px]" />
          )}
          <div className="flex gap-2 w-full">
            <Button onClick={download} variant="outline" className="flex-1 gap-2">
              <QrCode className="size-4" /> PNG
            </Button>
            <Button onClick={shareQr} variant="outline" className="flex-1 gap-2">
              {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
              {t("share")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
