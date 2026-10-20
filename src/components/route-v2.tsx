"use client";

import Image from "next/image";
import { useState } from "react";
import { flagAsset, type Place } from "@/data/routes";
import type { IconKey } from "@/data/services";
import type { RoutePageData } from "@/lib/route-page";
import { site } from "@/lib/site";
import HeroQuoteBar from "./hero-quote-bar";
import Icon from "./icon";
import { Reveal } from "./scroll";
import { HorizontalRail, StackedCards, TypeMarquee } from "./signature";
import { V2Arrow, V2Block, V2Button, V2Head, V2Hero } from "./v2-kit";

/*
 * Route 02 — "Licht & strak". White Swiss grid: light hero, photo + quote
 * cell, a route spec sheet, running city names over a bordered city grid,
 * stacking highlight cards, boxed FAQ and a sideways related rail.
 * Same content as Route 01 (see lib/route-page).
 */

export default function RouteV2({ data }: { data: RoutePageData }) {
  const { route, isCorridor, from, to, place, related, quote, specs } = data;

  return (
    <div className="bg-white text-zinc-950">
      {/* 1 · Hero — breadcrumb, huge light title, corridor flags + meta */}
      <V2Hero
        crumbs={[{ href: "/", label: "Home" }, { href: "/routes", label: "Routes" }, { label: route.nav }]}
        title={route.title}
        intro={route.subtitle}
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          {isCorridor && from && to && (
            <span className="flex flex-wrap items-center gap-3">
              <FlagLabel place={from} />
              <V2Arrow className="size-4 text-zinc-400" />
              <FlagLabel place={to} />
            </span>
          )}
          <span className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm text-zinc-700">
            <Icon name="clock" className="size-4 text-zinc-950" /> {route.frequency}
          </span>
          <span className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm text-zinc-700">
            <Icon name="shield" className="size-4 text-zinc-950" /> Verzekerd, met CMR
          </span>
        </div>
      </V2Hero>

      {/* 2 · Photo cell + quote cell */}
      <section id="prijs" className="scroll-mt-24 px-5 sm:px-12 lg:px-16">
        <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
          <div className="relative min-h-[18rem] overflow-hidden rounded-xl bg-zinc-950 sm:min-h-[26rem] lg:min-h-[34rem]">
            <Image src={route.heroImage} alt={`${route.nav} met Mcars`} fill priority sizes="(min-width: 1024px) 62vw, 100vw" className="object-cover" />
            <span className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-1.5 text-xs font-medium tracking-[0.14em] text-zinc-950 uppercase">
              {isCorridor ? "Vaste corridor" : "Bestemming"}
            </span>
          </div>
          <div className="flex flex-col justify-end rounded-xl bg-zinc-100 p-3 sm:p-4">
            <HeroQuoteBar layout="panel" title={quote.title} subtitle="Vrijblijvend, antwoord binnen 24 uur." service={route.nav} defaults={quote.defaults} className="!shadow-none" />
          </div>
        </div>
      </section>

      {/* 3 · Overview — intro + figures left, spec sheet right */}
      <V2Block>
        <V2Head index="01" label="Routefiche" lead={isCorridor ? "Deze route" : "Deze bestemming"} trail="in één oogopslag." />
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal className="flex flex-col">
            <p className="text-2xl leading-[1.3] font-light tracking-[-0.02em] text-pretty sm:text-3xl">{route.intro}</p>
            <dl className="mt-10 grid overflow-hidden rounded-xl border border-zinc-200 sm:mt-auto sm:grid-cols-3">
              {route.stats.map((s, i) => (
                <div key={s.label} className={`p-5 sm:p-6 ${i > 0 ? "border-t border-zinc-200 sm:border-t-0 sm:border-l" : ""}`}>
                  <dd className="text-2xl font-medium tracking-tight break-words lg:text-3xl">{s.value}</dd>
                  <dt className="mt-1 text-sm text-zinc-500">{s.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={100}>
            <div className="overflow-hidden rounded-xl border border-zinc-950">
              <p className="flex items-center justify-between bg-zinc-950 px-5 py-4 text-sm font-medium text-white sm:px-6">
                {route.nav}
                <span className="text-xs tracking-[0.18em] text-white/50 uppercase">Specificaties</span>
              </p>
              <dl>
                {specs.map((s, i) => (
                  <div key={s.label} className={`grid gap-1 px-5 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6 sm:px-6 ${i > 0 ? "border-t border-zinc-200" : ""}`}>
                    <dt className="text-xs font-medium tracking-[0.14em] text-zinc-500 uppercase sm:pt-0.5">{s.label}</dt>
                    <dd className="text-[0.95rem] text-zinc-950">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </V2Block>

      {/* 4 · Cities — Swiss grid of bordered cells */}
      <V2Block className="bg-zinc-100">
        <V2Head
          index="02"
          label={isCorridor ? "Ophaal- en leverpunten" : "Waar we rijden"}
          lead={isCorridor ? "Van deur tot deur," : `Actief in heel ${place?.name ?? ""},`}
          trail="waar u ook zit."
        />
        <div aria-hidden className="-mx-5 mb-10 sm:-mx-12 lg:-mx-16">
          <TypeMarquee words={route.cities.slice(0, 6)} images={[route.detailImage ?? route.heroImage, "/images/generated/pickup-inspection.jpg", "/images/generated/key-handover.jpg"]} speed={50} />
        </div>
        <ul className="grid grid-cols-2 overflow-hidden rounded-xl border-t border-l border-zinc-200 bg-white sm:grid-cols-3 lg:grid-cols-4">
          {route.cities.map((c, i) => (
            <Reveal as="li" key={c} delay={i * 30} className="flex min-h-28 flex-col justify-between gap-6 border-r border-b border-zinc-200 p-5 sm:min-h-32 sm:p-6">
              <span className="text-xs text-zinc-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-lg font-medium tracking-tight break-words sm:text-xl">{c}</span>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-3 flex flex-col items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
          <p className="text-base leading-relaxed text-zinc-600">Uw stad of adres er niet bij? Geen probleem — we halen op en leveren waar u het nodig heeft.</p>
          <V2Button href="#prijs">Prijs aanvragen</V2Button>
        </Reveal>
      </V2Block>

      {/* 5 · Why Mcars — bordered row of cells */}
      <V2Block>
        <V2Head index="03" label="Waarom Mcars" lead="Uw wagen" trail="in vertrouwde handen." />
        <StackedCards radius="rounded-md" items={route.highlights.map((h, i) => ({ title: h.title, body: h.body, image: routeHighlightImage(h.icon, i) }))} />
        <Reveal className="mt-3 flex flex-col items-start justify-between gap-4 rounded-xl bg-zinc-950 p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <p className="text-lg">Klaar om deze route te boeken? U krijgt binnen 24 uur een persoonlijk antwoord.</p>
          <a href="#prijs" className="inline-flex min-h-11 flex-none items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
            Prijs aanvragen <V2Arrow />
          </a>
        </Reveal>
      </V2Block>

      {/* 6 · FAQ — boxed accordion beside contact details */}
      <V2Block className="pt-0 sm:pt-0">
        <V2Head index="04" label="FAQ" lead="Vragen over" trail={isCorridor ? "deze route." : "deze bestemming."} />
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Reveal className="order-last lg:order-none">
            <p className="text-sm text-zinc-500">Staat uw vraag er niet bij?</p>
            <a href={site.phoneHref} className="mt-3 block text-2xl font-medium tracking-tight hover:underline">{site.phone}</a>
            <a href={`mailto:${site.email}`} className="mt-1 block break-words text-zinc-600 hover:text-zinc-950">{site.email}</a>
            <p className="mt-4 text-sm text-zinc-400">{site.hours}</p>
            <div className="mt-6">
              <V2Button href="/contact" variant="outline">Contact opnemen</V2Button>
            </div>
          </Reveal>
          <BoxedFaq items={route.faq} />
        </div>
      </V2Block>

      {/* 7 · Related — pinned rail of photo cards that travel sideways */}
      {related.length > 0 && (
        <section className="px-5 sm:px-12 lg:px-16">
          <V2Head index="05" label="Ontdek ook" lead="Andere routes" trail="en diensten." />
          <HorizontalRail
            radius="rounded-md"
            items={related.map((r) => ({ title: r.label, body: r.sub, image: r.image, meta: r.meta, href: r.href }))}
          />
          <div className="h-16 lg:h-0" />
        </section>
      )}
    </div>
  );
}

function FlagLabel({ place }: { place: Place }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image src={flagAsset[place.flag]} alt="" width={64} height={64} className="h-8 w-auto" />
      <span className="text-sm font-medium text-zinc-950">{place.name}</span>
    </span>
  );
}

/** Light boxed accordion — shared by the 02 route and werkwijze pages. */
export function BoxedFaq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-2">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className={`rounded-lg border transition-colors ${isOpen ? "border-zinc-950 bg-zinc-50" : "border-zinc-200"}`}>
            <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex min-h-11 w-full items-center gap-5 px-5 py-5 text-left sm:px-6">
              <span className="flex-1 text-lg font-medium tracking-tight">{f.q}</span>
              <span className={`flex size-7 flex-none items-center justify-center rounded-md transition-colors ${isOpen ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-600"}`}>
                <svg className={`size-3.5 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
              </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="max-w-2xl px-5 pb-6 text-base leading-relaxed text-zinc-600 sm:px-6">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** A photo per route highlight, chosen by what it is about (shared with Route 03). */
export function routeHighlightImage(icon: IconKey, i: number) {
  const byIcon: Partial<Record<IconKey, string>> = {
    shield: "/images/generated/pickup-inspection.jpg",
    users: "/images/generated/driver-portrait.jpg",
    truck: "/images/generated/dealer-loading.jpg",
    map: "/images/generated/aerial-motorway.jpg",
    globe: "/images/generated/alpine-pass.jpg",
    clock: "/images/generated/planning-office.jpg",
    route: "/images/generated/night-motorway.jpg",
  };
  return byIcon[icon] ?? ["/images/generated/depot-night.jpg", "/images/generated/team-depot.jpg", "/images/generated/truck-studio.jpg"][i % 3];
}
