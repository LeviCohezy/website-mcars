"use client";

import { useState } from "react";
import { faqGroups, faqTotal } from "@/data/faq";
import type { Faq } from "@/data/services";
import { site } from "@/lib/site";
import { Reveal } from "./scroll";
import { V3Block, V3Button, V3Head, V3Hero, V3Page, V3Star } from "./v3-kit";

/*
 * FAQ 03 — "Donker & premium". Dark tab per category with an oversized number;
 * the active category opens its answers beside a huge figure. Every panel is
 * rendered (inactive ones hidden) so all answers stay in the HTML.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export default function FaqV3() {
  const [active, setActive] = useState(0);

  return (
    <V3Page>
      <V3Hero
        short
        image="/fleet/countryside-highway.jpg"
        crumbs={[{ href: "/", label: "Home" }, { label: "FAQ" }]}
        title="Veelgestelde vragen."
        intro="De meest gestelde vragen over autotransport, per onderwerp. Kies een onderwerp hieronder."
      >
        <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-3 border-t border-white/10">
          {[
            { v: pad(faqTotal), k: "antwoorden" },
            { v: pad(faqGroups.length), k: "onderwerpen" },
            { v: "24u", k: "persoonlijk antwoord" },
          ].map((s, i) => (
            <div key={s.k} className={`flex flex-col-reverse pt-6 ${i > 0 ? "border-l border-white/10" : ""}`}>
              <dt className="mt-2 text-xs text-white/50 sm:text-sm">{s.k}</dt>
              <dd className="text-4xl font-light tracking-[-0.04em] tabular-nums sm:text-5xl">{s.v}</dd>
            </div>
          ))}
        </dl>
      </V3Hero>

      <V3Block className="pt-12 sm:pt-16">
        {/* Category tabs — snap rail on mobile, 4×2 grid on desktop */}
        <div
          role="tablist"
          aria-label="Onderwerpen"
          className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-10 sm:px-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {faqGroups.map((g, i) => {
            const on = active === i;
            return (
              <button
                key={g.id}
                id={`tab-${g.id}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls={`panel-${g.id}`}
                onClick={() => setActive(i)}
                className={`flex min-h-32 w-44 flex-none snap-start flex-col justify-between rounded-2xl border p-5 text-left transition-colors lg:w-auto ${
                  on ? "border-white bg-white text-zinc-950" : "border-white/10 bg-white/[0.03] text-white hover:border-white/30"
                }`}
              >
                <span className={`font-[family-name:var(--font-display)] text-5xl leading-none ${on ? "text-zinc-950" : "text-white/25"}`}>{pad(i + 1)}</span>
                <span className="mt-6 flex items-end justify-between gap-3">
                  <span className="text-base leading-tight font-medium">{g.label}</span>
                  <span className={`text-xs tabular-nums ${on ? "text-zinc-500" : "text-white/40"}`}>{g.items.length}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Panels */}
        {faqGroups.map((g, i) => (
          <div
            key={g.id}
            id={`panel-${g.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${g.id}`}
            hidden={active !== i}
            className="mt-14 grid gap-10 sm:mt-20 lg:grid-cols-[1fr_1.6fr] lg:gap-20"
          >
            <div>
              <span aria-hidden className="block font-[family-name:var(--font-display)] text-[7rem] leading-[0.8] text-white/10 sm:text-[11rem]">{pad(i + 1)}</span>
              <p className="mt-6 text-xs font-medium tracking-[0.2em] text-white/50 uppercase">{g.label}</p>
              <h2 className="mt-4 text-4xl leading-[1.04] font-light tracking-[-0.035em] text-balance sm:text-5xl">
                {g.title} <span className="text-white/35">{g.trail}</span>
              </h2>
              {i < faqGroups.length - 1 && (
                <button
                  type="button"
                  onClick={() => setActive(i + 1)}
                  className="mt-8 inline-flex min-h-11 items-center gap-2 border-b border-white/30 text-sm font-medium text-white/80 hover:border-white hover:text-white"
                >
                  Volgend onderwerp: {faqGroups[i + 1].label} →
                </button>
              )}
            </div>
            <DarkAccordion items={g.items} />
          </div>
        ))}
      </V3Block>

      {/* Still a question — oversized contact figures */}
      <V3Block className="bg-zinc-900">
        <V3Head center label="Nog een vraag?" lead="Staat uw vraag er niet bij?" trail="Wij helpen u persoonlijk." />
        <Reveal className="mx-auto grid max-w-5xl gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
          <a href={site.phoneHref} className="group flex min-h-44 flex-col justify-between bg-zinc-900 p-7 transition-colors hover:bg-zinc-800 sm:p-10">
            <span className="text-xs tracking-[0.2em] text-white/50 uppercase">Bel een planner</span>
            <span className="mt-8 text-3xl font-light tracking-[-0.03em] break-words sm:text-4xl lg:text-5xl">{site.phone}</span>
          </a>
          <a href={`mailto:${site.email}`} className="group flex min-h-44 flex-col justify-between bg-zinc-900 p-7 transition-colors hover:bg-zinc-800 sm:p-10">
            <span className="text-xs tracking-[0.2em] text-white/50 uppercase">Mail ons</span>
            <span className="mt-8 text-3xl font-light tracking-[-0.03em] break-words sm:text-4xl lg:text-5xl">{site.email}</span>
          </a>
        </Reveal>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <V3Button href="/offerte">Offerte aanvragen</V3Button>
          <V3Button href="/contact" variant="ghost">Contact</V3Button>
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-white/55">
          <V3Star /> <span className="font-medium text-white">{site.reviews.score}/5</span> op Google · {site.hours}
        </p>
      </V3Block>
    </V3Page>
  );
}

export function DarkAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-b border-white/10">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-t border-white/10">
            <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex min-h-11 w-full items-baseline gap-4 py-7 text-left sm:gap-6">
              <span className="w-6 flex-none text-sm text-white/30 tabular-nums">{pad(i + 1)}</span>
              <span className={`flex-1 text-xl font-medium tracking-tight transition-colors ${isOpen ? "text-white" : "text-white/70"}`}>{f.q}</span>
              <span aria-hidden className={`text-2xl leading-none font-light transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-8 pl-10 text-base leading-relaxed text-white/60 sm:pr-10 sm:pl-12">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
