"use client";

import { useState } from "react";
import { googleReviewsUrl, reviews, reviewsHeroImage, reviewsIntro, segmentLabel, segments, type Review, type ReviewSegment } from "@/data/reviews";
import { site } from "@/lib/site";
import {
  Chapter,
  ChapterIntro,
  ClipImage,
  Figures,
  FlowButton,
  FlowClose,
  FlowGrid,
  FlowHero,
  FlowPage,
  ImageBridge,
  IndexRow,
  Rise,
  ScrollWords,
  toneClasses,
  type FlowTone,
} from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * Reviews as one composed film. Same story in every version:
 *
 *   hero+form → 01 score → [bridge] → 02 featured quote →
 *   03 all quotes (split or filtered) → 04 voor wie → close
 *
 *   01 cinema    light → (bridge) dark → light curtain → paper → dark close
 *   02 wordmark  light → (bridge) paper → light → paper → dark close; quotes behind a filter
 *   03 lines     dark throughout, 03 (quotes, filtered) is the paper interlude
 */

type Version = 1 | 2 | 3;

const TONES: Record<Version, { page: FlowTone; score: FlowTone; featured: FlowTone; quotes: FlowTone; audience: FlowTone }> = {
  1: { page: "light", score: "light", featured: "dark", quotes: "light", audience: "paper" },
  2: { page: "light", score: "light", featured: "paper", quotes: "light", audience: "paper" },
  3: { page: "dark", score: "dark", featured: "dark", quotes: "paper", audience: "dark" },
};

const SEGMENT_IMAGES: Record<ReviewSegment, string> = {
  particulier: "/images/generated/key-handover.jpg",
  zakelijk: "/images/generated/dealer-loading.jpg",
};

