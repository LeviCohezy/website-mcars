import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { StatRow, QuoteCta } from "@/components/blocks";
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

        <div className="mt-24 grid gap-x-6 gap-y-16 md:grid-cols-2">
          {rest.map((c, i) => {
            const wide = rest.length % 2 === 1 && i === rest.length - 1;
            return (
            <Reveal key={c.title} delay={(i % 2) * 100} className={wide ? "md:col-span-2" : ""}>
              <Link href={caseHref(c)} className="group block">
                <div className={`relative overflow-hidden rounded-[2rem] bg-zinc-100 ${wide ? "aspect-[4/3] md:aspect-[21/9]" : "aspect-[4/3]"}`}>
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes={wide ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-zinc-200 pt-4">
                  <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{c.tag}</p>
                  <span className="text-xs tabular-nums text-zinc-400">{String(i + 2).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-4 text-2xl font-medium tracking-tight text-zinc-950">{c.title}</h3>
                <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-zinc-500">{c.body}</p>
                <ReadMore />
              </Link>
            </Reveal>
            );
          })}
        </div>
      </Section>

      <Section space="none">
        <SectionHeader label="Impact" lead="Wat we dagelijks" trail="waarmaken." className="mb-12" />
        <div className="grid lg:grid-cols-[1fr_3fr] lg:gap-10">
          <div className="hidden lg:block" />
          <StatRow items={o.stats} />
        </div>
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
