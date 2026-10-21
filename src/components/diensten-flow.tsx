"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { countryRoutes } from "@/data/routes";
import { defaultProcess, defaultVehicleTypes, services } from "@/data/services";
import { site } from "@/lib/site";
import {
  Arrow,
  Bento,
  Cell,
  Chapter,
  ChapterIntro,
  ClipImage,
  Figures,
  FlowButton,
  FlowClose,
  FlowGrid,
  FlowHero,
  FlowPage,
  ImageBridge,
  IndexRow,
  InlineImageLine,
  Rise,
  StepPath,
  toneClasses,
  type FlowTone,
} from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * Diensten overview as one composed film (sibling of service-flow.tsx).
 *
 *   hero+form → 01 the eleven services → 02 what we carry → [bridge] →
 *   03 one way of working → 04 every service on every route → close
 *
 * The services chapter is the centrepiece and is composed differently per version:
 *   01 cinema    IndexRow with photo thumbnails   light → paper → dark → light → close
 *   02 wordmark  Bento of photo cells             light / paper only
 *   03 lines     horizontal snap rail, tall cards dark, one paper interlude (02)
 */

type Version = 1 | 2 | 3;

const TONES: Record<Version, { page: FlowTone; services: FlowTone; vehicles: FlowTone; process: FlowTone; routes: FlowTone }> = {
  1: { page: "light", services: "light", vehicles: "paper", process: "dark", routes: "light" },
  2: { page: "light", services: "light", vehicles: "light", process: "paper", routes: "light" },
  3: { page: "dark", services: "dark", vehicles: "paper", process: "dark", routes: "dark" },
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function DienstenFlow({ version }: { version: Version }) {
  const T = TONES[version];
  const formTone = version === 1 ? "glass" : version === 2 ? "light" : "dark";
  const onLight = version === 2;
  const crumbs = [{ href: "/", label: "Home" }, { label: "Diensten" }];
  const proof = (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${onLight ? "text-zinc-500" : "text-white/70"}`}>
      <span><b className={onLight ? "font-medium text-zinc-950" : "font-medium text-white"}>{site.reviews.score}/5</b> op Google</span>
      <span aria-hidden>·</span>
      <span>{services.length} diensten</span>
      <span aria-hidden>·</span>
      <span>Eén aanspreekpunt</span>
    </div>
  );

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={version === 1 ? "cinema" : version === 2 ? "wordmark" : "lines"}
        title="Voor elk voertuig de juiste aanpak."
        intro="Van één particuliere wagen tot een volledig wagenpark — transportoplossingen in België en heel Europa."
        crumbs={crumbs}
        image={version === 2 ? "/images/generated/truck-studio.jpg" : "/fleet/sunset-parking.jpg"}
        imageAlt="Mcars-transporters geparkeerd bij zonsondergang"
        wordmark="DIENSTEN"
        lineImages={["/images/generated/dealer-loading.jpg", "/images/generated/oldtimer-loading.jpg"]}
        aside={proof}
        form={<QuoteFlow tone={formTone} />}
      />

      {/* 01 — the eleven services, the centrepiece */}
      <Chapter n="01" label="Onze diensten" tone={T.services}>
        <ChapterIntro
          lead="Elf manieren om uw wagen te verplaatsen,"
          trail="één team dat het regelt."
          body="Of het nu gaat om een gezinswagen, een voorraad voor de showroom of een klassieker die niet meer rijdt: u spreekt met de mensen die de rit ook effectief uitvoeren."
        />
        <div className="mt-12 sm:mt-16">
          {version === 1 && (
            <IndexRow items={services.map((s) => ({ title: s.nav, body: s.subtitle, href: `/diensten/${s.slug}`, image: s.heroImage, meta: s.category }))} />
          )}
          {version === 2 && (
            <Bento>
              {[
                ...services.map((s, i) => (
                  <Link key={s.slug} href={`/diensten/${s.slug}`} className="group absolute inset-0 block">
                    <Cell image={s.heroImage} alt={`${s.nav} door Mcars`} eyebrow={`${pad(i + 1)} · ${s.category}`} title={s.nav} body={s.subtitle} />
                  </Link>
                )),
                <Link key="offerte" href="/offerte" className="absolute inset-0 block">
                  <Cell eyebrow="Iets anders?" title="Uw transport staat er niet bij?" body="Leg ons uw vraag voor — we bekijken graag wat mogelijk is.">
                    <span className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-medium text-white">
                      Offerte aanvragen <Arrow />
                    </span>
                  </Cell>
                </Link>,
              ]}
            </Bento>
          )}
          {version === 3 && <ServiceRail />}
        </div>
      </Chapter>

      {/* 02 — what we carry */}
      <Chapter n="02" label="Voertuigen" tone={T.vehicles} curtain={T.vehicles === "paper" && T.services === "dark"}>
        {version === 3 ? (
          <InlineImageLine parts={["Wat we vervoeren:", { image: "/images/generated/oldtimer-loading.jpg" }, "rijdend", { image: "/images/generated/nonrunning-winch.jpg" }, "of niet."]} />
        ) : (
          <ChapterIntro lead="Wat we vervoeren." trail="Rijdend of niet." body="Van moto tot bestelwagen — ook als hij niet meer rijdt." />
        )}
        <FlowGrid className="mt-12 sm:mt-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
            <ClipImage
              src={version === 3 ? "/images/generated/dealer-loading.jpg" : "/images/generated/nonrunning-winch.jpg"}
              alt={version === 3 ? "Personenwagens worden op een Mcars-transporter geladen" : "Een niet-rijdende wagen gaat met de lier aan boord"}
              sizes="(min-width:1024px) 30vw, 100vw"
              className="aspect-[4/3] rounded-[1.5rem] lg:aspect-[3/4]"
            />
            <ol className={`grid self-start border-t sm:grid-cols-2 ${toneClasses(T.vehicles).line}`}>
              {defaultVehicleTypes.map((v, i) => (
                <Rise key={v} delay={(i % 2) * 70} className={`border-b py-6 sm:pr-8 ${toneClasses(T.vehicles).line}`}>
                  <span className={`font-mono text-[11px] tracking-[0.2em] ${toneClasses(T.vehicles).faint}`}>{pad(i + 1)}</span>
                  <span className="mt-2 block text-2xl font-light tracking-[-0.02em]">{v}</span>
                </Rise>
              ))}
            </ol>
          </div>
        </FlowGrid>
      </Chapter>

      <div>
        <ImageBridge src="/fleet/countryside-highway.jpg" alt="" from={T.vehicles} to={T.process} />
      </div>

      {/* 03 — one way of working for every service */}
      <Chapter n="03" label="Werkwijze" tone={T.process}>
        <ChapterIntro
          lead="Eén werkwijze,"
          trail="voor elke dienst."
          body="U weet op elk moment wat er gebeurt en wie u kan bellen."
          action={<FlowButton href="/hoe-werkt-het" variant="ghost">Zo werkt het</FlowButton>}
        />
        <div className="mt-14 sm:mt-20">
          <StepPath steps={defaultProcess.map((p) => ({ title: p.title, body: p.body }))} />
        </div>
        <div className="mt-20 sm:mt-28">
          <Figures items={[
            { value: "9", label: "Eigen transporters" },
            { value: "8", label: "Vaste chauffeurs" },
            { value: String(site.founded), label: "Sinds" },
            { value: "24u", label: "Antwoord op uw aanvraag" },
          ]} />
        </div>
      </Chapter>

      {/* 04 — every service on every route */}
      <Chapter n="04" label="Bestemmingen" tone={T.routes} curtain={T.routes !== T.process}>
        <ChapterIntro
          lead="Elke dienst, op elke route."
          trail="Van België tot Noord-Spanje en verder."
          action={<FlowButton href="/routes" variant="ghost">Alle routes</FlowButton>}
        />
        <FlowGrid className="mt-12 sm:mt-16">
          <ul className={`grid border-t sm:grid-cols-2 lg:grid-cols-3 ${toneClasses(T.routes).line}`}>
            {countryRoutes.map((r, i) => (
              <li key={r.slug} className={`border-b ${toneClasses(T.routes).line}`}>
                <Link href={`/routes/${r.slug}`} className="group flex min-h-24 items-center gap-5 py-6 sm:pr-8">
                  <span className={`font-mono text-[11px] tracking-[0.2em] ${toneClasses(T.routes).faint}`}>{pad(i + 1)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-2xl font-light tracking-[-0.02em]">{r.place!.name}</span>
                    <span className={`mt-1 block text-sm ${toneClasses(T.routes).muted}`}>{r.frequency}</span>
                  </span>
                  <span className={`flex size-11 flex-none items-center justify-center rounded-full ring-1 transition-colors ${T.routes === "dark" ? "ring-white/20 group-hover:bg-white group-hover:text-zinc-950" : "ring-zinc-950/15 group-hover:bg-zinc-950 group-hover:text-white"}`}>
                    <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </FlowGrid>
      </Chapter>

      <FlowClose
        form={<QuoteFlow tone="dark" />}
        contact={
          <dl className="grid gap-5 text-sm sm:grid-cols-2">
            <div><dt className="text-white/40">Rechtstreeks bellen</dt><dd className="mt-1"><a href={site.phoneHref} className="inline-block py-2 text-lg text-white">{site.phone}</a></dd></div>
            <div><dt className="text-white/40">Mailen</dt><dd className="mt-1"><a href={`mailto:${site.email}`} className="inline-block py-2 text-lg text-white">{site.email}</a></dd></div>
          </dl>
        }
      />
    </FlowPage>
  );
}

/** v3 centrepiece: a horizontal snap rail of tall photo cards, with arrow buttons for mouse users. */
function ServiceRail() {
  const ref = useRef<HTMLUListElement>(null);
  const by = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: "smooth" });
  };
  return (
    <FlowGrid>
      <div className="mb-6 flex items-center justify-between">
        <p className="font-mono text-[11px] tracking-[0.2em] text-white/55 uppercase">{pad(services.length)} diensten</p>
        <div className="flex gap-2">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => by(d)}
              aria-label={d < 0 ? "Vorige diensten" : "Volgende diensten"}
              className="flex size-11 items-center justify-center rounded-full text-white ring-1 ring-white/20 transition-colors hover:bg-white hover:text-zinc-950"
            >
              <Arrow className={`size-4 ${d < 0 ? "rotate-180" : ""}`} />
            </button>
          ))}
        </div>
      </div>
      <ul ref={ref} className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] sm:-mx-10 sm:scroll-px-10 sm:px-10 lg:-mx-14 lg:scroll-px-14 lg:px-14">
        {services.map((s, i) => (
          <li key={s.slug} className="w-[78%] flex-none snap-start sm:w-[21rem]">
            <Link href={`/diensten/${s.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-[1.5rem] ring-1 ring-white/10">
              <Image src={s.heroImage} alt={`${s.nav} door Mcars`} fill sizes="(min-width:640px) 21rem, 78vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/10 to-transparent" />
              <span className="absolute inset-x-0 top-0 p-5 font-[family-name:var(--font-display)] text-5xl leading-none text-white/80">{pad(i + 1)}</span>
              <span className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">{s.category}</span>
                <span className="mt-2 block text-2xl leading-tight font-light tracking-[-0.02em]">{s.nav}</span>
                <span className="mt-2 block text-sm leading-relaxed text-white/70">{s.subtitle}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </FlowGrid>
  );
}
