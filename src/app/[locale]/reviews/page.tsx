import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { ArrowButton, Eyebrow, SectionHeader } from "@/components/ui";
import { reviews as reviewsData } from "@/data/reviews";
import { localize } from "@/i18n/data";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PageReviews" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

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

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PageReviews");
  const reviews = localize(locale, reviewsData);
  const [featured, ...rest] = reviews;
  return (
    <PageShell>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        crumbs={[{ label: t("hero.crumb") }]}
        image="/fleet/spain-palms.jpg"
        badges={[{ label: t("hero.badgeScore", { score: site.reviews.score }) }, { label: t("hero.badgeClients", { clients: site.reviews.clients }) }]}
        primaryCta={{ label: t("hero.cta"), href: "/offerte" }}
      />

      {/* Rating */}
      <Section space="loose">
        <div className="grid gap-10 border-t border-zinc-950 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Eyebrow>{t("rating.eyebrow")}</Eyebrow>
          <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-20">
            <Reveal>
              <p className="text-[7rem] leading-[0.85] font-light tracking-[-0.05em] text-zinc-950 sm:text-[10rem]">{site.reviews.score}</p>
              <div className="mt-6 flex items-center gap-4">
                <Stars count={5} />
                <span className="text-sm text-zinc-500">{t("rating.reviews", { count: site.reviews.count })}</span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <p className="max-w-md text-lg leading-relaxed text-zinc-500">
                {t("rating.body")}
              </p>
              <div className="mt-8">
                <ArrowButton href="https://www.google.com/search?q=Mcars+Roeselare+reviews">{t("rating.cta")}</ArrowButton>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Featured quote */}
      <Section space="none" bleed>
        <div className="rounded-[2rem] bg-zinc-950 px-6 py-16 sm:px-10 sm:py-24 lg:px-14">
          <figure className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-10">
            <div>
              <Stars count={featured.stars} className="size-4" />
            </div>
            <div>
              <Reveal>
                <blockquote className="max-w-4xl text-3xl font-light leading-[1.2] tracking-[-0.025em] text-balance text-white sm:text-4xl lg:text-5xl">
                  &ldquo;{featured.quote}&rdquo;
                </blockquote>
              </Reveal>
              <figcaption className="mt-10 flex items-center gap-4 border-t border-white/15 pt-6 text-sm">
                <span className="font-medium text-white">{featured.author}</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </Section>

      {/* All quotes */}
      <Section space="loose">
        <SectionHeader
          label={t("quotes.label")}
          index={String(reviews.length).padStart(2, "0")}
          lead={t("quotes.lead")}
          trail={t("quotes.trail")}
          className="mb-16"
        />
        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((r, i) => (
            <Reveal key={r.quote} delay={(i % 3) * 80}>
              <figure className="flex h-full flex-col border-t border-zinc-950 pt-6">
                <div className="flex items-center justify-between">
                  <Stars count={r.stars} className="size-3.5" />
                  <span className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{r.segment}</span>
                </div>
                <blockquote className="mt-8 flex-1 text-lg leading-relaxed tracking-tight text-zinc-800">&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption className="mt-8 text-sm font-medium text-zinc-950">{r.author}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-16 text-sm text-zinc-400">
          {t("quotes.note")}
        </p>
      </Section>

      <QuoteCta />
    </PageShell>
  );
}
