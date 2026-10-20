import type { Metadata } from "next";
import { FaqAccordion, QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import Section from "@/components/section";
import { ImageAccordion, StickyStory, TypeMarquee } from "@/components/signature";
import { Eyebrow, SectionHeader } from "@/components/ui";
import VariantSwitcher from "@/components/variant-switcher";
import { cmr, cmrIntro, stappen, werkwijze, werkwijzeFaq as faq } from "@/data/process";

export const metadata: Metadata = werkwijze.seo;

/** Photos for the three CMR panels (the steps above already use the step photos). */
const CMR_IMAGES = ["/images/generated/dealer-loading.jpg", "/images/generated/pickup-inspection.jpg", "/images/generated/workshop.jpg"];

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

      {/* Six steps — sticky photo that follows the step being read */}
      <Section space="loose">
        <SectionHeader label="Zo werkt het" index="06" lead="Zes heldere stappen." trail="Van offerte tot levering." className="mb-14" />
        <StickyStory steps={stappen.map((s, i) => ({ title: s.title, body: s.body, image: s.image, alt: s.imageAlt, meta: `Stap ${String(i + 1).padStart(2, "0")} · ${s.status}` }))} />
      </Section>

      {/* Running band between the steps and the CMR block */}
      <section aria-label="Van offerte tot levering" className="py-8 sm:py-12">
        <TypeMarquee
          words={["Offerte", "Planning", "Ophaling", "CMR", "Levering"]}
          images={["/fleet/germany-autobahn.jpg", "/fleet/depot-dusk.jpg", "/fleet/valley-sunset.jpg", "/fleet/city-street.jpg"]}
        />
      </section>

      {/* Why CMR — expanding photo panels */}
      <Section space="loose">
        <SectionHeader
          label="Waarom deze aanpak"
          index="01"
          lead="De CMR-vrachtbrief:"
          trail="uw zekerheid, zwart op wit."
          intro={cmrIntro}
          className="mb-16"
        />
        <ImageAccordion items={cmr.map((h, i) => ({ title: h.title, body: h.body, image: CMR_IMAGES[i % CMR_IMAGES.length] }))} />
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
