import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Reveal } from "@/components/scroll";
import { SplitQuote, TypeMarquee } from "@/components/signature";
import Section from "@/components/section";
import { ArrowButton, Eyebrow, SectionHeader } from "@/components/ui";
import VariantSwitcher from "@/components/variant-switcher";
import { googleReviewsUrl, reviews, reviewsHeroImage, reviewsIntro, reviewsMetadata, segmentLabel, segments } from "@/data/reviews";
import { site } from "@/lib/site";

// Reviews 01 — cinematic. Content lives in src/data/reviews.ts (shared with v2/v3).
export const metadata: Metadata = reviewsMetadata;

/** Inline gold star row. `count` filled stars out of 5. */
function Stars({ count = 5, className = "size-5" }: { count?: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`${className} ${i < count ? "text-amber-400" : "text-zinc-300"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94z" />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const [featured, ...rest] = reviews;
  return (
    <PageShell>
      <PageHero
        eyebrow="Reviews"
        title={reviewsIntro.title}
        subtitle={reviewsIntro.subtitle}
        crumbs={[{ label: "Reviews" }]}
        image={reviewsHeroImage}
        badges={[{ label: `${site.reviews.score} / 5 op Google` }, { label: `${site.reviews.clients} klanten` }]}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* Rating */}
      <Section space="loose">
        <div className="grid gap-10 border-t border-zinc-950 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Eyebrow>Google-beoordeling</Eyebrow>
          <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-20">
            <Reveal>
              <p className="text-[7rem] leading-[0.85] font-light tracking-[-0.05em] text-zinc-950 sm:text-[10rem]">{site.reviews.score}</p>
              <div className="mt-6 flex items-center gap-4">
                <Stars count={5} />
                <span className="text-sm text-zinc-500">{site.reviews.count} reviews</span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <p className="max-w-md text-lg leading-relaxed text-zinc-500">
                {reviewsIntro.ratingNote}
              </p>
              <div className="mt-8">
                <ArrowButton href={googleReviewsUrl}>Bekijk op Google</ArrowButton>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Running band: score and audiences */}
      <section aria-hidden className="overflow-hidden pb-10">
        <TypeMarquee
          words={[`${site.reviews.score} op Google`, "Particulieren", `${site.reviews.count} reviews`, "Dealers & bedrijven"]}
          images={["/images/generated/key-handover.jpg", "/images/generated/dealer-loading.jpg", "/fleet/city-street.jpg", "/images/generated/oldtimer-loading.jpg"]}
          speed={55}
        />
      </section>

      {/* Featured quote — portrait photo beside the oversized quote */}
      <Section space="none" bleed>
        <div className="rounded-[2rem] bg-zinc-950 px-6 py-16 sm:px-10 sm:py-24 lg:px-14">
          <SplitQuote
            tone="dark"
            image="/fleet/city-loaded.jpg"
            alt="Een volgeladen Mcars-transporter in de stad"
            quote={featured.quote}
            name={featured.author}
          >
            <Stars count={featured.stars} className="size-4" />
          </SplitQuote>
        </div>
      </Section>

      {/* All quotes */}
      <Section space="loose">
        <SectionHeader
          label="Klantquotes"
          index={String(reviews.length).padStart(2, "0")}
          lead="Van particulieren"
          trail="en van dealers en bedrijven."
          className="mb-16"
        />
        {segments.map((seg, idx) => {
          const items = rest.filter((r) => r.segment === seg.id);
          if (items.length === 0) return null;
          return (
            <div key={seg.id} className={`grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-10 ${idx > 0 ? "mt-20 border-t border-zinc-200 pt-12" : ""}`}>
              <div>
                <p className="text-xl font-medium tracking-tight text-zinc-950">{seg.label}</p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">{seg.body}</p>
              </div>
              <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2">
                {items.map((r, i) => (
                  <Reveal key={r.quote} delay={(i % 2) * 80}>
                    <figure className="flex h-full flex-col border-t border-zinc-950 pt-6">
                      <div className="flex items-center justify-between">
                        <Stars count={r.stars} className="size-3.5" />
                        <span className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{segmentLabel(r.segment)}</span>
                      </div>
                      <blockquote className="mt-8 flex-1 text-lg leading-relaxed tracking-tight text-zinc-800">&ldquo;{r.quote}&rdquo;</blockquote>
                      <figcaption className="mt-8 text-sm font-medium text-zinc-950">{r.author}</figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
        <p className="mt-16 text-sm text-zinc-400">
          {reviewsIntro.disclaimer}
        </p>
      </Section>

      <QuoteCta />
      <VariantSwitcher sectionId="reviews" />
    </PageShell>
  );
}
