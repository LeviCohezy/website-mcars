"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { corridorRoutes, countryRoutes, flagAsset, routes, type Route } from "@/data/routes";
import Icon from "./icon";
import { Reveal } from "./scroll";
import { V2Arrow, V2Block, V2Button, V2Head, V2Hero } from "./v2-kit";

/*
 * Routes 02 — "Licht & strak". White Swiss grid with a client-side filter
 * chip bar above listing cards (photo, title, meta chips, round arrow), then
 * a bordered city index per country.
 */

type FilterId = "alle" | "binnenland" | "vanuit" | "naar" | "europa";

const isEuropa = (r: Route) => r.slug === "autotransport-europa";

/** Every route lands in exactly one group. */
function groupOf(r: Route): Exclude<FilterId, "alle"> {
  if (r.kind === "country") return r.place?.flag === "belgie" && !isEuropa(r) ? "binnenland" : "europa";
  if (r.from?.flag === "belgie") return "vanuit";
  if (r.to?.flag === "belgie") return "naar";
  return "europa";
}

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "alle", label: "Alle routes" },
  { id: "binnenland", label: "Binnenland" },
  { id: "vanuit", label: "Vanuit België" },
  { id: "naar", label: "Naar België" },
  { id: "europa", label: "Europa" },
];

const countIn = (id: FilterId) => (id === "alle" ? routes.length : routes.filter((r) => groupOf(r) === id).length);

function Flags({ r }: { r: Route }) {
  if (isEuropa(r)) {
    return (
      <span className="flex size-9 items-center justify-center rounded-md bg-white text-zinc-950">
        <Icon name="globe" className="size-5" />
      </span>
    );
  }
  const flags = r.kind === "country" ? [r.place!.flag] : [r.from!.flag, r.to!.flag];
  return (
    <span className="flex items-center -space-x-2">
      {flags.map((f) => (
        <Image key={f} src={flagAsset[f]} alt="" width={58} height={34} className="h-8 w-auto" />
      ))}
    </span>
  );
}

export default function RoutesIndexV2() {
  const [filter, setFilter] = useState<FilterId>("alle");
  const shown = filter === "alle" ? routes : routes.filter((r) => groupOf(r) === filter);

  return (
    <div className="bg-white text-zinc-950">
      <V2Hero
        crumbs={[{ href: "/", label: "Home" }, { label: "Routes" }]}
        title="Tot in elke uithoek van Europa."
        count={String(routes.length).padStart(2, "0")}
        intro="Onze niche: België en Nederland richting Frankrijk tot Noord-Spanje. En verder rijden we overal naartoe."
      >
        <dl className="mt-8 grid max-w-xl grid-cols-2 border-t border-l border-zinc-200">
          <div className="border-r border-b border-zinc-200 p-5">
            <dd className="text-4xl font-light tracking-[-0.04em] tabular-nums">{countryRoutes.length}</dd>
            <dt className="mt-1 text-sm text-zinc-500">bestemmingen</dt>
          </div>
          <div className="border-r border-b border-zinc-200 p-5">
            <dd className="text-4xl font-light tracking-[-0.04em] tabular-nums">{corridorRoutes.length}</dd>
            <dt className="mt-1 text-sm text-zinc-500">vaste corridors</dt>
          </div>
        </dl>
      </V2Hero>

      {/* 01 · Filterable listing */}
      <V2Block id="routes-lijst" className="pt-8 sm:pt-12">
        <div className="sticky top-24 z-10 -mx-5 border-y border-zinc-200 bg-white/90 px-5 py-3 backdrop-blur-md sm:-mx-12 sm:px-12 lg:-mx-16 lg:px-16">
          <div role="group" aria-label="Filter routes" className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 [scrollbar-width:none]">
            {FILTERS.map((f) => {
              const on = f.id === filter;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.id)}
                  className={`inline-flex min-h-11 flex-none snap-start items-center gap-2 rounded-lg border px-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    on ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 text-zinc-700 hover:border-zinc-950"
                  }`}
                >
                  {f.label}
                  <span className={`tabular-nums ${on ? "text-white/50" : "text-zinc-400"}`}>{countIn(f.id)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-8 text-sm text-zinc-500" aria-live="polite">
          {shown.length} {shown.length === 1 ? "route" : "routes"}
        </p>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r) => (
            <li key={r.slug}>
              <Link href={`/routes/${r.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 transition-colors hover:border-zinc-950">
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                  <Image
                    src={r.heroImage}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-3 left-3 rounded-md bg-white/95 p-1.5">
                    <Flags r={r} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl leading-snug font-medium tracking-tight">
                    {r.kind === "corridor" ? (
                      <>
                        {r.from!.name} <span className="text-zinc-400">→</span> {r.to!.name}
                      </>
                    ) : (
                      r.nav
                    )}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{r.subtitle}</p>
                  <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                    <ul className="flex flex-wrap gap-1.5">
                      <li className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs text-zinc-700">{r.frequency}</li>
                      {r.kind === "country" && (
                        <li className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs text-zinc-700">{r.cities.length} {isEuropa(r) ? "landen" : "steden"}</li>
                      )}
                      {r.kind === "corridor" && <li className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs text-zinc-700">Van deur tot deur</li>}
                    </ul>
                    <span className="flex size-11 flex-none items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white">
                      <V2Arrow />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </V2Block>

      {/* 02 · City index per country */}
      <V2Block className="pt-0 sm:pt-0">
        <V2Head
          index="02"
          label="Werkgebied"
          lead="Waar we"
          trail="ophalen en leveren."
          intro="Een greep uit de plaatsen waar we regelmatig rijden. Staat uw adres er niet bij? Vraag het gerust — we rijden overal naartoe."
        />
        <ul className="border-t border-zinc-950">
          {countryRoutes.map((r, i) => (
            <Reveal as="li" key={r.slug} delay={i * 50} className="grid gap-3 border-b border-zinc-200 py-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
              <Link href={`/routes/${r.slug}`} className="flex min-h-11 items-center gap-3 text-lg font-medium tracking-tight hover:underline">
                {r.place!.name}
                <span className="text-sm font-normal text-zinc-400">{r.frequency}</span>
              </Link>
              <p className="text-[0.95rem] leading-relaxed text-zinc-500">{r.cities.join(" · ")}</p>
            </Reveal>
          ))}
        </ul>
        <div className="mt-10">
          <V2Button href="/offerte">Offerte voor uw route</V2Button>
        </div>
      </V2Block>
    </div>
  );
}
