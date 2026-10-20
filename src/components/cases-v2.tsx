"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cases } from "@/data/cases";
import { caseHref, casesOverview as o } from "@/lib/case-page";
import { Reveal } from "./scroll";
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

        {/* Labelled photo tiles */}
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c, i) => {
            const big = filter === ALL && i === 0;
            const num = String(cases.indexOf(c) + 1).padStart(2, "0");
            return (
              <li key={c.slug} className={big ? "sm:col-span-2 lg:row-span-2" : ""}>
                <Link
                  href={caseHref(c)}
                  className={`group relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-xl bg-zinc-950 p-4 text-white sm:p-5 ${big ? "lg:min-h-[45rem]" : ""}`}
                >
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    sizes={big ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/10 to-zinc-950/30" />

                  <div className="relative flex items-start justify-between gap-3">
                    <span className="rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-950">{c.tag}</span>
                    <span className="text-sm tabular-nums text-white/70">{num}</span>
                  </div>

                  <div className="relative">
                    <h3 className={`font-medium leading-[1.1] tracking-[-0.02em] text-balance ${big ? "text-2xl sm:text-4xl" : "text-2xl"}`}>{c.title}</h3>
                    {big && <p className="mt-3 hidden max-w-lg text-[0.95rem] leading-relaxed text-white/75 sm:block">{c.body}</p>}
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/20 pt-4">
                      <span className="min-w-0 truncate text-sm text-white/70">{c.route ?? "Lees de case"}</span>
                      <span className="flex size-11 flex-none items-center justify-center rounded-full bg-white text-zinc-950 transition-transform group-hover:-rotate-45">
                        <V2Arrow />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </V2Block>

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
