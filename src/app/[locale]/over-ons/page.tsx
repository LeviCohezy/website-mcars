import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Draft, Timeline, WordReveal, type Milestone } from "@/components/about-interactive";
import { HighlightGrid, QuoteCta, StatRow } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Parallax, Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { Eyebrow, SectionHeader } from "@/components/ui";
import type { Highlight } from "@/data/services";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PageOverOns" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

// Photos are the client's own, colour-graded to one look (public/about/real).
const IMG = (name: string) => `/about/real/${name}.jpg`;

// `draft` marks what the client still has to confirm (year, wording). It shows
// a dashed "Nog te bevestigen" tag on the page; drop the flag once confirmed.
const milestoneMeta: { image?: string; draft?: boolean }[] = [
  {},
  {},
  { image: IMG("duo"), draft: true },
  { image: IMG("woerth") },
  { image: IMG("scanias") },
];

const fleet = [
  { count: 6, name: "Mercedes Actros", tone: "bg-white text-zinc-950" },
  { count: 2, name: "Scania Next Gen", tone: "bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-xl" },
  { count: 1, name: "Scania Streamline", tone: "bg-zinc-950 text-white" },
];

const gallery = [
  [
    { src: IMG("jubelpark"), w: 2048, h: 1536 },
    { src: IMG("sunset"), w: 2048, h: 1536 },
    { src: IMG("alps"), w: 1600, h: 1200 },
    { src: IMG("dusk"), w: 1536, h: 2048 },
    { src: IMG("loaded"), w: 2048, h: 1536 },
    { src: IMG("wave"), w: 2048, h: 1250 },
  ],
  [
    { src: IMG("oldtimers"), w: 1536, h: 2048 },
    { src: IMG("snow"), w: 2048, h: 1536 },
    { src: IMG("defender"), w: 2048, h: 1536 },
    { src: IMG("coast"), w: 2048, h: 1536 },
    { src: IMG("clouds"), w: 2048, h: 1536 },
    { src: IMG("rain"), w: 2048, h: 1536 },
  ],
];

const whyIcons: Highlight["icon"][] = ["users", "shield", "phone", "route"];

