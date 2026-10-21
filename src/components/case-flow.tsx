"use client";

import Image from "next/image";
import Link from "next/link";
import { cases } from "@/data/cases";
import { caseHref, casesOverview, type CasePageData } from "@/lib/case-page";
import { site } from "@/lib/site";
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
  ImageBridge,
  Rise,
  toneClasses,
  type FlowTone,
} from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * Case detail as a short film. Same story in all three versions:
 *
 *   hero → 01 dossier (facts) → 02 situatie → [bridge] → 03 aanpak →
 *   04 resultaat → 05 dienst → 06 next case (full-bleed, the film continues) → close
 *
 *   01 cinema    light → dark (bridge) → light curtain → dark close
 *   02 wordmark  light → paper (bridge) → light curtain → dark close
 *   03 lines     dark throughout, resultaat as the one paper interlude
 *
 * Also exports small shared pieces used by the cases / blog / article flows:
 * NextChapter (big full-bleed "next" link), FilterChips and CloseContact.
 */

export type Version = 1 | 2 | 3;

export const heroVariant = (v: Version) => (v === 1 ? "cinema" : v === 2 ? "wordmark" : "lines") as "cinema" | "wordmark" | "lines";
export const formTone = (v: Version) => (v === 1 ? "glass" : v === 2 ? "light" : "dark") as "glass" | "light" | "dark";
export const STUDIO = "/images/generated/truck-studio.jpg";

/* ------------------------------------------------------------------ */
/* Shared pieces                                                      */
/* ------------------------------------------------------------------ */

/** Phone + mail under the closing statement (same as the reference). */
export function CloseContact() {
  return (
    <dl className="grid gap-5 text-sm sm:grid-cols-2">
      <div>
        <dt className="text-white/40">Rechtstreeks bellen</dt>
        <dd className="mt-1">
          <a href={site.phoneHref} className="inline-block py-2 text-lg text-white">{site.phone}</a>
        </dd>
      </div>
      <div>
        <dt className="text-white/40">Mailen</dt>
        <dd className="mt-1">
          <a href={`mailto:${site.email}`} className="inline-block py-2 text-lg text-white">{site.email}</a>
        </dd>
      </div>
    </dl>
  );
}

