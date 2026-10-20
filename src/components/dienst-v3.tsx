"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { IconKey } from "@/data/services";
import type { ServicePageData } from "@/lib/service-page";
import { site } from "@/lib/site";
import ClientMarquee from "./client-marquee";
import HeroQuoteBar from "./hero-quote-bar";
import Icon from "./icon";
import { Reveal } from "./scroll";
import { HorizontalRail, ImageAccordion, TypeMarquee } from "./signature";

/*
 * Dienst 03 — "Donker & premium". The whole page sits on black: centred
 * cinematic hero, a horizontal card rail, oversized numbers, tabs and a fleet
 * band with big figures. Same sections and content as Dienst 01.
 */

/** Photos for the situation panels (the hero, overview and why-section use the page's own images). */
const SITUATION_IMAGES = [
  "/images/generated/flemish-square.jpg",
  "/images/generated/airport-nice.jpg",
  "/images/generated/nonrunning-winch.jpg",
  "/images/generated/workshop.jpg",
];
const PRICE_ICONS: IconKey[] = ["route", "car", "wrench", "map", "clock", "truck"];

function Head({ label, lead, trail, intro, center = false }: { label: string; lead: string; trail?: string; intro?: string; center?: boolean }) {
  return (
    <Reveal className={`mb-14 ${center ? "mx-auto max-w-3xl text-center" : "max-w-4xl"}`}>
      <p className={`flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] text-white/50 uppercase ${center ? "justify-center" : ""}`}>
        <span aria-hidden className="h-px w-6 bg-white/40" />
        {label}
      </p>
      <h2 className="mt-6 text-4xl font-light leading-[1.04] tracking-[-0.035em] text-balance text-white sm:text-5xl lg:text-6xl">
        {lead} {trail && <span className="text-white/35">{trail}</span>}
      </h2>
      {intro && <p className={`mt-6 text-lg leading-relaxed text-white/55 ${center ? "mx-auto max-w-xl" : "max-w-xl"}`}>{intro}</p>}
    </Reveal>
  );
}

function Block({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`px-5 py-24 sm:px-10 sm:py-32 lg:px-14 ${className}`}>{children}</section>;
}

function Tick() {
  return (
    <span className="mt-0.5 flex size-5 flex-none items-center justify-center rounded-full border border-white/30 text-white">
      <Icon name="check" className="size-3" />
    </span>
  );
}

