import Image from "next/image";
import Link from "next/link";
import type { CasePageData } from "@/lib/case-page";
import { caseHref } from "@/lib/case-page";
import { Reveal } from "./scroll";
import { V3Arrow, V3Block, V3Button, V3Head, V3Page, V3Tick } from "./v3-kit";

/*
 * Case 03 — "Donker & premium". Black page: full-bleed photo hero with the
 * title bottom-left and a short line + CTA bottom-right (FREIGHT-style),
 * oversized facts, the story as translucent status cards over a dark photo,
 * the related service and big previous / next panels.
 */

export default function CaseV3({ data }: { data: CasePageData }) {
  const { item, number, total, prev, next, service, detailImage, facts, story } = data;

  return (
    <V3Page>
      {/* 1 · Full-bleed hero */}
      <section className="relative flex min-h-[calc(100svh-1rem)] flex-col justify-end px-5 pt-36 pb-10 sm:px-10 sm:pb-12 lg:px-14">
        <Image src={item.image} alt={item.imageAlt} fill priority sizes="100vw" className="object-cover opacity-75" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/25 to-zinc-950/50" />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-end lg:gap-16">
          <div>
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-white/55">
              <Link href="/" className="hover:text-white">Home</Link>
              <span aria-hidden>/</span>
              <Link href="/cases" className="hover:text-white">Cases</Link>
              <span aria-hidden>/</span>
              <span className="text-white/85">Case {number}</span>
            </nav>
            <h1 className="mt-6 max-w-4xl text-[2.75rem] leading-[0.98] font-light tracking-[-0.045em] text-balance break-words sm:text-7xl lg:text-[6rem]">{item.title}</h1>
          </div>
          <div className="border-t border-white/20 pt-6">
            <p className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">{item.tag}</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-white/70">{item.route ? `${item.route}. ` : ""}Anoniem, maar écht gereden.</p>
            <div className="mt-6">
              <V3Button href="/offerte">Offerte aanvragen</V3Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Intro + oversized facts */}
      <V3Block>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Case {number} / {total}</p>
          </Reveal>
          <Reveal>
            <p className="text-2xl leading-[1.3] font-light tracking-[-0.02em] text-pretty sm:text-4xl lg:text-[2.6rem]">{item.body}</p>
          </Reveal>
        </div>
        <dl className="mt-16 grid gap-8 border-t border-white/10 pt-10 sm:mt-20 sm:grid-cols-3">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 90}>
              <dt className="text-sm text-white/45">{f.label}</dt>
              <dd className="mt-3 text-2xl font-light tracking-[-0.02em] break-words sm:text-3xl">
                {f.href ? (
                  <Link href={f.href} className="inline-flex min-h-11 items-center gap-2 underline decoration-white/25 underline-offset-[6px] hover:decoration-white">
                    {f.value}
                  </Link>
                ) : (
                  f.value
                )}
              </dd>
            </Reveal>
          ))}
        </dl>
      </V3Block>

      {/* 3 · Story — status cards over a dark photo */}
      <section className="relative mx-2 overflow-hidden rounded-2xl px-5 py-20 sm:mx-4 sm:px-10 sm:py-28 lg:px-14">
        <Image src={detailImage} alt="" fill sizes="100vw" className="object-cover opacity-40" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 to-zinc-950/90" />
        <div className="relative">
          <V3Head label="Het verhaal" lead="Van vraag" trail="tot levering." />
          <ol className={`grid gap-4 ${story.length === 3 ? "lg:grid-cols-3" : ""}`}>
            {story.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 100} className="flex flex-col rounded-2xl border border-white/15 bg-zinc-950/40 p-6 backdrop-blur-xl sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <V3Tick /> {s.label}
                  </span>
                  <span className="text-sm tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-8 text-lg leading-relaxed font-light text-white/85">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 4 · Related service */}
      {service && (
        <V3Block>
          <div className="grid gap-10 border-y border-white/10 py-12 lg:grid-cols-[2fr_1fr] lg:items-end lg:gap-16">
            <Reveal>
              <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
                <span aria-hidden className="h-px w-6 bg-white/40" />
                Gerelateerde dienst
              </p>
              <h2 className="mt-6 text-4xl font-light leading-[1.04] tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
                {service.title} <span className="text-white/35">{service.subtitle}</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-base leading-relaxed text-white/55">{service.intro}</p>
              <div className="mt-6">
                <V3Button href={`/diensten/${service.slug}`} variant="ghost">Bekijk de dienst</V3Button>
              </div>
            </Reveal>
          </div>
        </V3Block>
      )}

      {/* 5 · Previous / next */}
      <nav aria-label="Andere cases" className={`grid gap-2 px-2 pb-2 sm:grid-cols-2 ${service ? "" : "pt-20"}`}>
        {[
          { c: prev, label: "Vorige case", back: true },
          { c: next, label: "Volgende case", back: false },
        ].map(({ c, label, back }) => (
          <Link key={label} href={caseHref(c)} className={`group relative flex min-h-72 flex-col justify-end overflow-hidden rounded-xl p-6 sm:min-h-96 sm:p-10 ${back ? "" : "sm:items-end sm:text-right"}`}>
            <Image src={c.image} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover opacity-45 transition-[transform,opacity] duration-700 ease-out motion-safe:group-hover:scale-[1.04] group-hover:opacity-60" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-zinc-950/20" />
            <span className="relative flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-white/60 uppercase">
              {back && <V3Arrow className="size-4 rotate-180" />}
              {label}
              {!back && <V3Arrow />}
            </span>
            <span className="relative mt-4 max-w-md text-2xl leading-[1.12] font-light tracking-[-0.02em] text-balance sm:text-4xl">{c.title}</span>
          </Link>
        ))}
      </nav>
    </V3Page>
  );
}
