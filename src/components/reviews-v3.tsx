"use client";

import { useState } from "react";
import { googleReviewsUrl, reviewInitials, reviews, reviewsHeroImage, reviewsIntro, segmentLabel, segments, type ReviewSegment } from "@/data/reviews";
import { site } from "@/lib/site";
import Icon from "./icon";
import { Reveal } from "./scroll";
import { ImageAccordion, TypeMarquee } from "./signature";
import { V3Arrow, V3Block, V3Button, V3Head, V3Hero, V3Page, V3Star } from "./v3-kit";

/*
 * Reviews 03 — "Donker & premium". GlobalShip-style: a stats row of big
 * figures under the hero, one oversized featured quote, then the quotes as
 * list rows (avatar, stars, segment) behind a particulier / zakelijk filter.
 * Same content as /reviews.
 */

type Filter = "alle" | ReviewSegment;

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${count} op 5 sterren`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "" : "opacity-25 grayscale"}>
          <V3Star />
        </span>
      ))}
    </span>
  );
}

export default function ReviewsV3() {
  const [featured, ...rest] = reviews;
  const [filter, setFilter] = useState<Filter>("alle");
  const shown = filter === "alle" ? rest : rest.filter((r) => r.segment === filter);
  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "alle", label: "Alle", count: rest.length },
    ...segments.map((s) => ({ id: s.id, label: s.label, count: rest.filter((r) => r.segment === s.id).length })),
  ];

  const stats = [
    { value: site.reviews.score, label: "gemiddelde score op Google" },
    { value: String(site.reviews.count), label: "Google-reviews" },
    { value: site.reviews.clients, label: "klanten geholpen" },
    { value: String(site.founded), label: "actief sinds" },
  ];

  return (
    <V3Page>
      <V3Hero short image={reviewsHeroImage} crumbs={[{ href: "/", label: "Home" }, { label: "Reviews" }]} title={reviewsIntro.title} intro={reviewsIntro.subtitle}>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <V3Button href="#quotes">Lees de reviews</V3Button>
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/60"
          >
            <V3Star /> Bekijk op Google <V3Arrow />
          </a>
        </div>
      </V3Hero>

      {/* 1 · Stats row */}
      <V3Block className="pt-12 sm:pt-16">
        <dl className="grid grid-cols-2 border-y border-white/10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 80}
              className={`flex flex-col-reverse py-8 sm:py-10 ${i % 2 === 1 ? "border-l border-white/10 pl-5 sm:pl-8" : "pr-5"} ${i >= 2 ? "border-t border-white/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""}`}
            >
              <dt className="mt-3 text-sm text-white/50">{s.label}</dt>
              <dd className="flex items-baseline gap-3 text-5xl font-light tracking-[-0.05em] tabular-nums sm:text-8xl">
                {s.value}
                {i === 0 && <span className="hidden text-base tracking-normal text-white/40 sm:inline">/ 5</span>}
              </dd>
            </Reveal>
          ))}
        </dl>
      </V3Block>

      {/* Running band before the featured quote */}
      <section aria-hidden className="overflow-hidden pb-16">
        <TypeMarquee
          tone="dark"
          words={[`${site.reviews.score} / 5`, "Particulieren", "Dealers", `${site.reviews.count} reviews`]}
          images={["/images/generated/customer-update.jpg", "/images/generated/night-motorway.jpg", "/images/generated/dealer-loading.jpg", "/fleet/sunset-parking.jpg"]}
          speed={60}
        />
      </section>

      {/* 2 · Featured quote */}
      <V3Block className="pt-0 sm:pt-0">
        <Reveal as="figure" className="mx-auto max-w-5xl text-center">
          <div className="flex justify-center"><Stars count={featured.stars} /></div>
          <blockquote className="mt-8 text-3xl leading-[1.18] font-light tracking-[-0.03em] text-balance sm:text-5xl lg:text-[3.5rem]">
            &ldquo;{featured.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-10 text-sm text-white/50">
            <span className="text-white">{featured.author}</span>
          </figcaption>
        </Reveal>
      </V3Block>

      {/* 3 · Testimonial list rows with filter */}
      <V3Block id="quotes" className="scroll-mt-24 bg-zinc-900">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <V3Head label="Klantquotes" lead="Van particulieren" trail="en van dealers en bedrijven." />
          <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:mb-14">
            <div role="tablist" aria-label="Filter reviews" className="inline-flex gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === t.id}
                  onClick={() => setFilter(t.id)}
                  className={`inline-flex min-h-11 flex-none items-center gap-2 rounded-full px-5 text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === t.id ? "bg-white text-zinc-950" : "text-white/60 hover:text-white"
                  }`}
                >
                  {t.label}
                  <span className={`tabular-nums ${filter === t.id ? "text-zinc-400" : "text-white/35"}`}>{t.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <ul className="border-t border-white/10">
          {shown.map((r) => {
            const initials = reviewInitials(r.author);
            return (
              <li key={r.quote} className="grid gap-5 border-b border-white/10 py-8 sm:py-10 md:grid-cols-[16rem_1fr_auto] md:gap-10">
                <div className="flex items-center gap-4">
                  <span className="flex size-12 flex-none items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-sm font-medium">
                    {initials ?? <Icon name={r.segment === "zakelijk" ? "car" : "users"} className="size-5 text-white/70" />}
                  </span>
                  <div>
                    <p className="font-medium">{r.author}</p>
                    {!r.author.toLowerCase().includes(segmentLabel(r.segment).toLowerCase()) && <p className="mt-0.5 text-sm text-white/45">{segmentLabel(r.segment)}</p>}
                  </div>
                </div>
                <blockquote className="text-lg leading-relaxed font-light text-white/80 sm:text-xl">&ldquo;{r.quote}&rdquo;</blockquote>
                <div className="md:pt-1"><Stars count={r.stars} /></div>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-sm text-white/40">{reviewsIntro.disclaimer}</p>
      </V3Block>

      {/* 4 · Segment split */}
      <V3Block>
        <V3Head center label="Voor wie" lead="Particulieren én dealers," trail="dezelfde zorg per rit." />
        <ImageAccordion
          items={segments.map((sg) => ({
            title: sg.label,
            body: sg.body,
            href: sg.href,
            meta: `${reviews.filter((r) => r.segment === sg.id).length} quotes`,
            ...(sg.id === "zakelijk"
              ? { image: "/images/generated/dealer-loading.jpg", alt: "Laden bij een autohandelaar" }
              : { image: "/images/generated/key-handover.jpg", alt: "Sleuteloverdracht bij een particuliere klant" }),
          }))}
        />
      </V3Block>
    </V3Page>
  );
}
