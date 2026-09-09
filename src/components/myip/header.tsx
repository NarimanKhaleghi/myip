"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Globe, Moon, Sun, Search, Languages, Home } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "./i18n-provider";
import { isIP } from "@/lib/ip-utils";
import { cn } from "@/lib/utils";

/** Hydration-safe mounted flag (server + hydration render: false). */
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
}

export function Header({
  onSearch,
  onReset,
  isOwnIp,
}: {
  onSearch: (ip: string) => void;
  onReset: () => void;
  isOwnIp: boolean;
}) {
  const { t, toggleLang } = useI18n();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  // Before mount, render the same neutral state the server produced.
  const isDark = mounted && theme === "dark";
  const themeTitle = mounted ? (isDark ? t("light") : t("dark")) : t("dark");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (v === "") return;
    if (!isIP(v)) {
      setError(true);
      setValue("");
      setTimeout(() => setError(false), 2500);
      return;
    }
    onSearch(v);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl no-print">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-3">
        {/* Brand */}
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 shrink-0 group"
          aria-label="myip.thepm.ir"
        >
          <span className="relative grid place-items-center size-9 rounded-xl bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#10B981] text-white shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
            <Globe className="size-5" />
          </span>
          <span className="hidden sm:flex flex-col items-start leading-none">
            <span className="ip-mono text-sm font-bold tracking-tight">myip<span className="text-primary">.thepm.ir</span></span>
            <span className="text-[10px] text-muted-foreground mt-0.5">{t("siteTagline")}</span>
          </span>
        </button>

        {/* Search */}
        <form
          onSubmit={submit}
          className={cn(
            "flex-1 flex items-center gap-2 max-w-xl mx-auto transition-all",
            error && "animate-shake"
          )}
          role="search"
        >
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={error ? t("searchInvalid") : t("searchPlaceholder")}
              className={cn(
                "ps-9 h-10 ip-mono text-sm bg-muted/40 border-border/60",
                error && "border-destructive/70 text-destructive"
              )}
              inputMode="text"
              dir="ltr"
              aria-label={t("search")}
            />
          </div>
          <Button type="submit" variant="default" className="h-10 px-4 shrink-0 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90">
            {t("search")}
          </Button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isOwnIp && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onReset}
              title={t("lookupOwn")}
              className="size-10"
            >
              <Home className="size-4.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={themeTitle}
            className="size-10"
          >
            {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLang}
            title={t("langName")}
            className="size-10 font-semibold"
          >
            <Languages className="size-4.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
