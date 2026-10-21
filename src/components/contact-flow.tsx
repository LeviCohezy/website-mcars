"use client";

import Link from "next/link";
import ContactForm from "@/app/contact/contact-form";
import ContactGlyph from "@/app/contact/glyph";
import { contactMethods, contactPhotos, isExternal, mapsEmbedSrc } from "@/app/contact/methods";
import { site } from "@/lib/site";
import {
  Arrow,
  Chapter,
  ChapterIntro,
  ClipImage,
  FlowClose,
  FlowGrid,
  FlowHero,
  FlowPage,
  ImageBridge,
  InlineImageLine,
  Rise,
  toneClasses,
  useFlowTone,
  type FlowTone,
} from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * Contact as one film:
 *
 *   hero (transport request = QuoteFlow) → 01 direct lines + map → 02 general message → 03 the people & the depot → close
 *
 *   01 cinema    light lines+map → bridge → dark message → light people curtain → dark close
 *   02 wordmark  light lines+map → paper message → light people → dark close
 *   03 lines     dark lines+map → paper message interlude → dark people curtain → dark close
 */

type Version = 1 | 2 | 3;

const TONES: Record<Version, { page: FlowTone; direct: FlowTone; message: FlowTone; people: FlowTone }> = {
  1: { page: "light", direct: "light", message: "dark", people: "light" },
  2: { page: "light", direct: "light", message: "paper", people: "light" },
  3: { page: "dark", direct: "dark", message: "paper", people: "dark" },
};

const PEOPLE = [
  { title: "Een planner aan de lijn", body: "Rechtstreeks een planner aan de lijn — dezelfde mensen die uw rit inplannen.", image: contactPhotos.desk.src, alt: contactPhotos.desk.alt },
  { title: "Ons team in Roeselare", body: "Persoonlijk antwoord binnen 24 uur, van iemand van ons team.", image: "/images/generated/team-depot.jpg", alt: "Het team van Mcars op het depot" },
  { title: "Het depot", body: `${site.address.street}, ${site.address.city} — standplaats van onze vloot.`, image: "/fleet/depot-dusk.jpg", alt: "Het depot van Mcars bij schemering" },
];

export default function ContactFlow({ version }: { version: Version }) {
  const T = TONES[version];
  const formTone = version === 1 ? "glass" : version === 2 ? "light" : "dark";
  const onLight = version === 2;
  const proof = (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${onLight ? "text-zinc-500" : "text-white/70"}`}>
      <a href={site.phoneHref} className={`py-2 font-medium ${onLight ? "text-zinc-950" : "text-white"}`}>{site.phone}</a>
      <span aria-hidden className="hidden sm:inline">·</span>
      <span>{site.hours}</span>
      <span aria-hidden className="hidden sm:inline">·</span>
      <span>{site.address.city}</span>
    </div>
  );

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={version === 1 ? "cinema" : version === 2 ? "wordmark" : "lines"}
        title={"Liever recht\u00ADstreeks contact?"}
        intro="Bel, mail of app ons — of laat hieronder een bericht achter. We antwoorden persoonlijk, snel en zonder verplichting."
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
        image={version === 2 ? "/images/generated/truck-studio.jpg" : contactPhotos.hero.src}
        imageAlt={contactPhotos.hero.alt}
        wordmark="CONTACT"
        lineImages={[contactPhotos.desk.src, "/images/generated/team-depot.jpg"]}
        aside={proof}
        form={
          <div>
            {/* v2 pulls the form up over the wordmark panel — no caption there */}
            {!onLight && <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-white/60 uppercase">Transport aanvragen? Start hier</p>}
            <QuoteFlow tone={formTone} className="[contain:inline-size]" />
          </div>
        }
      />

      {/* 01 — every direct line, the hours and the map as one chapter */}
      <Chapter n="01" label="Rechtstreeks" tone={T.direct} >
        <ChapterIntro lead="Bel, mail of app ons." trail="Of kom langs in Roeselare." body={site.hoursNote} />
        <FlowGrid className="mt-12 sm:mt-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
            <Methods />
            <Rise className="lg:sticky lg:top-24 lg:self-start">
              <MapPanel />
            </Rise>
          </div>
        </FlowGrid>
      </Chapter>

      {version === 1 && (
        <div>
          <ImageBridge src="/fleet/sunset-field.jpg" alt="" from={T.direct} to={T.message} />
        </div>
      )}

      {/* 02 — general questions: the contact form */}
      <Chapter n="02" label="Bericht sturen" tone={T.message} curtain={version === 3}>
        {version === 3 ? (
          <InlineImageLine parts={["Een vraag?", { image: contactPhotos.desk.src }, "Laat een", { image: "/fleet/depot-dusk.jpg" }, "bericht achter."]} />
        ) : (
          <ChapterIntro lead="Een algemene vraag?" trail="Laat een bericht achter." />
        )}
        <FlowGrid className="mt-12 sm:mt-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
            <MessageAside />
            <Rise>
              <ContactForm tone={T.message === "dark" ? "dark" : "light"} />
            </Rise>
          </div>
        </FlowGrid>
      </Chapter>

      {/* 03 — who answers: the people and the depot */}
      <Chapter n="03" label="Wie u te woord staat" tone={T.people} curtain={T.people !== T.message}>
        <ChapterIntro lead="Geen callcenter." trail="Het team dat ook de ritten plant." />
        <FlowGrid className="mt-12 sm:mt-16">
          <ul className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
            {PEOPLE.map((p, i) => (
              <li key={p.title} className="w-[82%] flex-none snap-start sm:w-auto">
                <Rise delay={i * 90}>
                  <ClipImage src={p.image} alt={p.alt} sizes="(min-width:640px) 30vw, 82vw" className="aspect-[4/5] rounded-[1.5rem]" />
                  <PersonCaption index={i} title={p.title} body={p.body} />
                </Rise>
              </li>
            ))}
          </ul>
        </FlowGrid>
      </Chapter>

      <FlowClose
        lead="Een transport te plannen?"
        trail="Vraag meteen uw prijs aan."
        form={<QuoteFlow tone="dark" className="[contain:inline-size]" />}
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

/** Hairline list of every contact channel (from methods.ts / site.ts). */
function Methods() {
  const tone = useFlowTone();
  const t = toneClasses(tone);
  const dark = tone === "dark";
  return (
    <ul className={`border-t ${t.line}`}>
      {contactMethods.map((m, i) => {
        const inner = (
          <>
            <span className={`flex size-11 flex-none items-center justify-center rounded-full ring-1 ${dark ? "ring-white/15" : "ring-zinc-950/10"}`}>
              <ContactGlyph id={m.id} className="size-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block font-mono text-[11px] tracking-[0.2em] uppercase ${t.faint}`}>{m.label}</span>
              <span className="mt-1 block text-xl font-light tracking-[-0.02em] break-words sm:text-2xl">{m.value}</span>
              {m.sub && <span className={`mt-1 block text-sm leading-relaxed ${t.muted}`}>{m.sub}</span>}
            </span>
            {m.href && (
              <span className={`hidden flex-none items-center gap-2 text-sm sm:flex ${t.muted} transition-colors ${dark ? "group-hover:text-white" : "group-hover:text-zinc-950"}`}>
                {m.action} <Arrow />
              </span>
            )}
          </>
        );
        const cls = "group flex items-start gap-5 py-6";
        return (
          <li key={m.id} className={`border-b ${t.line}`}>
            <Rise delay={i * 60}>
              {m.href ? (
                <a href={m.href} target={isExternal(m.href) ? "_blank" : undefined} rel={isExternal(m.href) ? "noopener noreferrer" : undefined} className={cls}>
                  {inner}
                </a>
              ) : (
                <div className={cls}>{inner}</div>
              )}
            </Rise>
          </li>
        );
      })}
    </ul>
  );
}

