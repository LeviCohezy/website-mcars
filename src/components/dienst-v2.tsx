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

/*
 * Dienst 02 — "Licht & strak". A white, Swiss-grid take on the service page:
 * hairlines, bordered cells, small radii, black as the only accent. Same
 * sections and content as Dienst 01, each with its own layout.
 */

const PRICE_ICONS: IconKey[] = ["route", "car", "wrench", "map", "clock", "truck"];

function Head({ index, label, lead, trail, intro, dark = false }: { index: string; label: string; lead: string; trail?: string; intro?: string; dark?: boolean }) {
  return (
    <Reveal className={`mb-16 grid gap-6 border-t pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10 ${dark ? "border-white/15" : "border-zinc-950"}`}>
      <p className={`flex gap-3 text-xs font-medium tracking-[0.18em] uppercase ${dark ? "text-white/50" : "text-zinc-500"}`}>
        <span className={dark ? "text-white" : "text-zinc-950"}>{index}</span>
        {label}
      </p>
      <div>
        <h2 className={`max-w-4xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] sm:text-4xl lg:text-5xl ${dark ? "text-white" : "text-zinc-950"}`}>
          {lead} {trail && <span className={dark ? "text-white/40" : "text-zinc-400"}>{trail}</span>}
        </h2>
        {intro && <p className={`mt-5 max-w-2xl text-lg leading-relaxed ${dark ? "text-white/60" : "text-zinc-500"}`}>{intro}</p>}
      </div>
    </Reveal>
  );
}

function Block({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`px-6 py-24 sm:px-12 sm:py-32 lg:px-16 ${className}`}>{children}</section>;
}

function Check({ className = "" }: { className?: string }) {
  return (
    <span className={`flex size-5 flex-none items-center justify-center rounded-sm bg-zinc-950 text-white ${className}`}>
      <Icon name="check" className="size-3" />
    </span>
  );
}

