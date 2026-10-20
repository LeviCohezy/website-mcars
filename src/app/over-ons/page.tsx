import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { HighlightGrid, StatRow, QuoteCta } from "@/components/blocks";
import { Parallax, Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { Eyebrow, SectionHeader } from "@/components/ui";
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

      {/* Story */}
      <Section space="loose">
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
          <Reveal>
            <Eyebrow>{aboutStory.label}</Eyebrow>
          </Reveal>
          <div>
            <Reveal>
              <h2 className="max-w-4xl text-3xl font-light leading-[1.15] tracking-[-0.025em] text-balance text-zinc-950 sm:text-4xl lg:text-[3.25rem]">
                {aboutStory.lead} <span className="text-zinc-400">{aboutStory.trail}</span>
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-8 text-base leading-relaxed text-zinc-600 sm:grid-cols-2 sm:gap-10">
              {aboutStory.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 80}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120} className="mt-14 border-t border-zinc-200 pt-8">
              <StatRow items={aboutStats} />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Photo pair — team slot (left) and fleet (right) */}
      <Section space="none" bleed>
        <div className="grid gap-2 lg:grid-cols-[1.5fr_1fr]">
          {[aboutPhotos.team, aboutPhotos.fleet].map((photo, i) => (
            <Reveal key={photo.src} delay={i * 100} className="relative h-[46vh] overflow-hidden rounded-[2rem] sm:h-[68vh]">
              <Parallax speed={0.06} className="absolute inset-x-0 -top-[15%] h-[130%]">
                <Image src={photo.src} alt={photo.alt} fill sizes={i === 0 ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"} className="object-cover" />
              </Parallax>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Team & fleet */}
      <Section space="loose">
        <SectionHeader label={aboutTeam.label} index="01" lead={aboutTeam.lead} trail={aboutTeam.trail} intro={aboutTeam.intro} className="mb-14" />
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
          {/* Driver portrait — tall slot */}
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-zinc-100 lg:aspect-auto lg:min-h-72">
            <Image src={aboutPhotos.driver.src} alt={aboutPhotos.driver.alt} fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover" />
          </Reveal>
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

      {/* Why */}
      <Section space="loose">
        <SectionHeader label={aboutWhy.label} index="03" lead={aboutWhy.lead} trail={aboutWhy.trail} className="mb-16" />
        <HighlightGrid items={aboutWhy.items} />
      </Section>

      <QuoteCta image={aboutCtaImage} />
      <VariantSwitcher sectionId="over-ons" />
    </PageShell>
  );
}
