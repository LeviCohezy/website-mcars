import type { Metadata } from "next";
import { FaqAccordion, HighlightGrid } from "@/components/blocks";
import Icon from "@/components/icon";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import QuoteMultistep from "@/components/quote-multistep";
import { ArrowButton, Eyebrow, SplitHeading } from "@/components/ui";
import type { Faq, Highlight } from "@/data/services";

export const metadata: Metadata = {
  title: "Offerte aanvragen | Mcars",
  description:
    "Vraag vrijblijvend uw prijs voor autotransport aan. U krijgt binnen 24 uur een persoonlijk antwoord met prijs en planning — geen calculator, geen automatische mail.",
};

const factoren: Highlight[] = [
  {
    icon: "route",
    title: "Afstand",
    body: "Hoe verder de rit, hoe meer kilometers en tijd. De afstand tussen ophaal- en leveradres bepaalt mee de prijs.",
  },
  {
    icon: "car",
    title: "Type voertuig",
    body: "Afmetingen en gewicht spelen een rol. Een compacte wagen laadt anders dan een bestelwagen, SUV of oldtimer.",
  },
  {
    icon: "wrench",
    title: "Rijdend of niet-rijdend",
    body: "Rijdt de wagen, is hij verrolbaar of volledig geblokkeerd? Voor niet-rijdende wagens voorzien we lier of heftruck.",
  },
  {
    icon: "shield",
    title: "Open of gesloten",
    body: "Open transport is efficiënt en voordelig. Gesloten transport biedt extra bescherming voor exclusieve wagens.",
  },
  {
    icon: "clock",
    title: "Spoed of normale planning",
    body: "Sluit uw rit aan op onze bestaande routes, of moet het dringend? De planning weegt mee in de prijs.",
  },
  {
    icon: "globe",
    title: "Land van ophaling/levering",
    body: "Binnen België of tot ver in Europa: het land van ophaling en levering bepaalt mee de route en de kost.",
  },
];

const reassurance = [
  {
    icon: "clock" as const,
    title: "Antwoord binnen 24 uur",
    body: "U krijgt snel een prijs en een mogelijke planning terug — geen dagenlang wachten.",
  },
  {
    icon: "users" as const,
    title: "Persoonlijk, geen calculator",
    body: "Elke offerte wordt handmatig door ons team opgesteld, afgestemd op uw situatie.",
  },
  {
    icon: "check" as const,
    title: "Wij antwoorden zelf",
    body: "Geen automatische bevestigingsmail. U hoort rechtstreeks van een mens bij Mcars.",
  },
];

const faq: Faq[] = [
  {
    q: "Hoe snel krijg ik een antwoord op mijn aanvraag?",
    a: "U krijgt binnen 24 uur een persoonlijk antwoord met de prijs en de mogelijke planning. Elke aanvraag wordt handmatig bekeken — u ontvangt dus geen automatische bevestigingsmail, wij antwoorden zelf.",
  },
  {
    q: "Welke gegevens heb ik nodig om een offerte aan te vragen?",
    a: "Handig om bij de hand te hebben: of u particulier of bedrijf bent, het ophaal- en leveradres (of ons depot), het voertuig en de staat ervan (start en rijdt, verrolbaar of geblokkeerd, met of zonder topbox), en de gewenste datum. Hoe vollediger uw aanvraag, hoe scherper we uw prijs kunnen bepalen.",
  },
  {
    q: "Kan ik op ons depot laten leveren of ophalen?",
    a: "Ja. Levering of ophaling op ons depot in Roeselare kan en is doorgaans voordeliger dan aan huis. Vermeld het bij uw aanvraag, dan houden we er rekening mee.",
  },
  {
    q: "Hoe verloopt de betaling?",
    a: "Particulieren betalen vóór ophaling. Bedrijven betalen eenvoudig op factuur. De praktische afspraken stemmen we vooraf met u af.",
  },
];

export default function OffertePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Offerte"
        title="Vraag uw prijs aan — binnen 24 uur antwoord."
        subtitle="Vul het formulier in en u krijgt persoonlijk een prijs en planning terug. Geen calculator, geen automatische mail: wij bekijken elke aanvraag zelf."
        crumbs={[{ label: "Offerte aanvragen" }]}
        image="/fleet/depot-wet.jpg"
        secondaryCta={{ label: "Liever contact opnemen?", href: "/contact" }}
      />

      <QuoteMultistep />

      {/* Wat bepaalt de prijs? */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>Wat bepaalt de prijs?</Eyebrow>
          <SplitHeading
            className="mt-4"
            lead="Elke rit is anders."
            trail="Dit weegt mee in uw offerte."
          />
          <p className="mt-5 text-base leading-relaxed text-zinc-500">
            We rekenen geen vaste tarieven af. Uw prijs stellen we handmatig samen op basis van
            een aantal factoren — zo krijgt u altijd een correcte prijs voor uw specifieke transport.
          </p>
        </div>
        <HighlightGrid items={factoren} />
      </section>

      {/* Reassurance strip */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          {reassurance.map((r) => (
            <div key={r.title} className="rounded-3xl bg-zinc-100 p-7">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-zinc-950 shadow-sm">
                <Icon name={r.icon} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-zinc-950">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>Veelgestelde vragen</Eyebrow>
          <SplitHeading className="mt-4" lead="Over uw offerte." trail="Kort uitgelegd." />
        </div>
        <FaqAccordion items={faq} />
      </section>

      {/* Small contact band (form is already above, so no QuoteCta) */}
      <section className="px-5 pb-8 sm:px-8">
        <div className="flex flex-col items-start gap-6 rounded-[2rem] bg-zinc-100 px-8 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-12">
          <div className="max-w-xl">
            <h2 className="text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl">
              Liever even overleggen?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-500">
              Niet zeker welke gegevens u nodig heeft of hoe u uw wagen best omschrijft? Neem
              gerust contact op — we helpen u persoonlijk verder.
            </p>
          </div>
          <ArrowButton href="/contact">Neem contact op</ArrowButton>
        </div>
      </section>
    </PageShell>
  );
}
