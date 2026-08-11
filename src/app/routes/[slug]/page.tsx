import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqAccordion, HighlightGrid, MaskedHeading, QuoteCta, RibbonBand, StatRow } from "@/components/blocks";
import Icon from "@/components/icon";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Parallax, Reveal } from "@/components/scroll";
import { flagAsset, getRoute, routeSlugs } from "@/data/routes";
import { getService } from "@/data/services";

export function generateStaticParams() {
  return routeSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getRoute(slug);
  if (!r) return {};
  return { title: r.seo.title, description: r.seo.description };
}

export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = getRoute(slug);
  if (!route) notFound();

  const isCorridor = route.kind === "corridor";
  const bigWord = isCorridor ? route.to!.name.toUpperCase() : route.place!.name.toUpperCase();

  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow={isCorridor ? "Vaste corridor" : "Bestemming"}
        title={route.title}
        subtitle={route.subtitle}
        crumbs={[{ label: "Routes", href: "/routes" }, { label: route.nav }]}
        image={route.heroImage}
        bigWord={bigWord}
        scrollCue
        badges={[
          { icon: <Icon name="clock" className="size-4" />, label: route.frequency },
          { icon: <Icon name="shield" className="size-4" />, label: "Verzekerd & CMR" },
        ]}
        card={{ title: "Alle routes", sub: "Bekijk elke bestemming en corridor van Mcars.", href: "/routes" }}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
        secondaryCta={{ label: "Alle routes", href: "/routes" }}
      >
        {/* Route ribbon with flag-trucks */}
        <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-xl">
          {isCorridor ? (
            <>
              <FlagTruck flag={route.from!.flag} label={route.from!.name} />
              <Connector />
              <FlagTruck flag={route.to!.flag} label={route.to!.name} />
            </>
          ) : (
            <FlagTruck flag={route.place!.flag} label={route.place!.name} big />
          )}
        </div>
      </PageHero>

      {/* Stats */}
      <section className="px-5 pt-16 sm:px-8 sm:pt-24">
        <Reveal><StatRow items={route.stats} /></Reveal>
      </section>

      {/* Intro + parallax map */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">{isCorridor ? "Over deze route" : "Over deze bestemming"}</p>
            <p className="mt-5 text-2xl leading-[1.35] font-light tracking-tight text-zinc-950 sm:text-[2rem]">{route.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-700"><Icon name="clock" className="size-4" /> {route.frequency}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-700"><Icon name="shield" className="size-4" /> Verzekerd & CMR</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-700"><Icon name="route" className="size-4" /> Van deur tot deur</span>
            </div>
          </Reveal>
          <Reveal delay={120} variant="right" className="h-[420px] overflow-hidden rounded-[2rem]">
            <Parallax speed={0.1} className="h-full">
              <Image src={route.heroImage} alt={`Route ${route.nav}`} width={900} height={700} className="h-full w-full scale-110 object-cover" />
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* Photo-masked country word */}
      <section className="overflow-hidden px-5 pb-8 sm:px-8">
        <Reveal><MaskedHeading text={bigWord} image={route.heroImage} /></Reveal>
      </section>

      {/* Cities served — animated dark panel */}
      <section className="px-5 py-8 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-8 py-14 sm:px-14 sm:py-20">
            <div aria-hidden className="dot-grid absolute inset-0 opacity-[0.1]" />
            <div className="relative z-10 max-w-2xl">
              <p className="text-sm font-medium tracking-widest text-zinc-500 uppercase">{isCorridor ? "Ophaal- en leverpunten" : "Waar we ophalen & leveren"}</p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
                {isCorridor ? "Van deur tot deur, waar u ook zit." : `Actief in heel ${route.place!.name}.`}
              </h2>
            </div>
            <div className="relative z-10 mt-8 flex flex-wrap gap-2.5">
              {route.cities.map((c, i) => (
                <Reveal as="span" key={c} delay={i * 40} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200">{c}</Reveal>
              ))}
            </div>
            <p className="relative z-10 mt-6 text-sm text-zinc-500">Uw stad of adres er niet bij? Geen probleem — we halen op en leveren waar u het nodig heeft.</p>
          </div>
        </Reveal>
      </section>

      {/* Marquee of destinations */}
      <RibbonBand items={["België", "Nederland", "Frankrijk", "Spanje", "Duitsland", "Italië", "Polen", "Scandinavië", "Van deur tot deur"]} />

      {/* Highlights */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mb-10 max-w-2xl">
          <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">Waarom Mcars</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">Uw wagen in vertrouwde handen.</h2>
        </Reveal>
        <HighlightGrid items={route.highlights} accent={0} />
      </section>

      {/* FAQ */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">FAQ</p>
            <h2 className="mt-3 text-3xl font-medium leading-[1.15] tracking-tight text-zinc-950 sm:text-4xl">Vragen over deze route.</h2>
          </Reveal>
          <FaqAccordion items={route.faq} />
        </div>
      </section>

      <RelatedLinks routes={route.related} services={route.relatedServices ?? []} current={route.slug} />
      <QuoteCta title="Klaar om deze route te boeken?" />
    </PageShell>
  );
}

function FlagTruck({ flag, label, big = false }: { flag: keyof typeof flagAsset; label: string; big?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <Image src={flagAsset[flag]} alt={label} width={64} height={64} className={big ? "h-12 w-auto" : "h-9 w-auto"} />
      <span className={`font-medium text-white ${big ? "text-lg" : "text-sm"}`}>{label}</span>
    </span>
  );
}

function Connector() {
  return (
    <span className="flex items-center gap-1 text-white/50" aria-hidden>
      <span className="h-px w-5 bg-white/30" />
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </span>
  );
}

function RelatedLinks({ routes, services, current }: { routes: string[]; services: string[]; current: string }) {
  const rts = routes.filter((s) => s !== current).map(getRoute).filter(Boolean);
  const svc = services.map(getService).filter(Boolean);
  if (!rts.length && !svc.length) return null;
  return (
    <section className="px-5 py-8 sm:px-8">
      <p className="mb-6 text-sm font-medium tracking-widest text-zinc-400 uppercase">Ontdek ook</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rts.map((r, i) => (
          <Reveal key={r!.slug} delay={i * 60}>
            <Link href={`/routes/${r!.slug}`} className="group flex items-center justify-between gap-3 rounded-2xl bg-zinc-100 px-6 py-5 transition-colors hover:bg-zinc-950">
              <span className="text-sm font-medium text-zinc-950 transition-colors group-hover:text-white">{r!.nav}</span>
              <svg className="size-4 flex-none text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </Reveal>
        ))}
        {svc.map((s, i) => (
          <Reveal key={s!.slug} delay={(rts.length + i) * 60}>
            <Link href={`/diensten/${s!.slug}`} className="group flex items-center justify-between gap-3 rounded-2xl bg-zinc-100 px-6 py-5 transition-colors hover:bg-zinc-950">
              <span className="text-sm font-medium text-zinc-950 transition-colors group-hover:text-white">{s!.nav}</span>
              <svg className="size-4 flex-none text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
