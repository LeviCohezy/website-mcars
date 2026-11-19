import type { Metadata } from "next";
import { FaqAccordion, HighlightGrid } from "@/components/blocks";
import PageShell from "@/components/page-shell";
import OfferteForm from "@/components/offerte-form";
import { Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { ArrowButton, Eyebrow, SectionHeader } from "@/components/ui";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
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
    icon: "box",
    title: "Extra's aan boord",
    body: "Een topbox, fietsdrager of spullen in de wagen? Laat het ons weten — het speelt mee in hoe we laden en plannen.",
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
    title: "Antwoord binnen 24 uur",
    body: "U krijgt snel een prijs en een mogelijke planning terug — geen dagenlang wachten.",
  },
  {
    title: "Persoonlijk, geen calculator",
    body: "Elke offerte wordt handmatig door ons team opgesteld, afgestemd op uw situatie.",
  },
  {
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
    <PageShell dark>
      {/* Hero: the Mcars truck on the right, the offerte text on the open sky/road to its left */}
      <section className="relative flex min-h-[70svh] items-center overflow-hidden rounded-[2rem] bg-zinc-950 lg:aspect-[3/1] lg:min-h-[520px]">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-[position:65%_center] lg:bg-center"
          style={{ backgroundImage: `url(${asset("/fleet/offerte-hero.jpg")})` }}
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,rgb(9_9_11/0.75),rgb(9_9_11/0.45)_35%,transparent_55%)]" />
        <div aria-hidden className="absolute inset-0 bg-zinc-950/30 lg:hidden" />
        <div className="relative z-10 max-w-2xl px-6 pt-32 pb-12 sm:px-10 lg:px-14 lg:pt-24">
          <p className="text-xs font-semibold tracking-[0.3em] text-white uppercase sm:text-sm">
            Snel · veilig · betrouwbaar
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Offerte autotransport
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/90 sm:text-xl">
            Vul onderstaand formulier in en ontvang snel een vrijblijvende offerte voor het transport van uw voertuig.
          </p>
        </div>
      </section>

      {/* The quote form — flow from the client's reference, on a black screen */}
      <Section space="none" bleed id="aanvraag" className="mt-2">
        <div className="rounded-[2rem] bg-zinc-950 px-4 py-14 sm:px-8 sm:py-20 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-4 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="max-w-2xl text-3xl leading-[1.1] font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
                Plan uw transport. <span className="text-white/45">In vier korte stappen.</span>
              </h2>
              <p className="max-w-sm text-base leading-relaxed text-white/55">
                Vertrek, bestemming, uw auto en uw gegevens — wij sturen u binnen 24 uur een persoonlijke prijs en planning.
              </p>
            </div>
            <OfferteForm />
          </div>
        </div>
      </Section>

      {/* Price factors */}
      <Section space="loose">
        <SectionHeader
          label="Wat bepaalt de prijs?"
          index="01"
          lead="Elke rit is anders."
          trail="Dit weegt mee in uw offerte."
          intro="We rekenen geen vaste tarieven af. Uw prijs stellen we handmatig samen op basis van deze factoren — zo klopt hij voor uw specifieke transport."
          className="mb-16"
          dark
        />
        <HighlightGrid items={factoren} dark />
      </Section>

      {/* Reassurance */}
      <Section space="none" bleed>
        <div className="rounded-[2rem] bg-zinc-950 px-6 py-16 sm:px-10 sm:py-20 lg:px-14">
          <ul className="grid gap-10 sm:grid-cols-3">
            {reassurance.map((r, i) => (
              <Reveal as="li" key={r.title} delay={i * 80} className="border-t border-white/20 pt-6">
                <span className="text-xs font-medium tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-2xl font-medium tracking-tight text-white">{r.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-white/55">{r.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* FAQ */}
      <Section space="loose">
        <div className="grid gap-10 border-t border-white/15 pt-6 lg:grid-cols-[1fr_3fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow dark>Veelgestelde vragen</Eyebrow>
          </div>
          <div>
            <h2 className="max-w-3xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-white sm:text-4xl lg:text-[3.25rem]">
              Over uw offerte. <span className="text-white/45">Kort uitgelegd.</span>
            </h2>
            <div className="mt-12">
              <FaqAccordion items={faq} dark />
            </div>
            <div className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-base leading-relaxed text-white/55">
                Niet zeker welke gegevens u nodig heeft? Bel <a href={site.phoneHref} className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{site.phone}</a> — we helpen u persoonlijk verder.
              </p>
              <ArrowButton href="/contact" variant="light">Neem contact op</ArrowButton>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
