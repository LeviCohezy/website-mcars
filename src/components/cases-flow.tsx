"use client";

import { useRef, useState } from "react";
import { cases, type Case } from "@/data/cases";
import { getService } from "@/data/services";
import { caseHref, casesOverview as o } from "@/lib/case-page";
import { CloseContact, FilterChips, MetaRow, PhotoCard, STUDIO, formTone, heroVariant, type Version } from "./case-flow";
import {
  Arrow,
  Bento,
  Cell,
  Chapter,
  ChapterIntro,
  FlowButton,
  FlowClose,
  FlowGrid,
  FlowHero,
  FlowPage,
  IndexRow,
  Rise,
  toneClasses,
  Figures,
  type FlowTone,
} from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * Cases overview as one film. Same story in all versions:
 *
 *   hero → 01 the six cases (centrepiece) → 02 impact → 03 per dienst → close
 *
 *   01 cinema    light: tall-card snap rail · dark curtain impact · light curtain services
 *   02 wordmark  light: filter chips + index rows with photos · paper impact · light services
 *   03 lines     dark: bento of cases · paper interlude impact · dark services
 */

const ALL = "Alle cases";

const TONES: Record<Version, { page: FlowTone; cases: FlowTone; impact: FlowTone; services: FlowTone }> = {
  1: { page: "light", cases: "light", impact: "dark", services: "light" },
  2: { page: "light", cases: "light", impact: "paper", services: "light" },
  3: { page: "dark", cases: "dark", impact: "paper", services: "dark" },
};

const num = (c: Case) => String(cases.indexOf(c) + 1).padStart(2, "0");

export default function CasesFlow({ version }: { version: Version }) {
  const T = TONES[version];
  const [filter, setFilter] = useState(ALL);
  const tags = [ALL, ...Array.from(new Set(cases.map((c) => c.tag)))];
  const shown = filter === ALL ? cases : cases.filter((c) => c.tag === filter);
  const total = String(cases.length).padStart(2, "0");

  const services = Array.from(new Set(cases.map((c) => c.service).filter((s): s is string => Boolean(s))))
    .map((s) => ({ service: getService(s), item: cases.find((c) => c.service === s)! }))
    .filter((x): x is { service: NonNullable<ReturnType<typeof getService>>; item: Case } => Boolean(x.service));

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={heroVariant(version)}
        title={o.title}
        intro={o.subtitle}
        crumbs={[{ href: "/", label: "Home" }, { label: "Cases" }]}
        image={version === 2 ? STUDIO : o.heroImage}
        imageAlt={version === 2 ? "Een Mcars-transporter in de studio" : "Een volgeladen Mcars-transporter in de stad"}
        wordmark="CASES"
        lineImages={[cases[0].image, cases[2].image]}
        aside={<MetaRow light={version === 2} items={[`${total} cases`, "Particulier & zakelijk", "Anoniem, maar écht gereden"]} />}
        form={<QuoteFlow tone={formTone(version)} />}
      />

      {/* 01 — the cases themselves */}
      <Chapter n="01" label="Cases" tone={T.cases}>
        <ChapterIntro lead="Elke rit is anders," trail="de aanpak blijft dezelfde." body={o.intro} />
        <div className="mt-12 sm:mt-16">
          {version === 2 && (
            <div className="mb-8">
              <FilterChips label="Filter cases op type" options={tags} active={filter} onPick={setFilter} tone={T.cases} count={(t) => (t === ALL ? cases.length : cases.filter((c) => c.tag === t).length)} />
            </div>
          )}
          {version === 1 && <CaseRail items={cases} tone={T.cases} />}
          {version === 2 && (
            <IndexRow items={shown.map((c) => ({ title: c.title, body: c.body, href: caseHref(c), image: c.image, meta: c.tag }))} />
          )}
          {version === 3 && (
            <Bento>
              {cases.map((c, i) => (
                <PhotoCard
                  key={c.slug}
                  href={caseHref(c)}
                  image={c.image}
                  alt={c.imageAlt}
                  eyebrow={`${num(c)} · ${c.tag}`}
                  title={c.title}
                  body={i === 0 ? c.body : c.route}
                  className="!absolute inset-0 !rounded-none"
                  sizes={i === 0 ? "(min-width:1024px) 60vw, 100vw" : "(min-width:1024px) 30vw, 100vw"}
                />
              ))}
              <Cell eyebrow="Anoniem" title="Geen namen, wel het echte verhaal." body={o.intro} />
            </Bento>
          )}
        </div>
      </Chapter>

      {/* 02 — impact: the figures behind the cases */}
      <Chapter n="02" label="Impact" tone={T.impact} curtain>
        <ChapterIntro lead="Wat we dagelijks" trail="waarmaken." body="Anoniem verteld, maar elk van deze ritten is echt gereden — door onze eigen chauffeurs, met onze eigen transporters." />
        <Stats tone={T.impact} items={[{ value: total, label: "Cases op deze pagina" }, ...o.stats]} />
      </Chapter>

      {/* 03 — the services behind the cases */}
      <Chapter n="03" label="Per dienst" tone={T.services} curtain={T.services !== T.impact}>
        <ChapterIntro lead="Herkent u uw rit?" trail="Dit zijn de diensten erachter." action={<FlowButton href="/diensten" variant="ghost">Alle diensten</FlowButton>} />
        <FlowGrid className="mt-12 sm:mt-16">
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {services.map(({ service, item }, i) => (
              <li key={service.slug}>
                <Rise delay={(i % 3) * 80}>
                  <PhotoCard
                    href={`/diensten/${service.slug}`}
                    image={service.heroImage}
                    alt=""
                    eyebrow={`${service.category} · case ${num(item)}`}
                    title={service.nav}
                    className="aspect-[4/3]"
                    sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw"
                  />
                </Rise>
              </li>
            ))}
          </ul>
        </FlowGrid>
      </Chapter>

      <FlowClose lead="Uw rit als" trail="volgende case?" form={<QuoteFlow tone="dark" />} contact={<CloseContact />} />
    </FlowPage>
  );
}

