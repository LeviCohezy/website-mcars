"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { cases } from "@/data/cases";
import { caseHref, casesOverview as o } from "@/lib/case-page";
import { Reveal } from "./scroll";
import { V3Arrow, V3Block, V3Button, V3Head, V3Hero, V3Page } from "./v3-kit";

/*
 * Cases 03 — "Donker & premium". Black page: centred cinematic hero, a
 * horizontal snap rail of big photo cards, oversized figures and a closing
 * index of every case.
 */

export default function CasesV3() {
  const rail = useRef<HTMLUListElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 400) + 16), behavior: "smooth" });
  };

  return (
    <V3Page>
      <V3Hero image={o.heroImage} crumbs={[{ href: "/", label: "Home" }, { label: "Cases" }]} title={o.title} intro={o.subtitle}>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <V3Button href="#cases">Bekijk de {cases.length} cases</V3Button>
          <V3Button href="/offerte" variant="ghost">Offerte aanvragen</V3Button>
        </div>
      </V3Hero>

      {/* Horizontal rail of big cards */}
      <V3Block id="cases" className="scroll-mt-24">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <V3Head label={`Cases (${String(cases.length).padStart(2, "0")})`} lead="Elke rit is anders," trail="de aanpak blijft dezelfde." intro={o.intro} />
          <div className="mb-12 hidden flex-none gap-2 sm:mb-14 sm:flex">
            <button type="button" onClick={() => scrollBy(-1)} aria-label="Vorige cases" className="flex size-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/60">
              <V3Arrow className="size-4 rotate-180" />
            </button>
            <button type="button" onClick={() => scrollBy(1)} aria-label="Volgende cases" className="flex size-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/60">
              <V3Arrow />
            </button>
          </div>
        </div>

        <ul ref={rail} className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-10 sm:scroll-px-10 sm:px-10 lg:-mx-14 lg:scroll-px-14 lg:px-14">
          {cases.map((c, i) => (
            <li key={c.slug} className="w-[86%] flex-none snap-start sm:w-[30rem] lg:w-[36rem]">
              <Link href={caseHref(c)} className="group relative flex min-h-[32rem] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-6 sm:min-h-[38rem] sm:p-8">
                <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 36rem, (min-width: 640px) 30rem, 86vw" className="object-cover opacity-70 transition-[transform,opacity] duration-700 ease-out motion-safe:group-hover:scale-[1.04] group-hover:opacity-85" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/20" />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="text-7xl leading-none font-light tracking-[-0.05em] tabular-nums sm:text-8xl">{String(i + 1).padStart(2, "0")}</span>
                  <span className="rounded-full border border-white/25 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md">{c.tag}</span>
                </div>
                <div className="relative">
                  <h3 className="text-2xl leading-[1.12] font-light tracking-[-0.02em] text-balance sm:text-3xl">{c.title}</h3>
                  <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-white/60">{c.body}</p>
                  <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium">
                    Lees de case <V3Arrow className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </V3Block>

      {/* Oversized figures */}
      <V3Block className="border-t border-white/10">
        <V3Head label="Impact" lead="Wat we dagelijks" trail="waarmaken." center />
        <dl className="grid gap-10 sm:grid-cols-3">
          {o.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="border-t border-white/15 pt-6 text-center sm:text-left">
              <dd className="text-6xl font-light tracking-[-0.05em] tabular-nums break-words lg:text-8xl">{s.value}</dd>
              <dt className="mt-3 text-sm text-white/50">{s.label}</dt>
            </Reveal>
          ))}
        </dl>
      </V3Block>

      {/* Index of every case */}
      <V3Block className="bg-zinc-900">
        <V3Head label="Index" lead="Alle cases" trail="op een rij." />
        <ol className="border-t border-white/10">
          {cases.map((c, i) => (
            <li key={c.slug} className="border-b border-white/10">
              <Link href={caseHref(c)} className="group grid min-h-11 grid-cols-[3rem_1fr_auto] items-center gap-4 py-6 sm:grid-cols-[4rem_1fr_16rem_auto] sm:py-7">
                <span className="text-sm tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg font-light tracking-tight text-white/85 transition-colors group-hover:text-white sm:text-2xl">{c.title}</span>
                <span className="hidden text-sm text-white/45 sm:block">{c.tag}</span>
                <span className="flex size-11 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-white group-hover:bg-white group-hover:text-zinc-950">
                  <V3Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </V3Block>
    </V3Page>
  );
}
