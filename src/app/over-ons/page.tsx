import type { Metadata } from "next";
import Image from "next/image";
import { CollageStatement, ImageAccordion, MosaicGallery, TypeMarquee } from "@/components/signature";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { StatRow, QuoteCta } from "@/components/blocks";
import { Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { SectionHeader } from "@/components/ui";
import VariantSwitcher from "@/components/variant-switcher";
import {
  aboutArea,
  aboutCtaImage,
  aboutHeroImage,
  aboutInsured,
  aboutIntro,
  aboutMetadata,
  aboutPhotos,
  aboutStats,
  aboutStory,
  aboutTeam,
  aboutWhy,
  countries,
  extraCountries,
  fleet,
} from "@/data/about";

// Over ons 01 — cinematic. Content lives in src/data/about.ts (shared with v2/v3).
export const metadata: Metadata = aboutMetadata;

/** One photo per "Waarom Mcars" reason (AI placeholders, see docs/CONTENT-NEEDS.md). */
const WHY_PHOTOS = [
  { image: "/images/generated/customer-update.jpg", alt: "Een klant krijgt een update over haar transport" },
  { image: "/images/generated/strap-closeup.jpg", alt: "Een wiel wordt vastgezet met een spanband" },
  { image: "/images/generated/planning-office.jpg", alt: "De planning van Mcars op kantoor" },
  { image: "/fleet/hero-highway-sunset.jpg", alt: "Een Mcars-transporter op de snelweg bij zonsondergang" },
];

export default function OverOnsPage() {
  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow={aboutIntro.eyebrow}
        title={aboutIntro.title}
        subtitle={aboutIntro.subtitle}
        crumbs={[{ label: "Over ons" }]}
        image={aboutHeroImage}
        badges={aboutIntro.badges.map((label) => ({ label }))}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* Story — oversized statement with three loosely placed photos */}
      <Section space="loose">
        <CollageStatement
          eyebrow={aboutStory.label}
          statement={<>{aboutStory.lead} <span className="text-zinc-400">{aboutStory.trail}</span></>}
          images={[
            { title: "Team", image: aboutPhotos.driver.src, alt: aboutPhotos.driver.alt },
            { title: "Onderweg", image: aboutPhotos.road.src, alt: aboutPhotos.road.alt },
            { title: "Depot", image: "/images/generated/key-handover.jpg", alt: "Een chauffeur van Mcars overhandigt de sleutels aan een klant" },
          ]}
        >
          <div className="grid gap-6 text-base leading-relaxed text-zinc-600 sm:grid-cols-2">
            {aboutStory.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </CollageStatement>
        <Reveal delay={120} className="mt-16 border-t border-zinc-200 pt-8">
          <StatRow items={aboutStats} />
        </Reveal>
      </Section>

      {/* Running words with photo pills */}
      <section aria-hidden className="overflow-hidden py-6">
        <TypeMarquee
          words={["Sinds 2009", "Roeselare", "Eigen vloot", "Heel Europa"]}
          images={[aboutPhotos.team.src, "/images/generated/night-motorway.jpg", aboutPhotos.studio.src, "/fleet/countryside-highway.jpg"]}
        />
      </section>

      {/* Team & fleet — asymmetric photo bento, then the fleet ledger */}
      <Section space="loose">
        <SectionHeader label={aboutTeam.label} index="01" lead={aboutTeam.lead} trail={aboutTeam.trail} intro={aboutTeam.intro} className="mb-14" />
        <MosaicGallery
          images={[
            { title: "Team Mcars", image: aboutPhotos.team.src, alt: aboutPhotos.team.alt },
            { title: "Werkplaats", image: aboutPhotos.workshop.src, alt: aboutPhotos.workshop.alt },
            { title: "Vaste chauffeurs", image: "/images/generated/pickup-inspection.jpg", alt: "Een chauffeur van Mcars inspecteert een wagen bij ophaling" },
            { title: "Depot", image: aboutPhotos.fleet.src, alt: aboutPhotos.fleet.alt },
          ]}
          figure={{ value: aboutStats[1].value, label: aboutStats[1].label, body: aboutTeam.languages.join(" & ") + " chauffeurs" }}
        />
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_3fr]">
          <div className="hidden lg:block" />
          <table className="w-full self-start border-t border-zinc-950 text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">
                <th className="py-4 font-medium">Model</th>
                <th className="hidden py-4 font-medium sm:table-cell">Opbouw</th>
                <th className="py-4 text-right font-medium">Aantal</th>
              </tr>
            </thead>
            <tbody>
              {fleet.map((f) => (
                <tr key={f.name} className="border-b border-zinc-200">
                  <td className="py-6 text-xl font-medium tracking-tight text-zinc-950 sm:text-2xl">{f.name}</td>
                  <td className="hidden py-6 text-zinc-500 sm:table-cell">{f.note}</td>
                  <td className="py-6 text-right text-3xl font-medium tracking-tight tabular-nums text-zinc-950 sm:text-4xl">{f.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Area */}
      <Section space="flush-top">
        <SectionHeader label={aboutArea.label} index="02" lead={aboutArea.lead} trail={aboutArea.trail} intro={aboutArea.intro} className="mb-14" />
        <div className="grid lg:grid-cols-[1fr_3fr] lg:gap-10">
          <div className="hidden lg:block" />
          <div>
            <ul className="grid grid-cols-2 border-t border-zinc-950 sm:grid-cols-3">
              {countries.map((c, i) => (
                <Reveal as="li" key={c.name} delay={i * 50} className="flex items-center gap-4 border-b border-zinc-200 py-5 pr-4">
                  <Image src={c.flag} alt="" width={120} height={80} className="h-9 w-auto" />
                  <span className="text-lg font-medium tracking-tight text-zinc-950">{c.name}</span>
                </Reveal>
              ))}
            </ul>
            <p className="mt-6 text-sm text-zinc-500">
              Ook actief in {extraCountries.join(", ")}. {aboutArea.note}
            </p>
          </div>
        </div>
      </Section>

      {/* Insured */}
      <Section space="none" bleed>
        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-6 py-16 sm:px-10 sm:py-24 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-[1fr_3fr] lg:gap-10">
            <Reveal>
              <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/60 uppercase">
                <span aria-hidden className="size-1.5 rounded-full bg-white" />
                {aboutInsured.label}
              </p>
            </Reveal>
            <div>
              <Reveal>
                <h2 className="max-w-3xl text-3xl font-light leading-[1.08] tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-6xl">
                  {aboutInsured.lead} <span className="text-white/45">{aboutInsured.trail}</span>
                </h2>
              </Reveal>
              <ul className="mt-14 grid gap-10 sm:grid-cols-3">
                {aboutInsured.items.map((it, i) => (
                  <Reveal as="li" key={it.title} delay={i * 80} className="border-t border-white/20 pt-6">
                    <span className="text-xs font-medium tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-6 text-xl font-medium tracking-tight text-white">{it.title}</p>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-white/55">{it.body}</p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Why — expanding photo panels */}
      <Section space="loose">
        <SectionHeader label={aboutWhy.label} index="03" lead={aboutWhy.lead} trail={aboutWhy.trail} className="mb-16" />
        <ImageAccordion items={aboutWhy.items.map((h, i) => ({ title: h.title, body: h.body, ...WHY_PHOTOS[i % WHY_PHOTOS.length] }))} />
      </Section>

      <QuoteCta image={aboutCtaImage} />
      <VariantSwitcher sectionId="over-ons" />
    </PageShell>
  );
}
