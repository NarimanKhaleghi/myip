"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "./i18n-provider";
import { toast } from "@/hooks/use-toast";

/**
 * Monochrome design system — shared primitives.
 * Status is expressed with PATTERN, never color:
 *   filled   = positive / clean
 *   hatched  = alert / detected
 *   dashed   = warning / medium
 */

/** Card section — thin border, solid surface, hard shadow on hover. */
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
        "border-[1.5px] border-border bg-card p-4 sm:p-6 fade-in",
        "transition-[transform,border-color,box-shadow] duration-300",
        "hover:border-foreground hover:shadow-[8px_8px_0_var(--shadow)] hover:-translate-y-1",
        className
      )}
    >
      {title && (
        <header className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-dashed border-border">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            {icon && <span className="text-foreground">{icon}</span>}
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
        "group inline-flex items-center gap-2 border border-border bg-muted/50 px-3 py-1.5 text-start transition-all",
        "hover:border-foreground hover:bg-foreground hover:text-background",
        className
      )}
    >
      {label && <span className="text-xs text-muted-foreground shrink-0 group-hover:text-background/70">{label}</span>}
      <span
        className={cn(
          "text-sm truncate min-w-0",
          mono && "ip-mono num"
        )}
      >
        {value}
      </span>
      {copied ? (
        <Check className="size-3.5 shrink-0" />
      ) : (
        <Copy className="size-3.5 shrink-0 text-muted-foreground group-hover:text-background transition-colors" />
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
      <div className="flex items-center justify-between gap-3 py-2 border-b border-border/60 last:border-0">
        <span className="text-xs text-muted-foreground shrink-0">{label}</span>
        <CopyChip value={value} className="max-w-[60%] border-0 bg-transparent p-0 hover:bg-transparent hover:text-foreground" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-border/60 last:border-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className={cn("text-sm text-end font-medium min-w-0 [overflow-wrap:anywhere]", mono && "ip-mono num")}>
        {value === undefined || value === null || value === "" ? "—" : value}
      </span>
    </div>
  );
}

/**
 * Status tag — PURE monochrome semantics.
 * OK → filled inverted slab. BAD → hatched box with thick border.
 */
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
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold",
        ok ? "tag--ok" : "tag--bad"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block size-1.5 bg-current",
          ok ? "rotate-45" : "rounded-none"
        )}
      />
      {ok ? textOk : textBad}
    </span>
  );
}

/** Neutral technical tag (mono). */
export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "tag px-3 py-1 text-xs",
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

/** Skeleton shimmer block — mono. */
export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted border border-border",
        className
      )}
    />
  );
}
