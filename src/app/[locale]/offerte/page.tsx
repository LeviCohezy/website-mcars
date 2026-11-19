import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqAccordion, HighlightGrid } from "@/components/blocks";
import PageShell from "@/components/page-shell";
import OfferteForm from "@/components/offerte-form";
import { Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { ArrowButton, Eyebrow, SectionHeader } from "@/components/ui";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import type { Faq, Highlight } from "@/data/services";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "PageOfferte" });
  return { title: t("meta.title"), description: t("meta.description") };
}

const factorIcons = ["route", "car", "wrench", "box", "clock", "globe"] as const;

export default async function OffertePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PageOfferte");
  const factoren: Highlight[] = (t.raw("factors.items") as { title: string; body: string }[]).map((f, i) => ({ icon: factorIcons[i], ...f }));
  const reassurance = t.raw("reassurance") as { title: string; body: string }[];
  const faq = t.raw("faq.items") as Faq[];
  return (
    <PageShell dark>
      {/* Hero: the Mcars truck on the right, the offerte text on the open sky/road to its left */}
      <section className="relative flex min-h-[70svh] items-center overflow-hidden rounded-[2rem] bg-zinc-950 lg:aspect-[3/1] lg:min-h-[520px]">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-[position:65%_center] lg:bg-center"
          style={{ backgroundImage: `url(${asset("/fleet/offerte-hero.jpg")})` }}
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,rgb(9_9_11/0.75),rgb(9_9_11/0.45)_35%,transparent_55%)]" />
        <div aria-hidden className="absolute inset-0 bg-zinc-950/30 lg:hidden" />
        <div className="relative z-10 max-w-2xl px-6 pt-32 pb-12 sm:px-10 lg:px-14 lg:pt-24">
          <p className="text-xs font-semibold tracking-[0.3em] text-white uppercase sm:text-sm">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {t("hero.title")}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/90 sm:text-xl">
            {t("hero.lead")}
          </p>
        </div>
      </section>

      {/* The quote form — flow from the client's reference, on a black screen */}
      <Section space="none" bleed id="aanvraag" className="mt-2">
        <div className="rounded-[2rem] bg-zinc-950 px-4 py-14 sm:px-8 sm:py-20 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-4 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="max-w-2xl text-3xl leading-[1.1] font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
                {t.rich("form.title", { muted: (c) => <span className="text-white/45">{c}</span> })}
              </h2>
              <p className="max-w-sm text-base leading-relaxed text-white/55">
                {t("form.intro")}
              </p>
            </div>
            <OfferteForm />
          </div>
        </div>
      </Section>

      {/* Price factors */}
      <Section space="loose">
        <SectionHeader
          label={t("factors.label")}
          index="01"
          lead={t("factors.lead")}
          trail={t("factors.trail")}
          intro={t("factors.intro")}
          className="mb-16"
          dark
        />
        <HighlightGrid items={factoren} dark />
      </Section>

      {/* Reassurance */}
      <Section space="none" bleed>
        <div className="rounded-[2rem] bg-zinc-950 px-6 py-16 sm:px-10 sm:py-20 lg:px-14">
          <ul className="grid gap-10 sm:grid-cols-3">
            {reassurance.map((r, i) => (
              <Reveal as="li" key={r.title} delay={i * 80} className="border-t border-white/20 pt-6">
                <span className="text-xs font-medium tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-2xl font-medium tracking-tight text-white">{r.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-white/55">{r.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* FAQ */}
      <Section space="loose">
        <div className="grid gap-10 border-t border-white/15 pt-6 lg:grid-cols-[1fr_3fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow dark>{t("faq.eyebrow")}</Eyebrow>
          </div>
          <div>
            <h2 className="max-w-3xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-white sm:text-4xl lg:text-[3.25rem]">
              {t.rich("faq.title", { muted: (c) => <span className="text-white/45">{c}</span> })}
            </h2>
            <div className="mt-12">
              <FaqAccordion items={faq} dark />
            </div>
            <div className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-base leading-relaxed text-white/55">
                {t.rich("faq.phone", { phone: site.phone, link: (c) => <a href={site.phoneHref} className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{c}</a> })}
              </p>
              <ArrowButton href="/contact" variant="light">{t("faq.contact")}</ArrowButton>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
