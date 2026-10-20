import { corridorRoutes, countryRoutes, getRoute } from "@/data/routes";
import EuropeNetwork from "./europe-network";
import { Reveal } from "./scroll";
import { HorizontalRail, HoverRevealList } from "./signature";
import { V3Block, V3Button, V3Head, V3Hero } from "./v3-kit";

/*
 * Routes 03 — "Donker & premium". Black page: centred cinematic hero, big
 * figures, the dark animated Europe map, then oversized destination names
 * with a floating photo and a pinned, sideways-scrolling corridor rail.
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

      {/* Destinations — oversized names; the destination photo floats beside the cursor */}
      <V3Block id="bestemmingen">
        <V3Head
          label="Bestemmingen"
          lead="Autotransport"
          trail="per bestemming."
          intro="Van dagelijkse ritten binnen België tot wekelijkse rondes door heel Frankrijk. Kies uw bestemming voor steden, frequentie en praktische info."
        />
        <HoverRevealList
          tone="dark"
          items={countryRoutes.map((r) => ({
            title: r.place!.name,
            body: `${r.frequency} · ${r.cities.slice(0, 5).join(" · ")}`,
            image: r.heroImage,
            href: `/routes/${r.slug}`,
          }))}
        />
      </V3Block>

      {/* Corridors — pinned rail; the corridor photos travel sideways as you scroll */}
      <section className="bg-zinc-900 px-5 pt-20 sm:px-10 sm:pt-32 lg:px-14">
        <V3Head
          label="Vaste corridors"
          lead="Rechtstreeks"
          trail="tussen de landen."
          intro="Op deze assen rijden we op regelmatige basis. Uw wagen sluit aan op een bestaande rit — efficiënt, zonder omwegen."
        />
        <HorizontalRail
          items={corridorRoutes.map((r) => ({
            title: `${r.from!.name} → ${r.to!.name}`,
            body: r.subtitle,
            image: r.heroImage,
            alt: `${r.nav} met Mcars`,
            meta: r.frequency,
            href: `/routes/${r.slug}`,
          }))}
        />
        <div className="h-20 lg:h-8" />
      </section>
    </>
  );
}
