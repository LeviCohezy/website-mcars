import type { Metadata } from "next";
import { FaqAccordion, QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import Section from "@/components/section";
import { CollageStatement, ImageAccordion } from "@/components/signature";
import { ArrowButton, Eyebrow } from "@/components/ui";
import VariantSwitcher from "@/components/variant-switcher";
import { faqGroups as groups, faqTotal } from "@/data/faq";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Veelgestelde vragen | Mcars",
  description:
    "Antwoorden op veelgestelde vragen over autotransport: prijzen, verzekering, ophaling en levering, buitenland, niet-rijdende voertuigen, documenten, betaling en spoed.",
};

/** One photo per FAQ topic for the topic accordion (order = faqGroups). */
const TOPIC_IMAGES = [
  "/images/generated/planning-office.jpg",
  "/images/generated/strap-closeup.jpg",
  "/images/generated/key-handover.jpg",
  "/images/generated/alpine-pass.jpg",
  "/images/generated/nonrunning-winch.jpg",
  "/images/generated/pickup-inspection.jpg",
  "/images/generated/customer-update.jpg",
  "/images/generated/night-motorway.jpg",
];

export default function FaqPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="FAQ"
        title="Veelgestelde vragen."
        subtitle="De meest gestelde vragen over autotransport, per onderwerp. Staat uw vraag er niet bij? We helpen u graag persoonlijk verder."
        crumbs={[{ label: "FAQ" }]}
        image="/fleet/countryside-highway.jpg"
        badges={[{ label: `${faqTotal} antwoorden` }, { label: `${groups.length} onderwerpen` }]}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* Topic index — photo accordion, each panel jumps to its topic */}
      <Section space="loose">
        <nav aria-label="Onderwerpen">
          <div className="mb-12 grid gap-6 border-t border-zinc-950 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
            <Eyebrow>Onderwerpen</Eyebrow>
            <h2 className="max-w-3xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-balance text-zinc-950 sm:text-4xl">
              {groups.length} onderwerpen, <span className="text-zinc-400">{faqTotal} antwoorden.</span>
            </h2>
          </div>
          {/* Compact chips on small screens; the photo accordion from lg up */}
          <ul className="flex flex-wrap gap-2 lg:hidden">
            {groups.map((g, i) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-zinc-200 px-4 text-sm text-zinc-700">
                  <span className="text-xs tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                  {g.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:block">
          <ImageAccordion
            items={groups.map((g, i) => ({
              title: g.label,
              body: `${g.title} ${g.trail} ${g.items.length} ${g.items.length === 1 ? "vraag" : "vragen"} beantwoord.`,
              image: TOPIC_IMAGES[i % TOPIC_IMAGES.length],
              href: `#${g.id}`,
              meta: String(i + 1).padStart(2, "0"),
            }))}
          />
          </div>
        </nav>
      </Section>

      <Section space="flush-top">
        <div className="flex flex-col gap-24">
          {groups.map((g, i) => (
            <div
              key={g.id}
              id={g.id}
              className="grid scroll-mt-28 gap-10 border-t border-zinc-200 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10"
            >
              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center justify-between gap-4 lg:block">
                  <Eyebrow>{g.label}</Eyebrow>
                  <span className="text-xs tabular-nums text-zinc-400 lg:mt-3 lg:block lg:pl-4">{String(i + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}</span>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl">
                  {g.title} <span className="text-zinc-400">{g.trail}</span>
                </h2>
                <div className="mt-10">
                  <FaqAccordion items={g.items} defaultOpen={i === 0 ? 0 : null} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Still a question — airy statement with photos */}
      <Section space="none">
        <div className="mb-12 grid gap-6 border-t border-zinc-950 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Eyebrow>Nog een vraag?</Eyebrow>
          <h2 className="max-w-2xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl lg:text-[3.25rem]">
            Staat uw vraag er niet bij? <span className="text-zinc-400">Wij helpen u persoonlijk.</span>
          </h2>
        </div>
        <CollageStatement
          statement="U krijgt een duidelijk antwoord van iemand die uw transport ook echt kan inplannen."
          images={[
            { title: "Planning", image: "/images/generated/team-depot.jpg", alt: "Het team van Mcars op het depot" },
            { title: "Onderweg", image: "/fleet/countryside-highway.jpg", alt: "Een transporter van Mcars op de snelweg" },
            { title: "Chauffeur", image: "/images/generated/driver-portrait.jpg", alt: "Een chauffeur van Mcars in de cabine" },
          ]}
        >
          <div className="flex flex-col items-start gap-3">
            <ArrowButton href="/contact">Neem contact op</ArrowButton>
            <a href={site.phoneHref} className="text-sm text-zinc-500 transition-colors hover:text-zinc-950">
              Of bel {site.phone}
            </a>
          </div>
        </CollageStatement>
      </Section>

      <QuoteCta />
      <VariantSwitcher sectionId="faq" />
    </PageShell>
  );
}