export default function DienstV2({ data }: { data: ServicePageData }) {
  const { service, process, vehicleTypes, detailImage, detailAlt, details, practiceCase, safetyImage, safetyAlt, faq, related } = data;

  return (
    <div className="bg-white text-zinc-950">
      {/* 1 · Hero — full photo, big title bottom-left, white form panel right */}
      <section id="prijs" className="relative flex min-h-[calc(100svh-1rem)] flex-col overflow-hidden rounded-xl bg-zinc-950">
        <Image src={service.heroImage} alt={`${service.nav} door Mcars`} fill priority sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-zinc-950/40" />
        <div aria-hidden className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-zinc-950/50 to-transparent" />

        <div className="relative z-10 grid flex-1 gap-8 px-5 pt-32 pb-6 sm:px-8 sm:pb-8 lg:grid-cols-[1fr_24rem] lg:items-end lg:gap-12 lg:px-10 lg:pb-10">
          <div className="flex flex-col">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-white">Home</Link>
              <span aria-hidden>/</span>
              <Link href="/diensten" className="hover:text-white">Diensten</Link>
              <span aria-hidden>/</span>
              <span className="text-white">{service.nav}</span>
            </nav>
            <h1 className="mt-6 max-w-3xl text-[3rem] leading-[0.98] font-light tracking-[-0.045em] text-balance text-white sm:text-7xl lg:text-[6rem]">
              {service.title}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">{service.subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#werkwijze" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
                Bekijk hoe het werkt <Arrow />
              </a>
              <Link href="/reviews" className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-3 text-sm text-white/85 backdrop-blur-md transition-colors hover:border-white/60">
                <span className="font-medium text-white">{site.reviews.score}/5</span> op Google
              </Link>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-3 text-sm text-white/85 backdrop-blur-md">
                <Icon name="shield" className="size-4 text-white" /> Verzekerd, met CMR
              </span>
            </div>
          </div>
          <HeroQuoteBar layout="panel" title="Waar mag uw wagen heen?" subtitle="Vraag vrijblijvend uw prijs." service={service.nav} />
        </div>
      </section>

      <ClientMarquee />

      {/* 2 · Overview — pill + statement with highlighted figures, photo left, structured dark panel right */}
      <Block>
        <Reveal>
          <p className="inline-flex rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700">Eigen vloot, vaste chauffeurs</p>
          <h2 className="mt-6 max-w-6xl text-3xl leading-[1.12] font-medium tracking-[-0.03em] text-pretty text-zinc-400 sm:text-4xl lg:text-5xl">
            Al <span className="text-zinc-950">{site.reviews.clients} klanten</span> vertrouwden hun wagen toe aan onze{" "}
            <span className="text-zinc-950">9 eigen transporters</span> en <span className="text-zinc-950">8 vaste chauffeurs</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <Reveal className="relative min-h-[26rem] overflow-hidden rounded-md bg-zinc-950">
            <Image src={detailImage} alt={detailAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </Reveal>

          <Reveal delay={100} className="relative flex flex-col overflow-hidden rounded-md bg-zinc-950 p-8 text-white sm:p-12 lg:p-14">
            {/* Decorative route lines */}
            <svg aria-hidden className="pointer-events-none absolute -top-10 right-0 h-64 w-[70%] text-white/10" viewBox="0 0 400 240" fill="none" stroke="currentColor">
              <path d="M0 0 L200 170 Q220 188 240 170 L400 30" />
              <path d="M90 0 L200 100 Q220 118 240 100 L350 0" />
            </svg>

            <p className="relative text-xs font-medium tracking-[0.18em] text-white/50 uppercase">Overzicht · {service.nav}</p>
            <h3 className="relative mt-4 text-3xl leading-[1.1] font-medium tracking-[-0.025em] sm:text-4xl">Wat we voor u regelen.</h3>
            <p className="relative mt-5 text-base leading-relaxed text-white/75">{service.intro}</p>

            {/* Structured facts */}
            <dl className="relative mt-8 grid border-t border-white/15 sm:grid-cols-[9rem_1fr]">
              <dt className="pt-5 text-xs font-medium tracking-[0.18em] text-white/45 uppercase sm:pb-5">Voor wie</dt>
              <dd className="pt-2 pb-5 text-[0.95rem] leading-relaxed text-white/85 sm:pt-5">{service.audience}</dd>
              <dt className="border-t border-white/15 pt-5 text-xs font-medium tracking-[0.18em] text-white/45 uppercase sm:pb-5">Inbegrepen</dt>
              <dd className="pt-2 pb-5 sm:border-t sm:border-white/15 sm:pt-5">
                <ul className="grid gap-2 text-[0.95rem] text-white/85">
                  {service.benefits.slice(0, 3).map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <Icon name="check" className="mt-1 size-3.5 flex-none text-white" />
                      {b}
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>

            {/* Service figures, or Mcars-wide facts when a service has none */}
            {(
              <div className="relative grid grid-cols-3 border-t border-white/15">
                {(service.stats ?? [
                  { value: String(site.founded), label: "actief sinds" },
                  { value: "9", label: "eigen transporters" },
                  { value: "24u", label: "antwoord op uw aanvraag" },
                ]).map((st, i) => (
                  <div key={st.label} className={`py-5 ${i > 0 ? "border-l border-white/15 pl-4 sm:pl-5" : "pr-4"}`}>
                    <p className="text-2xl font-medium tracking-tight tabular-nums sm:text-3xl">{st.value}</p>
                    <p className="mt-1 text-xs leading-snug text-white/50">{st.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="relative mt-auto flex flex-wrap gap-3 pt-6">
              <a href="#prijs" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
                Prijs aanvragen <Arrow />
              </a>
              <a href="#werkwijze" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/60">
                Hoe het werkt <Arrow />
              </a>
            </div>
          </Reveal>
        </div>
      </Block>

      {/* 3 · Situations — numbered index left, detail right */}
      {details.situations.length > 0 && <Situations items={details.situations} image={data.situationsImage} />}

      {/* 4 · Why Mcars — bordered row of cells */}
      <Block>
        <Head index="03" label="Waarom Mcars" lead="Zo pakken we het aan," trail="rit na rit." />
        <div className="grid overflow-hidden rounded-md border border-zinc-200 sm:grid-cols-3">
          {service.highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 80} className={`flex min-h-72 flex-col p-7 ${i > 0 ? "border-t border-zinc-200 sm:border-t-0 sm:border-l" : ""}`}>
              <span className="flex size-11 items-center justify-center rounded-sm border border-zinc-200">
                <Icon name={h.icon} className="size-5" />
              </span>
              <h3 className="mt-auto pt-12 text-xl font-medium tracking-tight">{h.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-500">{h.body}</p>
            </Reveal>
          ))}
        </div>
      </Block>

      {/* 5 · Process — grid cells with large numbers + CTA strip */}
      <Block className="scroll-mt-24 bg-zinc-100" id="werkwijze">
        <Head index="04" label="Werkwijze" lead="Van aanvraag tot levering," trail="in vier stappen." />
        <ol className="grid gap-px overflow-hidden rounded-md bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 80} className="flex min-h-80 flex-col bg-white p-8 sm:p-10">
              <span className="self-end text-6xl font-medium tracking-[-0.05em] text-zinc-200 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-auto text-xl font-medium tracking-tight">{s.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-zinc-500">{s.body}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-px flex flex-col items-start justify-between gap-4 rounded-md bg-zinc-950 p-8 sm:p-10 text-white sm:flex-row sm:items-center">
          <p className="text-lg">Klaar voor stap 01? U krijgt binnen 24 uur een persoonlijk antwoord.</p>
          <a href="#prijs" className="inline-flex items-center gap-2 rounded-sm bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
            Prijs aanvragen <Arrow />
          </a>
        </Reveal>
      </Block>

      {/* 6 · Price — factor table + sticky tips card */}
      <Block>
        <Head index="05" label="Prijs" lead="Wat bepaalt" trail="de prijs?" intro="Geen calculator: elke prijs is afgestemd op uw transport. Dit zijn de factoren die meetellen." />
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:gap-10">
          <div className="border-t border-zinc-200">
            {details.priceFactors.map((f, i) => (
              <Reveal key={f.title} className="grid gap-2 border-b border-zinc-200 py-6 sm:grid-cols-[3rem_1fr_1.6fr] sm:gap-6">
                <span className="text-zinc-400"><Icon name={PRICE_ICONS[i % PRICE_ICONS.length]} className="size-5" /></span>
                <h3 className="text-lg font-medium tracking-tight">{f.title}</h3>
                <p className="text-[0.95rem] leading-relaxed text-zinc-500">{f.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="self-start rounded-md border border-zinc-200 p-8 sm:p-10 lg:sticky lg:top-28">
            {details.savingTips.length > 0 && (
              <>
                <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">Zo bespaart u</p>
                <ul className="mt-5 flex flex-col gap-4">
                  {details.savingTips.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-zinc-700"><Check className="mt-0.5" />{t}</li>
                  ))}
                </ul>
              </>
            )}
            <a href="#prijs" className="mt-7 flex items-center justify-between rounded-sm bg-zinc-950 px-5 py-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
              Prijs aanvragen <Arrow />
            </a>
          </Reveal>
        </div>
      </Block>

      {/* 7 · What we need — three columns with a black header strip */}
      <Block className="pt-0 sm:pt-0">
        {details.needsMode === "pech" ? (
          <>
            <Head index="06" label="Bij pech" lead="Wat te doen" trail="bij pech?" />
            <Columns cols={BREAKDOWN} />
          </>
        ) : (
          <>
            <Head index="06" label="Voorbereiding" lead="Wat we van u" trail="nodig hebben." />
            <Columns cols={[
              { title: "Bij de aanvraag", items: details.needs.aanvraag },
              { title: "Documenten", items: details.needs.documenten },
              { title: "Op de dag zelf", items: details.needs.dagZelf },
            ]} />
          </>
        )}
      </Block>

      {/* 8 · Included — two-up checklist + vehicle tag box */}
      <Block className="bg-zinc-100">
        <Head index="07" label="Inbegrepen" lead="Wat u van ons" trail="mag verwachten." />
        <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
          <ul className="grid gap-px overflow-hidden rounded-md bg-zinc-200 sm:grid-cols-2">
            {service.benefits.map((b, i) => (
              <Reveal as="li" key={b} delay={i * 60} className="flex min-h-36 flex-col justify-between gap-6 bg-white p-7 sm:p-8">
                <Check />
                <span className="text-lg leading-snug tracking-tight">{b}</span>
              </Reveal>
            ))}
          </ul>
          <Reveal className="rounded-md bg-white p-7 sm:p-8">
            <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">Wij vervoeren</p>
            <ul className="mt-5 divide-y divide-zinc-200 border-y border-zinc-200">
              {vehicleTypes.map((v) => (
                <li key={v} className="flex items-center justify-between py-3 text-[0.95rem] text-zinc-700">
                  {v}
                  <Icon name="car" className="size-4 text-zinc-300" />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Block>

      {/* 9 · Fleet & safety — stat cards over a photo strip, then the safety points */}
      <Block>
        <Head index="08" label="Vloot & veiligheid" lead="Zo beschermen we" trail="uw wagen." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Eigen vloot", v: "9", u: "transporters", icon: "truck" as IconKey },
            { k: "Vaste chauffeurs", v: "8", u: "in dienst", icon: "users" as IconKey },
            { k: "Actief sinds", v: String(site.founded), u: "", icon: "star" as IconKey },
            { k: "Elke rit", v: "CMR", u: "vrachtbrief", icon: "shield" as IconKey },
          ].map((s, i) => (
            <Reveal key={s.k} delay={i * 70} className="rounded-md bg-zinc-100 p-7 sm:p-8">
              <div className="flex items-center justify-between text-xs font-medium tracking-[0.14em] text-zinc-500 uppercase">
                {s.k}
                <Icon name={s.icon} className="size-4 text-zinc-950" />
              </div>
              <p className="mt-10 text-6xl font-medium tracking-[-0.05em] tabular-nums">
                {s.v}<span className="ml-2 text-base font-normal tracking-normal text-zinc-500">{s.u}</span>
              </p>
            </Reveal>
          ))}
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="relative min-h-80 overflow-hidden rounded-md bg-zinc-950">
            <Image src={safetyImage} alt={safetyAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </Reveal>
          <ul className="rounded-md border border-zinc-200 px-6">
            {details.safety.map((s) => (
              <Reveal as="li" key={s.title} className="border-b border-zinc-200 py-5 last:border-b-0">
                <h3 className="font-medium tracking-tight">{s.title}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-zinc-500">{s.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Block>

      {/* 10 · Practice — editorial case: large title, image square */}
      {practiceCase && (
        <Block className="bg-zinc-950 text-white">
          <Head dark index="09" label="Uit de praktijk" lead="Zo deden we het" trail="eerder." />
          <Reveal className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <div className="flex flex-col">
              <p className="text-sm text-white/50">{practiceCase.tag}</p>
              <h3 className="mt-5 text-3xl leading-[1.1] font-light tracking-[-0.03em] sm:text-5xl">“{practiceCase.title}”</h3>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">{practiceCase.body}</p>
              <Link href="/cases" className="mt-10 inline-flex items-center gap-2 self-start border-b border-white/30 pb-1 text-sm font-medium hover:border-white">
                Meer cases bekijken <Arrow />
              </Link>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-md">
              <Image src={practiceCase.image} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        </Block>
      )}

      {/* 11 · FAQ — boxed accordion beside plain contact details */}
      <Block>
        <Head index="10" label="FAQ" lead="Veelgestelde vragen" trail={`over ${service.nav.toLowerCase()}.`} />
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Reveal className="order-last lg:order-none">
            <p className="text-sm text-zinc-500">Staat uw vraag er niet bij?</p>
            <a href={site.phoneHref} className="mt-3 block text-2xl font-medium tracking-tight hover:underline">{site.phone}</a>
            <a href={`mailto:${site.email}`} className="mt-1 block text-zinc-600 hover:text-zinc-950">{site.email}</a>
            <p className="mt-4 text-sm text-zinc-400">{site.hours}</p>
          </Reveal>
          <BoxedFaq items={faq} />
        </div>
      </Block>

      {/* 12 · Related — index rows with a thumbnail */}
      {related.length > 0 && (
        <Block className="pt-0 sm:pt-0">
          <Head index="11" label="Ontdek ook" lead="Verwante diensten" trail="en routes." />
          <ul className="border-t border-zinc-200">
            {related.map((r) => (
              <Reveal as="li" key={r.href} className="border-b border-zinc-200">
                <Link href={r.href} className="group grid grid-cols-[5rem_1fr_auto] items-center gap-5 py-4 sm:grid-cols-[7rem_1fr_1fr_auto] sm:gap-8">
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-sm bg-zinc-100">
                    <Image src={r.image} alt="" fill sizes="7rem" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </span>
                  <span className="text-xl font-medium tracking-tight sm:text-2xl">{r.label}</span>
                  <span className="hidden text-[0.95rem] text-zinc-500 sm:block">{r.sub}</span>
                  <span className="flex items-center gap-3 text-sm text-zinc-400">
                    <span className="hidden sm:inline">{r.meta}</span>
                    <span className="flex size-9 items-center justify-center rounded-sm border border-zinc-200 text-zinc-950 transition-colors group-hover:bg-zinc-950 group-hover:text-white"><Arrow /></span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
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

function Columns({ cols }: { cols: { title: string; items: string[] }[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {cols.map((c, i) => (
        <Reveal key={c.title} delay={i * 70} className="overflow-hidden rounded-md border border-zinc-200">
          <div className="flex items-center justify-between bg-zinc-950 px-6 py-4 text-white">
            <h3 className="font-medium tracking-tight">{c.title}</h3>
            <span className="text-sm text-white/50 tabular-nums">{String.fromCharCode(65 + i)}</span>
          </div>
          <ul className="flex flex-col gap-4 p-7 sm:p-8">
            {c.items.map((it) => (
              <li key={it} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-zinc-700"><Check className="mt-0.5" />{it}</li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}

function Situations({ items, image }: { items: { title: string; desc?: string; body: string }[]; image: string }) {
  const [active, setActive] = useState(0);
  const s = items[active];
  return (
    <Block className="bg-zinc-100">
      <Head index="02" label="Herkenbare situaties" lead="Herkent u zich" trail="hierin?" />
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <ul className="border-t border-zinc-300">
          {items.map((it, i) => (
            <li key={it.title} className="border-b border-zinc-300">
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-pressed={active === i}
                className="flex w-full items-baseline gap-6 py-6 text-left"
              >
                <span className={`w-8 text-sm tabular-nums transition-colors ${active === i ? "text-zinc-950" : "text-zinc-400"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`text-xl font-medium tracking-tight text-balance transition-colors sm:text-2xl ${active === i ? "text-zinc-950" : "text-zinc-400"}`}>{it.title}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-5">
          <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-zinc-950">
            <Image src={image} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div aria-live="polite" className="grid gap-6 sm:grid-cols-2">
            {s.desc && (
              <div>
                <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">De situatie</p>
                <p className="mt-3 text-base leading-relaxed text-zinc-700">{s.desc}</p>
              </div>
            )}
            <div className="rounded-md bg-zinc-950 p-5 text-white">
              <p className="text-xs font-medium tracking-[0.18em] text-white/50 uppercase">Wat wij doen</p>
              <p className="mt-3 text-base leading-relaxed text-white/85">{s.body}</p>
            </div>
          </div>
        </div>
      </div>
    </Block>
  );
}

function BoxedFaq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-2">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className={`rounded-md border transition-colors ${isOpen ? "border-zinc-950 bg-zinc-50" : "border-zinc-200"}`}>
            <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center gap-5 px-5 py-5 text-left sm:px-6">
              <span className="flex-1 text-lg font-medium tracking-tight">{f.q}</span>
              <span className={`flex size-7 flex-none items-center justify-center rounded-sm transition-colors ${isOpen ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-600"}`}>
                <svg className={`size-3.5 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="max-w-2xl px-5 pb-6 text-base leading-relaxed text-zinc-600 sm:px-6">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Arrow() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
