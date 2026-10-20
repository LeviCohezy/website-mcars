import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteCta } from "@/components/blocks";
import HeroQuoteBar from "@/components/hero-quote-bar";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import {
  BreakdownSection, ExpectBento, OverviewCards, FaqWithContact, NeedsSection, PracticeCase, PriceSection, RelatedCards,
} from "@/components/service-sections";
import { ImageAccordion, MosaicGallery, StickyStory } from "@/components/signature";
import Section from "@/components/section";
import SituationsScroll from "@/components/situations-scroll";
import VariantSwitcher from "@/components/variant-switcher";
import { ArrowChip, SectionHeader } from "@/components/ui";
import { getServicePage, serviceMetadata, serviceStaticParams } from "@/lib/service-page";
import { site } from "@/lib/site";

export const generateStaticParams = serviceStaticParams;

/** One photo per process step. */
const STEP_IMAGES = [
  "/images/generated/customer-update.jpg",
  "/images/generated/planning-office.jpg",
  "/images/generated/pickup-inspection.jpg",
  "/images/generated/key-handover.jpg",
];

/** Photos for the "Waarom Mcars" panels after the first (which uses the page's detail image). */
const HIGHLIGHT_IMAGES = ["/images/generated/strap-closeup.jpg", "/images/generated/alpine-pass.jpg", "/images/generated/driver-portrait.jpg"];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return serviceMetadata(params);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getServicePage(slug);
  if (!data) notFound();
  const { service, process, vehicleTypes, detailImage, detailAlt, details, practiceCase, situationsImage, safetyImage, safetyAlt, faq, related } = data;
  // Highlight photos, skipping any the page already shows nearby.
  const pool = HIGHLIGHT_IMAGES.filter((img) => img !== detailImage && img !== safetyImage);
  const pick = (i: number) => pool[(i - 1) % pool.length];

  return (
    <PageShell>
      {/* Target for in-page "Prijs aanvragen" links: the hero, form included. */}
      <div id="prijs" aria-hidden />
      <PageHero
        size="full"
        screen
        eyebrow={service.category}
        title={service.title}
        crumbs={[{ label: "Diensten", href: "/diensten" }, { label: service.nav }]}
        image={service.heroImage}
      >
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{service.subtitle}</p>
        <div className="mt-8 flex flex-col gap-3 sm:mt-10 lg:flex-row lg:items-stretch">
          <HeroQuoteBar service={service.nav} className="lg:max-w-none lg:flex-1" />
          <div className="flex gap-3 lg:flex-none">
            <Link
              href="/reviews"
              aria-label={`${site.reviews.score} op 5 op Google — bekijk reviews`}
              className="flex flex-1 items-center gap-3 rounded-[1.5rem] border border-white/20 bg-white/10 px-5 py-4 shadow-2xl backdrop-blur-xl transition-colors hover:bg-white/15 lg:flex-none"
            >
              <span className="flex size-9 flex-none items-center justify-center rounded-full bg-white"><GoogleLogo /></span>
              <span className="flex items-center gap-1.5 text-lg leading-none font-semibold text-white">
                <span>{site.reviews.score}<span className="font-normal text-white/60">/5</span></span>
                <StarMini />
              </span>
            </Link>
            <div className="flex flex-1 items-center gap-3 rounded-[1.5rem] border border-white/20 bg-white/10 px-5 py-4 text-sm leading-snug text-white shadow-2xl backdrop-blur-xl lg:flex-none lg:whitespace-nowrap">
              <ShieldCheck />
              <span>Verzekerd, met CMR</span>
            </div>
          </div>
        </div>
      </PageHero>

      {/* Overview — statement, then figure / photo / promise cards */}
      <Section space="loose">
        <OverviewCards
          intro={service.intro}
          audience={service.audience}
          image={safetyImage}
          imageAlt={safetyAlt}
          stats={service.stats}
        />
      </Section>

      {/* 3 · Recognisable situations — full-bleed photo, square edges */}
      {details.situations.length > 0 && (
        <Section space="none" bleed className="mb-16 sm:mb-24">
          <SituationsScroll
            items={details.situations}
            image={situationsImage}
            title="Herkent u zich in een van deze situaties?"
            intro={`${["Twee", "Drie", "Vier", "Vijf"][details.situations.length - 2] ?? "Enkele"} situaties waarin klanten ons bellen. Herkent u de uwe? Dan ziet u meteen wat wij voor u regelen.`}
          />
        </Section>
      )}

      {/* 4 · Why Mcars — expanding photo panels, one per highlight */}
      <Section space="flush-top">
        <SectionHeader label="Waarom Mcars" lead="Zo pakken we het aan," trail="rit na rit." className="mb-12" />
        <ImageAccordion
          items={service.highlights.map((h, i) => ({
            title: h.title,
            body: h.body,
            image: i === 0 ? detailImage : pick(i),
            alt: i === 0 ? detailAlt : "",
          }))}
        />
      </Section>

      {/* 5 · Process — sticky photo that swaps per step; CTA back to the hero form */}
      <Section space="loose">
        <SectionHeader
          label="Werkwijze"
          lead="Van aanvraag tot levering,"
          trail="helder en eenvoudig."
          intro="U weet op elk moment wat er gebeurt en wie u kan bellen."
          action={
            <a href="#prijs" className="group inline-flex items-center gap-3 rounded-full bg-zinc-950 py-2 pr-2 pl-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
              Prijs aanvragen
              <ArrowChip />
            </a>
          }
          className="mb-4"
        />
        <StickyStory steps={process.map((p, i) => ({ title: p.title, body: p.body, image: STEP_IMAGES[i % STEP_IMAGES.length] }))} />
      </Section>

      {/* 6 · What determines the price (factors, no amounts) */}
      <Section space="flush-top">
        <SectionHeader
          label="Prijs"
          lead="Wat bepaalt"
          trail="de prijs?"
          intro="We werken niet met een calculator: elke prijs is afgestemd op uw transport. Dit zijn de factoren die meetellen."
          className="mb-12"
        />
        <PriceSection factors={details.priceFactors} tips={details.savingTips} />
      </Section>

      {/* 7 · What we need from you — or, for depannage, what to do on a breakdown */}
      <Section space="loose">
        {details.needsMode === "pech" ? (
          <>
            <SectionHeader label="Bij pech" lead="Wat te doen" trail="bij pech?" className="mb-12" />
            <BreakdownSection />
          </>
        ) : (
          <>
            <SectionHeader label="Voorbereiding" lead="Wat we van u" trail="nodig hebben." className="mb-12" />
            <NeedsSection needs={details.needs} />
          </>
        )}
      </Section>

      {/* 8 · Included & what we carry */}
      <Section space="none" bleed>
        <ExpectBento
          benefits={service.benefits}
          vehicleTypes={vehicleTypes}
          caption={`Eigen vloot · vaste chauffeurs · sinds ${site.founded}`}
        />
      </Section>

      {/* 9 · Fleet & safety — photo mosaic, then the safety points */}
      <Section space="loose">
        <SectionHeader label="Vloot & veiligheid" lead="Zo beschermen we" trail="uw wagen." className="mb-12" />
        <MosaicGallery
          images={[
            { image: "/images/generated/truck-studio.jpg", alt: "Een transporter van de eigen Mcars-vloot", title: details.safety[0]?.title ?? "" },
            { title: "", image: "/images/generated/team-depot.jpg", alt: "Het team van Mcars op het depot in Roeselare" },
            { title: "", image: "/images/generated/pickup-inspection.jpg", alt: "Inspectie van een wagen bij ophaling" },
            { title: "", image: "/images/generated/depot-night.jpg", alt: "De vloot van Mcars op het depot" },
          ]}
          figure={{ value: "9", label: "Eigen transporters", body: "Allemaal met Kässbohrer-opbouw, gereden door 8 vaste chauffeurs." }}
        />
        <ul className="mt-10 grid gap-x-10 border-t border-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
          {details.safety.map((x) => (
            <li key={x.title} className="border-b border-zinc-200 py-6">
              <h3 className="text-lg font-medium tracking-tight text-zinc-950">{x.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-500">{x.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 10 · From practice */}
      {practiceCase && (
        <Section space="flush-top">
          <SectionHeader label="Uit de praktijk" lead="Zo deden we het" trail="eerder." className="mb-12" />
          <PracticeCase item={practiceCase} />
        </Section>
      )}

      {/* 11 · FAQ beside a direct-contact card */}
      <Section space="loose">
        <FaqWithContact lead="Veelgestelde vragen" trail={`over ${service.nav.toLowerCase()}.`} items={faq} />
      </Section>

      {/* 12 · Related services & routes */}
      {related.length > 0 && (
        <Section space="none">
          <SectionHeader label="Ontdek ook" lead="Verwante diensten" trail="en routes." className="mb-10" />
          <RelatedCards items={related.map((r) => ({ ...r, image: r.portrait ?? r.image }))} />
        </Section>
      )}

      <QuoteCta />
      <VariantSwitcher sectionId="dienst" base={`/diensten/${service.slug}`} />
    </PageShell>
  );
}

function StarMini() {
  return <svg className="size-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.8 1.4 6.8L12 17.3 5.9 20.7l1.4-6.8L2.2 9.1l6.9-.8z" /></svg>;
}

function GoogleLogo() {
  return (
    <svg className="size-6" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function ShieldCheck() {
  return (
    <svg className="size-7 flex-none text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l7 3v6c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V6l7-3z" />
      <path d="M8.75 12.25l2.25 2.25 4.25-4.5" />
    </svg>
  );
}
