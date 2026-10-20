import Image from "next/image";
import Link from "next/link";
import type { CasePageData } from "@/lib/case-page";
import { caseHref } from "@/lib/case-page";
import PageHero from "./page-hero";
import { Parallax, Reveal } from "./scroll";
import Section from "./section";
import { ArrowChip, SectionHeader } from "./ui";

/*
 * Case 01 — cinematic. Full photo hero, facts strip, the story as numbered
 * hairline rows beside a parallax photo panel, the related service on a dark
 * panel and previous / next case cards.
 */

export default function CaseDetail({ data }: { data: CasePageData }) {
  const { item, number, total, prev, next, service, detailImage, facts, story } = data;

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
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-zinc-100 lg:sticky lg:top-28 lg:aspect-[4/5] lg:self-start">
            <Parallax speed={0.06} className="absolute inset-x-0 -top-[15%] h-[130%]">
              <Image src={detailImage} alt={service ? `${service.nav} door Mcars` : item.title} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </Parallax>
          </Reveal>
          <ol className="border-t border-zinc-950">
            {story.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 90} className="grid gap-4 border-b border-zinc-200 py-8 sm:grid-cols-[5rem_1fr] sm:py-10">
                <span className="text-sm tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-2xl font-medium tracking-tight text-zinc-950">{s.label}</h3>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-500 sm:text-lg">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
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

      {/* Previous / next */}
      <Section space="none">
        <nav aria-label="Andere cases" className="grid gap-4 sm:grid-cols-2">
          {[
            { c: prev, label: "Vorige case" },
            { c: next, label: "Volgende case" },
          ].map(({ c, label }) => (
            <Link key={label} href={caseHref(c)} className="group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-[2rem] bg-zinc-950 p-6 text-white sm:min-h-72 sm:p-8">
              <Image src={c.image} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover opacity-55 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.04]" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
              <div className="relative">
                <p className="text-xs font-medium tracking-[0.18em] text-white/60 uppercase">{label}</p>
                <p className="mt-3 flex items-end justify-between gap-4 text-xl font-medium tracking-tight text-balance sm:text-2xl">
                  {c.title}
                  <ArrowChip />
                </p>
              </div>
            </Link>
          ))}
        </nav>
      </Section>
    </>
  );
}
