import type { Metadata } from "next";
import { FaqAccordion } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import QuoteMultistep from "@/components/quote-multistep";
import Section from "@/components/section";
import { CollageStatement, ImageAccordion } from "@/components/signature";
import { ArrowButton, Eyebrow, SectionHeader } from "@/components/ui";
import { site } from "@/lib/site";
import VariantSwitcher from "@/components/variant-switcher";
import { offerteFaq as faq, offerteReassurance as reassurance, offerteSteps, priceFactors as factoren } from "@/data/pricing";

export const metadata: Metadata = {
  title: "Offerte aanvragen | Mcars",
  description:
    "Vraag vrijblijvend uw prijs voor autotransport aan. U krijgt binnen 24 uur een persoonlijk antwoord met prijs en planning — geen calculator, geen automatische mail.",
};

/** One photo per price factor, in the order of priceFactors. */
const FACTOR_IMAGES = [
  "/images/generated/aerial-motorway.jpg",
  "/images/generated/dealer-loading.jpg",
  "/images/generated/nonrunning-winch.jpg",
  "/fleet/city-loaded.jpg",
  "/images/generated/night-motorway.jpg",
  "/images/generated/alpine-pass.jpg",
];

export default function OffertePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Offerte"
        title="Vraag uw prijs aan — binnen 24 uur antwoord."
        subtitle="Geen calculator, geen automatische mail: wij bekijken elke aanvraag zelf en sturen u prijs en planning."
        crumbs={[{ label: "Offerte aanvragen" }]}
        image="/fleet/depot-wet.jpg"
        badges={reassurance.map((r) => ({ label: r.title }))}
        secondaryCta={{ label: "Liever contact opnemen?", href: "/contact" }}
      />

      <QuoteMultistep
        aside={
          <div className="flex flex-col justify-between gap-12">
            <div>
              <Eyebrow>Uw aanvraag</Eyebrow>
              <h2 className="mt-8 max-w-xl text-3xl font-light leading-[1.1] tracking-[-0.025em] text-balance text-zinc-950 sm:text-4xl lg:text-5xl">
                Drie korte stappen. <span className="text-zinc-400">Wij doen de rest.</span>
              </h2>
            </div>
            <ol className="border-t border-zinc-950">
              {offerteSteps.map((it, i) => (
                <li key={it.title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-zinc-200 py-5">
                  <span className="pt-1 text-xs font-medium tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-lg font-medium tracking-tight text-zinc-950">{it.title}</span>
                    <span className="mt-1 block text-[0.95rem] leading-relaxed text-zinc-500">{it.body}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-sm leading-relaxed text-zinc-500">
              Liever per mail of telefoon?{" "}
              <a href={`mailto:${site.email}`} className="text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950">{site.email}</a>
              {" · "}
              <a href={site.phoneHref} className="text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950">{site.phone}</a>
            </p>
          </div>
        }
      />

      {/* Price factors */}
      <Section space="loose">
        <SectionHeader
          label="Wat bepaalt de prijs?"
          index="01"
          lead="Elke rit is anders."
          trail="Dit weegt mee in uw offerte."
          intro="We rekenen geen vaste tarieven af. Uw prijs stellen we handmatig samen op basis van deze factoren — zo klopt hij voor uw specifieke transport."
          className="mb-16"
        />
        <ImageAccordion items={factoren.map((f, i) => ({ title: f.title, body: f.body, image: FACTOR_IMAGES[i % FACTOR_IMAGES.length] }))} />
      </Section>

      {/* Reassurance — statement with loosely placed photos on a dark panel */}
      <Section space="none" bleed>
        <div className="rounded-[2rem] bg-zinc-950 px-6 py-16 sm:px-10 sm:py-24 lg:px-14">
          <CollageStatement
            tone="dark"
            eyebrow="Waarom aanvragen eenvoudig is"
            statement="Geen calculator en geen automatische mail: een planner van Mcars stelt uw prijs zelf samen."
            images={[
              { title: "", image: "/images/generated/planning-office.jpg", alt: "Een planner van Mcars bekijkt een aanvraag" },
              { title: "", image: "/fleet/hero-highway-sunset.jpg", alt: "Een transporter van Mcars op de snelweg bij zonsondergang" },
              { title: "", image: "/images/generated/customer-update.jpg", alt: "Een klant volgt de levering van haar wagen" },
            ]}
          >
            <ul className="border-t border-white/15">
              {reassurance.map((r, i) => (
                <li key={r.title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-white/15 py-5">
                  <span className="pt-1 text-xs font-medium tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-lg font-medium tracking-tight text-white">{r.title}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-white/55">{r.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CollageStatement>
        </div>
      </Section>

      {/* FAQ */}
      <Section space="loose">
        <div className="grid gap-10 border-t border-zinc-200 pt-6 lg:grid-cols-[1fr_3fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Veelgestelde vragen</Eyebrow>
          </div>
          <div>
            <h2 className="max-w-3xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl lg:text-[3.25rem]">
              Over uw offerte. <span className="text-zinc-400">Kort uitgelegd.</span>
            </h2>
            <div className="mt-12">
              <FaqAccordion items={faq} />
            </div>
            <div className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-base leading-relaxed text-zinc-500">
                Niet zeker welke gegevens u nodig heeft? Bel <a href={site.phoneHref} className="text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950">{site.phone}</a> — we helpen u persoonlijk verder.
              </p>
              <ArrowButton href="/contact">Neem contact op</ArrowButton>
            </div>
          </div>
        </div>
      </Section>
      <VariantSwitcher sectionId="offerte" />
    </PageShell>
  );
}
