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
      <header className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2.5">
          <BookOpen className="size-6 text-primary" />
          <span className="gradient-text">{t("articlesTitle")}</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("articlesSubtitle")}</p>
      </header>

      <div className="space-y-3">
        {ARTICLES.map((article) => {
          const isOpen = open === article.id;
          const paragraphs = lang === "fa" ? article.bodyFa : article.bodyEn;
          const title = lang === "fa" ? article.titleFa : article.titleEn;
          return (
            <article
              key={article.id}
              className="glass rounded-2xl overflow-hidden transition-all"
              itemScope
              itemType="https://schema.org/Article"
            >
              <button
                onClick={() => setOpen(isOpen ? null : article.id)}
                className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-start hover:bg-primary/[0.03] transition-colors"
                aria-expanded={isOpen}
              >
                <h3 className="text-sm sm:text-base font-semibold leading-relaxed" itemProp="headline">
                  {title}
                </h3>
                <DirChevron open={isOpen} />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 space-y-3 text-sm leading-7 text-foreground/80" itemProp="articleBody">
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
      <header className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2.5">
          <HelpCircle className="size-6 text-primary" />
          <span className="gradient-text">{t("faqTitle")}</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("faqSubtitle")}</p>
      </header>

      <SectionCard>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`} className="border-border/40">
              <AccordionTrigger className="text-sm sm:text-base font-semibold text-start hover:text-primary hover:no-underline py-4">
                {lang === "fa" ? f.qFa : f.qEn}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-foreground/75">
                {lang === "fa" ? f.aFa : f.aEn}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SectionCard>
    </section>
  );
}