/** Tall-card horizontal snap rail with arrow buttons (desktop) — swipe on touch. */
function CaseRail({ items, tone }: { items: Case[]; tone: FlowTone }) {
  const ref = useRef<HTMLUListElement>(null);
  const t = toneClasses(tone);
  const by = (d: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: d * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const btn = `flex size-12 items-center justify-center rounded-full ring-1 transition-colors ${tone === "dark" ? "ring-white/20 hover:bg-white hover:text-zinc-950" : "ring-zinc-950/15 hover:bg-zinc-950 hover:text-white"}`;
  return (
    <FlowGrid>
      <ul ref={ref} className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:gap-4 sm:px-0">
        {items.map((c, i) => (
          <li key={c.slug} className="w-[82%] flex-none snap-start sm:w-[46%] lg:w-[31.5%]">
            <PhotoCard
              href={caseHref(c)}
              image={c.image}
              alt={c.imageAlt}
              eyebrow={`${String(i + 1).padStart(2, "0")} · ${c.tag}`}
              title={c.title}
              body={c.route}
              className="aspect-[3/4] sm:aspect-[4/5.4]"
            />
          </li>
        ))}
      </ul>
      <div className={`mt-6 flex items-center justify-between border-t pt-5 ${t.line}`}>
        <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.muted}`}>
          {String(items.length).padStart(2, "0")} cases · swipe of gebruik de pijlen
        </p>
        <div className="flex gap-2">
          <button type="button" aria-label="Vorige cases" onClick={() => by(-1)} className={btn}>
            <Arrow className="size-4 rotate-180" />
          </button>
          <button type="button" aria-label="Volgende cases" onClick={() => by(1)} className={btn}>
            <Arrow />
          </button>
        </div>
      </div>
    </FlowGrid>
  );
}

/** Hairline figure row — like the kit's Figures, sized for word values ("Wekelijks"). */
function Stats({ items }: { items: { value: string; label: string }[]; tone: FlowTone }) {
  // Kit Figures: one full-width row per figure on phones, 2 → 4 columns above.
  return (
    <div className="mt-14 sm:mt-20">
      <Figures items={items} />
    </div>
  );
}