export default function DienstV3({ data }: { data: ServicePageData }) {
  const { service, process, vehicleTypes, detailImage, detailAlt, details, practiceCase, safetyImage, safetyAlt, faq, related } = data;

  return (
    <div className="overflow-clip rounded-[1rem] bg-zinc-950 text-white">
      {/* 1 · Hero — centred title over the photo, form bar and proof below */}
      <section id="prijs" className="relative flex min-h-[calc(100svh-1rem)] flex-col items-center justify-end px-5 pt-36 pb-8 text-center sm:px-10">
        <Image src={service.heroImage} alt={`${service.nav} door Mcars`} fill priority sizes="100vw" className="object-cover opacity-60" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/30 to-zinc-950" />
        <div className="relative w-full">
          <nav aria-label="Breadcrumb" className="flex justify-center gap-2 text-sm text-white/50">
            <Link href="/diensten" className="hover:text-white">Diensten</Link>
            <span aria-hidden>/</span>
            <span className="text-white/80">{service.category}</span>
          </nav>
          <h1 className="mx-auto mt-6 max-w-5xl text-5xl leading-[0.98] font-light tracking-[-0.045em] text-balance sm:text-7xl lg:text-[6.5rem]">
            {service.title}
          </h1>
          <div className="mx-auto mt-12 max-w-5xl text-left">
            <HeroQuoteBar service={service.nav} className="!max-w-none" />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/60">
            <Link href="/reviews" className="flex items-center gap-2 hover:text-white">
              <Star /> <span className="font-medium text-white">{site.reviews.score}/5</span> op Google
            </Link>
            <span className="flex items-center gap-2"><Icon name="shield" className="size-4 text-white" /> Verzekerd, met CMR</span>
            <span className="flex items-center gap-2"><Icon name="truck" className="size-4 text-white" /> Eigen vloot sinds {site.founded}</span>
          </div>
        </div>
      </section>

      <ClientMarquee className="[&_li_span]:!text-white/25" />

      {/* 2 · Overview — statement and oversized figures */}
      <Block>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Voor wie</p>
            <p className="mt-4 text-lg leading-relaxed text-white/70">{service.audience}</p>
          </Reveal>
          <Reveal>
            <p className="text-3xl leading-[1.25] font-light tracking-[-0.025em] text-pretty sm:text-4xl lg:text-[2.8rem]">{service.intro}</p>
          </Reveal>
        </div>
        {service.stats && (
          <dl className="mt-20 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-3">
            {service.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <dd className="text-7xl font-light tracking-[-0.05em] tabular-nums lg:text-8xl">{s.value}</dd>
                <dt className="mt-3 text-sm text-white/50">{s.label}</dt>
              </Reveal>
            ))}
          </dl>
        )}
      </Block>

      {/* 3 · Situations — expanding photo panels */}
      {details.situations.length > 0 && (
        <Block className="bg-zinc-900">
          <Head label="Herkenbare situaties" lead="Herkent u zich" trail="hierin?" />
          <ImageAccordion
            items={details.situations.map((x, i) => ({
              title: x.title,
              body: x.desc ? `${x.desc} Wat wij doen: ${x.body}` : `Wat wij doen: ${x.body}`,
              image: SITUATION_IMAGES[i % SITUATION_IMAGES.length],
            }))}
          />
        </Block>
      )}

      {/* 4 · Why Mcars — sticky photo left, numbered points right */}
      <Block>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative min-h-[28rem] overflow-hidden rounded-2xl lg:sticky lg:top-24 lg:h-[80vh] lg:self-start">
            <Image src={detailImage} alt={detailAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <Head label="Waarom Mcars" lead="Zo pakken we het aan," trail="rit na rit." />
            <ol>
              {service.highlights.map((h, i) => (
                <Reveal as="li" key={h.title} className="grid grid-cols-[4rem_1fr] gap-4 border-t border-white/10 py-9">
                  <span className="text-4xl font-light tracking-tight text-white/30 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight">{h.title}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-white/60">{h.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Block>

      {/* 5 · Process — big numbered rows */}
      <Block className="bg-zinc-900">
        <Head label="Werkwijze" lead="Van aanvraag tot levering." />
        <ol className="border-b border-white/10">
          {process.map((s, i) => (
            <Reveal as="li" key={s.title} className="group grid gap-4 border-t border-white/10 py-10 transition-colors hover:bg-white/[0.03] sm:grid-cols-[8rem_1fr_1.3fr] sm:items-baseline sm:gap-10">
              <span className="font-[family-name:var(--font-display)] text-7xl leading-none text-white/20 transition-colors group-hover:text-white">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{s.title}</h3>
              <p className="text-base leading-relaxed text-white/60">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </Block>

      {/* 6 · Price — grid of factor tiles with one white CTA tile */}
      <Block>
        <Head label="Prijs" lead="Wat bepaalt" trail="de prijs?" intro="Geen calculator en geen standaardtarief: dit zijn de factoren die voor uw transport meetellen." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {details.priceFactors.map((f, i) => (
            <Reveal key={f.title} delay={i * 50} className="flex min-h-56 flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-white/10"><Icon name={PRICE_ICONS[i % PRICE_ICONS.length]} className="size-[1.1rem]" /></span>
              <h3 className="mt-auto pt-10 text-lg font-medium tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{f.body}</p>
            </Reveal>
          ))}
          <Reveal className={`flex min-h-56 flex-col rounded-2xl bg-white p-6 text-zinc-950 ${details.priceFactors.length % 4 === 3 ? "" : "sm:col-span-2"}`}>
            <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">{details.savingTips.length > 0 ? "Zo bespaart u" : "Uw prijs"}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {(details.savingTips.length > 0 ? details.savingTips : ["Elke prijs is maatwerk — u krijgt een persoonlijk antwoord."]).map((t) => (
                <li key={t} className="text-sm leading-relaxed text-zinc-700">— {t}</li>
              ))}
            </ul>
            <a href="#prijs" className="mt-auto inline-flex items-center justify-between gap-3 rounded-full bg-zinc-950 py-3 pr-3 pl-6 pt-3 text-sm font-medium text-white">
              Prijs aanvragen <Arrow />
            </a>
          </Reveal>
        </div>
      </Block>

      {/* 7 · What we need — tabs */}
      <Block className="bg-zinc-900">
        {details.needsMode === "pech" ? (
          <>
            <Head center label="Bij pech" lead="Wat te doen" trail="bij pech?" />
            <Tabs tabs={BREAKDOWN} />
          </>
        ) : (
          <>
            <Head center label="Voorbereiding" lead="Wat we van u" trail="nodig hebben." />
            <Tabs tabs={[
              { title: "Bij de aanvraag", items: details.needs.aanvraag },
              { title: "Documenten", items: details.needs.documenten },
              { title: "Op de dag zelf", items: details.needs.dagZelf },
            ]} />
          </>
        )}
      </Block>

      {/* 8 · Included — split: checklist left, vehicle chips right */}
      <Block>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Head label="Inbegrepen" lead="Wat u van ons" trail="mag verwachten." />
            <ul className="flex flex-col">
              {service.benefits.map((b) => (
                <Reveal as="li" key={b} className="flex items-start gap-4 border-t border-white/10 py-5 text-lg">
                  <Tick /> {b}
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal className="self-end rounded-2xl border border-white/10 p-7">
            <p className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Wij vervoeren</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {vehicleTypes.map((v) => (
                <li key={v} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80">{v}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Block>

      {/* 9 · Fleet & safety — running words, photo band with big figures, safety points under */}
      <section className="relative">
        <div className="pt-16 pb-6 sm:pt-24">
          <TypeMarquee
            tone="dark"
            words={["Eigen vloot", "Kässbohrer", "CMR", `Sinds ${site.founded}`]}
            images={["/images/generated/depot-night.jpg", "/images/generated/truck-studio.jpg", "/images/generated/team-depot.jpg"]}
            speed={60}
          />
        </div>
        <div className="relative flex min-h-[80vh] flex-col justify-end overflow-hidden">
          <Image src={safetyImage} alt={safetyAlt} fill sizes="100vw" className="object-cover opacity-55" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/60" />
          <div className="relative px-5 pb-14 sm:px-10 lg:px-14">
            <Head label="Vloot & veiligheid" lead="Zo beschermen we" trail="uw wagen." />
            <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {[
                { v: "9", u: "", l: "eigen transporters met Kässbohrer-opbouw" },
                { v: "8", u: "", l: "vaste chauffeurs, geen onderaannemers" },
                { v: "100", u: "%", l: "van de ritten op CMR-vrachtbrief" },
                { v: String(site.founded), u: "", l: "het jaar dat we begonnen" },
              ].map((s) => (
                <Reveal key={s.l}>
                  <dd className="text-6xl font-light tracking-[-0.05em] tabular-nums lg:text-7xl">{s.v}<span className="text-white/40">{s.u}</span></dd>
                  <dt className="mt-3 max-w-[14rem] text-sm text-white/60">{s.l}</dt>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
        <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {details.safety.slice(0, 4).map((s) => (
            <Reveal key={s.title} className="bg-zinc-950 p-7 sm:p-8">
              <h3 className="text-lg font-medium tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 10 · Practice — white card on black */}
      {practiceCase && (
        <Block>
          <Reveal className="grid overflow-hidden rounded-2xl bg-white text-zinc-950 lg:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col p-8 sm:p-12">
              <p className="text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase">Uit de praktijk · {practiceCase.tag}</p>
              <h2 className="mt-6 text-3xl leading-[1.08] font-light tracking-[-0.03em] sm:text-5xl">{practiceCase.title}</h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600">{practiceCase.body}</p>
              <Link href="/cases" className="mt-auto inline-flex items-center gap-2 self-start pt-10 text-sm font-medium">
                Meer cases bekijken <Arrow />
              </Link>
            </div>
            <div className="relative min-h-80">
              <Image src={practiceCase.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        </Block>
      )}

      {/* 11 · FAQ — numbered dark accordion, contact under the heading */}
      <Block className="bg-zinc-900">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Head label="FAQ" lead="Veelgestelde" trail="vragen." />
            <Reveal className="-mt-6 text-white/60">
              Staat uw vraag er niet bij? Bel{" "}
              <a href={site.phoneHref} className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{site.phone}</a>
              {" "}of mail{" "}
              <a href={`mailto:${site.email}`} className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{site.email}</a>.
            </Reveal>
          </div>
          <DarkFaq items={faq} />
        </div>
      </Block>

      {/* 12 · Related — pinned rail of tall cards */}
      {related.length > 0 && (
        <Block className="py-0 sm:py-0 lg:[&_.snap-start]:w-[22rem]">
          <HorizontalRail
            heading={<Head label="Ontdek ook" lead="Verwante diensten" trail="en routes." />}
            items={related.map((r) => ({ title: r.label, body: r.sub, image: r.portrait ?? r.image, href: r.href, meta: r.meta }))}
          />
        </Block>
      )}
    </div>
  );
}

const BREAKDOWN = [
  { title: "Eerst veilig", items: ["Zet de wagen zo veilig mogelijk aan de kant en zet de alarmlichten aan.", "Trek een fluohesje aan en plaats de gevarendriehoek.", "Wacht achter de vangrail, niet in of naast de wagen."] },
  { title: "Bel ons", items: ["Geef de exacte locatie door (straat, afrit of kilometerpaal).", "Vertel welk voertuig het is en wat er scheelt.", "Zeg waar de wagen naartoe moet."] },
  { title: "Wij komen", items: ["U krijgt meteen een eerlijk antwoord over wanneer we er kunnen zijn.", "We laden de wagen veilig op met de lier.", "We brengen hem naar uw garage, naar huis of naar ons depot."] },
];

function Tabs({ tabs }: { tabs: { title: string; items: string[] }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="mx-auto max-w-3xl">
      <div role="tablist" className="mx-auto flex w-full flex-wrap justify-center gap-1 rounded-full border border-white/10 p-1 sm:w-auto">
        {tabs.map((t, i) => (
          <button
            key={t.title}
            role="tab"
            type="button"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`flex-1 rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:flex-none ${active === i ? "bg-white text-zinc-950" : "text-white/60 hover:text-white"}`}
          >
            <span className="mr-2 tabular-nums opacity-50">{String(i + 1).padStart(2, "0")}</span>{t.title}
          </button>
        ))}
      </div>
      <ul role="tabpanel" className="mt-10 flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        {tabs[active].items.map((it) => (
          <li key={it} className="flex items-start gap-4 rounded-xl px-4 py-4 text-lg leading-relaxed text-white/85">
            <Tick /> {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DarkFaq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-b border-white/10">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-t border-white/10">
            <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-baseline gap-6 py-7 text-left">
              <span className="w-6 text-sm text-white/30 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className={`flex-1 text-xl font-medium tracking-tight transition-colors ${isOpen ? "text-white" : "text-white/70"}`}>{f.q}</span>
              <span className={`text-2xl leading-none font-light transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="max-w-2xl pr-10 pb-8 pl-12 text-base leading-relaxed text-white/60">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Star() {
  return <svg className="size-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2l2.9 6.3 6.9.8-5.1 4.8 1.4 6.8L12 17.3 5.9 20.7l1.4-6.8L2.2 9.1l6.9-.8z" /></svg>;
}

function Arrow() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
