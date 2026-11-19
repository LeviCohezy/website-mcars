import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LinkList } from "@/components/blocks";
import HeroQuoteBar from "@/components/hero-quote-bar";
import Icon from "@/components/icon";
import OfferteForm from "@/components/offerte-form";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { PlaceGlobe, StepStack } from "@/components/place-interactive";
import { BlogSection, ProblemSection, ReviewsSection, SolutionSection } from "@/components/place-sections";
import Section from "@/components/section";
import { FaqWithContact, HighlightPanel } from "@/components/service-sections";
import { SectionHeader } from "@/components/ui";
import { blogPosts } from "@/data/blog";
import { comboParams, getCombo } from "@/data/combos";
import { getFlow } from "@/data/flow";
import { pageShots } from "@/data/local-images";
import { reviews } from "@/data/reviews";
import { FACTS, flagAsset, type Flag } from "@/data/routes";
import type { IconKey } from "@/data/services";
import { getServicePage } from "@/lib/service-page";

/**
 * Service × place landing page: /diensten/oldtimer-transport/frankrijk or
 * /diensten/oldtimer-transport/belgie-frankrijk. Content from src/data/combos.ts.
 */

type Params = Promise<{ locale: string; slug: string; place: string }>;

// Dutch only for now: the other languages get these pages later.
export const generateStaticParams = () => comboParams().map((c) => ({ locale: "nl", ...c }));
export const dynamicParams = false;

const REASON_ICONS: IconKey[] = ["clock", "star", "route", "users", "truck", "spark"];
const hash = (t: string) => [...t].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const pick = <T,>(items: T[], seed: number, n: number) => Array.from({ length: Math.min(n, items.length) }, (_, i) => items[(seed + i) % items.length]);

function load(slug: string, place: string) {
  const combo = getCombo(slug, place);
  const data = getServicePage(slug);
  if (!combo || !data) return null;
  const flow = getFlow(data.service, combo, {
    situations: data.details.situations,
    process: data.process,
    regions: FACTS[combo.to ?? combo.from].cities.slice(0, 5),
  });
  return { combo, data, flow };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, place } = await params;
  const page = load(slug, place);
  if (!page) return {};
  const { combo, flow } = page;
  return { title: combo.seo.title, description: flow.seoDescription ?? combo.seo.description, alternates: { canonical: `/diensten/${slug}/${place}` } };
}

