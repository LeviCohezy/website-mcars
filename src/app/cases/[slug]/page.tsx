import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { HoverRevealList, StickyStory } from "@/components/signature";
import { ArrowChip, SectionHeader } from "@/components/ui";
import VariantSwitcher from "@/components/variant-switcher";
import { cases } from "@/data/cases";
import { caseHref, caseMetadata, caseNumber, caseStaticParams, getCasePage, type CasePageData } from "@/lib/case-page";

// Case 01 — cinematic. Same content as /v2 and /v3, different design.
export const generateStaticParams = caseStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return caseMetadata(params);
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getCasePage(slug);
  if (!data) notFound();
  return (
    <PageShell>
      <CaseDetailV1 data={data} />
      <QuoteCta />
      <VariantSwitcher sectionId="case" base={`/cases/${slug}`} />
    </PageShell>
  );
}

/** Situatie / aanpak / resultaat, each with its own photo for the sticky story. */
function storyPanels({ item, detailImage, service, story }: CasePageData) {
  const photos = [
    { image: item.image, alt: item.imageAlt },
    { image: "/images/generated/strap-closeup.jpg", alt: "Een wiel wordt vastgezet met een spanband" },
    { image: detailImage, alt: service ? `${service.nav} door Mcars` : item.title },
  ];
  return story.map((s, i) => ({ title: s.label, body: s.body, meta: String(i + 1).padStart(2, "0"), ...photos[i % photos.length] }));
}

/*
 * Case 01 — cinematic. Full photo hero, facts strip, the story as a sticky
 * photo that swaps per step, the related service on a dark panel and the
 * other cases as large rows with a floating photo.
 */
function CaseDetailV1({ data }: { data: CasePageData }) {
  const { item, number, total, next, service, facts } = data;

  return (
    <>
      <PageHero
        size="full"
        eyebrow={`Case ${number} / ${total}`}
        title={item.title}
        subtitle={item.body}
        crumbs={[{ label: "Cases", href: "/cases" }, { label: item.tag }]}
        image={item.image}
        badges={[{ label: item.tag }, ...(item.route ? [{ label: item.route }] : [])]}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
        secondaryCta={service ? { label: service.nav, href: `/diensten/${service.slug}` } : { label: "Alle cases", href: "/cases" }}
      />

      {/* Facts strip */}
      <Section space="tight">
        <Reveal>
          <dl className="grid border-y border-zinc-950 sm:grid-cols-3">
            {facts.map((f, i) => (
              <div key={f.label} className={`py-6 sm:px-6 sm:first:pl-0 ${i > 0 ? "border-t border-zinc-200 sm:border-t-0 sm:border-l" : ""}`}>
                <dt className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{f.label}</dt>
                <dd className="mt-3 text-xl font-medium tracking-tight text-zinc-950">
                  {f.href ? (
                    <Link href={f.href} className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950">
                      {f.value}
                    </Link>
                  ) : (
                    f.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      {/* Story — situatie / aanpak / resultaat */}
      <Section space="loose">
        <SectionHeader label="Het verhaal" index={number} lead="Van vraag" trail="tot levering." className="mb-14" />
        <StickyStory steps={storyPanels(data)} />
      </Section>

      {/* Related service */}
      {service && (
        <Section space="flush-top">
          <SectionHeader label="Dienst" lead="Een gelijkaardig transport?" trail="Zo pakken we het aan." className="mb-12" />
          <Reveal>
            <Link href={`/diensten/${service.slug}`} className="group grid overflow-hidden rounded-[2rem] bg-zinc-950 text-white lg:grid-cols-2">
              <div className="relative min-h-64 sm:min-h-80">
                <Image src={service.heroImage} alt={`${service.nav} door Mcars`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-col p-7 sm:p-10 lg:p-14">
                <p className="text-xs font-medium tracking-[0.18em] text-white/50 uppercase">{service.category}</p>
                <h3 className="mt-5 text-3xl font-light tracking-[-0.03em] text-balance sm:text-4xl">{service.title}</h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-white/65">{service.intro}</p>
                <span className="mt-auto flex items-center gap-3 pt-10 text-sm font-medium">
                  <ArrowChip /> Bekijk de dienst
                </span>
              </div>
            </Link>
          </Reveal>
        </Section>
      )}

      {/* Other cases — typographic rows with a floating photo */}
      <Section space="none">
        <SectionHeader label="Meer cases" lead="Nog een rit" trail="uit de praktijk." className="mb-10" />
        <nav aria-label="Andere cases">
          <HoverRevealList
            items={[next, ...cases.filter((c) => c.slug !== item.slug && c.slug !== next.slug)].slice(0, 4).map((c) => ({
              title: c.title,
              body: c.tag,
              meta: c.slug === next.slug ? "Volgende" : caseNumber(c),
              href: caseHref(c),
              image: c.image,
            }))}
          />
        </nav>
      </Section>
    </>
  );
}
