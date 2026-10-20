import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import Section from "@/components/section";
import { HorizontalRail, StackedCards, TypeMarquee } from "@/components/signature";
import { SectionHeader } from "@/components/ui";
import VariantSwitcher from "@/components/variant-switcher";
import { defaultProcess, defaultVehicleTypes, services } from "@/data/services";

/** One photo per step of the shared process. */
const STEP_IMAGES = [
  "/images/generated/customer-update.jpg",
  "/images/generated/planning-office.jpg",
  "/images/generated/pickup-inspection.jpg",
  "/images/generated/key-handover.jpg",
];

export const metadata: Metadata = {
  title: "Diensten — autotransport op maat | Mcars",
  description:
    "Van particulier transport tot fleet, import, export, oldtimers en spoed. Ontdek alle autotransportdiensten van Mcars in België en Europa.",
};

export default function DienstenOverview() {
  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow="Onze diensten"
        title="Voor elk voertuig de juiste aanpak."
        subtitle="Van één particuliere wagen tot een volledig wagenpark — transportoplossingen in België en heel Europa."
        crumbs={[{ label: "Diensten" }]}
        image="/fleet/sunset-parking.jpg"
        badges={[{ label: `${services.length} diensten` }, { label: "Eén aanspreekpunt" }]}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* 01 · Services — pinned horizontal rail of photo cards */}
      <Section space="loose" bleed>
        {/* Cards are kept a touch smaller here so heading + row fit one screen. */}
        <div className="rounded-[2rem] bg-zinc-950 px-5 py-16 text-white sm:px-10 lg:px-14 lg:py-0 lg:[&_.snap-start]:w-[21rem]">
          <HorizontalRail
            heading={
              <div className="grid gap-6 pt-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
                <h2 className="text-4xl leading-[1.05] font-light tracking-[-0.03em] text-balance sm:text-5xl">
                  Elf manieren om uw wagen te verplaatsen, <span className="text-white/40">één team dat het regelt.</span>
                </h2>
                <p className="max-w-lg text-base leading-relaxed text-white/60">
                  Of het nu gaat om een gezinswagen, een voorraad voor de showroom of een klassieker die niet meer rijdt: u spreekt met de mensen die de rit ook effectief uitvoeren.
                </p>
              </div>
            }
            items={services.map((s, i) => ({
              title: s.nav,
              body: s.subtitle,
              image: s.heroImage,
              alt: `${s.nav} door Mcars`,
              href: `/diensten/${s.slug}`,
              meta: `${String(i + 1).padStart(2, "0")} · ${s.category}`,
            }))}
          />
        </div>
      </Section>

      {/* 02 · Vehicle types — running words with photo pills, list underneath */}
      <Section space="flush-top" bleed>
        <div className="px-5 sm:px-8">
          <SectionHeader label="Voertuigen" index="02" lead="Wat we vervoeren." trail="Rijdend of niet." className="mb-6" />
        </div>
        <TypeMarquee
          words={defaultVehicleTypes}
          images={["/images/generated/dealer-loading.jpg", "/images/generated/oldtimer-loading.jpg", "/images/generated/nonrunning-winch.jpg", "/fleet/city-loaded.jpg"]}
          speed={70}
        />
        <ul className="mx-5 mt-6 grid border-t border-zinc-950 sm:mx-8 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4">
          {defaultVehicleTypes.map((v) => (
            <li key={v} className="border-b border-zinc-200 py-4 text-lg font-medium tracking-tight text-zinc-950">{v}</li>
          ))}
        </ul>
      </Section>

      {/* 03 · Process — cards that stack while scrolling */}
      <Section>
        <SectionHeader label="Werkwijze" index="03" lead="Eén werkwijze," trail="voor elke dienst." className="mb-14" />
        <StackedCards
          items={defaultProcess.map((p, i) => ({ title: p.title, body: p.body, image: STEP_IMAGES[i % STEP_IMAGES.length] }))}
        />
      </Section>

      <QuoteCta />
      <VariantSwitcher sectionId="diensten" />
    </PageShell>
  );
}
