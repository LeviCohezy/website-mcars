import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BenefitsList, FaqAccordion, HighlightGrid, MaskedHeading, ProcessTimeline,
  QuoteCta, RibbonBand, StatRow,
} from "@/components/blocks";
import Icon from "@/components/icon";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Parallax, Reveal } from "@/components/scroll";
import { defaultProcess, defaultVehicleTypes, getService, serviceSlugs } from "@/data/services";
import { getRoute } from "@/data/routes";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return { title: s.seo.title, description: s.seo.description };
}

const HERO_WORD: Record<string, string> = {
  "autotransport-particulier": "PARTICULIER",
  "autotransport-dealers": "DEALERS",
  "auto-importeren": "IMPORT",
  "auto-exporteren": "EXPORT",
  "niet-rijdende-auto": "NIET-RIJDEND",
  "oldtimer-transport": "OLDTIMER",
  "open-autotransport": "OPEN",
  "gesloten-autotransport": "GESLOTEN",
  "spoedtransport": "SPOED",
  "fleet-wagenpark": "FLEET",
  "eventtransport": "EVENT",
};

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const process = service.process ?? defaultProcess;
  const vehicleTypes = service.vehicleTypes ?? defaultVehicleTypes;
  const bigWord = HERO_WORD[service.slug] ?? service.nav.split(" ")[0].toUpperCase();

  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow={service.category}
        title={service.title}
        subtitle={service.subtitle}
        crumbs={[{ label: "Diensten", href: "/diensten" }, { label: service.nav }]}
        image={service.heroImage}
        bigWord={bigWord}
        scrollCue
        badges={[
          { icon: <StarMini />, label: "4,7 · 37 reviews" },
          { icon: <Icon name="shield" className="size-4" />, label: "Verzekerd & CMR" },
        ]}
        card={{ title: "Zo werkt het", sub: "Van aanvraag tot levering in een paar heldere stappen.", href: "/hoe-werkt-het" }}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
        secondaryCta={{ label: "Bekijk werkwijze", href: "/hoe-werkt-het" }}
      />

      {/* Statement + stats */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">Overzicht</p>
            <p className="mt-5 text-2xl leading-[1.35] font-light tracking-tight text-zinc-950 sm:text-[2rem]">
              {service.intro}
            </p>
            <div className="mt-8 flex items-start gap-4 rounded-2xl bg-zinc-100 p-6">
              <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-zinc-950 text-white"><Icon name="users" /></span>
              <div>
                <p className="text-sm font-semibold text-zinc-950">Voor wie?</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500">{service.audience}</p>
              </div>
            </div>
          </Reveal>
          {service.stats && (
            <Reveal delay={120} variant="right" className="lg:pt-10">
              <StatRow items={service.stats} />
              <div className="mt-4 overflow-hidden rounded-3xl">
                <Parallax speed={0.08}>
                  <Image src={service.heroImage} alt={service.title} width={800} height={600} className="h-60 w-full scale-110 object-cover" />
                </Parallax>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Marquee ribbon of what we carry */}
      <RibbonBand items={vehicleTypes} />

      {/* Highlights */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <Reveal className="mb-10 max-w-2xl">
          <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">Waarom Mcars</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">Zo pakken we het aan.</h2>
        </Reveal>
        <HighlightGrid items={service.highlights} accent={1} />
      </section>

      {/* Cinematic video-background break — the dramatic dark shift */}
      <VideoStatement
        word={bigWord}
        line="Autotransport dat verder gaat dan van A naar B."
      />

      {/* Process with parallax cutout + dashed connectors */}
      <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
        <Parallax speed={0.2} className="pointer-events-none absolute -top-10 right-0 hidden w-[42%] opacity-[0.06] lg:block">
          <Image src="/truck-outline.png" alt="" width={900} height={500} className="w-full" />
        </Parallax>
        <Reveal className="mb-12 max-w-2xl">
          <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">Werkwijze</p>
          <h2 className="mt-3 text-3xl font-medium leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-zinc-950">Van aanvraag tot levering, </span>
            <span className="text-zinc-400">helder en eenvoudig.</span>
          </h2>
        </Reveal>
        <div className="relative z-10">
          <ProcessTimeline steps={process} />
        </div>
      </section>

      {/* Benefits + vehicle types */}
      <section className="px-5 py-8 sm:px-8">
        <Reveal>
          <div className="rounded-[2rem] bg-zinc-50 p-8 ring-1 ring-zinc-100 sm:p-12">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
              <div>
                <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">Inbegrepen</p>
                <h2 className="mt-3 mb-7 text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl">Wat u van ons mag verwachten.</h2>
                <BenefitsList items={service.benefits} />
              </div>
              <div>
                <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">Wij vervoeren</p>
                <h2 className="mt-3 mb-7 text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl">Elk type voertuig.</h2>
                <div className="flex flex-wrap gap-2">
                  {vehicleTypes.map((v) => (
                    <span key={v} className="rounded-full bg-white px-4 py-2 text-sm text-zinc-700 ring-1 ring-zinc-200">{v}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Photo-masked giant word */}
      <section className="overflow-hidden px-5 py-16 sm:px-8">
        <Reveal>
          <MaskedHeading text={bigWord} image={service.heroImage} />
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">FAQ</p>
            <h2 className="mt-3 text-3xl font-medium leading-[1.15] tracking-tight text-zinc-950 sm:text-4xl">Veelgestelde vragen.</h2>
            <p className="mt-5 text-base leading-relaxed text-zinc-500">Staat uw vraag er niet bij? Bel of mail ons — u krijgt meteen een persoonlijk antwoord.</p>
          </Reveal>
          <FaqAccordion items={service.faq} />
        </div>
      </section>

      <RelatedLinks services={service.related} routes={service.relatedRoutes ?? []} />
      <QuoteCta />
    </PageShell>
  );
}

function VideoStatement({ word, line }: { word: string; line: string }) {
  return (
    <section className="px-5 py-8 sm:px-8">
      <div className="relative flex min-h-[70vh] items-end overflow-hidden rounded-[2rem] bg-zinc-950">
        <Parallax speed={0.14} className="absolute inset-0 h-[120%]">
          <video className="slow-zoom size-full object-cover opacity-70" src="/hero.mp4" autoPlay muted loop playsInline />
        </Parallax>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/30" />
        <Parallax speed={-0.05} className="pointer-events-none absolute inset-x-0 top-8 flex justify-center px-4">
          <span className="hero-wordmark block truncate uppercase">{word}</span>
        </Parallax>
        <div className="relative z-10 w-full p-8 sm:p-14">
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-widest text-white/90 uppercase backdrop-blur-xl">
              <span className="scroll-bob flex size-4 items-center justify-center rounded-full bg-white text-zinc-950">
                <svg className="size-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
              In beweging
            </span>
            <h2 className="max-w-3xl text-3xl font-light leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">{line}</h2>
            <Link href="/offerte" className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white py-3 pr-3 pl-7 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
              Vraag uw offerte
              <span className="flex size-8 items-center justify-center rounded-full bg-zinc-950 text-white">
                <svg className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StarMini() {
  return <svg className="size-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.8 1.4 6.8L12 17.3 5.9 20.7l1.4-6.8L2.2 9.1l6.9-.8z" /></svg>;
}

function RelatedLinks({ services, routes }: { services: string[]; routes: string[] }) {
  const svc = services.map(getService).filter(Boolean);
  const rts = routes.map(getRoute).filter(Boolean);
  if (!svc.length && !rts.length) return null;
  return (
    <section className="px-5 py-8 sm:px-8">
      <p className="mb-6 text-sm font-medium tracking-widest text-zinc-400 uppercase">Ontdek ook</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {svc.map((s, i) => (
          <Reveal key={s!.slug} delay={i * 60}>
            <Link href={`/diensten/${s!.slug}`} className="group flex items-center justify-between gap-3 rounded-2xl bg-zinc-100 px-6 py-5 transition-colors hover:bg-zinc-950">
              <span className="text-sm font-medium text-zinc-950 transition-colors group-hover:text-white">{s!.nav}</span>
              <svg className="size-4 flex-none text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </Reveal>
        ))}
        {rts.map((r, i) => (
          <Reveal key={r!.slug} delay={(svc.length + i) * 60}>
            <Link href={`/routes/${r!.slug}`} className="group flex items-center justify-between gap-3 rounded-2xl bg-zinc-100 px-6 py-5 transition-colors hover:bg-zinc-950">
              <span className="text-sm font-medium text-zinc-950 transition-colors group-hover:text-white">{r!.nav}</span>
              <svg className="size-4 flex-none text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
