import type { Metadata } from "next";
import { FaqAccordion, HighlightGrid, QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Eyebrow, SplitHeading } from "@/components/ui";
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
        subtitle="Een duidelijke, persoonlijke aanpak zonder verrassingen. Zo verloopt uw autotransport bij Mcars — van uw eerste aanvraag tot de afrekening."
        crumbs={[{ label: "Hoe werkt het" }]}
        image="/fleet/countryside.jpg"
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* 6-step process — left-rail number + content */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Zo werkt het</Eyebrow>
          <SplitHeading className="mt-4" lead="Zes heldere stappen." trail="Van offerte tot levering." />
        </div>

        <ol className="flex flex-col gap-4">
          {stappen.map((stap, i) => (
            <li
              key={stap.title}
              className="group grid gap-5 rounded-3xl bg-zinc-100 p-7 transition-colors hover:bg-zinc-950 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-8 sm:p-9"
            >
              <span className="flex size-14 flex-none items-center justify-center rounded-2xl bg-zinc-950 font-[family-name:var(--font-display)] text-xl text-white transition-colors group-hover:bg-white group-hover:text-zinc-950">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-zinc-950 transition-colors group-hover:text-white sm:text-2xl">
                  {stap.title}
                </h3>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-300">
                  {stap.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Why CMR */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>Waarom deze aanpak</Eyebrow>
          <SplitHeading className="mt-4" lead="De CMR-vrachtbrief:" trail="uw zekerheid, zwart op wit." />
          <p className="mt-5 text-base leading-relaxed text-zinc-500">
            Eén document maakt het verschil. De CMR-vrachtbrief die we bij elke ophaling opmaken,
            legt vast wat, wanneer en in welke staat werd opgehaald — bescherming voor u én voor ons.
          </p>
        </div>
        <HighlightGrid items={cmr} />
      </section>

      {/* FAQ */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>Veelgestelde vragen</Eyebrow>
          <SplitHeading className="mt-4" lead="Nog vragen?" trail="Dit horen we het vaakst." />
        </div>
        <FaqAccordion items={faq} />
      </section>

      <QuoteCta />
    </PageShell>
  );
}