export default function ReviewsFlow({ version }: { version: Version }) {
  const T = TONES[version];
  const formTone = version === 1 ? "glass" : version === 2 ? "light" : "dark";
  const onLight = version === 2;
  const [featured, ...rest] = reviews;

  const proof = (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${onLight ? "text-zinc-500" : "text-white/70"}`}>
      <span className="flex items-center gap-2">
        <Stars count={5} className="size-3.5" />
        <b className={onLight ? "font-medium text-zinc-950" : "font-medium text-white"}>{site.reviews.score}/5</b> op Google
      </span>
      <span aria-hidden>·</span>
      <span>{site.reviews.count} reviews</span>
      <span aria-hidden>·</span>
      <span>{site.reviews.clients} klanten</span>
    </div>
  );

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={version === 1 ? "cinema" : version === 2 ? "wordmark" : "lines"}
        title={reviewsIntro.title}
        intro={reviewsIntro.subtitle}
        crumbs={[{ href: "/", label: "Home" }, { label: "Reviews" }]}
        image={version === 2 ? "/images/generated/truck-studio.jpg" : reviewsHeroImage}
        imageAlt={version === 2 ? "Zijaanzicht van een volgeladen Mcars-autotransporter" : "Een klant krijgt een update over haar transport"}
        wordmark="REVIEWS"
        lineImages={["/images/generated/key-handover.jpg", "/images/generated/dealer-loading.jpg"]}
        aside={proof}
        form={<QuoteFlow tone={formTone} />}
      />

      {/* 01 — the score */}
      <Chapter n="01" label="Google-beoordeling" tone={T.score} className="pb-12 sm:pb-16">
        <ChapterIntro
          lead={`Een ${site.reviews.score} op 5,`}
          trail="van particulieren én dealers."
          body={reviewsIntro.ratingNote}
          action={<FlowButton href={googleReviewsUrl} variant="ghost">Bekijk op Google</FlowButton>}
        />
        <div className="mt-14 sm:mt-20">
          <Figures
            items={[
              { value: site.reviews.score, label: "Score op Google" },
              { value: String(site.reviews.count), label: "Google-reviews" },
              { value: site.reviews.clients, label: "Tevreden klanten" },
              { value: String(site.founded), label: "Sinds" },
            ]}
          />
        </div>
      </Chapter>

      <div>
        <ImageBridge src="/fleet/city-loaded.jpg" alt="Een volgeladen Mcars-transporter in de stad" from={T.score} to={T.featured} />
      </div>

      {/* 02 — one quote, large */}
      <Chapter n="02" label="Uitgelicht" tone={T.featured}>
        <ChapterIntro lead="In de woorden" trail="van een klant." />
        <Featured review={featured} tone={T.featured} />
      </Chapter>

      {/* 03 — every quote: split by audience (01) or behind a filter (02/03) */}
      <Chapter n="03" label="Klantquotes" tone={T.quotes} curtain={T.quotes !== T.featured}>
        <ChapterIntro lead="Van particulieren" trail="en van dealers en bedrijven." />
        {version === 1 ? <SplitQuotes items={rest} tone={T.quotes} /> : <FilteredQuotes items={rest} tone={T.quotes} />}
        <FlowGrid className="mt-14">
          <p className={`max-w-xl text-sm leading-relaxed lg:ml-[25%] ${toneClasses(T.quotes).faint}`}>{reviewsIntro.disclaimer}</p>
        </FlowGrid>
      </Chapter>

      {/* 04 — for whom: the two audiences, each leading to its service */}
      <Chapter n="04" label="Voor wie" tone={T.audience} curtain={T.audience !== T.quotes}>
        <ChapterIntro lead="Particulieren én dealers," trail="dezelfde zorg per rit." action={<FlowButton href={googleReviewsUrl}>Alle reviews op Google</FlowButton>} />
        <div className="mt-12 sm:mt-16">
          <IndexRow
            items={segments.map((s) => ({
              title: s.label,
              body: s.body,
              href: s.href,
              image: SEGMENT_IMAGES[s.id],
              meta: `${reviews.filter((r) => r.segment === s.id).length} quotes`,
            }))}
          />
        </div>
      </Chapter>

      <FlowClose
        lead="Rijdt uw wagen"
        trail="straks ook met ons mee?"
        form={<QuoteFlow tone="dark" />}
        contact={
          <dl className="grid gap-5 text-sm sm:grid-cols-2">
            <div><dt className="text-white/40">Rechtstreeks bellen</dt><dd className="mt-1"><a href={site.phoneHref} className="inline-block py-2 text-lg text-white">{site.phone}</a></dd></div>
            <div><dt className="text-white/40">Mailen</dt><dd className="mt-1"><a href={`mailto:${site.email}`} className="inline-block py-2 text-lg text-white">{site.email}</a></dd></div>
          </dl>
        }
      />
    </FlowPage>
  );
}

/** Monochrome star row — the flow palette is black/white/zinc only. */
function Stars({ count = 5, className = "size-4" }: { count?: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${count} op 5 sterren`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`${className} ${i < count ? "" : "opacity-25"}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94z" />
        </svg>
      ))}
    </span>
  );
}

function Featured({ review, tone }: { review: Review; tone: FlowTone }) {
  const t = toneClasses(tone);
  return (
    <FlowGrid className="mt-14 sm:mt-20">
      <figure className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-end lg:gap-16">
        <ClipImage src="/images/generated/key-handover.jpg" alt="Een chauffeur van Mcars overhandigt de sleutels aan een klant" parallax sizes="(min-width:1024px) 30vw, 100vw" className="aspect-[4/5] rounded-[1.5rem] sm:rounded-[2rem]" />
        <div>
          <Stars count={review.stars} />
          <blockquote className="mt-8 text-[1.7rem] leading-[1.18] font-light tracking-[-0.03em] sm:text-4xl lg:text-[3.1rem] lg:leading-[1.1]">
            &ldquo;<ScrollWords text={review.quote} />&rdquo;
          </blockquote>
          <figcaption className={`mt-10 flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase ${t.muted}`}>
            <span aria-hidden className={`h-px w-8 ${tone === "dark" ? "bg-white/30" : "bg-zinc-950/25"}`} />
            {review.author}
          </figcaption>
        </div>
      </figure>
    </FlowGrid>
  );
}

/** A quote on a hairline — the one card style on this page. */
function Quote({ r, tone, delay }: { r: Review; tone: FlowTone; delay: number }) {
  const t = toneClasses(tone);
  return (
    <Rise delay={delay} className="h-full">
      <figure className={`flex h-full flex-col border-t pt-6 ${tone === "dark" ? "border-white/40" : "border-zinc-950"}`}>
        <div className={`flex items-center justify-between gap-4 ${t.muted}`}>
          <Stars count={r.stars} className="size-3.5" />
          <span className={`font-mono text-[10px] tracking-[0.18em] uppercase ${t.faint}`}>{segmentLabel(r.segment)}</span>
        </div>
        <blockquote className="mt-7 flex-1 text-lg leading-relaxed font-light tracking-[-0.01em] sm:text-xl">&ldquo;{r.quote}&rdquo;</blockquote>
        <figcaption className={`mt-7 text-sm ${t.muted}`}>{r.author}</figcaption>
      </figure>
    </Rise>
  );
}

function SplitQuotes({ items, tone }: { items: Review[]; tone: FlowTone }) {
  const t = toneClasses(tone);
  return (
    <FlowGrid className="mt-14 sm:mt-20">
      {segments.map((seg, idx) => {
        const list = items.filter((r) => r.segment === seg.id);
        if (!list.length) return null;
        return (
          <div key={seg.id} className={`grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-0 ${idx > 0 ? "mt-20 sm:mt-24" : ""}`}>
            <div className="lg:pr-10">
              <p className={`font-mono text-[11px] tracking-[0.2em] ${t.faint}`}>{String(idx + 1).padStart(2, "0")} · {list.length} quotes</p>
              <h3 className="mt-3 text-2xl font-light tracking-[-0.025em] sm:text-3xl">{seg.label}</h3>
              <p className={`mt-3 max-w-xs text-sm leading-relaxed ${t.muted}`}>{seg.body}</p>
            </div>
            <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2">
              {list.map((r, i) => (
                <Quote key={r.quote} r={r} tone={tone} delay={(i % 2) * 80} />
              ))}
            </div>
          </div>
        );
      })}
    </FlowGrid>
  );
}

type Filter = "alle" | ReviewSegment;

function FilteredQuotes({ items, tone }: { items: Review[]; tone: FlowTone }) {
  const [filter, setFilter] = useState<Filter>("alle");
  const t = toneClasses(tone);
  const dark = tone === "dark";
  const shown = filter === "alle" ? items : items.filter((r) => r.segment === filter);
  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "alle", label: "Alle", count: items.length },
    ...segments.map((s) => ({ id: s.id as Filter, label: s.label, count: items.filter((r) => r.segment === s.id).length })),
  ];
  return (
    <FlowGrid className="mt-12 sm:mt-16">
      <div className="lg:ml-[25%]">
        <div role="tablist" aria-label="Filter op klant" className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto px-5 pb-1 sm:scroll-px-0 [scrollbar-width:none] sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const on = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(tab.id)}
                className={`inline-flex min-h-11 flex-none snap-start items-center gap-2.5 rounded-full px-5 text-sm transition-colors ${
                  on
                    ? dark ? "bg-white text-zinc-950" : "bg-zinc-950 text-white"
                    : dark ? "ring-1 ring-white/20 text-white/70 hover:ring-white/50" : "ring-1 ring-zinc-950/15 text-zinc-600 hover:ring-zinc-950/40"
                }`}
              >
                {tab.label}
                <span className={`font-mono text-[11px] ${on ? (dark ? "text-zinc-400" : "text-white/50") : t.faint}`}>{tab.count}</span>
              </button>
            );
          })}
        </div>
        <div key={filter} className="mt-12 grid gap-x-10 gap-y-14 sm:grid-cols-2">
          {shown.map((r, i) => (
            <Quote key={r.quote} r={r} tone={tone} delay={(i % 2) * 80} />
          ))}
        </div>
      </div>
    </FlowGrid>
  );
}
