import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MediaBand, QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Reveal } from "@/components/scroll";
import RoutesNetwork from "@/components/routes-network";
import RoutesReach from "@/components/routes-reach";
import Section from "@/components/section";
import { SectionHeader } from "@/components/ui";
import { corridorRoutes, countryRoutes, flagAsset } from "@/data/routes";

export const metadata: Metadata = {
  title: "Bestemmingen & routes — autotransport door Europa | Mcars",
  description:
    "Autotransport in België, Nederland, Frankrijk, Spanje, Italië en heel Europa, plus vaste corridors tussen de landen. Bekijk alle routes van Mcars.",
};

const Arrow = () => (
  <span className="flex size-9 flex-none items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors duration-300 group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white">
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  </span>
);

export default function RoutesOverview() {
  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow="Bestemmingen & routes"
        title={
          <>
            Vanuit België.
            <br />
            Door heel Europa.
            <br />
            <span className="text-white/55">Elke week.</span>
          </>
        }
        subtitle="Onze niche: België en Nederland richting Frankrijk tot Noord-Spanje. En verder rijden we overal naartoe."
        crumbs={[{ label: "Routes" }]}
        video="/hero.mp4"
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
        marquee={false}
        reviews
      />

      <RoutesReach corridors={corridorRoutes.length} />

      {/* Countries — ruled index */}
      <Section space="loose">
        <SectionHeader
          label="Landen"
          index="01"
          lead="Autotransport"
          trail="per bestemming."
          intro="Van dagelijkse ritten binnen België tot wekelijkse rondes door heel Frankrijk. Kies uw bestemming voor steden, frequentie en praktische info."
          className="mb-14"
        />
        <ul className="border-t border-zinc-950">
          {countryRoutes.map((r, i) => (
            <Reveal as="li" key={r.slug} delay={i * 50} className="border-b border-zinc-200">
              <Link href={`/routes/${r.slug}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 sm:grid-cols-[3rem_6rem_1fr_1fr_auto] sm:gap-8">
                <span className="hidden text-xs font-medium tabular-nums text-zinc-400 sm:block">{String(i + 1).padStart(2, "0")}</span>
                <Image src={flagAsset[r.place!.flag]} alt="" width={96} height={64} className="h-10 w-auto sm:h-12" />
                <span className="text-2xl font-medium tracking-tight text-zinc-950 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:translate-x-1 sm:text-3xl">
                  {r.place!.name}
                </span>
                <span className="hidden text-sm text-zinc-500 sm:block">
                  {r.frequency} · {r.cities.length} steden
                </span>
                <Arrow />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section space="none" bleed>
        <MediaBand image="/fleet/germany-autobahn.jpg" line="Elke week heel Frankrijk door, met vaste stops onderweg." caption="Van Roeselare tot Noord-Spanje" />
      </Section>

      {/* Corridors — pinned sequence: pills → black wipe → route finder on a globe */}
      <RoutesNetwork corridors={corridorRoutes.map((r) => ({ slug: r.slug, fixed: Boolean(r.fixed) }))} />

      <QuoteCta />
    </PageShell>
  );
}
