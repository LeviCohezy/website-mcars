"use client";

import { offerteFaq,offerteReassurance, offerteSteps, priceFactors } from "@/data/pricing";
import { site } from "@/lib/site";
import {
  Chapter,
  ChapterIntro,
  FlowButton,
  FlowClose,
  FlowFaq,
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
 * Offerte & prijzen — the page IS the form. The hero's QuoteFlow is the main
 * element; everything below explains what happens with it:
 *
 *   hero+form → 01 price factors (no prices) → 02 after your request → 03 questions → close (contact, no 2nd form)
 *
 *   01 cinema    light factors → bridge → dark "after" → light FAQ curtain → dark close
 *   02 wordmark  light factors → paper "after" → light FAQ → dark close
 *   03 lines     dark factors → paper "after" interlude → dark FAQ curtain → dark close
 */

type Version = 1 | 2 | 3;

const TONES: Record<Version, { page: FlowTone; factors: FlowTone; after: FlowTone; faq: FlowTone }> = {
  1: { page: "light", factors: "light", after: "dark", faq: "light" },
  2: { page: "light", factors: "light", after: "paper", faq: "light" },
  3: { page: "dark", factors: "dark", after: "paper", faq: "dark" },
};

/** One photo per price factor, in the order of priceFactors. */
const FACTOR_IMAGES = [
  "/images/generated/aerial-motorway.jpg",
  "/images/generated/dealer-loading.jpg",
  "/images/generated/nonrunning-winch.jpg",
  "/fleet/city-loaded.jpg",
  "/images/generated/night-motorway.jpg",
  "/images/generated/alpine-pass.jpg",
];

const FORM_ID = "aanvraag";

export default function OfferteFlow({ version }: { version: Version }) {
  const T = TONES[version];
  const formTone = version === 1 ? "glass" : version === 2 ? "light" : "dark";
  const onLight = version === 2;
  const proof = (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${onLight ? "text-zinc-500" : "text-white/70"}`}>
      {offerteReassurance.map((r, i) => (
        <span key={r.title} className="flex items-center gap-5">
          {i > 0 && <span aria-hidden className="hidden sm:inline">·</span>}
          {r.title}
        </span>
      ))}
    </div>
  );

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={version === 1 ? "cinema" : version === 2 ? "wordmark" : "lines"}
        title="Vraag uw prijs aan — binnen 24 uur antwoord."
        intro="Geen calculator, geen automatische mail: wij bekijken elke aanvraag zelf en sturen u prijs en planning."
        crumbs={[{ href: "/", label: "Home" }, { label: "Offerte aanvragen" }]}
        image={version === 2 ? "/images/generated/truck-studio.jpg" : "/fleet/depot-wet.jpg"}
        imageAlt="Transporters van Mcars op het depot in Roeselare"
        wordmark="OFFERTE"
        lineImages={["/images/generated/planning-office.jpg", "/images/generated/customer-update.jpg"]}
        aside={proof}
        form={
          <div id={FORM_ID} className="scroll-mt-28">
            <QuoteFlow tone={formTone} size="hero" className="[contain:inline-size]" />
          </div>
        }
      />

      {/* 01 — what determines the price (factors only — no prices, client policy) */}
      <Chapter n="01" label="Wat bepaalt de prijs" tone={T.factors} >
        <ChapterIntro
          lead="Elke rit is anders."
          trail="Dit weegt mee in uw offerte."
          body="We rekenen geen vaste tarieven af. Uw prijs stellen we handmatig samen op basis van deze factoren — zo klopt hij voor uw specifieke transport."
        />
        {version === 2 ? (
          <FactorGrid tone={T.factors} />
        ) : (
          <div className="mt-12 sm:mt-16">
            <IndexRow items={priceFactors.map((f, i) => ({ title: f.title, body: f.body, image: FACTOR_IMAGES[i] }))} />
          </div>
        )}
      </Chapter>

      {version === 1 && (
        <div>
          <ImageBridge src="/images/generated/planning-office.jpg" alt="Een planner van Mcars bekijkt een aanvraag" from={T.factors} to={T.after} />
        </div>
      )}

      {/* 02 — what happens after you hit send */}
      <Chapter n="02" label="Na uw aanvraag" tone={T.after} curtain={version === 3}>
        {version === 3 ? (
          <InlineImageLine parts={["Wat gebeurt er", { image: "/images/generated/planning-office.jpg" }, "na uw", { image: "/images/generated/customer-update.jpg" }, "aanvraag?"]} />
        ) : (
          <ChapterIntro
            lead="Wat gebeurt er"
            trail="na uw aanvraag?"
            body="Geen calculator en geen automatische mail: een planner van Mcars stelt uw prijs zelf samen."
          />
        )}
        <div className="mt-14 sm:mt-20">
          <StepPath steps={offerteSteps.map((s) => ({ title: s.title, body: s.body }))} />
        </div>
        <Reassurance tone={T.after} />
      </Chapter>

      {/* 03 — questions */}
      <Chapter n="03" label="Vragen" tone={T.faq} curtain={T.faq !== T.after}>
        <ChapterIntro
          lead="Over uw offerte."
          trail="Kort uitgelegd."
          action={<FlowButton href={`#${FORM_ID}`} variant="ghost">Naar het formulier</FlowButton>}
        />
        <div className="mt-12 sm:mt-16">
          <FlowFaq items={offerteFaq} />
        </div>
      </Chapter>

      {/* Close: the form is already the hero — here the direct lines instead of a second form */}
      <FlowClose
        lead="Liever eerst even praten?"
        trail="Wij helpen u persoonlijk verder."
        body={`Niet zeker welke gegevens u nodig heeft? Bel, app of mail ons — of vul het formulier bovenaan de pagina in. ${site.hours}.`}
        form={<DirectLines />}
      />
    </FlowPage>
  );
}

/** v2: factors as a Swiss hairline grid. */
function FactorGrid({ tone }: { tone: FlowTone }) {
  const t = toneClasses(tone);
  return (
    <FlowGrid className="mt-12 sm:mt-16">
      <ol className={`grid border-t sm:grid-cols-2 lg:grid-cols-3 ${t.line}`}>
        {priceFactors.map((f, i) => (
          <li key={f.title} className={`border-b sm:pr-8 ${t.line}`}>
            <Rise delay={(i % 3) * 80} className="py-8">
              <span className={`font-mono text-[11px] tracking-[0.2em] ${t.faint}`}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-2xl font-light tracking-[-0.02em]">{f.title}</h3>
              <p className={`mt-2 max-w-sm text-sm leading-relaxed ${t.muted}`}>{f.body}</p>
            </Rise>
          </li>
        ))}
      </ol>
    </FlowGrid>
  );
}

/** The three promises, as a hairline row under the steps. */
function Reassurance({ tone }: { tone: FlowTone }) {
  const t = toneClasses(tone);
  return (
    <FlowGrid className="mt-20 sm:mt-28">
      <ul className={`grid border-t md:grid-cols-3 ${t.line}`}>
        {offerteReassurance.map((r, i) => (
          <li key={r.title} className={`border-b md:border-b-0 ${i > 0 ? `md:border-l md:pl-8` : ""} ${t.line}`}>
            <Rise delay={i * 90} className="py-8 md:pr-8">
              <p className="font-[family-name:var(--font-display)] text-5xl leading-none sm:text-6xl">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-5 text-2xl font-light tracking-[-0.02em]">{r.title}</h3>
              <p className={`mt-2 max-w-sm text-sm leading-relaxed ${t.muted}`}>{r.body}</p>
            </Rise>
          </li>
        ))}
      </ul>
    </FlowGrid>
  );
}

/** Close panel: the direct contact lines, styled like the dark QuoteFlow card. */
function DirectLines() {
  const lines = [
    { label: "Bellen", value: site.phone, href: site.phoneHref },
    { label: "WhatsApp", value: "Stuur een bericht of foto", href: site.whatsapp, external: true },
    { label: "E-mail", value: site.email, href: `mailto:${site.email}` },
  ];
  return (
    <div className="rounded-[1.5rem] bg-white/[0.05] p-6 ring-1 ring-white/10 sm:p-8">
      <ul className="border-t border-white/12">
        {lines.map((l) => (
          <li key={l.label} className="border-b border-white/12">
            <a
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="group flex min-h-20 items-center justify-between gap-6 py-5"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">{l.label}</span>
                <span className="mt-1 block truncate text-xl font-light tracking-[-0.02em] text-white sm:text-2xl">{l.value}</span>
              </span>
              <span className="flex size-11 flex-none items-center justify-center rounded-full ring-1 ring-white/20 transition-colors group-hover:bg-white group-hover:text-zinc-950">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <a href={`#${FORM_ID}`} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
          Toch het formulier invullen
          <svg className="size-4 -rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
