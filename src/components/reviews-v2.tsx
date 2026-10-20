"use client";

import Link from "next/link";
import { useState } from "react";
import { googleReviewsUrl, reviews, reviewsIntro, segmentLabel, segments, type ReviewSegment } from "@/data/reviews";
import { site } from "@/lib/site";
import { Reveal } from "./scroll";
import { MosaicGallery, SplitQuote } from "./signature";
import { V2Arrow, V2Block, V2Button, V2Head, V2Hero } from "./v2-kit";

/*
 * Reviews 02 — "Licht & strak". A Swiss grid of bordered quote cells with one
 * big black score cell, a segmented filter (particulieren / dealers &
 * bedrijven) and a two-cell segment split. Same content as /reviews.
 */

type Filter = "alle" | ReviewSegment;

function Stars({ count, className = "size-3.5", dim = "text-zinc-300" }: { count: number; className?: string; dim?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${count} op 5 sterren`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`${className} ${i < count ? "text-amber-400" : dim}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94z" />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewsV2() {
  const [filter, setFilter] = useState<Filter>("alle");
  const shown = filter === "alle" ? reviews : reviews.filter((r) => r.segment === filter);
  const spotlight = reviews.find((r) => r.segment === "zakelijk") ?? reviews[0];
  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "alle", label: "Alle", count: reviews.length },
    ...segments.map((s) => ({ id: s.id, label: s.label, count: reviews.filter((r) => r.segment === s.id).length })),
  ];

  return (
    <div className="bg-white text-zinc-950">
      <V2Hero crumbs={[{ href: "/", label: "Home" }, { label: "Reviews" }]} title={reviewsIntro.title} intro={reviewsIntro.subtitle} count={String(reviews.length).padStart(2, "0")}>
        <div className="mt-8 flex flex-wrap gap-3">
          <V2Button href="#quotes">Lees de reviews</V2Button>
          <V2Button href="/offerte" variant="outline">Offerte aanvragen</V2Button>
        </div>
      </V2Hero>

      {/* 1 · Quote grid with the big score cell */}
      <V2Block id="quotes" className="scroll-mt-24 pt-4 sm:pt-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex gap-3 text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">
            <span className="text-zinc-950">01</span> Klantquotes
          </p>
          <div className="-mx-5 flex gap-1 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
            <div role="tablist" aria-label="Filter reviews" className="flex flex-none gap-1 rounded-lg border border-zinc-200 p-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === t.id}
                  onClick={() => setFilter(t.id)}
                  className={`inline-flex min-h-11 flex-none items-center gap-2 rounded-md px-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === t.id ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {t.label}
                  <span className={`tabular-nums ${filter === t.id ? "text-white/50" : "text-zinc-400"}`}>{t.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Spotlight quote — portrait beside an oversized quote (an existing review from the data) */}
        <div className="mb-16 border-b border-zinc-200 pb-16">
          <SplitQuote
            radius="rounded-md"
            image="/images/generated/dealer-loading.jpg"
            alt="Een SUV wordt bij een autohandelaar op een Mcars-transporter geladen"
            quote={spotlight.quote}
            name={spotlight.author}
            role={segmentLabel(spotlight.segment)}
          />
        </div>

        <div className="grid gap-px overflow-hidden rounded-md border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
          {/* Score cell */}
          <div className="flex min-h-[26rem] flex-col bg-zinc-950 p-6 text-white sm:col-span-2 sm:p-8 lg:col-span-1 lg:row-span-2">
            <p className="text-xs font-medium tracking-[0.18em] text-white/50 uppercase">Google-beoordeling</p>
            <p className="mt-auto pt-10 text-[7rem] leading-[0.85] font-light tracking-[-0.06em] tabular-nums sm:text-[9rem]">{site.reviews.score}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Stars count={5} className="size-5" dim="text-white/20" />
              <span className="text-sm text-white/60">{site.reviews.count} reviews</span>
            </div>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-white/60">{reviewsIntro.ratingNote}</p>
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-11 items-center gap-2 self-start rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              Bekijk op Google <V2Arrow />
            </a>
          </div>

          {shown.map((r) => (
            <figure key={r.quote} className="flex min-h-64 flex-col bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <Stars count={r.stars} />
                <span className="rounded-sm border border-zinc-200 px-2 py-1 text-[0.7rem] font-medium tracking-[0.14em] text-zinc-500 uppercase">{segmentLabel(r.segment)}</span>
              </div>
              <blockquote className="mt-6 flex-1 text-[1.05rem] leading-relaxed tracking-tight text-zinc-800">&ldquo;{r.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 border-t border-zinc-200 pt-4 text-sm font-medium">{r.author}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-sm text-zinc-400">{reviewsIntro.disclaimer}</p>
      </V2Block>

      {/* 2 · Segment split — particulieren vs dealers & bedrijven */}
      <V2Block className="bg-zinc-100">
        <V2Head index="02" label="Voor wie" lead="Particulieren én dealers," trail="dezelfde zorg per rit." />
        <div className="grid gap-px overflow-hidden rounded-md border border-zinc-200 bg-zinc-200 md:grid-cols-2">
          {segments.map((s, i) => {
            const n = reviews.filter((r) => r.segment === s.id).length;
            return (
              <Reveal key={s.id} delay={i * 80} className="flex flex-col bg-white p-6 sm:p-10">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{s.label}</h3>
                  <span className="text-5xl leading-none font-light tracking-[-0.05em] text-zinc-200 tabular-nums">{String(n).padStart(2, "0")}</span>
                </div>
                <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-zinc-500">{s.body}</p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFilter(s.id);
                      document.getElementById("quotes")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-950 px-5 py-3 text-sm font-medium transition-colors hover:bg-zinc-950 hover:text-white"
                  >
                    Toon {n} quotes
                  </button>
                  <Link href={s.href} className="inline-flex min-h-11 items-center gap-2 px-2 py-3 text-sm font-medium text-zinc-600 hover:text-zinc-950">
                    Bekijk de dienst <V2Arrow />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-4">
          <MosaicGallery
            radius="rounded-md"
            images={[
              { title: "Particulieren", image: "/images/generated/key-handover.jpg", alt: "Sleuteloverdracht bij een particuliere klant" },
              { title: "Dealers", image: "/images/generated/dealer-loading.jpg", alt: "Laden bij een autohandelaar" },
              { title: "Klassiekers", image: "/images/generated/oldtimer-loading.jpg", alt: "Een klassieke sportwagen wordt geladen" },
              { title: "Opvolging", image: "/images/generated/customer-update.jpg", alt: "Een klant krijgt een update over haar transport" },
            ]}
            figure={{ value: site.reviews.score, label: "Gemiddeld op Google", body: `${site.reviews.count} reviews · ${site.reviews.clients} klanten · actief sinds ${site.founded}` }}
          />
        </div>
      </V2Block>
    </div>
  );
}
