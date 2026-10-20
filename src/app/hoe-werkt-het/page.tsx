import type { Metadata } from "next";
import { FaqAccordion, HighlightGrid, MediaBand, QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { Eyebrow, SectionHeader } from "@/components/ui";
import VariantSwitcher from "@/components/variant-switcher";
import { cmr, cmrIntro, stappen, werkwijze, werkwijzeFaq as faq } from "@/data/process";

export const metadata: Metadata = werkwijze.seo;

export default function HoeWerktHetPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow={werkwijze.eyebrow}
        title={werkwijze.title}
        subtitle={werkwijze.subtitle}
        crumbs={[{ label: "Hoe werkt het" }]}
        image={werkwijze.heroImage}
        badges={werkwijze.badges.map((label) => ({ label }))}
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
        <MediaBand image={werkwijze.bandImage} line="Eén document, zwart op wit: de CMR-vrachtbrief." caption="Opgemaakt bij elke ophaling" />
      </Section>

      {/* Why CMR */}
      <Section space="loose">
        <SectionHeader
          label="Waarom deze aanpak"
          index="01"
          lead="De CMR-vrachtbrief:"
          trail="uw zekerheid, zwart op wit."
          intro={cmrIntro}
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
      <VariantSwitcher sectionId="hoe-werkt-het" />
    </PageShell>
  );
}
