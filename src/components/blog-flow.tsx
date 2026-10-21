"use client";

import Link from "next/link";
import { useState } from "react";
import { blogCategories, formatDate, readingTime, sortedArticles, type Article } from "@/data/blog";
import { CloseContact, FilterChips, MetaRow, STUDIO, formTone, heroVariant, type Version } from "./case-flow";
import {
  Arrow,
  Chapter,
  ChapterIntro,
  ClipImage,
  FlowButton,
  FlowClose,
  FlowGrid,
  FlowHero,
  FlowPage,
  IndexRow,
  Rise,
  toneClasses,
  type FlowTone,
} from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * Blog overview as one film — mirrors the cases overview:
 *
 *   hero → 01 uitgelicht (featured) → 02 alle artikels (chips + list/grid) → 03 onderwerpen → close
 *
 *   01 cinema    light featured + card grid · dark curtain topics
 *   02 wordmark  light featured + index rows · paper curtain topics
 *   03 lines     dark featured + card grid · paper interlude topics
 */

const ALL = "Alle";

const TONES: Record<Version, { page: FlowTone; featured: FlowTone; archive: FlowTone; topics: FlowTone }> = {
  1: { page: "light", featured: "light", archive: "light", topics: "dark" },
  2: { page: "light", featured: "light", archive: "light", topics: "paper" },
  3: { page: "dark", featured: "dark", archive: "dark", topics: "paper" },
};

const meta = (a: Article) => `${a.category} · ${readingTime(a)} min`;

