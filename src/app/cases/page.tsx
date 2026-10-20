import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { QuoteCta } from "@/components/blocks";
import { HoverRevealList, MosaicGallery } from "@/components/signature";
import { Parallax, Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { SectionHeader } from "@/components/ui";
import VariantSwitcher from "@/components/variant-switcher";
import { cases } from "@/data/cases";
import { caseHref, casesMetadata, casesOverview as o } from "@/lib/case-page";

export const metadata: Metadata = casesMetadata;

export default function CasesPage() {
  const [featured, ...rest] = cases;
  return (
    <PageShell>
      <PageHero
        eyebrow={o.eyebrow}
        title={o.title}
        subtitle={o.subtitle}
        crumbs={[{ label: "Cases" }]}
        image={o.heroImage}
        badges={[{ label: `${cases.length} cases` }, { label: "Particulier & zakelijk" }]}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      <Section space="loose">
        <SectionHeader
          label="Cases"
          index={String(cases.length).padStart(2, "0")}
          lead="Elke rit is anders,"
          trail="de aanpak blijft dezelfde."
          intro={o.intro}
          className="mb-16"
        />

        {/* Featured case */}
        <Reveal>
          <Link href={caseHref(featured)} className="group grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-14">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-zinc-100">
              <Parallax speed={0.06} className="absolute inset-x-0 -top-[15%] h-[130%]">
                <Image src={featured.image} alt={featured.imageAlt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              </Parallax>
            </div>
            <div className="border-t border-zinc-950 pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{featured.tag}</p>
                <span className="text-xs tabular-nums text-zinc-400">01</span>
              </div>
              <h2 className="mt-6 text-3xl font-medium text-balance leading-[1.1] tracking-[-0.025em] text-zinc-950 sm:text-4xl">{featured.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-zinc-500">{featured.body}</p>
              <ReadMore />
            </div>
          </Link>
        </Reveal>

        {/* The other cases — large typographic rows, the photo floats along on hover */}
        <div className="mt-24">
          <HoverRevealList
            items={rest.map((c, i) => ({
              title: c.title,
              body: c.tag,
              meta: String(i + 2).padStart(2, "0"),
              href: caseHref(c),
              image: c.image,
            }))}
          />
        </div>
      </Section>

      {/* Impact — asymmetric photo bento with one figure tile */}
      <Section space="none">
        <SectionHeader label="Impact" lead="Wat we dagelijks" trail="waarmaken." className="mb-12" />
        <MosaicGallery
          images={[
            { title: rest[1].tag, image: rest[1].image, alt: rest[1].imageAlt },
            { title: rest[0].tag, image: rest[0].image, alt: rest[0].imageAlt },
            { title: rest[3].tag, image: rest[3].image, alt: rest[3].imageAlt },
            { title: rest[4].tag, image: rest[4].image, alt: rest[4].imageAlt },
          ]}
          figure={{ value: o.stats[0].value, label: o.stats[0].label, body: o.stats.slice(1).map((s) => `${s.value} ${s.label.toLowerCase()}`).join(" · ") }}
        />
      </Section>

      <QuoteCta />
      <VariantSwitcher sectionId="cases" />
    </PageShell>
  );
}

function ReadMore() {
  return (
    <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition-colors group-hover:decoration-zinc-950">
      Lees de case
      <svg className="size-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}
