"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "./i18n-provider";
import { toast } from "@/hooks/use-toast";

/** Glass card section with title. */
export function SectionCard({
  title,
  icon,
  children,
  className,
  action,
}: {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "glass rounded-2xl p-4 sm:p-6 fade-in",
        className
      )}
    >
      {title && (
        <header className="flex items-center justify-between gap-2 mb-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
            {icon && <span className="text-primary">{icon}</span>}
            {title}
          </h3>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/** Copy-to-clipboard text chip with inline feedback. */
export function CopyChip({
  value,
  label,
  mono = true,
  className,
}: {
  value: string;
  label?: string;
  mono?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    toast({ title: t("copied"), duration: 1500 });
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={t("copy")}
      className={cn(
        "group inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-start transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]",
        className
      )}
    >
      {label && <span className="text-xs text-muted-foreground shrink-0">{label}</span>}
      <span
        className={cn(
          "text-sm truncate",
          mono && "ip-mono num"
        )}
      >
        {value}
      </span>
      {copied ? (
        <Check className="size-3.5 shrink-0 text-emerald-500" />
      ) : (
        <Copy className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
      )}
    </button>
  );
}

/** Label/value row used across detail cards. */
export function InfoRow({
  label,
  value,
  copyable = false,
  mono = false,
}: {
  label: string;
  value: ReactNode;
  copyable?: boolean;
  mono?: boolean;
}) {
  if (copyable && typeof value === "string" && value) {
    return (
      <div className="flex items-center justify-between gap-3 py-2 border-b border-border/40 last:border-0">
        <span className="text-xs text-muted-foreground shrink-0">{label}</span>
        <CopyChip value={value} className="max-w-[60%] border-0 bg-transparent p-0 hover:bg-transparent" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className={cn("text-sm text-end font-medium", mono && "ip-mono num")}>
        {value === undefined || value === null || value === "" ? "—" : value}
      </span>
    </div>
  );
}

/** Colored status pill. */
export function StatusPill({
  ok,
  textOk,
  textBad,
}: {
  ok: boolean;
  textOk: string;
  textBad: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        ok
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
          : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25"
      )}
    >
      <span className={cn("size-1.5 rounded-full", ok ? "bg-emerald-500" : "bg-red-500")} />
      {ok ? textOk : textBad}
    </span>
  );
}

/** Neutral pill. */
export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-foreground/80",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Section chevron aware of RTL. */
export function DirChevron({ open }: { open: boolean }) {
  const { isRTL } = useI18n();
  const cls = cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-90");
  return isRTL ? <ChevronLeft className={cls} /> : <ChevronRight className={cls} />;
}

/** Skeleton shimmer block. */
export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted",
        className
      )}
    />
  );
}
