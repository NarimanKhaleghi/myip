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
  Check,
  Clock,
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
import { Shimmer, Pill } from "./ui-bits";
import type { IPInfo } from "./types";
import { toast } from "@/hooks/use-toast";

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
    <section className="aurora relative -mt-px pt-14 pb-10 sm:pt-20 sm:pb-14">
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        {/* Label */}
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4 fade-in">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex size-2 rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          {isOwn ? t("yourIp") : <span className="ip-mono">{info?.ip}</span>}
          {info?.version && <Pill className="py-0.5">{info.version}</Pill>}
        </p>

        {/* The big IP */}
        <div className="fade-in fade-in-1">
          {isLoading || (!ipv4 && isOwn && dual.loading) ? (
            <Shimmer className="h-16 sm:h-24 w-3/4 mx-auto" />
          ) : ipv4 ? (
            <button
              onClick={copyIP}
              className="group ip-mono num mx-auto block text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight gradient-text hover:scale-[1.02] active:scale-[0.99] transition-transform cursor-pointer"
              title={t("copy")}
            >
              {ipv4}
            </button>
          ) : (
            <p className="text-2xl text-destructive">{t("ipNotFound")}</p>
          )}
        </div>

        {/* IPv6 line */}
        {isOwn && (
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground fade-in fade-in-2">
            {dual.loading
              ? t("detecting")
              : ipv6
              ? bothSame
                ? `${t("yourIPv6")}: `
                : `${t("yourIPv6")}: `
              : t("ipv6NotDetected")}
            {ipv6 && !bothSame && (
              <span className="ip-mono num text-foreground/80">{ipv6}</span>
            )}
            {ipv6 && bothSame && (
              <span className="ip-mono num text-foreground/80">({ipv6})</span>
            )}
          </p>
        )}

        {/* Badges */}
        {info && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 fade-in fade-in-3">
            <Pill>
              <span className="text-base leading-none">{info.flagEmoji ?? "🌍"}</span>
              {countryName(info.country, info.countryCode)}
            </Pill>
            {info.city && (
              <Pill>
                <MapPin className="size-3.5 text-primary" />
                {info.city}
              </Pill>
            )}
            {info.isp && (
              <Pill>
                <Building2 className="size-3.5 text-primary" />
                <span className="max-w-48 truncate">{info.isp}</span>
              </Pill>
            )}
            {info.isProxy !== undefined && (
              <Pill
                className={
                  info.isProxy
                    ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                }
              >
                <ShieldCheck className="size-3.5" />
                {info.isProxy ? t("proxyDetected") : t("proxyNotDetected")}
              </Pill>
            )}
            {info.timezone && (
              <Pill>
                <Clock className="size-3.5 text-primary" />
                <span className="ip-mono num text-xs">{localTime ?? info.timezoneAbbr ?? info.timezone}</span>
              </Pill>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3 fade-in fade-in-4 no-print">
          <Button
            onClick={copyIP}
            disabled={!ipv4}
            size="lg"
            className="gap-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90 shadow-lg shadow-primary/30"
          >
            <Copy className="size-4" />
            {t("copy")}
          </Button>

          <QrDialog ip={ipv4 ?? ""} />

          <Button onClick={share} size="lg" variant="outline" className="gap-2 border-border/60">
            <Share2 className="size-4" />
            {t("share")}
          </Button>
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
      color: { dark: "#0F172A", light: "#FFFFFF" },
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
        <Button size="lg" variant="outline" className="gap-2 border-border/60" disabled={!ip}>
          <QrCode className="size-4" />
          {t("qrCode")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="size-5 text-primary" />
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
              className="rounded-xl border border-border/60 shadow-lg"
            />
          ) : (
            <Shimmer className="size-[280px]" />
          )}
          <div className="flex gap-2 w-full">
            <Button onClick={download} variant="outline" className="flex-1 gap-2">
              <QrCode className="size-4" /> PNG
            </Button>
            <Button onClick={shareQr} variant="outline" className="flex-1 gap-2">
              {copied ? <Check className="size-4 text-emerald-500" /> : <Share2 className="size-4" />}
              {t("share")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
