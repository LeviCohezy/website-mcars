"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { flagAsset } from "@/data/routes";
import type { RoutePageData } from "@/lib/route-page";
import { site } from "@/lib/site";
import HeroQuoteBar from "./hero-quote-bar";
import Icon from "./icon";
import { routeHighlightImage } from "./route-v2";
import { Reveal } from "./scroll";
import { ImageAccordion, StickyStory } from "./signature";
import { V3Arrow, V3Block, V3Button, V3Head, V3Star } from "./v3-kit";

/*
 * Route 03 — "Donker & premium". FREIGHT-style hero (full-bleed photo, title
 * bottom-left, short copy + CTA bottom-right), a glass quote strip, oversized
 * figures and city names, a sticky photo that swaps per reason and opening
 * photo panels for related pages. Same content
 * as Route 01 (see lib/route-page).
 */

export default function RouteV3({ data }: { data: RoutePageData }) {
  const { route, isCorridor, from, to, place, related, detailImage, quote, specs } = data;

  return (
    // Same canvas as <V3Page>, but overflow-clip: overflow-hidden would turn it
    // into a scroll container and break the sticky panels inside.
    <div className="overflow-clip rounded-[1rem] bg-zinc-950 text-white">
      {/* 1 · Hero — full-bleed photo, title bottom-left, copy + CTA bottom-right */}
      <section className="relative flex min-h-[calc(100svh-1rem)] flex-col justify-end px-5 pt-36 pb-10 sm:px-10 sm:pb-14 lg:px-14">
        <Image src={route.heroImage} alt={`${route.nav} met Mcars`} fill priority sizes="100vw" className="object-cover opacity-75" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-zinc-950/50" />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-end lg:gap-16">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-white/55">
              <Link href="/routes" className="hover:text-white">Routes</Link>
              <span aria-hidden>/</span>
              <span className="text-white/85">{isCorridor ? "Vaste corridor" : "Bestemming"}</span>
            </nav>
            <h1 className="mt-6 max-w-5xl text-[2.75rem] leading-[0.98] font-light tracking-[-0.045em] text-balance break-words sm:text-7xl lg:text-[6.5rem]">
              {route.title}
            </h1>
          </div>
          <div className="border-t border-white/20 pt-6">
            {isCorridor && from && to && (
              <p className="mb-5 flex flex-wrap items-center gap-3 text-sm text-white/85">
                <Image src={flagAsset[from.flag]} alt="" width={64} height={64} className="h-7 w-auto" />
                {from.name}
                <V3Arrow className="size-4 text-white/50" />
                <Image src={flagAsset[to.flag]} alt="" width={64} height={64} className="h-7 w-auto" />
                {to.name}
              </p>
            )}
            <p className="text-base leading-relaxed text-white/70">{route.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <V3Button href="#prijs">Prijs aanvragen</V3Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Quote strip — glass bar + proof */}
      <section id="prijs" className="scroll-mt-24 border-y border-white/10 px-5 py-10 sm:px-10 sm:py-12 lg:px-14">
        <div className="grid gap-6 lg:grid-cols-[14rem_1fr] lg:items-center lg:gap-10">
          <p className="text-lg leading-snug font-light tracking-tight">{quote.title}<span className="block text-white/40">antwoord binnen 24 uur.</span></p>
          <HeroQuoteBar service={route.nav} defaults={quote.defaults} className="!max-w-none" />
        </div>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60 lg:pl-[16.5rem]">
          <Link href="/reviews" className="flex min-h-11 items-center gap-2 hover:text-white">
            <V3Star /> <span className="font-medium text-white">{site.reviews.score}/5</span> op Google
          </Link>
          <span className="flex min-h-11 items-center gap-2"><Icon name="shield" className="size-4 text-white" /> Verzekerd, met CMR</span>
          <span className="flex min-h-11 items-center gap-2"><Icon name="clock" className="size-4 text-white" /> {route.frequency}</span>
        </div>
      </section>

      {/* 3 · Overview — statement + oversized figures */}
      <V3Block>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">{isCorridor ? "Over deze route" : "Over deze bestemming"}</p>
            <dl className="mt-6 border-t border-white/10">
              {specs.filter((s) => s.label !== "Type").map((s) => (
                <div key={s.label} className="grid gap-1 border-b border-white/10 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
                  <dt className="text-xs tracking-[0.14em] text-white/40 uppercase sm:pt-0.5">{s.label}</dt>
                  <dd className="text-sm text-white/80">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal>
            <p className="text-3xl leading-[1.25] font-light tracking-[-0.025em] text-pretty sm:text-4xl lg:text-[2.8rem]">{route.intro}</p>
          </Reveal>
        </div>
        <dl className="mt-16 grid gap-10 border-t border-white/10 pt-10 sm:mt-20 sm:grid-cols-3">
          {route.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="min-w-0">
              <dd className="text-5xl font-light tracking-[-0.045em] break-words sm:text-5xl lg:text-7xl">{s.value}</dd>
              <dt className="mt-3 text-sm text-white/50">{s.label}</dt>
            </Reveal>
          ))}
        </dl>
      </V3Block>

      {/* 4 · Cities — oversized names over a dimmed photo */}
      <section className="relative overflow-hidden">
        <Image src={route.heroImage} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/70 to-zinc-950" />
        <V3Block className="relative">
          <V3Head
            label={isCorridor ? "Ophaal- en leverpunten" : "Waar we rijden"}
            lead={isCorridor ? "Van deur tot deur," : `Actief in heel ${place?.name ?? ""},`}
            trail="waar u ook zit."
          />
          <ul className="grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {route.cities.map((c, i) => (
              <Reveal as="li" key={c} delay={i * 30} className="flex items-baseline gap-4 border-b border-white/10 py-5 sm:pr-6">
                <span className="w-7 flex-none text-xs text-white/30 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 text-3xl font-light tracking-[-0.03em] break-words sm:text-4xl">{c}</span>
              </Reveal>
            ))}
          </ul>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/50">
            Uw stad of adres er niet bij? Geen probleem — we halen op en leveren waar u het nodig heeft.
          </p>
        </V3Block>
      </section>

      {/* 5 · Why Mcars — the sticky photo swaps as each reason scrolls past */}
      <V3Block>
        <V3Head label="Waarom Mcars" lead="Uw wagen" trail="in vertrouwde handen." />
        <StickyStory
          tone="dark"
          steps={route.highlights.map((h, i) => ({
            title: h.title,
            body: h.body,
            image: i === 0 ? detailImage : routeHighlightImage(h.icon, i),
            meta: `Reden ${String(i + 1).padStart(2, "0")}`,
          }))}
        />
      </V3Block>

      {/* 6 · FAQ — dark numbered accordion */}
      <V3Block className="bg-zinc-900">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <V3Head label="FAQ" lead="Vragen over" trail={isCorridor ? "deze route." : "deze bestemming."} />
            <Reveal className="-mt-6 text-white/60">
              Staat uw vraag er niet bij? Bel{" "}
              <a href={site.phoneHref} className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{site.phone}</a>
              {" "}of mail{" "}
              <a href={`mailto:${site.email}`} className="break-words text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{site.email}</a>.
            </Reveal>
          </div>
          <DarkFaq items={route.faq} />
        </div>
      </V3Block>

      {/* 7 · Related — photo panels; the active one opens */}
      {related.length > 0 && (
        <V3Block>
          <V3Head label="Ontdek ook" lead="Andere routes" trail="en diensten." />
          <ImageAccordion items={related.map((r) => ({ title: r.label, body: r.sub, image: r.image, meta: r.meta, href: r.href }))} />
        </V3Block>
      )}
    </div>
  );
}

/** Dark numbered accordion — shared by the 03 route and werkwijze pages. */
export function DarkFaq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-b border-white/10">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-t border-white/10">
            <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex min-h-11 w-full items-baseline gap-4 py-7 text-left sm:gap-6">
              <span className="w-6 flex-none text-sm text-white/30 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
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
