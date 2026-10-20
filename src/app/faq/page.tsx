import type { Metadata } from "next";
import { FaqAccordion, QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import Section from "@/components/section";
import { ArrowButton, Eyebrow } from "@/components/ui";
import VariantSwitcher from "@/components/variant-switcher";
import { faqGroups as groups, faqTotal } from "@/data/faq";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Veelgestelde vragen | Mcars",
  description:
    "Antwoorden op veelgestelde vragen over autotransport: prijzen, verzekering, ophaling en levering, buitenland, niet-rijdende voertuigen, documenten, betaling en spoed.",
};

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

      {/* Topic index */}
      <Section space="tight">
        <nav aria-label="Onderwerpen" className="grid gap-6 border-t border-zinc-950 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Eyebrow>Onderwerpen</Eyebrow>
          <ul className="flex flex-wrap gap-2">
            {groups.map((g, i) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="inline-flex items-center gap-2.5 rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950"
                >
                  <span className="text-xs tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                  {g.label}
                </a>
              </li>
            ))}
          </ul>
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

      {/* Still a question */}
      <Section space="none">
        <div className="grid gap-10 border-t border-zinc-950 pt-6 lg:grid-cols-[1fr_3fr]">
          <Eyebrow>Nog een vraag?</Eyebrow>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-2xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl lg:text-[3.25rem]">
                Staat uw vraag er niet bij? <span className="text-zinc-400">Wij helpen u persoonlijk.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500">
                U krijgt een duidelijk antwoord van iemand die uw transport ook echt kan inplannen.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <ArrowButton href="/contact">Neem contact op</ArrowButton>
              <a href={site.phoneHref} className="text-sm text-zinc-500 transition-colors hover:text-zinc-950">
                Of bel {site.phone}
              </a>
            </div>
          </div>
        </div>
      </Section>

      <QuoteCta />
      <VariantSwitcher sectionId="faq" />
    </PageShell>
  );
}
