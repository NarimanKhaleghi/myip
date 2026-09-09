"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { UI, COUNTRY_FA, type Lang, type Dict } from "@/lib/i18n";

interface I18nCtx {
  lang: Lang;
  dict: Dict;
  t: (key: keyof Dict, params?: Record<string, string>) => string;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  isRTL: boolean;
  /** Localized country name: Persian mapping when fa, English original otherwise. */
  countryName: (en: string | undefined, code?: string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

/* ---- language as an external store (localStorage + storage events) ---- */

function subscribeLang(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("myip:lang", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("myip:lang", onChange);
  };
}

function getLangSnapshot(): Lang {
  const v = window.localStorage.getItem("myip-lang");
  return v === "en" ? "en" : "fa";
}

function getLangServerSnapshot(): Lang {
  return "fa";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribeLang, getLangSnapshot, getLangServerSnapshot);

  // Sync <html lang="" dir=""> with the active language (external system).
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = UI[lang].dir;
    html.classList.toggle("lang-en", lang === "en");
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    window.localStorage.setItem("myip-lang", l);
    window.dispatchEvent(new Event("myip:lang"));
  }, []);

  const toggleLang = useCallback(() => {
    const current = getLangSnapshot();
    setLang(current === "fa" ? "en" : "fa");
  }, [setLang]);

  const t = useCallback(
    (key: keyof Dict, params?: Record<string, string>) => {
      let str = UI[lang][key] as string;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replaceAll(`{${k}}`, v);
        }
      }
      return str;
    },
    [lang]
  );

  const countryName = useCallback(
    (en: string | undefined, code?: string) => {
      if (!en) return UI[lang].unknown;
      if (lang === "fa" && code) {
        const fa = COUNTRY_FA[code];
        if (fa) return fa;
      }
      return en;
    },
    [lang]
  );

  return (
    <Ctx.Provider
      value={{
        lang,
        dict: UI[lang] as Dict,
        t,
        setLang,
        toggleLang,
        isRTL: lang === "fa",
        countryName,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
