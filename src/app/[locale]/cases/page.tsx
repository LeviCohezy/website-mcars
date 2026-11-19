import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { StatRow, QuoteCta } from "@/components/blocks";
import { Parallax, Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { SectionHeader } from "@/components/ui";
import { cases as casesData } from "@/data/cases";
import { localize } from "@/i18n/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PageCases" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function CasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PageCases");
  const cases = localize(locale, casesData);
  const [featured, ...rest] = cases;
  return (
    <PageShell>
      <PageHero
        size="full"
        screen
        marquee={false}
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        crumbs={[{ label: t("hero.crumb") }]}
        image="/fleet/city-loaded.jpg"
        badges={[{ label: t("hero.badgeCount", { count: cases.length }) }, { label: t("hero.badgeSegment") }]}
        primaryCta={{ label: t("hero.cta"), href: "/offerte" }}
      />

      <Section space="loose">
        <SectionHeader
          label={t("header.label")}
          index={String(cases.length).padStart(2, "0")}
          lead={t("header.lead")}
          trail={t("header.trail")}
          intro={t("header.intro")}
          className="mb-16"
        />

        {/* Featured case */}
        <Reveal>
          <article className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-14">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-zinc-100">
              <Parallax speed={0.06} className="absolute inset-x-0 -top-[15%] h-[130%]">
                <Image src={featured.image} alt={featured.title} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              </Parallax>
            </div>
            <div className="border-t border-zinc-950 pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{featured.tag}</p>
                <span className="text-xs tabular-nums text-zinc-400">01</span>
              </div>
              <h2 className="mt-6 text-3xl font-medium leading-[1.1] tracking-[-0.025em] text-zinc-950 sm:text-4xl">{featured.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-zinc-500">{featured.body}</p>
            </div>
          </article>
        </Reveal>

        <div className="mt-24 grid gap-x-6 gap-y-16 md:grid-cols-2">
          {rest.map((c, i) => {
            const wide = rest.length % 2 === 1 && i === rest.length - 1;
            return (
            <Reveal key={c.title} delay={(i % 2) * 100} className={wide ? "md:col-span-2" : ""}>
              <article className="group">
                <div className={`relative overflow-hidden rounded-[2rem] bg-zinc-100 ${wide ? "aspect-[4/3] md:aspect-[21/9]" : "aspect-[4/3]"}`}>
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes={wide ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-zinc-200 pt-4">
                  <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{c.tag}</p>
                  <span className="text-xs tabular-nums text-zinc-400">{String(i + 2).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-4 text-2xl font-medium tracking-tight text-zinc-950">{c.title}</h3>
                <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-zinc-500">{c.body}</p>
              </article>
            </Reveal>
            );
          })}
        </div>
      </Section>

      <Section space="none">
        <SectionHeader label={t("impact.label")} lead={t("impact.lead")} trail={t("impact.trail")} className="mb-12" />
        <div className="grid lg:grid-cols-[1fr_3fr] lg:gap-10">
          <div className="hidden lg:block" />
          <StatRow
            items={[
              { value: "3000+", label: t("impact.clients") },
              { value: "20+", label: t("impact.experience") },
              { value: t("impact.weekly"), label: t("impact.france") },
            ]}
          />
        </div>
      </Section>

      <QuoteCta />
    </PageShell>
  );
}
