import type { Metadata } from "next";
import { FaqAccordion, HighlightGrid, MediaBand, QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { Eyebrow, SectionHeader } from "@/components/ui";
import type { Faq, Highlight, ProcessStep } from "@/data/services";

export const metadata: Metadata = {
  title: "Hoe werkt het? | Mcars",
  description:
    "Van offerte tot levering in zes stappen. Ontdek hoe Mcars uw autotransport aanpakt — persoonlijk, met CMR-vrachtbrief en duidelijke afspraken.",
};

const stappen: ProcessStep[] = [
  {
    title: "Offerte aanvragen",
    body: "U vraagt uw transport aan via de website, telefonisch of via WhatsApp. U krijgt binnen 24 uur een persoonlijk antwoord met de prijs en de mogelijke planning.",
  },
  {
    title: "Goedkeuring offerte",
    body: "Bent u akkoord met de prijs en de planning? Dan geeft u groen licht en zetten we uw transport in gang. Geen verplichtingen tot u bevestigt.",
  },
  {
    title: "Transport inplannen",
    body: "Na uw goedkeuring leggen we samen de ophaaldatum vast. Op de dag zelf belt de chauffeur wanneer hij ter plaatse zal zijn, zodat u niets hoeft te missen.",
  },
  {
    title: "Ophaling + controle & CMR-documenten",
    body: "We halen uw wagen op waar u wil. Ter plaatse maken we de CMR-vrachtbrief op en inspecteren en fotograferen we het voertuig als intern bewijsstuk van de staat bij vertrek.",
  },
  {
    title: "Levering op locatie",
    body: "We bellen wanneer we bij het leveradres aankomen. Levering op ons depot in Roeselare kan 24/7 en is doorgaans voordeliger dan levering aan huis.",
  },
  {
    title: "Betaling / factuur",
    body: "Particulieren betalen vóór ophaling, bedrijven eenvoudig op factuur. De praktische afspraken stemmen we vooraf duidelijk met u af.",
  },
];

const cmr: Highlight[] = [
  {
    icon: "shield",
    title: "Bewijst de ophaling",
    body: "De CMR-vrachtbrief toont zwart op wit dat uw wagen door Mcars is opgehaald, wanneer en waar. Zekerheid voor beide partijen.",
  },
  {
    icon: "box",
    title: "Documenteert de staat",
    body: "Bij ophaling leggen we de staat van het voertuig vast met foto's. Zo staat de toestand bij vertrek onbetwistbaar geregistreerd.",
  },
  {
    icon: "check",
    title: "Belangrijk bij een claim",
    body: "Mocht er ooit discussie of schade zijn, dan is de CMR met de vastgelegde staat het referentiepunt. Rustig geregeld op voorhand.",
  },
];

const faq: Faq[] = [
  {
    q: "Welke documenten heb ik nodig?",
    a: "Enkel een CMR-vrachtbrief is nodig, en die maken wij bij ophaling op. Zo heeft u meteen bewijs dat uw wagen door Mcars is opgehaald.",
  },
  {
    q: "Moet mijn wagen rijden om opgehaald te worden?",
    a: "Nee. Verrolbare wagens trekken we met de lier op de transporter. Is de wagen volledig geblokkeerd, dan voorzien we een heftruck ter plaatse. Vermeld de staat bij uw aanvraag.",
  },
  {
    q: "Kan ik op uw depot laten leveren of ophalen?",
    a: "Ja. Levering en ophaling op ons depot in Roeselare kan 24/7 en is doorgaans voordeliger dan aan huis. Handig als u flexibel wil zijn.",
  },
];

export default function HoeWerktHetPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Werkwijze"
        title="Van aanvraag tot levering in zes stappen."
        subtitle="Een duidelijke, persoonlijke aanpak zonder verrassingen — van uw eerste aanvraag tot de afrekening."
        crumbs={[{ label: "Hoe werkt het" }]}
        image="/fleet/countryside.jpg"
        badges={[{ label: "Antwoord binnen 24 uur" }, { label: "CMR bij elke ophaling" }]}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* Six steps — large ruled rows */}
      <Section space="loose">
        <SectionHeader label="Zo werkt het" index="06" lead="Zes heldere stappen." trail="Van offerte tot levering." className="mb-14" />
        <ol className="border-t border-zinc-950">
          {stappen.map((stap, i) => (
            <Reveal
              as="li"
              key={stap.title}
              delay={i * 60}
              className="grid gap-4 border-b border-zinc-200 py-10 sm:grid-cols-[6rem_1fr] lg:grid-cols-[1fr_1.4fr_1.6fr] lg:gap-10 lg:py-12"
            >
              <span className="text-5xl font-light tracking-[-0.04em] tabular-nums text-zinc-300 sm:text-6xl lg:text-7xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl lg:pt-2">{stap.title}</h3>
              <p className="max-w-xl text-base leading-relaxed text-zinc-500 sm:col-start-2 lg:col-start-auto lg:pt-3 lg:text-lg">
                {stap.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section space="none" bleed>
        <MediaBand image="/fleet/city-loaded.jpg" line="Eén document, zwart op wit: de CMR-vrachtbrief." caption="Opgemaakt bij elke ophaling" />
      </Section>

      {/* Why CMR */}
      <Section space="loose">
        <SectionHeader
          label="Waarom deze aanpak"
          index="01"
          lead="De CMR-vrachtbrief:"
          trail="uw zekerheid, zwart op wit."
          intro="De CMR die we bij elke ophaling opmaken, legt vast wat, wanneer en in welke staat werd opgehaald — bescherming voor u én voor ons."
          className="mb-16"
        />
        <HighlightGrid items={cmr} />
      </Section>

      {/* FAQ */}
      <Section space="none">
        <div className="grid gap-10 border-t border-zinc-200 pt-6 lg:grid-cols-[1fr_3fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Veelgestelde vragen</Eyebrow>
          </div>
          <div>
            <h2 className="max-w-3xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl lg:text-[3.25rem]">
              Nog vragen? <span className="text-zinc-400">Dit horen we het vaakst.</span>
            </h2>
            <div className="mt-12">
              <FaqAccordion items={faq} />
            </div>
          </div>
        </div>
      </Section>

      <QuoteCta />
    </PageShell>
  );
}
