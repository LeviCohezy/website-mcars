import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import Section from "@/components/section";
import { HorizontalRail, HoverRevealList, TypeMarquee } from "@/components/signature";
import { SectionHeader } from "@/components/ui";
import VariantSwitcher from "@/components/variant-switcher";
import { corridorRoutes, countryRoutes } from "@/data/routes";

export const metadata: Metadata = {
  title: "Bestemmingen & routes — autotransport door Europa | Mcars",
  description:
    "Autotransport in België, Nederland, Frankrijk, Spanje, Italië en heel Europa, plus vaste corridors tussen de landen. Bekijk alle routes van Mcars.",
};

export default function RoutesOverview() {
  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow="Bestemmingen & routes"
        title="Tot in elke uithoek van Europa."
        subtitle="Onze niche: België en Nederland richting Frankrijk tot Noord-Spanje. En verder rijden we overal naartoe."
        crumbs={[{ label: "Routes" }]}
        video="/hero.mp4"
        badges={[{ label: `${countryRoutes.length} bestemmingen` }, { label: `${corridorRoutes.length} vaste corridors` }]}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* Countries — pinned rail of destination photos on a dark panel */}
      <Section space="loose" bleed>
        <div className="rounded-[2rem] bg-zinc-950 px-5 sm:px-10 lg:px-14">
              <div className="flex flex-col gap-6 pt-16 sm:pt-20 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/60 uppercase">
                    <span aria-hidden className="size-1.5 rounded-full bg-white" />
                    Landen · 01
                  </p>
                  <h2 className="mt-5 max-w-3xl text-4xl leading-[1.04] font-light tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
                    Autotransport <span className="text-white/45">per bestemming.</span>
                  </h2>
                </div>
                <p className="max-w-sm text-base leading-relaxed text-white/60">
                  Van dagelijkse ritten binnen België tot wekelijkse rondes door heel Frankrijk. Kies uw bestemming voor steden, frequentie en praktische info.
                </p>
              </div>
          <HorizontalRail
            items={countryRoutes.map((r) => ({
              title: r.place!.name,
              body: `${r.frequency} · ${r.cities.slice(0, 3).join(", ")}`,
              image: r.heroImage,
              alt: `${r.nav} met Mcars`,
              meta: `${r.cities.length} ${r.slug === "autotransport-europa" ? "landen" : "steden"}`,
              href: `/routes/${r.slug}`,
            }))}
          />
          <div className="h-10 lg:h-4" />
        </div>
      </Section>

      {/* Country names running past, with photo pills */}
      <Section space="none" bleed>
        <TypeMarquee
          words={countryRoutes.map((r) => r.place!.name)}
          images={["/fleet/germany-autobahn.jpg", "/images/generated/alpine-pass.jpg", "/fleet/spain-palms.jpg", "/images/generated/flemish-square.jpg"]}
        />
        <p className="px-5 pt-2 text-center text-sm text-zinc-500 sm:px-8">Elke week heel Frankrijk door, met vaste stops onderweg — van Roeselare tot Noord-Spanje.</p>
      </Section>

      {/* Corridors — big rows, the photo follows the cursor */}
      <Section space="loose">
        <SectionHeader
          label="Vaste corridors"
          index="02"
          lead="Rechtstreeks"
          trail="tussen de landen."
          intro="Op deze assen rijden we op regelmatige basis. Uw wagen sluit aan op een bestaande rit — efficiënt, zonder omwegen."
          className="mb-14"
        />
        <HoverRevealList
          items={corridorRoutes.map((r) => ({
            title: `${r.from!.name} → ${r.to!.name}`,
            body: r.subtitle,
            image: r.heroImage,
            meta: r.frequency,
            href: `/routes/${r.slug}`,
          }))}
        />
      </Section>

      <QuoteCta />
      <VariantSwitcher sectionId="routes" />
    </PageShell>
  );
}
