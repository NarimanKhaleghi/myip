"use client";

import { useState } from "react";
import { BookOpen, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionCard, DirChevron } from "./ui-bits";
import { useI18n } from "./i18n-provider";
import { ARTICLES, FAQS } from "@/lib/articles";

export function SeoContent() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12" id="articles">
      <header className="mb-8">
        <p className="kicker mb-3">
          <code>SEC.01</code>
          <BookOpen className="size-3.5" />
          <span>{lang === "fa" ? "دانش‌نامه" : "KNOWLEDGE BASE"}</span>
        </p>
        <h2 className="display text-3xl sm:text-4xl">{t("articlesTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("articlesSubtitle")}</p>
      </header>

      <div className="space-y-3">
        {ARTICLES.map((article, i) => {
          const isOpen = open === article.id;
          const paragraphs = lang === "fa" ? article.bodyFa : article.bodyEn;
          const title = lang === "fa" ? article.titleFa : article.titleEn;
          return (
            <article
              key={article.id}
              className="border-[1.5px] border-border bg-card overflow-hidden transition-[border-color,box-shadow,transform] duration-300 hover:border-foreground hover:shadow-[6px_6px_0_var(--shadow)]"
              itemScope
              itemType="https://schema.org/Article"
            >
              <button
                onClick={() => setOpen(isOpen ? null : article.id)}
                className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-start hover:bg-muted/60 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="ip-mono text-[11px] text-muted-foreground border border-dashed border-border px-2 py-0.5 shrink-0" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold leading-relaxed" itemProp="headline">
                    {title}
                  </h3>
                </span>
                <DirChevron open={isOpen} />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 space-y-3 text-sm leading-7 text-foreground/85 border-t border-dashed border-border pt-4" itemProp="articleBody">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function Faq() {
  const { t, lang } = useI18n();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: lang === "fa" ? f.qFa : f.qEn,
      acceptedAnswer: {
        "@type": "Answer",
        text: lang === "fa" ? f.aFa : f.aEn,
      },
    })),
  };

  return (
    <section className="mx-auto max-w-4xl px-4 pb-12" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-8">
        <p className="kicker mb-3">
          <code>SEC.02</code>
          <HelpCircle className="size-3.5" />
          <span>{lang === "fa" ? "پرسش و پاسخ" : "Q&A"}</span>
        </p>
        <h2 className="display text-3xl sm:text-4xl">{t("faqTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("faqSubtitle")}</p>
      </header>

      <SectionCard className="!p-0">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`} className="border-border">
              <AccordionTrigger className="text-sm sm:text-base font-bold text-start hover:no-underline py-4">
                <span className="flex items-center gap-3">
                  <span className="ip-mono text-[11px] text-muted-foreground shrink-0" aria-hidden="true">
                    Q{String(i + 1).padStart(2, "0")}
                  </span>
                  {lang === "fa" ? f.qFa : f.qEn}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-foreground/80">
                {lang === "fa" ? f.aFa : f.aEn}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SectionCard>
    </section>
  );
}
