import Image from "next/image";
import Link from "next/link";
import { corridorRoutes, countryRoutes, flagAsset, getRoute } from "@/data/routes";
import EuropeNetwork from "./europe-network";
import Icon from "./icon";
import { Reveal } from "./scroll";
import { V3Arrow, V3Block, V3Button, V3Head, V3Hero } from "./v3-kit";

/*
 * Routes 03 — "Donker & premium". Black page: centred cinematic hero, big
 * figures, the dark animated Europe map, then an oversized destination list
 * and a grid of corridor cards.
 */

const pad = (n: number) => String(n).padStart(2, "0");

// Figures straight from the route data (Europa page) — no invented numbers.
const europa = getRoute("autotransport-europa");
const FIGURES = [
  { value: pad(countryRoutes.length), label: "bestemmingen" },
  { value: pad(corridorRoutes.length), label: "vaste corridors" },
  ...(europa?.stats.slice(0, 2) ?? []),
];

export default function RoutesIndexV3() {
  return (
    <>
      <V3Hero
        image="/fleet/hero-highway-sunset.jpg"
        crumbs={[{ href: "/", label: "Home" }, { label: "Routes" }]}
        title="Tot in elke uithoek van Europa."
        intro="Onze niche: België en Nederland richting Frankrijk tot Noord-Spanje. En verder rijden we overal naartoe."
      >
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <V3Button href="/offerte">Offerte aanvragen</V3Button>
          <V3Button href="#bestemmingen" variant="ghost">Alle bestemmingen</V3Button>
        </div>
      </V3Hero>

      {/* Big figures */}
      <V3Block className="pt-10 sm:pt-16">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-10 lg:grid-cols-4">
          {FIGURES.map((f, i) => (
            <Reveal key={f.label} delay={i * 90}>
              <dd className="text-6xl font-light tracking-[-0.05em] tabular-nums sm:text-7xl lg:text-8xl">{f.value}</dd>
              <dt className="mt-3 text-sm text-white/50">{f.label}</dt>
            </Reveal>
          ))}
        </dl>
      </V3Block>

      {/* Dark Europe map */}
      <div className="px-3 sm:px-6 lg:px-10">
        <EuropeNetwork eyebrow="Ons netwerk" title="Vanuit Roeselare, heel Europa door." />
      </div>

      {/* Destinations — oversized list */}
      <V3Block id="bestemmingen">
        <V3Head
          label="Bestemmingen"
          lead="Autotransport"
          trail="per bestemming."
          intro="Van dagelijkse ritten binnen België tot wekelijkse rondes door heel Frankrijk. Kies uw bestemming voor steden, frequentie en praktische info."
        />
        <ul className="border-t border-white/10">
          {countryRoutes.map((r, i) => (
            <Reveal as="li" key={r.slug} delay={i * 50} className="border-b border-white/10">
              <Link href={`/routes/${r.slug}`} className="group grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-2 py-7 sm:grid-cols-[3.5rem_1fr_auto_auto] sm:gap-x-8 sm:py-9">
                <span className="hidden text-sm tabular-nums text-white/35 sm:block">{pad(i + 1)}</span>
                <span className="min-w-0">
                  <span className="block text-4xl leading-none font-light tracking-[-0.04em] break-words transition-colors duration-300 group-hover:text-white sm:text-6xl lg:text-7xl">
                    {r.place!.name}
                  </span>
                  <span className="mt-3 block text-sm leading-relaxed text-white/45">{r.cities.slice(0, 5).join(" · ")}</span>
                </span>
                <span className="col-start-1 row-start-2 text-sm text-white/60 sm:col-start-auto sm:row-start-auto sm:text-right">{r.frequency}</span>
                <span className="row-span-2 flex size-11 flex-none items-center justify-center rounded-full border border-white/20 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-zinc-950 sm:row-span-1 sm:size-14">
                  <V3Arrow />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </V3Block>

      {/* Corridors — translucent cards */}
      <V3Block className="bg-zinc-900">
        <V3Head
          label="Vaste corridors"
          lead="Rechtstreeks"
          trail="tussen de landen."
          intro="Op deze assen rijden we op regelmatige basis. Uw wagen sluit aan op een bestaande rit — efficiënt, zonder omwegen."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {corridorRoutes.map((r, i) => (
            <Reveal as="li" key={r.slug} delay={(i % 3) * 80}>
              <Link href={`/routes/${r.slug}`} className="group flex h-full flex-col justify-between gap-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-white/30 hover:bg-white/[0.07] sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex items-center -space-x-2">
                    <Image src={flagAsset[r.from!.flag]} alt="" width={58} height={34} className="h-9 w-auto" />
                    <Image src={flagAsset[r.to!.flag]} alt="" width={58} height={34} className="h-9 w-auto" />
                  </span>
                  <span className="text-xs tracking-[0.18em] text-white/40 uppercase">{r.frequency}</span>
                </div>
                <div>
                  <h3 className="text-3xl leading-tight font-light tracking-[-0.03em]">
                    {r.from!.name}
                    <span className="block text-white/40">→ {r.to!.name}</span>
                  </h3>
                  <span className="mt-6 flex min-h-11 items-center gap-2 text-sm text-white/70 group-hover:text-white">
                    <Icon name="route" className="size-4" /> Van deur tot deur <V3Arrow className="ml-auto size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </V3Block>
    </>
  );
}