export default function BlogFlow({ version }: { version: Version }) {
  const T = TONES[version];
  const [featured, ...rest] = sortedArticles;
  const [filter, setFilter] = useState<string>(ALL);
  const list = filter === ALL ? rest : sortedArticles.filter((a) => a.category === filter);
  const count = (c: string) => (c === ALL ? sortedArticles.length : sortedArticles.filter((a) => a.category === c).length);
  const total = String(sortedArticles.length).padStart(2, "0");

  const pick = (c: string) => {
    setFilter(c);
    document.getElementById("artikels")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={heroVariant(version)}
        title="Kennis uit de cabine."
        intro="Praktische tips en heldere uitleg over autotransport, geschreven door mensen die er elke dag mee op de baan zitten."
        crumbs={[{ href: "/", label: "Home" }, { label: "Blog" }]}
        image={version === 2 ? STUDIO : "/fleet/barcelona-palms.jpg"}
        imageAlt={version === 2 ? "Een Mcars-transporter in de studio" : "Een Mcars-transporter tussen de palmbomen in Barcelona"}
        wordmark="KENNIS"
        lineImages={[featured.image, "/images/generated/workshop.jpg"]}
        aside={<MetaRow light={version === 2} items={[`${total} artikels`, `${blogCategories.length} onderwerpen`, "Voor particulier en handelaar"]} />}
        form={<QuoteFlow tone={formTone(version)} />}
      />

      {/* 01 — the latest article, given room */}
      <Chapter n="01" label="Uitgelicht" tone={T.featured}>
        <ChapterIntro lead="Recent geschreven," trail="door wie er elke dag rijdt." />
        <FlowGrid className="mt-12 sm:mt-16">
          <Link href={`/blog/${featured.slug}`} className="group grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <ClipImage src={featured.image} alt={featured.imageAlt} parallax sizes="(min-width:1024px) 58vw, 100vw" className="aspect-[4/3] rounded-[1.5rem] sm:aspect-[16/10] sm:rounded-[2rem]" />
            <div className={`border-t pt-6 ${toneClasses(T.featured).line}`}>
              <p className={`flex flex-wrap justify-between gap-2 font-mono text-[11px] tracking-[0.2em] uppercase ${toneClasses(T.featured).muted}`}>
                <span>{featured.category}</span>
                <span>{formatDate(featured.date)} · {readingTime(featured)} min</span>
              </p>
              <h2 className="mt-6 text-3xl leading-[1.06] font-light tracking-[-0.035em] text-balance sm:text-5xl">{featured.title}</h2>
              <p className={`mt-5 text-base leading-relaxed sm:text-lg ${toneClasses(T.featured).muted}`}>{featured.excerpt}</p>
              <span className={`mt-8 inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-medium transition-colors ${T.featured === "dark" ? "bg-white text-zinc-950 group-hover:bg-zinc-200" : "bg-zinc-950 text-white group-hover:bg-zinc-800"}`}>
                Lees het artikel <Arrow />
              </span>
            </div>
          </Link>
        </FlowGrid>
      </Chapter>

      {/* 02 — the archive, filterable */}
      <Chapter n="02" label="Alle artikels" tone={T.archive} id="artikels" className="scroll-mt-20">
        <ChapterIntro lead="Meer uit de kennisbank," trail={`${total} artikels.`} />
        <div className="mt-12 sm:mt-16">
          <div className="mb-8 sm:mb-10">
            <FilterChips label="Filter op onderwerp" options={[ALL, ...blogCategories]} active={filter} onPick={setFilter} count={count} tone={T.archive} />
          </div>
          {version === 2 ? (
            <IndexRow items={list.map((a) => ({ title: a.title, body: a.excerpt, href: `/blog/${a.slug}`, image: a.image, meta: meta(a) }))} />
          ) : (
            <FlowGrid>
              <ul className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((a, i) => (
                  <li key={a.slug}>
                    <Rise delay={(i % 3) * 80}>
                      <ArticleCard a={a} tone={T.archive} />
                    </Rise>
                  </li>
                ))}
              </ul>
            </FlowGrid>
          )}
        </div>
      </Chapter>

      {/* 03 — topics: each one filters the archive above */}
      <Chapter n="03" label="Onderwerpen" tone={T.topics} curtain>
        <ChapterIntro lead="Waar we over schrijven" trail="— voor particulier en handelaar." action={<FlowButton href="/faq" variant="ghost">Veelgestelde vragen</FlowButton>} />
        <FlowGrid className="mt-12 sm:mt-16">
          <ul className={`grid border-t sm:grid-cols-2 sm:gap-x-10 lg:ml-[25%] ${toneClasses(T.topics).line}`}>
            {blogCategories.map((c, i) => {
              const n = count(c);
              return (
                <li key={c} className={`border-b ${toneClasses(T.topics).line}`}>
                  <button type="button" onClick={() => pick(c)} className="group flex min-h-16 w-full items-center gap-5 py-4 text-left">
                    <span className={`w-8 flex-none font-mono text-[11px] tracking-[0.18em] ${toneClasses(T.topics).faint}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-xl font-light tracking-[-0.015em] sm:text-2xl">{c}</span>
                    <span className={`font-mono text-[11px] tracking-[0.18em] uppercase ${toneClasses(T.topics).muted}`}>
                      {n} {n === 1 ? "artikel" : "artikels"}
                    </span>
                    <Arrow className="size-4 rotate-[-90deg] opacity-50 transition-opacity group-hover:opacity-100" />
                  </button>
                </li>
              );
            })}
          </ul>
        </FlowGrid>
      </Chapter>

      <FlowClose lead="Liever meteen" trail="een persoonlijke prijs?" form={<QuoteFlow tone="dark" />} contact={<CloseContact />} />
    </FlowPage>
  );
}

function ArticleCard({ a, tone }: { a: Article; tone: FlowTone }) {
  const t = toneClasses(tone);
  return (
    <Link href={`/blog/${a.slug}`} className="group block">
      <PhotoCardFrame a={a} />
      <p className={`mt-5 font-mono text-[11px] tracking-[0.2em] uppercase ${t.muted}`}>
        {a.category} · {formatDate(a.date)}
      </p>
      <h3 className="mt-2 text-xl leading-snug font-light tracking-[-0.02em] text-balance sm:text-2xl">{a.title}</h3>
      <p className={`mt-2 line-clamp-2 text-sm leading-relaxed ${t.muted}`}>{a.excerpt}</p>
    </Link>
  );
}

/** Photo only (the caption sits under it, so long titles stay readable). */
function PhotoCardFrame({ a }: { a: Article }) {
  return (
    <span className="relative block aspect-[4/3] overflow-hidden rounded-[1.25rem]">
      <ClipImage src={a.image} alt={a.imageAlt} sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]" />
      <span aria-hidden className="absolute right-4 bottom-4 flex size-11 items-center justify-center rounded-full bg-white/90 text-zinc-950">
        <Arrow />
      </span>
    </span>
  );
}