export default async function OverOnsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PageOverOns");
  const muted = (c: React.ReactNode) => <span className="text-zinc-400">{c}</span>;
  const mutedW = (c: React.ReactNode) => <span className="text-white/55">{c}</span>;
  const milestones: Milestone[] = (t.raw("milestones") as Milestone[]).map((m, i) => ({ ...m, ...milestoneMeta[i] }));
  const fleetNotes = t.raw("fleetNotes") as string[];
  const galleryAlts = t.raw("galleryAlts") as string[][];
  const whyItems: Highlight[] = (t.raw("why") as { title: string; body: string }[]).map((w, i) => ({ icon: whyIcons[i], ...w }));
  const insured = t.raw("insured") as { t: string; b: string }[];
  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow={t("hero.eyebrow")}
        title={t.rich("hero.title", { br: () => <br />, muted: mutedW })}
        subtitle={t("hero.subtitle")}
        crumbs={[{ label: t("hero.crumb") }]}
        image={IMG("hero")}
        badges={[{ label: t("hero.badgeFamily") }, { label: t("hero.badgeLocation") }]}
        primaryCta={{ label: t("hero.cta"), href: "/offerte" }}
      />

      {/* Statement that lights up word by word */}
      <Section space="loose">
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
          <Reveal>
            <Eyebrow>{t("who.eyebrow")}</Eyebrow>
          </Reveal>
          <div>
            <WordReveal
              text={t("who.text")}
              muted={t("who.muted")}
              className="max-w-5xl text-3xl leading-[1.15] font-light tracking-[-0.025em] text-zinc-950 sm:text-4xl lg:text-[3.5rem] lg:leading-[1.1]"
            />
            <Reveal delay={120} className="mt-14 border-t border-zinc-200 pt-8">
              <StatRow
                items={[
                  { value: "2009", label: t("who.founded") },
                  { value: "9", label: t("who.transporters") },
                  { value: "8", label: t("who.drivers") },
                  { value: "20+", label: t("who.experience") },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Father and son */}
      <Section space="none" bleed>
        <div className="grid gap-2 lg:grid-cols-[1.3fr_1fr]">
          {/* The whole photo, uncropped: the frame takes its 4:3 ratio. */}
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image src={IMG("duo")} alt={t("duo.alt")} fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delay={100} className="flex flex-col justify-between gap-12 rounded-[2rem] bg-zinc-100 p-7 sm:p-10 lg:p-12">
            <div>
              <Eyebrow>{t("duo.eyebrow")}</Eyebrow>
              <h2 className="mt-6 text-4xl leading-[1.02] font-medium tracking-[-0.035em] text-zinc-950 sm:text-5xl">
                {t.rich("duo.title", { muted })}
              </h2>
            </div>
            <dl className="grid gap-px overflow-hidden rounded-2xl bg-zinc-200">
              <div className="bg-white p-6">
                <dt className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-xl font-medium tracking-tight text-zinc-950">Filip Maertens</span>
                  <span className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{t("duo.founder")}</span>
                </dt>
                <dd className="mt-3 text-[0.95rem] leading-relaxed text-zinc-600">
                  {t("duo.filipBody")}
                </dd>
              </div>
              <div className="bg-white p-6">
                <dt className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-xl font-medium tracking-tight text-zinc-950">Ralph Maertens</span>
                  <span className="text-xs font-medium tracking-[0.18em] whitespace-nowrap text-zinc-400 uppercase">{t("duo.second")}</span>
                </dt>
                <dd className="mt-3 text-[0.95rem] leading-relaxed text-zinc-600">
                  {t("duo.ralphBody")}
                  <span className="mt-3 block"><Draft>{t("duo.draft")}</Draft></span>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </Section>

      {/* Pinned horizontal timeline */}
      <div className="mt-2">
        <Timeline items={milestones} />
      </div>

      {/* Fleet: one full photo, three cards on it */}
      <Section space="none" bleed className="mt-2">
        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950">
          <Image src={IMG("fleet")} alt={t("fleet.alt")} fill sizes="100vw" className="object-cover object-[50%_60%]" />
          <div aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-zinc-950/70 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-950/70 to-transparent" />
          <div className="relative z-10 flex min-h-[94svh] flex-col justify-between gap-16 px-6 pt-24 pb-6 sm:px-10 sm:pb-10 lg:aspect-[16/10] lg:min-h-0 lg:px-14">
            <Reveal>
              <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/70 uppercase">
                <span aria-hidden className="size-1.5 rounded-full bg-white" />
                {t("fleet.label")}
              </p>
              <h2 className="mt-4 max-w-2xl text-4xl leading-[1.02] font-medium tracking-[-0.035em] text-white sm:text-5xl">
                {t.rich("fleet.title", { muted: mutedW })}
              </h2>
            </Reveal>
            <div>
              <div aria-hidden className="mb-4 hidden grid-cols-3 gap-3 sm:grid">
                {fleet.map((f) => (
                  <span key={f.name} className="flex items-center gap-3">
                    <span className="flex size-4 items-center justify-center rounded-full bg-white/25"><span className="size-1.5 rounded-full bg-white" /></span>
                    <span className="h-px flex-1 bg-white/30" />
                  </span>
                ))}
              </div>
              <ul className="grid gap-3 sm:grid-cols-3">
                {fleet.map((f, i) => (
                  <Reveal as="li" key={f.name} delay={i * 90} className={`rounded-2xl p-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 sm:p-6 ${f.tone}`}>
                    <p className="flex items-baseline justify-between gap-3">
                      <span className="text-4xl leading-none font-medium tracking-[-0.05em] tabular-nums sm:text-5xl">{f.count}×</span>
                      <span className="text-[11px] font-medium tracking-[0.18em] uppercase opacity-60">Kässbohrer</span>
                    </p>
                    <p className="mt-5 text-xl font-medium tracking-tight">{f.name}</p>
                    <p className="mt-1 text-sm opacity-65">{fleetNotes[i]}</p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Best trucks + factory visit: image and text */}
      <Section space="loose" bleed>
        <div className="grid gap-2 lg:grid-cols-[1fr_1.25fr]">
          <Reveal className="order-2 flex flex-col justify-between gap-12 rounded-[2rem] bg-zinc-100 p-7 sm:p-10 lg:order-1 lg:p-12">
            <div>
              <Eyebrow>{t("material.eyebrow")}</Eyebrow>
              <h2 className="mt-6 text-4xl leading-[1.02] font-medium tracking-[-0.035em] text-zinc-950 sm:text-5xl">
                {t.rich("material.title", { muted })}
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-600">
                {t("material.body")}
              </p>
            </div>
            <div className="border-t border-zinc-300 pt-6">
              <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">{t("material.visitLabel")}</p>
              <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-zinc-600">
                {t("material.visitBody")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={100} className="relative order-1 h-[44vh] overflow-hidden rounded-[2rem] sm:h-[70vh] lg:order-2">
            <Parallax speed={0.05} className="absolute inset-x-0 -top-[12%] h-[124%]">
              <Image src={IMG("woerth")} alt={t("material.woerthAlt")} fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover object-[35%_50%]" />
            </Parallax>
            <p className="absolute bottom-4 left-4 rounded-full bg-white/85 px-4 py-1.5 text-sm font-medium text-zinc-950 backdrop-blur-md">{t("material.woerthCaption")}</p>
          </Reveal>
        </div>
      </Section>

      {/* On the road: two photo ribbons */}
      <Section space="flush-top" bleed>
        <div className="px-5 sm:px-8">
          <SectionHeader label={t("road.label")} index="01" lead={t("road.lead")} trail={t("road.trail")} intro={t("road.intro")} className="mb-12" />
        </div>
        <div className="flex flex-col gap-3">
          {gallery.map((row, r) => (
            <div key={r} data-gallery className="marquee flex overflow-hidden">
              {[0, 1].map((copy) => (
                <ul key={copy} aria-hidden={copy === 1} className={`flex shrink-0 gap-3 pr-3 ${r === 0 ? "animate-marquee" : "animate-marquee-reverse"}`}>
                  {row.map((g, gi) => (
                    <li key={g.src} className="h-52 flex-none overflow-hidden rounded-2xl sm:h-80">
                      <Image src={g.src} alt={copy === 0 ? galleryAlts[r][gi] : ""} width={g.w} height={g.h} sizes="(min-width: 640px) 30rem, 18rem" className="h-full w-auto object-cover transition-transform duration-700 hover:scale-105" />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* Insured */}
      <Section space="none" bleed>
        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-6 py-16 sm:px-10 sm:py-24 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-[1fr_3fr] lg:gap-10">
            <Reveal>
              <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/60 uppercase">
                <span aria-hidden className="size-1.5 rounded-full bg-white" />
                {t("insuredSection.label")}
              </p>
            </Reveal>
            <div>
              <Reveal>
                <h2 className="max-w-3xl text-3xl font-light leading-[1.08] tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-6xl">
                  {t.rich("insuredSection.title", { muted: (c) => <span className="text-white/45">{c}</span> })}
                </h2>
              </Reveal>
              <ul className="mt-14 grid gap-10 sm:grid-cols-3">
                {insured.map((it, i) => (
                  <Reveal as="li" key={it.t} delay={i * 80} className="border-t border-white/20 pt-6">
                    <span className="text-xs font-medium tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-6 text-xl font-medium tracking-tight text-white">{it.t}</p>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-white/55">{it.b}</p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Why */}
      <Section space="loose">
        <SectionHeader
          label={t("whySection.label")}
          index="02"
          lead={t("whySection.lead")}
          trail={t("whySection.trail")}
          action={
            <Link href="/routes" className="text-sm font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950">
              {t("whySection.action")}
            </Link>
          }
          className="mb-16"
        />
        <HighlightGrid items={whyItems} />
      </Section>

      <QuoteCta image={IMG("sunset")} />
    </PageShell>
  );
}
