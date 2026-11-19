import Image from "next/image";
import Link from "next/link";
import { Draft, Timeline, WordReveal, type Milestone } from "@/components/about-interactive";
import { HighlightGrid, QuoteCta, StatRow } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Parallax, Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { Eyebrow, SectionHeader } from "@/components/ui";
import type { Highlight } from "@/data/services";

export const metadata = {
  title: "Over ons | Mcars",
  description:
    "Mcars is een familiebedrijf uit Roeselare: vader en zoon, 8 vaste chauffeurs en 9 eigen autotransporters. Ontdek ons verhaal sinds 2004, onze vloot en hoe we werken.",
};

// Photos are the client's own, colour-graded to one look (public/about/real).
const IMG = (name: string) => `/about/real/${name}.jpg`;

// `draft` marks what the client still has to confirm (year, wording). It shows
// a dashed "Nog te bevestigen" tag on the page; drop the flag once confirmed.
const milestones: Milestone[] = [
  { year: "2004", title: "De eerste lading", body: "Filip Maertens laadt zijn eerste auto's op. Het begin van ruim twintig jaar ervaring in autotransport." },
  { year: "2009", title: "Mcars wordt opgericht", body: "Vanuit Roeselare krijgt het bedrijf zijn naam. De aanpak blijft dezelfde: korte lijnen en afspraken die kloppen." },
  { year: "20XX", title: "De tweede generatie", body: "Zoon Ralph stapt mee in de zaak. Vader en zoon bouwen samen verder.", image: IMG("duo"), draft: true },
  { year: "2026", title: "Op bezoek in Wörth", body: "Samen met transporteurs uit de regio bezoeken we de vrachtwagenfabriek van Mercedes-Benz in Duitsland, waar onze Actrossen gebouwd worden.", image: IMG("woerth") },
  { year: "Nu", title: "Negen transporters, acht chauffeurs", body: "Elke week over heel Frankrijk, en verder van Scandinavië tot Spanje. Nog altijd met dezelfde familie aan het stuur.", image: IMG("scanias") },
];

const fleet = [
  { count: 6, name: "Mercedes Actros", note: "De ruggengraat van de vloot.", tone: "bg-white text-zinc-950" },
  { count: 2, name: "Scania Next Gen", note: "De nieuwste generatie Scania.", tone: "bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-xl" },
  { count: 1, name: "Scania Streamline", note: "Met het grote Mcars-embleem.", tone: "bg-zinc-950 text-white" },
];

const gallery = [
  [
    { src: IMG("jubelpark"), alt: "Mcars-transporters met oldtimers aan het Jubelpark in Brussel", w: 2048, h: 1536 },
    { src: IMG("sunset"), alt: "Geladen autotransporter bij zonsondergang", w: 2048, h: 1536 },
    { src: IMG("alps"), alt: "Twee Mcars-transporters in de bergen", w: 1600, h: 1200 },
    { src: IMG("dusk"), alt: "Mcars Actros onder een roze avondlucht", w: 1536, h: 2048 },
    { src: IMG("loaded"), alt: "Autotransporter met twee laadvloeren vol", w: 2048, h: 1536 },
    { src: IMG("wave"), alt: "Chauffeur zwaait vanuit de cabine", w: 2048, h: 1250 },
  ],
  [
    { src: IMG("oldtimers"), alt: "Oldtimers op een Mcars-transporter voor de triomfboog", w: 1536, h: 2048 },
    { src: IMG("snow"), alt: "Mcars Actros op een besneeuwde weg", w: 2048, h: 1536 },
    { src: IMG("defender"), alt: "Terreinwagens op de transporter", w: 2048, h: 1536 },
    { src: IMG("coast"), alt: "Volgeladen transporter onder een blauwe lucht", w: 2048, h: 1536 },
    { src: IMG("clouds"), alt: "Scania van Mcars onder een wolkenlucht", w: 2048, h: 1536 },
    { src: IMG("rain"), alt: "Mcars Actros op een natte terminal", w: 2048, h: 1536 },
  ],
];

