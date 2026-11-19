import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqAccordion, QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import Section from "@/components/section";
import { ArrowButton, Eyebrow } from "@/components/ui";
import type { Faq } from "@/data/services";
import { site } from "@/lib/site";

type Group = { eyebrow: string; title: string; trail: string; items: Faq[] };

// Anchor ids stay the Dutch slugs in every language (same order as the groups in messages).
const groupIds = ["prijzen", "verzekering", "ophaling-en-levering", "buitenland-transport", "niet-rijdende-voertuigen", "documenten", "betaling", "spoedtransport"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "PageFaq" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PageFaq");
  const groups = t.raw("groups") as Group[];
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  return (
    <PageShell>
      <PageHero
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        crumbs={[{ label: t("crumb") }]}
        image="/fleet/countryside-highway.jpg"
        badges={[{ label: t("badgeAnswers", { count: total }) }, { label: t("badgeTopics", { count: groups.length }) }]}
        primaryCta={{ label: t("cta"), href: "/offerte" }}
      />

      {/* Topic index */}
      <Section space="tight">
        <nav aria-label={t("topics")} className="grid gap-6 border-t border-zinc-950 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Eyebrow>{t("topics")}</Eyebrow>
          <ul className="flex flex-wrap gap-2">
            {groups.map((g, i) => (
              <li key={groupIds[i]}>
                <a
                  href={`#${groupIds[i]}`}
                  className="inline-flex items-center gap-2.5 rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950"
                >
                  <span className="text-xs tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                  {g.eyebrow}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <Section space="flush-top">
        <div className="flex flex-col gap-24">
          {groups.map((g, i) => (
            <div
              key={groupIds[i]}
              id={groupIds[i]}
              className="grid scroll-mt-28 gap-10 border-t border-zinc-200 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10"
            >
              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center justify-between gap-4 lg:block">
                  <Eyebrow>{g.eyebrow}</Eyebrow>
                  <span className="text-xs tabular-nums text-zinc-400 lg:mt-3 lg:block lg:pl-4">{String(i + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}</span>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl">
                  {g.title} <span className="text-zinc-400">{g.trail}</span>
                </h2>
                <div className="mt-10">
                  <FaqAccordion items={g.items} defaultOpen={i === 0 ? 0 : null} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Still a question */}
      <Section space="none">
        <div className="grid gap-10 border-t border-zinc-950 pt-6 lg:grid-cols-[1fr_3fr]">
          <Eyebrow>{t("stillEyebrow")}</Eyebrow>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-2xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl lg:text-[3.25rem]">
                {t.rich("stillTitle", { muted: (c) => <span className="text-zinc-400">{c}</span> })}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500">
                {t("stillText")}
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <ArrowButton href="/contact">{t("contactCta")}</ArrowButton>
              <a href={site.phoneHref} className="text-sm text-zinc-500 transition-colors hover:text-zinc-950">
                {t("callUs", { phone: site.phone })}
              </a>
            </div>
          </div>
        </div>
      </Section>

      <QuoteCta />
    </PageShell>
  );
}
