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
import { useDualStack, useLocalTime } from "./hooks";
import { Shimmer } from "./ui-bits";
import type { IPInfo } from "./types";
import { toast } from "@/hooks/use-toast";

const GITHUB_URL = "https://github.com/NarimanKhaleghi/myip";

export function Hero({ info, isLoading, isOwn }: { info?: IPInfo; isLoading: boolean; isOwn: boolean }) {
  const { t, lang, countryName } = useI18n();
  const dual = useDualStack(isOwn);

  // When viewing someone else's IP, the hero shows that IP without dual-stack probing.
  const ipv4 = isOwn ? dual.ipv4 ?? info?.ip : info?.ip;
  const ipv6 = isOwn ? dual.ipv6 : undefined;
  const bothSame = ipv4 && ipv6 && ipv4 === ipv6;

  const localTime = useLocalTime(info?.timezone);

  const copyIP = async () => {
    if (!ipv4) return;
    try {
      await navigator.clipboard.writeText(ipv4);
      toast({ title: t("ipCopied"), duration: 1800 });
    } catch {
      /* noop */
    }
  };

  const share = async () => {
    const url = `${window.location.origin}${info && !isOwn ? `/?ip=${info.ip}` : "/"}`;
    const text = `${t("shareText")} — ${ipv4 ?? ""}`;
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

        {/* The big IP — technical mono slab */}
        <div className="fade-in fade-in-1">
          {isLoading || (!ipv4 && isOwn && dual.loading) ? (
            <Shimmer className="h-20 sm:h-28 w-3/4 mx-auto" />
          ) : ipv4 ? (
            <button
              onClick={copyIP}
              className="group ip-mono num mx-auto block text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground border-[2px] border-foreground bg-card px-6 sm:px-10 py-4 sm:py-6 shadow-[10px_10px_0_var(--shadow)] hover:shadow-[4px_4px_0_var(--shadow)] hover:translate-x-[6px] hover:translate-y-[6px] active:shadow-none active:translate-x-[10px] active:translate-y-[10px] transition-all duration-300 cursor-pointer"
              title={t("copy")}
            >
              {ipv4}
            </button>
          ) : (
            <p className="text-2xl font-bold">{t("ipNotFound")}</p>
          )}
        </div>

        {/* IPv6 line */}
        {isOwn && (
          <p className="mt-5 text-xs sm:text-sm text-muted-foreground fade-in fade-in-2">
            {dual.loading
              ? t("detecting")
              : ipv6
              ? `${t("yourIPv6")}: `
              : t("ipv6NotDetected")}
            {ipv6 && (
              <span className="ip-mono num text-foreground/85">{bothSame ? `(${ipv6})` : ipv6}</span>
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
          <Button onClick={copyIP} disabled={!ipv4} size="lg" className="gap-2">
            <Copy className="size-4" />
            {t("copy")}
          </Button>

          <QrDialog ip={ipv4 ?? ""} />

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
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="size-5" />
            {t("qrCode")} — <span className="ip-mono num">{ip}</span>
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
