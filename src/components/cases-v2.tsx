"use client";

import Link from "next/link";
import { useState } from "react";
import { cases } from "@/data/cases";
import { caseHref, casesOverview as o } from "@/lib/case-page";
import { Reveal } from "./scroll";
import { StackedCards, TypeMarquee } from "./signature";
import { V2Arrow, V2Block, V2Button, V2Head, V2Hero } from "./v2-kit";

/*
 * Cases 02 — "Licht & strak". White Swiss grid: a chip bar filters a grid of
 * labelled photo tiles (AXION-style), then the figures as a row of bordered
 * cells where the first one is dark.
 */

const ALL = "Alle";

export default function CasesV2() {
  const [filter, setFilter] = useState<string>(ALL);
  const tags = [ALL, ...Array.from(new Set(cases.map((c) => c.tag)))];
  const shown = filter === ALL ? cases : cases.filter((c) => c.tag === filter);

  return (
    <div className="bg-white text-zinc-950">
      <V2Hero crumbs={[{ href: "/", label: "Home" }, { label: "Cases" }]} title={o.title} intro={o.subtitle} count={String(cases.length).padStart(2, "0")} />

      <V2Block className="!pt-8 sm:!pt-12">
        <V2Head index="01" label="Cases" lead="Elke rit is anders," trail="de aanpak blijft dezelfde." intro={o.intro} />

        {/* Filter chips */}
        <div role="group" aria-label="Filter cases op type" className="-mx-5 mb-6 flex snap-x gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {tags.map((t) => {
            const active = t === filter;
            const n = t === ALL ? cases.length : cases.filter((c) => c.tag === t).length;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(t)}
                className={`inline-flex min-h-11 flex-none snap-start items-center gap-2 rounded-lg border px-4 text-sm whitespace-nowrap transition-colors ${
                  active ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 text-zinc-700 hover:border-zinc-950"
                }`}
              >
                {t}
                <span className={`tabular-nums ${active ? "text-white/50" : "text-zinc-400"}`}>{n}</span>
              </button>
            );
          })}
        </div>

        {/* Cases stack on top of each other while scrolling */}
        <StackedCards
          radius="rounded-md"
          items={shown.map((c) => ({ title: c.title, body: c.body, image: c.image, alt: c.imageAlt }))}
        />
        <ul className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <li key={c.slug} className="min-w-0">
              <Link href={caseHref(c)} className="group flex min-h-11 items-center justify-between gap-3 rounded-md border border-zinc-200 px-4 py-3 text-sm transition-colors hover:border-zinc-950">
                <span className="min-w-0 truncate">Lees de case: {c.title}</span>
                <V2Arrow className="size-4 flex-none transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </V2Block>

      {/* Case types as running words */}
      <section aria-hidden className="overflow-hidden border-t border-zinc-200 py-8">
        <TypeMarquee words={tags.slice(1)} images={cases.map((c) => c.image)} speed={60} />
      </section>

      {/* Figures — bordered cells, the first one dark */}
      <V2Block className="border-t border-zinc-200">
        <V2Head index="02" label="Impact" lead="Wat we dagelijks" trail="waarmaken." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {o.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className={`flex min-h-48 flex-col justify-between rounded-xl p-6 ${i === 0 ? "bg-zinc-950 text-white" : "border border-zinc-200"}`}>
              <span className={`text-xs tabular-nums ${i === 0 ? "text-white/50" : "text-zinc-400"}`}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-5xl font-light tracking-[-0.04em] break-words">{s.value}</p>
                <p className={`mt-2 text-sm ${i === 0 ? "text-white/60" : "text-zinc-500"}`}>{s.label}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={240} className="flex min-h-48 flex-col justify-between rounded-xl border border-zinc-950 p-6">
            <p className="text-lg leading-snug font-medium text-balance">Wordt uw transport de volgende case?</p>
            <div>
              <V2Button href="/offerte">Offerte aanvragen</V2Button>
            </div>
          </Reveal>
        </div>
      </V2Block>
    </div>
  );
}