function MapPanel() {
  const tone = useFlowTone();
  const t = toneClasses(tone);
  const dark = tone === "dark";
  return (
    <figure>
      <div className={`overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] ${dark ? "bg-white/[0.05]" : "bg-zinc-100"}`}>
        <iframe
          title={`Locatie van ${site.name} op Google Maps`}
          src={mapsEmbedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={`h-[22rem] w-full border-0 grayscale sm:h-[28rem] lg:h-[34rem] ${dark ? "invert-[0.92] hue-rotate-180" : ""}`}
        />
      </div>
      <figcaption className={`mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-[0.2em] uppercase ${t.muted}`}>
        <span>{site.address.street} · {site.address.city}</span>
        <span>{site.hours}</span>
      </figcaption>
    </figure>
  );
}

function MessageAside() {
  const tone = useFlowTone();
  const t = toneClasses(tone);
  const link = tone === "dark" ? "text-white decoration-white/30 hover:decoration-white" : "text-zinc-950 decoration-zinc-300 hover:decoration-zinc-950";
  return (
    <div>
      <ClipImage src="/images/generated/customer-update.jpg" alt="Een klant leest een bericht van Mcars op haar smartphone" sizes="(min-width:1024px) 35vw, 100vw" className="aspect-[4/3] rounded-[1.5rem]" />
      <p className={`mt-6 max-w-sm text-base leading-relaxed ${t.muted}`}>
        Zoekt u een concrete prijs en planning? Vraag dan meteen een{" "}
        <Link href="/offerte" className={`underline underline-offset-4 ${link}`}>vrijblijvende offerte</Link> aan.
      </p>
    </div>
  );
}

function PersonCaption({ index, title, body }: { index: number; title: string; body: string }) {
  const tone = useFlowTone();
  const t = toneClasses(tone);
  return (
    <div className={`mt-5 border-t pt-5 ${t.line}`}>
      <span className={`font-mono text-[11px] tracking-[0.2em] ${t.faint}`}>{String(index + 1).padStart(2, "0")}</span>
      <h3 className="mt-3 text-2xl font-light tracking-[-0.02em]">{title}</h3>
      <p className={`mt-2 text-sm leading-relaxed ${t.muted}`}>{body}</p>
    </div>
  );
}
