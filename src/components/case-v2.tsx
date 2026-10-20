import Image from "next/image";
import Link from "next/link";
import type { CasePageData } from "@/lib/case-page";
import { caseHref } from "@/lib/case-page";
import { Reveal } from "./scroll";
import { V2Arrow, V2Block, V2Button, V2Check, V2Head, V2Hero } from "./v2-kit";

/*
 * Case 02 — "Licht & strak". White Swiss grid: light hero with the case
 * number, a wide photo, bordered fact cells, the story as three columns (the
 * result in black), the related service and previous / next cells.
 */

export default function CaseV2({ data }: { data: CasePageData }) {
  const { item, number, total, prev, next, service, detailImage, facts, story } = data;

  return (
    <div className="bg-white text-zinc-950">
      <V2Hero crumbs={[{ href: "/", label: "Home" }, { href: "/cases", label: "Cases" }, { label: item.tag }]} title={item.title} intro={item.body} count={number}>
        <div className="mt-8 flex flex-wrap gap-3">
          <V2Button href="/offerte">Offerte aanvragen</V2Button>
          {service && (
            <V2Button href={`/diensten/${service.slug}`} variant="outline">
              {service.nav}
            </V2Button>
          )}
        </div>
      </V2Hero>

      {/* Wide photo + fact cells */}
      <section className="px-5 sm:px-12 lg:px-16">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 sm:aspect-[21/9]">
          <Image src={item.image} alt={item.imageAlt} fill priority sizes="100vw" className="object-cover" />
          <span className="absolute top-4 left-4 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-950">
            Case {number} / {total}
          </span>
        </Reveal>
        <dl className={`mt-3 grid gap-3 sm:grid-cols-2 ${facts.length >= 3 ? "lg:grid-cols-3" : ""}`}>
          {facts.map((f) => (
            <div key={f.label} className="rounded-xl border border-zinc-200 p-5 sm:p-6">
              <dt className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">{f.label}</dt>
              <dd className="mt-3 text-lg font-medium tracking-tight break-words">
                {f.href ? (
                  <Link href={f.href} className="inline-flex min-h-11 items-center gap-2 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950">
                    {f.value} <V2Arrow />
                  </Link>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Story */}
      <V2Block>
        <V2Head index="01" label="Het verhaal" lead="Van vraag" trail="tot levering." />
        <ol className={`grid gap-3 ${story.length === 3 ? "lg:grid-cols-3" : ""}`}>
          {story.map((s, i) => {
            const last = i === story.length - 1 && story.length > 1;
            return (
              <Reveal as="li" key={s.label} delay={i * 90} className={`flex min-h-64 flex-col rounded-xl p-6 sm:p-8 ${last ? "bg-zinc-950 text-white" : "border border-zinc-200"}`}>
                <span className={`text-sm tabular-nums ${last ? "text-white/50" : "text-zinc-400"}`}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-10 text-2xl font-medium tracking-tight">{s.label}</h3>
                <p className={`mt-3 text-base leading-relaxed ${last ? "text-white/75" : "text-zinc-500"}`}>{s.body}</p>
              </Reveal>
            );
          })}
        </ol>
      </V2Block>

      {/* Related service */}
      {service && (
        <V2Block className="border-t border-zinc-200">
          <V2Head index="02" label="Dienst" lead="Een gelijkaardig transport?" trail="Zo pakken we het aan." />
          <Reveal className="grid gap-3 lg:grid-cols-2">
            <div className="relative min-h-72 overflow-hidden rounded-xl bg-zinc-100">
              <Image src={detailImage} alt={`${service.nav} door Mcars`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col rounded-xl border border-zinc-200 p-6 sm:p-10">
              <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">{service.category}</p>
              <h3 className="mt-4 text-3xl font-medium tracking-[-0.025em] text-balance">{service.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-zinc-500">{service.intro}</p>
              <ul className="mt-6 grid gap-3 border-t border-zinc-200 pt-6 text-[0.95rem]">
                {service.benefits.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <V2Check className="mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <V2Button href={`/diensten/${service.slug}`} variant="outline">Bekijk de dienst</V2Button>
              </div>
            </div>
          </Reveal>
        </V2Block>
      )}

      {/* Previous / next */}
      <nav aria-label="Andere cases" className="grid gap-3 px-5 pb-4 sm:grid-cols-2 sm:px-12 lg:px-16">
        {[
          { c: prev, label: "Vorige case" },
          { c: next, label: "Volgende case" },
        ].map(({ c, label }) => (
          <Link key={label} href={caseHref(c)} className="group flex items-center gap-4 rounded-xl border border-zinc-200 p-3 transition-colors hover:border-zinc-950 sm:gap-5">
            <span className="relative aspect-[4/3] w-24 flex-none overflow-hidden rounded-md bg-zinc-100 sm:w-32">
              <Image src={c.image} alt="" fill sizes="8rem" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">{label}</span>
              <span className="mt-1.5 block text-base leading-snug font-medium text-balance sm:text-lg">{c.title}</span>
            </span>
            <span className="mr-2 flex size-11 flex-none items-center justify-center rounded-full border border-zinc-200 transition-colors group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white">
              <V2Arrow className={`size-4 ${label === "Vorige case" ? "rotate-180" : ""}`} />
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
