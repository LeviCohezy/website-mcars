"use client";

import { useEffect, useRef, useState } from "react";
import { faqGroups as groups, faqTotal, type FaqGroup } from "@/data/faq";
import { site } from "@/lib/site";
import {
  Chapter,
  ChapterIntro,
  ClipImage,
  FRAME,
  FlowButton,
  FlowClose,
  FlowFaq,
  FlowGrid,
  FlowHero,
  FlowPage,
  ImageBridge,
  IndexRow,
  Rise,
  toneClasses,
  type FlowTone,
} from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * FAQ as one composed film. Same story in every version:
 *
 *   hero+form → 01 topic index → [bridge] → 02 answers (8 topics) →
 *   03 still a question? → close
 *
 *   01 cinema    light → (bridge) paper → dark curtain → dark close
 *   02 wordmark  light → light, with a sticky topic rail (desktop) /
 *                snap chips (mobile) → paper curtain → dark close
 *   03 lines     dark throughout, 03 is the paper interlude
 */

type Version = 1 | 2 | 3;

const TONES: Record<Version, { page: FlowTone; index: FlowTone; answers: FlowTone; more: FlowTone }> = {
  1: { page: "light", index: "light", answers: "paper", more: "dark" },
  2: { page: "light", index: "light", answers: "light", more: "paper" },
  3: { page: "dark", index: "dark", answers: "dark", more: "paper" },
};

/** One photo per FAQ topic (order = faqGroups). AI placeholders, see docs/CONTENT-NEEDS.md. */
const TOPIC_IMAGES = [
  "/images/generated/planning-office.jpg",
  "/images/generated/strap-closeup.jpg",
  "/images/generated/key-handover.jpg",
  "/images/generated/alpine-pass.jpg",
  "/images/generated/nonrunning-winch.jpg",
  "/images/generated/pickup-inspection.jpg",
  "/images/generated/customer-update.jpg",
  "/images/generated/night-motorway.jpg",
];

const pad = (n: number) => String(n).padStart(2, "0");
const count = (g: FaqGroup) => `${g.items.length} ${g.items.length === 1 ? "vraag" : "vragen"}`;