/** Small proof row under hero titles. */
export function MetaRow({ items, light }: { items: string[]; light: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm ${light ? "text-zinc-500" : "text-white/70"}`}>
      {items.map((it, i) => (
        <span key={it} className="flex items-center gap-4">
          {i > 0 && <span aria-hidden>·</span>}
          <span>{it}</span>
        </span>
      ))}
    </div>
  );
}

/** Filter chips — kit-styled pills (≥44px), horizontal snap rail on mobile. */
export function FilterChips({
  label,
  options,
  active,
  count,
  onPick,
  tone,
}: {
  label: string;
  options: string[];
  active: string;
  count: (o: string) => number;
  onPick: (o: string) => void;
  tone: FlowTone;
}) {
  const dark = tone === "dark";
  return (
    <FlowGrid>
      <div role="group" aria-label={label} className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {options.map((o) => {
          const on = o === active;
          const cls = on
            ? dark
              ? "bg-white text-zinc-950"
              : "bg-zinc-950 text-white"
            : dark
              ? "text-white/75 ring-1 ring-white/15 hover:ring-white/50"
              : "text-zinc-700 ring-1 ring-zinc-950/12 hover:ring-zinc-950/40";
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(o)}
              className={`inline-flex min-h-11 flex-none snap-start items-center gap-2 rounded-full px-4 text-sm whitespace-nowrap transition-colors ${cls}`}
            >
              {o}
              <span className={`font-mono text-[11px] tabular-nums ${on ? (dark ? "text-zinc-950/45" : "text-white/50") : dark ? "text-white/35" : "text-zinc-400"}`}>{count(o)}</span>
            </button>
          );
        })}
      </div>
    </FlowGrid>
  );
}

/**
 * The "next chapter" link: a full-bleed photo with a giant title — the film
 * simply continues into the next case or article.
 */
export function NextChapter({
  href,
  image,
  alt,
  eyebrow,
  title,
  body,
}: {
  href: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <FlowGrid>
      <Rise>
        <Link href={href} className="group relative isolate block min-h-[70svh] overflow-hidden rounded-[1.5rem] text-white sm:min-h-[80svh] sm:rounded-[2rem]">
          <ClipImage src={image} alt={alt} parallax sizes="100vw" className="absolute inset-0" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-zinc-950/20 transition-opacity duration-700 group-hover:opacity-90" />
          <span className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-6 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:p-14">
            <span className="max-w-4xl">
              <span className="block font-mono text-[11px] tracking-[0.22em] text-white/60 uppercase">{eyebrow}</span>
              <span className="mt-4 block text-[2.3rem] leading-[1] font-light tracking-[-0.045em] text-balance sm:text-6xl lg:text-[5.25rem]">{title}</span>
              {body && <span className="mt-5 block max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{body}</span>}
            </span>
            <span className="flex size-16 flex-none items-center justify-center rounded-full bg-white text-zinc-950 transition-transform duration-500 group-hover:translate-x-1 sm:size-20">
              <Arrow className="size-6" />
            </span>
          </span>
        </Link>
      </Rise>
    </FlowGrid>
  );
}

/* ------------------------------------------------------------------ */
/* Case detail                                                        */
/* ------------------------------------------------------------------ */

type Tones = { page: FlowTone; facts: FlowTone; story: [FlowTone, FlowTone, FlowTone]; service: FlowTone; next: FlowTone };

const TONES: Record<Version, Tones> = {
  1: { page: "light", facts: "light", story: ["light", "dark", "light"], service: "light", next: "light" },
  2: { page: "light", facts: "light", story: ["light", "paper", "light"], service: "light", next: "light" },
  3: { page: "dark", facts: "dark", story: ["dark", "dark", "paper"], service: "dark", next: "dark" },
};

const STORY_IMAGES = [
  { src: "/images/generated/strap-closeup.jpg", alt: "Een wiel wordt vastgezet met een spanband" },
  { src: "/images/generated/key-handover.jpg", alt: "De sleutels worden bij levering overhandigd" },
];

export default function CaseFlow({ data, version }: { data: CasePageData; version: Version }) {
  const { item, number, total, next, service, detailImage, facts, story } = data;
  const T = TONES[version];
  const crumbs = [{ href: "/", label: "Home" }, { href: "/cases", label: "Cases" }, { label: item.tag }];
  const nextNumber = String(cases.findIndex((c) => c.slug === next.slug) + 1).padStart(2, "0");

  // Chapter numbering: 01 dossier, then one per story beat, then dienst, then next.
  let n = 1;
  const num = () => String(++n).padStart(2, "0");

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={heroVariant(version)}
        title={item.title}
        intro={item.body}
        crumbs={crumbs}
        image={version === 2 ? STUDIO : item.image}
        imageAlt={version === 2 ? "Een Mcars-transporter in de studio" : item.imageAlt}
        wordmark="CASE"
        lineImages={[detailImage, STORY_IMAGES[0].src]}
        aside={<MetaRow light={version === 2} items={[`Case ${number} / ${total}`, item.tag, ...(item.route ? [item.route] : [])]} />}
        form={<QuoteFlow tone={formTone(version)} service={service?.nav} />}
      />

      {/* 01 — the file: type, traject, dienst */}
      <Chapter n="01" label="Het dossier" tone={T.facts}>
        <ChapterIntro lead="Een echte rit," trail="anoniem verteld." body={casesOverview.intro} />
        <FactsStrip facts={facts} tone={T.facts} />
      </Chapter>

      {/* 02–04 — situatie / aanpak / resultaat, handed over by a bridge and a curtain */}
      {story.map((s, i) => {
        const tone = T.story[i] ?? T.story[0];
        const prev = i === 0 ? T.facts : T.story[i - 1];
        const bridgeAfter = i === 0 && story.length > 1;
        const curtain = i > 0 && i !== 1 && tone !== prev;
        const label = s.label;
        const chapterN = num();
        return (
          <StoryBeat
            key={s.label}
            n={chapterN}
            label={label}
            body={s.body}
            index={i}
            total={story.length}
            tone={tone}
            curtain={curtain}
            bridge={bridgeAfter ? { ...STORY_IMAGES[0], to: T.story[1] } : undefined}
            image={i === story.length - 1 && story.length > 1 ? { src: detailImage, alt: service ? `${service.nav} door Mcars` : item.imageAlt } : undefined}
          />
        );
      })}

      {/* 05 — the related service */}
      {service && (
        <Chapter n={num()} label="De dienst" tone={T.service} curtain={T.service !== T.story[Math.min(story.length, 3) - 1]}>
          <ChapterIntro lead="Een gelijkaardig transport?" trail="Zo pakken we het aan." />
          <FlowGrid className="mt-12 sm:mt-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
              <ClipImage src={service.heroImage} alt={`${service.nav} door Mcars`} parallax sizes="(min-width:1024px) 55vw, 100vw" className="aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem]" />
              <div>
                <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${toneClasses(T.service).faint}`}>{service.category}</p>
                <h2 className="mt-5 text-3xl leading-[1.06] font-light tracking-[-0.035em] text-balance sm:text-5xl">{service.title}</h2>
                <p className={`mt-6 text-base leading-relaxed sm:text-lg ${toneClasses(T.service).muted}`}>{service.intro}</p>
                <div className="mt-8">
                  <FlowButton href={`/diensten/${service.slug}`} variant="ghost">Bekijk de dienst</FlowButton>
                </div>
              </div>
            </div>
          </FlowGrid>
        </Chapter>
      )}

      {/* 06 — the film continues: next case, full-bleed */}
      <Chapter n={num()} label="Volgende case" tone={T.next}>
        <ChapterIntro lead="De film loopt verder." trail="Nog een rit uit de praktijk." action={<FlowButton href="/cases" variant="ghost">Alle cases</FlowButton>} />
        <div className="mt-12 sm:mt-16">
          <NextChapter
            href={caseHref(next)}
            image={next.image}
            alt={next.imageAlt}
            eyebrow={`Case ${nextNumber} / ${total} · ${next.tag}`}
            title={next.title}
            body={next.route}
          />
        </div>
      </Chapter>

      <FlowClose
        lead="Een gelijkaardige rit"
        trail="voor uw wagen?"
        form={<QuoteFlow tone="dark" service={service?.nav} />}
        contact={<CloseContact />}
      />
    </FlowPage>
  );
}

