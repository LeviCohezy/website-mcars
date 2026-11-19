import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqAccordion, HighlightGrid, MediaBand, QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { Eyebrow, SectionHeader } from "@/components/ui";
import type { Faq, Highlight, ProcessStep } from "@/data/services";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PageHoeWerktHet" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const cmrIcons: Highlight["icon"][] = ["shield", "box", "check"];

export default async function HoeWerktHetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PageHoeWerktHet");
  const stappen = t.raw("steps") as ProcessStep[];
  const cmr: Highlight[] = (t.raw("cmr") as { title: string; body: string }[]).map((c, i) => ({ icon: cmrIcons[i], ...c }));
  const faq = t.raw("faq") as Faq[];
  return (
    <PageShell>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        crumbs={[{ label: t("hero.crumb") }]}
        image="/fleet/countryside.jpg"
        badges={[{ label: t("hero.badgeAnswer") }, { label: t("hero.badgeCmr") }]}
        primaryCta={{ label: t("hero.cta"), href: "/offerte" }}
      />

      {/* Six steps — large ruled rows */}
      <Section space="loose">
        <SectionHeader label={t("stepsHeader.label")} index="06" lead={t("stepsHeader.lead")} trail={t("stepsHeader.trail")} className="mb-14" />
        <ol className="border-t border-zinc-950">
          {stappen.map((stap, i) => (
            <Reveal
              as="li"
              key={stap.title}
              delay={i * 60}
              className="grid gap-4 border-b border-zinc-200 py-10 sm:grid-cols-[6rem_1fr] lg:grid-cols-[1fr_1.4fr_1.6fr] lg:gap-10 lg:py-12"
            >
              <span className="text-5xl font-light tracking-[-0.04em] tabular-nums text-zinc-300 sm:text-6xl lg:text-7xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl lg:pt-2">{stap.title}</h3>
              <p className="max-w-xl text-base leading-relaxed text-zinc-500 sm:col-start-2 lg:col-start-auto lg:pt-3 lg:text-lg">
                {stap.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section space="none" bleed>
        <MediaBand image="/fleet/city-loaded.jpg" line={t("media.line")} caption={t("media.caption")} />
      </Section>

      {/* Why CMR */}
      <Section space="loose">
        <SectionHeader
          label={t("cmrHeader.label")}
          index="01"
          lead={t("cmrHeader.lead")}
          trail={t("cmrHeader.trail")}
          intro={t("cmrHeader.intro")}
          className="mb-16"
        />
        <HighlightGrid items={cmr} />
      </Section>

      {/* FAQ */}
      <Section space="none">
        <div className="grid gap-10 border-t border-zinc-200 pt-6 lg:grid-cols-[1fr_3fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>{t("faqSection.eyebrow")}</Eyebrow>
          </div>
          <div>
            <h2 className="max-w-3xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl lg:text-[3.25rem]">
              {t.rich("faqSection.title", { muted: (c) => <span className="text-zinc-400">{c}</span> })}
            </h2>
            <div className="mt-12">
              <FaqAccordion items={faq} />
            </div>
          </div>
        </div>
      </Section>

      <QuoteCta />
    </PageShell>
  );
}