export default async function ComboPage({ params }: { params: Params }) {
  const { locale, slug, place } = await params;
  if (locale !== "nl") notFound();
  setRequestLocale(locale);
  const page = load(slug, place);
  if (!page) notFound();
  const { combo, data, flow } = page;
  const { service } = data;

  const A = FACTS[combo.from];
  const B = combo.to ? FACTS[combo.to] : null;
  const where = B ? `${A.name} → ${B.name}` : A.name;
  const { hero, shots } = pageShots(slug, combo.from, combo.to);
  const seed = hash(`${slug}/${place}`);

  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow={service.nav}
        title={<span className="block lg:max-w-[calc(100vw-34rem)]">{combo.title}</span>}
        crumbs={[{ label: "Diensten", href: "/diensten" }, { label: service.nav, href: `/diensten/${slug}` }, { label: where }]}
        image={hero.src}
      >
        <div className="mt-8 flex items-center gap-4">
          <FlagTruck flag={combo.from} label={A.name} />
          {combo.to && (
            <>
              <span className="flex items-center gap-1 text-white/50" aria-hidden>
                <span className="h-px w-5 bg-white/30" />
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
              <FlagTruck flag={combo.to} label={B!.name} />
            </>
          )}
        </div>
        <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-[1fr_24rem] lg:items-end lg:gap-0">
          <div className="grid gap-6 border-t border-white/15 pt-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-10 lg:pr-10">
            <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{flow.sub}</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="text-white/90 [&_svg]:size-4"><Icon name="clock" /></span>
                {combo.frequency}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white/90 [&_svg]:size-4"><Icon name="shield" /></span>
                Verzekerd, met CMR
              </li>
            </ul>
          </div>
          <div className="lg:relative lg:self-stretch">
            <HeroQuoteBar
              layout="card"
              title="Prijs aanvragen"
              service={service.nav}
              defaults={B ? { van: A.name, naar: B.name } : { naar: A.name }}
              className="lg:absolute lg:right-0 lg:bottom-0"
            />
          </div>
        </div>
      </PageHero>

      {/* 1 · The customer's problem */}
      <Section space="loose">
        <ProblemSection problem={flow.problem} />
      </Section>

      {/* 2 · Our solution: reliable, fast, traceable, insured */}
      <Section space="none" bleed>
        <SolutionSection solution={flow.solution} pillars={flow.pillars} image={shots[0]?.src ?? service.heroImage} />
      </Section>

      {/* 3 · Why Mcars */}
      <Section space="none" bleed className="mt-2">
        <HighlightPanel
          image={shots[1]?.src ?? data.detailImage}
          alt={shots[1]?.alt ?? `${service.nav} door Mcars`}
          label="Waarom Mcars"
          lead="Ervaring, passie"
          trail="en eigen chauffeurs."
          items={flow.reasons.map((r, i) => ({ ...r, icon: REASON_ICONS[i % REASON_ICONS.length] }))}
        />
      </Section>

      {/* 4 · The globe: this country, or the road between the two */}
      <Section space="none" bleed className="mt-2">
        <PlaceGlobe
          from={combo.from}
          to={combo.to}
          label={B ? "Deze route" : `Actief in ${A.name}`}
          title={B ? `Van ${A.name} naar ${B.name}, van deur tot deur.` : `Thuis op de weg in ${A.name}.`}
          body={flow.why.body}
          regions={flow.why.regions}
        />
      </Section>

      {/* 5 · Step plan: a deck of cards that stack while scrolling */}
      <Section space="loose">
        <SectionHeader
          label="Stappenplan"
          lead="Van aanvraag tot levering,"
          trail={`in ${["twee", "drie", "vier", "vijf", "zes"][flow.steps.length - 2] ?? "enkele"} stappen.`}
          className="mb-12"
        />
        <StepStack steps={flow.steps} shots={[...shots.slice(2), hero, ...shots.slice(0, 2)]} />
      </Section>

      {/* 6 · The quote form, one step at a time */}
      <Section space="none" bleed id="prijs" className="scroll-mt-4">
        <div className="rounded-[2rem] bg-zinc-950 px-4 py-14 sm:px-8 sm:py-20 lg:px-14">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 sm:mb-14">
              <h2 className="text-3xl leading-[1.1] font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
                Vraag uw prijs aan. <span className="text-white/45">In vier korte stappen.</span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/55">
                Vertrek, bestemming, uw auto en uw gegevens. U krijgt binnen 24 uur een persoonlijk antwoord.
              </p>
            </div>
            <OfferteForm stepped defaults={B ? { vanLand: A.name, naarLand: B.name } : undefined} />
          </div>
        </div>
      </Section>

      {/* 7 · Reviews */}
      <Section space="loose">
        <ReviewsSection items={pick(reviews, seed, 3)} />
      </Section>

      {/* 8 · FAQ */}
      <Section space="flush-top">
        <FaqWithContact lead="Veelgestelde vragen" trail={B ? "over deze route." : `over ${service.nav.toLowerCase()} in ${A.name}.`} items={flow.faq} />
      </Section>

      {/* 9 · Blog */}
      <Section space="flush-top">
        <SectionHeader label="Blog" lead="Goed om te lezen" trail="voor u vertrekt." className="mb-12" />
        <BlogSection posts={pick(blogPosts, seed >>> 2, 3)} />
      </Section>

      <Section space="flush-top">
        <SectionHeader label="Ontdek ook" lead="Verwante" trail="pagina's." className="mb-10" />
        <div className="grid lg:grid-cols-[1fr_3fr] lg:gap-10">
          <div className="hidden lg:block" />
          <LinkList items={combo.related} />
        </div>
      </Section>
    </PageShell>
  );
}

function FlagTruck({ flag, label }: { flag: Flag; label: string }) {
  return (
    <span className="flex items-center gap-3">
      <Image src={flagAsset[flag]} alt="" width={64} height={64} className="h-9 w-auto" />
      <span className="text-sm font-medium text-white/85">{label}</span>
    </span>
  );
}
