"use client";

import { cases } from "@/data/cases";
import { caseHref, casesOverview as o } from "@/lib/case-page";
import { Reveal } from "./scroll";
import { HorizontalRail, HoverRevealList } from "./signature";
import { V3Block, V3Button, V3Head, V3Hero, V3Page } from "./v3-kit";

/*
 * Cases 03 — "Donker & premium". Black page: centred cinematic hero, a
 * horizontal snap rail of big photo cards, oversized figures and a closing
 * index of every case.
 */

export default function CasesV3() {
  return (
    <V3Page>
      <V3Hero image={o.heroImage} crumbs={[{ href: "/", label: "Home" }, { label: "Cases" }]} title={o.title} intro={o.subtitle}>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <V3Button href="#cases">Bekijk de {cases.length} cases</V3Button>
          <V3Button href="/offerte" variant="ghost">Offerte aanvragen</V3Button>
        </div>
      </V3Hero>

      {/* Pinned rail: the cards travel sideways while you scroll */}
      <section id="cases" className="scroll-mt-24 px-5 sm:px-10 lg:px-14">
        <HorizontalRail
          heading={<V3Head label={`Cases (${String(cases.length).padStart(2, "0")})`} lead="Elke rit is anders," trail="de aanpak blijft dezelfde." intro={o.intro} />}
          items={cases.map((c) => ({ title: c.title, body: c.route, meta: c.tag, href: caseHref(c), image: c.image, alt: c.imageAlt }))}
        />
      </section>

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
        <HoverRevealList
          tone="dark"
          items={cases.map((c, i) => ({ title: c.title, body: c.tag, meta: String(i + 1).padStart(2, "0"), href: caseHref(c), image: c.image }))}
        />
      </V3Block>
    </V3Page>
  );
}
