import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaqAccordion, HighlightGrid, LinkList, QuoteCta, StatRow } from "@/components/blocks";
import HeroQuoteBar from "@/components/hero-quote-bar";
import Icon from "@/components/icon";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Parallax, Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { Eyebrow, SectionHeader } from "@/components/ui";
import VariantSwitcher from "@/components/variant-switcher";
import { flagAsset } from "@/data/routes";
import { getRoutePage, routeMetadata, routeStaticParams } from "@/lib/route-page";

// Route 01 — cinematic. Versions 02 (/v2) and 03 (/v3) render the same data.
export const generateStaticParams = routeStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return routeMetadata(params);
}

export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getRoutePage(slug);
  if (!data) notFound();
  const { route, isCorridor, quote, detailImage } = data;
  const related = data.related.map(({ href, label, meta }) => ({ href, label, meta }));

  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow={isCorridor ? "Vaste corridor" : "Bestemming"}
        title={<span className="block lg:max-w-[calc(100vw-34rem)]">{route.title}</span>}
        crumbs={[{ label: "Routes", href: "/routes" }, { label: route.nav }]}
        image={route.heroImage}
      >
        {isCorridor && (
          <div className="mt-8 flex items-center gap-4">
            <FlagTruck flag={route.from!.flag} label={route.from!.name} />
            <Connector />
            <FlagTruck flag={route.to!.flag} label={route.to!.name} />
          </div>
        )}
        {/* Meta row: its hairline runs into the card's outline, so the rule
            wraps around the form instead of stopping short of it. */}
        <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-[1fr_24rem] lg:items-end lg:gap-0">
          <div className="grid gap-6 border-t border-white/15 pt-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-10 lg:pr-10">
            <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{route.subtitle}</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="text-white/90 [&_svg]:size-4"><Icon name="clock" /></span>
                {route.frequency}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white/90 [&_svg]:size-4"><Icon name="shield" /></span>
                Verzekerd, met CMR
              </li>
            </ul>
          </div>
          {/* On desktop the card is lifted out of the flow and rises beside
              the title, so its height doesn't push the headline up. */}
          <div className="lg:relative lg:self-stretch">
            <HeroQuoteBar
              layout="card"
              title={quote.title}
              service={route.nav}
              defaults={quote.defaults}
              className="lg:absolute lg:right-0 lg:bottom-0"
            />
          </div>
        </div>
      </PageHero>

      {/* Intro + figures */}
      <Section space="loose">
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
          <Reveal>
            <Eyebrow>{isCorridor ? "Over deze route" : "Over deze bestemming"}</Eyebrow>
          </Reveal>
          <div>
            <Reveal>
              <p className="text-2xl leading-[1.3] font-light tracking-[-0.02em] text-pretty text-zinc-950 sm:text-3xl lg:text-[2.6rem] lg:leading-[1.2]">
                {route.intro}
              </p>
            </Reveal>
            <Reveal delay={100} className="mt-14 border-t border-zinc-200 pt-8">
              <StatRow items={route.stats} />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Cities — dark panel with photo */}
      <Section space="none" bleed>
        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950">
          <Parallax speed={0.06} className="absolute inset-x-0 -top-[15%] h-[130%]">
            <Image src={detailImage} alt="" fill sizes="100vw" className="object-cover opacity-30" />
          </Parallax>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
          <div className="relative z-10 grid gap-12 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-[1fr_3fr] lg:gap-10 lg:px-14">
            <Reveal>
              <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/60 uppercase">
                <span aria-hidden className="size-1.5 rounded-full bg-white" />
                {isCorridor ? "Ophaal- en leverpunten" : "Waar we rijden"}
              </p>
            </Reveal>
            <div>
              <Reveal>
                <h2 className="max-w-3xl text-3xl font-light leading-[1.08] tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-6xl">
                  {isCorridor ? "Van deur tot deur, waar u ook zit." : `Actief in heel ${route.place!.name}.`}
                </h2>
              </Reveal>
              <ul className="mt-12 grid grid-cols-2 border-t border-white/15 sm:grid-cols-3 lg:grid-cols-4">
                {route.cities.map((c, i) => (
                  <Reveal as="li" key={c} delay={i * 30} className="border-b border-white/10 py-4 pr-4 text-base text-white/85">
                    {c}
                  </Reveal>
                ))}
              </ul>
              <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/50">
                Uw stad of adres er niet bij? Geen probleem — we halen op en leveren waar u het nodig heeft.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Highlights */}
      <Section space="loose">
        <SectionHeader label="Waarom Mcars" index="01" lead="Uw wagen" trail="in vertrouwde handen." className="mb-16" />
        <HighlightGrid items={route.highlights} />
      </Section>

      {/* FAQ */}
      <Section space="flush-top">
        <div className="grid gap-10 border-t border-zinc-200 pt-6 lg:grid-cols-[1fr_3fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>FAQ</Eyebrow>
          </div>
          <div>
            <h2 className="max-w-3xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl lg:text-[3.25rem]">
              Vragen over <span className="text-zinc-400">deze route.</span>
            </h2>
            <div className="mt-12">
              <FaqAccordion items={route.faq} />
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section space="none">
          <SectionHeader label="Ontdek ook" lead="Andere routes" trail="en diensten." className="mb-10" />
          <div className="grid lg:grid-cols-[1fr_3fr] lg:gap-10">
            <div className="hidden lg:block" />
            <LinkList items={related} />
          </div>
        </Section>
      )}

      <QuoteCta title="Klaar om deze route te boeken?" image={route.heroImage} />
      <VariantSwitcher sectionId="route" base={`/routes/${slug}`} />
    </PageShell>
  );
}

function FlagTruck({ flag, label }: { flag: keyof typeof flagAsset; label: string }) {
  return (
    <span className="flex items-center gap-3">
      <Image src={flagAsset[flag]} alt="" width={64} height={64} className="h-9 w-auto" />
      <span className="text-sm font-medium text-white/85">{label}</span>
    </span>
  );
}

function Connector() {
  return (
    <span className="flex items-center gap-1 text-white/50" aria-hidden>
      <span className="h-px w-5 bg-white/30" />
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </span>
  );
}