const whyItems: Highlight[] = [
  { icon: "users", title: "Persoonlijk & familiaal", body: "Geen callcenter, geen nummers. U spreekt rechtstreeks met het team dat uw wagen ook effectief vervoert." },
  { icon: "shield", title: "Betrouwbaar & verzekerd", body: "Elke rit met CMR-vrachtbrief en verzekerd transport. Duidelijke afspraken, correct nagekomen." },
  { icon: "phone", title: "Spontaan, keep it simple", body: "Snel schakelen zonder gedoe. U vraagt aan, u krijgt binnen 24 uur een helder antwoord met prijs en planning." },
  { icon: "route", title: "Transparant", body: "U weet steeds waar u aan toe bent. Geen verborgen kosten, geen verrassingen onderweg." },
];

export default function OverOnsPage() {
  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow="Over ons"
        title={
          <>
            Sinds 2004 laden we auto&apos;s.
            <br />
            <span className="text-white/55">Sinds 2009 als Mcars.</span>
          </>
        }
        subtitle="Een familiebedrijf uit Roeselare: vader en zoon, acht vaste chauffeurs en negen eigen autotransporters."
        crumbs={[{ label: "Over ons" }]}
        image={IMG("hero")}
        badges={[{ label: "Familiebedrijf" }, { label: "Roeselare, België" }]}
        primaryCta={{ label: "Offerte", href: "/offerte" }}
      />

      {/* Statement that lights up word by word */}
      <Section space="loose">
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
          <Reveal>
            <Eyebrow>Wie zijn we</Eyebrow>
          </Reveal>
          <div>
            <WordReveal
              text="Een familiebedrijf dat autotransport door en door kent. Geen callcenter, geen tussenpersonen: u spreekt met de mensen die uw wagen ook echt vervoeren."
              muted="Wie één keer met Mcars rijdt, blijft."
              className="max-w-5xl text-3xl leading-[1.15] font-light tracking-[-0.025em] text-zinc-950 sm:text-4xl lg:text-[3.5rem] lg:leading-[1.1]"
            />
            <Reveal delay={120} className="mt-14 border-t border-zinc-200 pt-8">
              <StatRow
                items={[
                  { value: "2009", label: "Opgericht" },
                  { value: "9", label: "Eigen autotransporters" },
                  { value: "8", label: "Vaste chauffeurs" },
                  { value: "20+", label: "Jaar ervaring" },
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
            <Image src={IMG("duo")} alt="Twee generaties Mcars tussen twee autotransporters" fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delay={100} className="flex flex-col justify-between gap-12 rounded-[2rem] bg-zinc-100 p-7 sm:p-10 lg:p-12">
            <div>
              <Eyebrow>Vader en zoon</Eyebrow>
              <h2 className="mt-6 text-4xl leading-[1.02] font-medium tracking-[-0.035em] text-zinc-950 sm:text-5xl">
                Twee generaties, <span className="text-zinc-400">één manier van werken.</span>
              </h2>
            </div>
            <dl className="grid gap-px overflow-hidden rounded-2xl bg-zinc-200">
              <div className="bg-white p-6">
                <dt className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-xl font-medium tracking-tight text-zinc-950">Filip Maertens</span>
                  <span className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">Oprichter</span>
                </dt>
                <dd className="mt-3 text-[0.95rem] leading-relaxed text-zinc-600">
                  Laadde in 2004 zijn eerste auto&apos;s op en richtte in 2009 Mcars op. Bijna twintig jaar later staat hij nog altijd zelf tussen de vrachtwagens.
                </dd>
              </div>
              <div className="bg-white p-6">
                <dt className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-xl font-medium tracking-tight text-zinc-950">Ralph Maertens</span>
                  <span className="text-xs font-medium tracking-[0.18em] whitespace-nowrap text-zinc-400 uppercase">Tweede generatie</span>
                </dt>
                <dd className="mt-3 text-[0.95rem] leading-relaxed text-zinc-600">
                  Stapte mee in de zaak en bouwt aan de volgende jaren van Mcars, met dezelfde korte lijnen als zijn vader.
                  <span className="mt-3 block"><Draft>Rol en startjaar nog te bevestigen</Draft></span>
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
          <Image src={IMG("fleet")} alt="Vijf autotransporters van Mcars naast elkaar: Scania en Mercedes" fill sizes="100vw" className="object-cover object-[50%_60%]" />
          <div aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-zinc-950/70 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-950/70 to-transparent" />
          <div className="relative z-10 flex min-h-[94svh] flex-col justify-between gap-16 px-6 pt-24 pb-6 sm:px-10 sm:pb-10 lg:aspect-[16/10] lg:min-h-0 lg:px-14">
            <Reveal>
              <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/70 uppercase">
                <span aria-hidden className="size-1.5 rounded-full bg-white" />
                De vloot
              </p>
              <h2 className="mt-4 max-w-2xl text-4xl leading-[1.02] font-medium tracking-[-0.035em] text-white sm:text-5xl">
                Negen eigen transporters, <span className="text-white/55">acht vaste chauffeurs.</span>
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
                    <p className="mt-1 text-sm opacity-65">{f.note}</p>
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
              <Eyebrow>Materiaal</Eyebrow>
              <h2 className="mt-6 text-4xl leading-[1.02] font-medium tracking-[-0.035em] text-zinc-950 sm:text-5xl">
                We rijden met <span className="text-zinc-400">het beste materiaal.</span>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-600">
                Uw wagen verdient een vrachtwagen waar we zelf op vertrouwen. Daarom rijden we met Mercedes Actros en Scania, elk met een Kässbohrer-opbouw en een lier aan boord.
              </p>
            </div>
            <div className="border-t border-zinc-300 pt-6">
              <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">2026 · Wörth, Duitsland</p>
              <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-zinc-600">
                In 2026 bezochten we, samen met transporteurs uit de regio, de vrachtwagenfabriek van Mercedes-Benz in Wörth. Zo zien we zelf waar onze Actrossen gebouwd worden en wat eraan komt.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100} className="relative order-1 h-[44vh] overflow-hidden rounded-[2rem] sm:h-[70vh] lg:order-2">
            <Parallax speed={0.05} className="absolute inset-x-0 -top-[12%] h-[124%]">
              <Image src={IMG("woerth")} alt="Mercedes-Benz-vrachtwagens voor de fabriek in Wörth" fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover object-[35%_50%]" />
            </Parallax>
            <p className="absolute bottom-4 left-4 rounded-full bg-white/85 px-4 py-1.5 text-sm font-medium text-zinc-950 backdrop-blur-md">Mercedes-Benz, Wörth am Rhein</p>
          </Reveal>
        </div>
      </Section>

      {/* On the road: two photo ribbons */}
      <Section space="flush-top" bleed>
        <div className="px-5 sm:px-8">
          <SectionHeader label="Onderweg" index="01" lead="Echte ritten," trail="echte foto's." intro="Geen stockbeelden. Dit zijn onze vrachtwagens, van het Jubelpark in Brussel tot in de Alpen." className="mb-12" />
        </div>
        <div className="flex flex-col gap-3">
          {gallery.map((row, r) => (
            <div key={r} data-gallery className="marquee flex overflow-hidden">
              {[0, 1].map((copy) => (
                <ul key={copy} aria-hidden={copy === 1} className={`flex shrink-0 gap-3 pr-3 ${r === 0 ? "animate-marquee" : "animate-marquee-reverse"}`}>
                  {row.map((g) => (
                    <li key={g.src} className="h-52 flex-none overflow-hidden rounded-2xl sm:h-80">
                      <Image src={g.src} alt={copy === 0 ? g.alt : ""} width={g.w} height={g.h} sizes="(min-width: 640px) 30rem, 18rem" className="h-full w-auto object-cover transition-transform duration-700 hover:scale-105" />
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
                Verzekerd transport
              </p>
            </Reveal>
            <div>
              <Reveal>
                <h2 className="max-w-3xl text-3xl font-light leading-[1.08] tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-6xl">
                  Uw wagen reist <span className="text-white/45">gedekt en gedocumenteerd.</span>
                </h2>
              </Reveal>
              <ul className="mt-14 grid gap-10 sm:grid-cols-3">
                {[
                  { t: "Verzekerd transport", b: "Elk voertuig is gedekt tijdens het volledige traject." },
                  { t: "CMR-vrachtbrief", b: "Bevestigt de ophaling en legt de staat bij vertrek vast." },
                  { t: "Intern fotobewijs", b: "Foto's als bewijsstuk bij schade — zorgvuldig en discreet bewaard." },
                ].map((it, i) => (
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
          label="Hoe wij werken"
          index="02"
          lead="Vier redenen"
          trail="die klanten telkens aanhalen."
          action={
            <Link href="/routes" className="text-sm font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950">
              Bekijk waar we rijden
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