export default function FaqFlow({ version }: { version: Version }) {
  const T = TONES[version];
  const formTone = version === 1 ? "glass" : version === 2 ? "light" : "dark";
  const onLight = version === 2;
  const rail = version === 2;

  const proof = (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${onLight ? "text-zinc-500" : "text-white/70"}`}>
      <span><b className={onLight ? "font-medium text-zinc-950" : "font-medium text-white"}>{faqTotal}</b> antwoorden</span>
      <span aria-hidden>·</span>
      <span>{groups.length} onderwerpen</span>
      <span aria-hidden>·</span>
      <span>Antwoord binnen 24 uur</span>
    </div>
  );

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={version === 1 ? "cinema" : version === 2 ? "wordmark" : "lines"}
        title="Veelgestelde vragen."
        intro="De meest gestelde vragen over autotransport, per onderwerp. Staat uw vraag er niet bij? We helpen u graag persoonlijk verder."
        crumbs={[{ href: "/", label: "Home" }, { label: "FAQ" }]}
        image={version === 2 ? "/images/generated/truck-studio.jpg" : "/fleet/countryside-highway.jpg"}
        imageAlt={version === 2 ? "Zijaanzicht van een volgeladen Mcars-autotransporter" : "Een transporter van Mcars op de snelweg"}
        wordmark="VRAGEN"
        lineImages={["/images/generated/planning-office.jpg", "/images/generated/key-handover.jpg"]}
        aside={proof}
        form={<QuoteFlow tone={formTone} />}
      />

      {/* 01 — topic index: each row jumps to its answers */}
      <Chapter n="01" label="Onderwerpen" tone={T.index} className={T.index !== T.answers ? "pb-12 sm:pb-16" : ""}>
        <ChapterIntro lead={`${groups.length} onderwerpen,`} trail={`${faqTotal} antwoorden.`} body="Kies een onderwerp, of scroll rustig door alle antwoorden." />
        <nav aria-label="Onderwerpen" className="mt-12 sm:mt-16">
          <IndexRow items={groups.map((g, i) => ({ title: g.label, body: `${g.title} ${g.trail}`, href: `#${g.id}`, image: TOPIC_IMAGES[i % TOPIC_IMAGES.length], meta: count(g) }))} />
        </nav>
      </Chapter>

      {T.index !== T.answers && (
        <div>
          <ImageBridge src="/images/generated/team-depot.jpg" alt="Het team van Mcars op het depot" from={T.index} to={T.answers} />
        </div>
      )}

      {/* 02 — every answer, topic by topic */}
      <Chapter n="02" label="Antwoorden" tone={T.answers}>
        <ChapterIntro lead="Alle antwoorden," trail="per onderwerp." />
        <Answers tone={T.answers} rail={rail} />
      </Chapter>

      {/* 03 — still a question */}
      <Chapter n="03" label="Nog een vraag?" tone={T.more} curtain={T.more !== T.answers}>
        <ChapterIntro
          lead="Staat uw vraag er niet bij?"
          trail="Wij helpen u persoonlijk."
          body="U krijgt een duidelijk antwoord van iemand die uw transport ook echt kan inplannen."
          action={
            <>
              <FlowButton href="/contact">Neem contact op</FlowButton>
              <a href={site.phoneHref} className={`inline-flex min-h-12 items-center rounded-full px-6 text-sm font-medium ring-1 transition-colors ${T.more === "dark" ? "text-white ring-white/25 hover:ring-white/60" : "text-zinc-950 ring-zinc-950/15 hover:ring-zinc-950/50"}`}>
                Bel {site.phone}
              </a>
            </>
          }
        />
        <FlowGrid className="mt-14 sm:mt-20">
          <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
            {[
              { src: "/images/generated/planning-office.jpg", alt: "De planning van Mcars op kantoor", label: "Planning" },
              { src: "/images/generated/driver-portrait.jpg", alt: "Een chauffeur van Mcars in de cabine", label: "Chauffeur" },
              { src: "/images/generated/team-depot.jpg", alt: "Het team van Mcars op het depot", label: "Team" },
            ].map((p) => (
              <figure key={p.src} className="w-[78%] flex-none snap-start sm:w-auto">
                <ClipImage src={p.src} alt={p.alt} sizes="(min-width:640px) 30vw, 78vw" className="aspect-[4/5] rounded-[1.25rem]" />
                <figcaption className={`mt-3 font-mono text-[11px] tracking-[0.2em] uppercase ${toneClasses(T.more).muted}`}>{p.label}</figcaption>
              </figure>
            ))}
          </div>
        </FlowGrid>
      </Chapter>

      <FlowClose
        lead="Vraag beantwoord?"
        trail="Dan plannen we uw transport."
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

/** Tracks which topic is currently in the reading zone (for the rail). */
function useActiveTopic(enabled: boolean) {
  const [active, setActive] = useState(groups[0].id);
  useEffect(() => {
    if (!enabled) return;
    const els = groups.map((g) => document.getElementById(g.id)).filter((e): e is HTMLElement => Boolean(e));
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

function Answers({ tone, rail }: { tone: FlowTone; rail: boolean }) {
  const t = toneClasses(tone);
  const dark = tone === "dark";
  const active = useActiveTopic(rail);
  const chipsRef = useRef<HTMLElement>(null);
  // Keep the active chip in view on the horizontal mobile rail (horizontal scroll only).
  useEffect(() => {
    const bar = chipsRef.current;
    const el = bar?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!bar || !el || bar.offsetParent === null) return;
    bar.scrollTo({ left: el.offsetLeft - 20, behavior: "smooth" });
  }, [active]);
  const chip = (on: boolean) =>
    on
      ? dark ? "bg-white text-zinc-950" : "bg-zinc-950 text-white"
      : dark ? "ring-1 ring-white/20 text-white/70" : `ring-1 ring-zinc-950/15 text-zinc-600 ${tone === "paper" ? "bg-zinc-100" : "bg-white"}`;

  return (
    <div className="relative mt-12 sm:mt-16">
      {rail && (
        <>
          {/* Mobile / tablet: snap chips that stay under the nav */}
          <div className={`sticky top-[4.75rem] z-20 lg:hidden ${t.bg}`}>
            <nav ref={chipsRef} aria-label="Onderwerpen" className="relative flex snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto px-5 py-3 sm:scroll-px-10 [scrollbar-width:none] sm:px-10">
              {groups.map((g, i) => (
                <a key={g.id} data-id={g.id} href={`#${g.id}`} className={`inline-flex min-h-11 flex-none snap-start items-center gap-2 rounded-full px-4 text-sm transition-colors ${chip(active === g.id)}`}>
                  <span className="font-mono text-[10px] opacity-60">{pad(i + 1)}</span>
                  {g.label}
                </a>
              ))}
            </nav>
          </div>
          {/* Desktop: sticky rail in the left quarter of the frame */}
          <div className={`pointer-events-none absolute inset-0 hidden lg:block ${FRAME}`}>
            <nav aria-label="Onderwerpen" className="pointer-events-auto sticky top-28 w-[20%]">
              <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.faint}`}>Onderwerpen</p>
              <ul className={`mt-4 border-t ${t.line}`}>
                {groups.map((g, i) => {
                  const on = active === g.id;
                  return (
                    <li key={g.id} className={`border-b ${t.line}`}>
                      <a href={`#${g.id}`} aria-current={on ? "true" : undefined} className={`flex min-h-11 items-center gap-3 py-2 text-sm transition-colors ${on ? t.text : `${t.muted} hover:text-zinc-950`}`}>
                        <span className={`font-mono text-[10px] tracking-[0.18em] ${t.faint}`}>{pad(i + 1)}</span>
                        <span className="flex-1">{g.label}</span>
                        <span aria-hidden className={`size-1.5 rounded-full bg-current transition-opacity ${on ? "opacity-100" : "opacity-0"}`} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </>
      )}

      <div className="space-y-20 sm:space-y-28">
        {groups.map((g, i) => (
          <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className={rail ? "scroll-mt-36 lg:scroll-mt-28" : "scroll-mt-28"}>
            <FlowGrid>
              <Rise className={rail ? "lg:ml-[25%]" : "grid gap-3 lg:grid-cols-[25%_minmax(0,1fr)] lg:items-baseline lg:gap-0"}>
                <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.faint}`}>
                  {pad(i + 1)} / {pad(groups.length)} · {g.label}
                </p>
                <h3 id={`${g.id}-h`} className={`text-3xl leading-[1.08] font-light tracking-[-0.03em] sm:text-4xl ${rail ? "mt-3" : ""}`}>
                  {g.title} <span className={t.faint}>{g.trail}</span>
                </h3>
              </Rise>
            </FlowGrid>
            <div className="mt-8 sm:mt-10">
              <FlowFaq items={g.items} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