function FactsStrip({ facts, tone }: { facts: CasePageData["facts"]; tone: FlowTone }) {
  const t = toneClasses(tone);
  return (
    <FlowGrid className="mt-14 sm:mt-20">
      <dl className={`grid border-t sm:grid-cols-3 ${t.line}`}>
        {facts.map((f, i) => (
          <Rise key={f.label} delay={i * 90} className={`border-b py-7 sm:py-10 sm:pr-6 ${t.line} ${i > 0 ? "sm:border-l sm:pl-6" : ""}`}>
            <dt className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.muted}`}>
              <span className={t.faint}>{String(i + 1).padStart(2, "0")}</span> · {f.label}
            </dt>
            <dd className="mt-4 text-2xl leading-tight font-light tracking-[-0.025em] sm:text-3xl">
              {f.href ? (
                <Link href={f.href} className={`inline-flex min-h-11 items-center gap-2 underline decoration-1 underline-offset-[6px] ${tone === "dark" ? "decoration-white/25 hover:decoration-white" : "decoration-zinc-950/20 hover:decoration-zinc-950"}`}>
                  {f.value}
                </Link>
              ) : (
                f.value
              )}
            </dd>
          </Rise>
        ))}
      </dl>
    </FlowGrid>
  );
}

function StoryBeat({
  n,
  label,
  body,
  index,
  total,
  tone,
  curtain,
  bridge,
  image,
}: {
  n: string;
  label: string;
  body: string;
  index: number;
  total: number;
  tone: FlowTone;
  curtain: boolean;
  bridge?: { src: string; alt: string; to: FlowTone };
  image?: { src: string; alt: string };
}) {
  const t = toneClasses(tone);
  return (
    <>
      <Chapter n={n} label={label} tone={tone} curtain={curtain} >
        <ChapterIntro
          lead={body}
          action={
            <p className={`flex w-full items-end gap-4 border-t pt-5 ${t.line}`}>
              <span className="font-[family-name:var(--font-display)] text-7xl leading-[0.8] sm:text-8xl">{String(index + 1).padStart(2, "0")}</span>
              <span className={`pb-1 font-mono text-[11px] tracking-[0.2em] uppercase ${t.muted}`}>
                {label}
                <br />
                <span className={t.faint}>{index + 1} van {total}</span>
              </span>
            </p>
          }
        />
        {image && (
          <FlowGrid className="mt-14 sm:mt-20">
            <ClipImage src={image.src} alt={image.alt} parallax sizes="100vw" className="aspect-[16/10] rounded-[1.5rem] sm:aspect-[21/9] sm:rounded-[2rem]" />
          </FlowGrid>
        )}
      </Chapter>
      {bridge && (
        <div>
          <ImageBridge src={bridge.src} alt={bridge.alt} from={tone} to={bridge.to} />
        </div>
      )}
    </>
  );
}

/** Thumbnail helper used by overview flows (kept here so all case/blog flows share one card). */
export function PhotoCard({
  href,
  image,
  alt,
  eyebrow,
  title,
  body,
  className = "",
  sizes = "(min-width:1024px) 30vw, 80vw",
}: {
  href: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  body?: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <Link href={href} className={`group relative isolate block overflow-hidden rounded-[1.5rem] text-white ${className}`}>
      <Image src={image} alt={alt} fill sizes={sizes} className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]" />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-zinc-950/5" />
      <span className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <span className="block font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">{eyebrow}</span>
        <span className="mt-2 block text-2xl leading-[1.1] font-light tracking-[-0.025em] text-balance">{title}</span>
        {body && <span className="mt-3 block text-sm leading-relaxed text-white/65">{body}</span>}
      </span>
      <span aria-hidden className="absolute top-5 right-5 flex size-11 items-center justify-center rounded-full bg-white/90 text-zinc-950 transition-transform duration-500 group-hover:translate-x-0.5">
        <Arrow />
      </span>
    </Link>
  );
}
