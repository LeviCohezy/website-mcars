"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cmr, cmrIntro, stappen, werkwijze, werkwijzeFaq } from "@/data/process";
import { site } from "@/lib/site";
import Icon from "./icon";
import { DarkFaq } from "./route-v3";
import { Reveal } from "./scroll";
import { V3Block, V3Button, V3Head, V3Hero, V3Tick } from "./v3-kit";

/*
 * Werkwijze 03 — "Donker & premium". Shippers-style HUD: on desktop a sticky
 * photo with translucent status cards that follow the step you're reading;
 * on mobile the panel stacks above the steps and each step carries its own
 * status card. Same content as Werkwijze 01 (data/process).
 */

const pad = (n: number) => String(n).padStart(2, "0");

export default function WerkwijzeV3() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  // The step crossing the middle of the viewport becomes the active one.
  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!items?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    // Same canvas as <V3Page>, but overflow-clip: overflow-hidden would turn it
    // into a scroll container and break the sticky panels inside.
    <div className="overflow-clip rounded-[1rem] bg-zinc-950 text-white">
      {/* 1 · Hero */}
      <V3Hero image={werkwijze.heroImage} crumbs={[{ href: "/", label: "Home" }, { label: "Hoe werkt het" }]} title={werkwijze.title} intro={werkwijze.subtitle}>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <V3Button href="/offerte">Offerte aanvragen</V3Button>
          <V3Button href="#stappen" variant="ghost">Bekijk de stappen</V3Button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/60">
          {werkwijze.badges.map((b) => (
            <span key={b} className="flex min-h-11 items-center gap-2.5"><V3Tick /> {b}</span>
          ))}
        </div>
      </V3Hero>

      {/* 2 · Six steps — sticky HUD photo + scrolling steps */}
      <V3Block id="stappen" className="scroll-mt-20">
        <V3Head label="Zo werkt het" lead="Zes heldere stappen." trail="Van offerte tot levering." />
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* Mobile: stacked overview of a completed transport. Desktop: sticky, follows the active step. */}
          <div className="lg:hidden">
            <HudPanel active={stappen.length} />
          </div>
          <div className="hidden lg:sticky lg:top-24 lg:block lg:h-[calc(100svh-8rem)] lg:self-start">
            <HudPanel active={active} />
          </div>

          <ol ref={listRef}>
            {stappen.map((s, i) => (
              <li
                key={s.title}
                data-step={i}
                className="border-t border-white/10 py-10 last:border-b lg:flex lg:min-h-[62svh] lg:flex-col lg:justify-center lg:py-16"
              >
                <span className={`font-[family-name:var(--font-display)] text-7xl leading-none transition-colors duration-500 lg:text-8xl ${active === i ? "text-white" : "text-white/20"}`}>
                  {pad(i + 1)}
                </span>
                <h3 className="mt-5 text-2xl font-medium tracking-tight text-balance sm:text-3xl">{s.title}</h3>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-white/60">{s.body}</p>
                {/* Per-step status card on mobile (the sticky HUD is desktop-only) */}
                <p className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm backdrop-blur-xl lg:hidden">
                  <span className="flex size-8 items-center justify-center rounded-full bg-white text-zinc-950"><Icon name={s.icon} className="size-4" /></span>
                  <span>
                    <span className="block text-xs tracking-[0.18em] text-white/45 uppercase">Status · stap {pad(i + 1)}</span>
                    <span className="font-medium">{s.status}</span>
                  </span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </V3Block>

      {/* 3 · CMR — photo band with the statement, three points under it */}
      <section className="relative">
        <div className="relative flex min-h-[70svh] flex-col justify-end overflow-hidden">
          <Image src={werkwijze.bandImage} alt={werkwijze.bandImageAlt} fill sizes="100vw" className="object-cover opacity-50" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/70" />
          <div className="relative px-5 pb-10 sm:px-10 sm:pb-14 lg:px-14">
            <V3Head label="Waarom deze aanpak" lead="De CMR-vrachtbrief:" trail="uw zekerheid, zwart op wit." intro={cmrIntro} />
          </div>
        </div>
        <div className="grid gap-px bg-white/10 sm:grid-cols-3">
          {cmr.map((h, i) => (
            <Reveal key={h.title} delay={i * 80} className="bg-zinc-950 p-7 sm:p-8 lg:p-10">
              <span className="text-6xl font-light tracking-[-0.05em] text-white/25 tabular-nums lg:text-7xl">{pad(i + 1)}</span>
              <h3 className="mt-8 text-xl font-medium tracking-tight">{h.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-white/55">{h.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4 · FAQ */}
      <V3Block className="bg-zinc-900">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <V3Head label="Veelgestelde vragen" lead="Nog vragen?" trail="Dit horen we het vaakst." />
            <Reveal className="-mt-6 text-white/60">
              Staat uw vraag er niet bij? Bel{" "}
              <a href={site.phoneHref} className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{site.phone}</a>
              {" "}of mail{" "}
              <a href={`mailto:${site.email}`} className="break-words text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{site.email}</a>.
            </Reveal>
          </div>
          <DarkFaq items={werkwijzeFaq} />
        </div>
      </V3Block>
    </div>
  );
}

/**
 * Photo with HUD-style translucent cards: a progress card and a status list.
 * `active` = index of the current step; `stappen.length` shows a completed transport.
 */
function HudPanel({ active }: { active: number }) {
  const done = active >= stappen.length;
  const current = Math.min(active, stappen.length - 1);
  const progress = done ? 100 : ((current + 1) / stappen.length) * 100;

  return (
    <div className="relative flex min-h-[34rem] flex-col justify-between gap-6 overflow-hidden rounded-2xl p-4 sm:p-6 lg:h-full lg:min-h-0">
      {/* One photo per step, cross-fading with the active step (a finished transport shows the last one). */}
      {stappen.map((s, i) => (
        <Image
          key={s.image}
          src={s.image}
          alt={i === current ? s.imageAlt : ""}
          aria-hidden={i !== current}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`object-cover transition-opacity duration-700 ease-out ${i === current ? "opacity-70" : "opacity-0"}`}
        />
      ))}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-transparent to-zinc-950/80" />

      {/* Progress card */}
      <div className="relative w-full max-w-xs rounded-2xl border border-white/15 bg-zinc-950/40 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs tracking-[0.18em] text-white/55 uppercase">
          Uw transport
          <span className="tabular-nums text-white">{done ? "Afgerond" : `Stap ${pad(current + 1)} / ${pad(stappen.length)}`}</span>
        </div>
        <p className="mt-3 text-lg leading-snug font-medium tracking-tight">{done ? "Van aanvraag tot levering" : stappen[current].title}</p>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-white transition-[width] duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Status list */}
      <ul aria-label="Status per stap" className="relative w-full max-w-sm self-end rounded-2xl border border-white/15 bg-zinc-950/40 p-2 backdrop-blur-xl">
        {stappen.map((s, i) => {
          const isDone = done || i < current;
          const isNow = !done && i === current;
          return (
            <li key={s.title} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-500 ${isNow ? "bg-white/10 text-white" : isDone ? "text-white/80" : "text-white/35"}`}>
              <span className="relative flex size-6 flex-none items-center justify-center">
                {isDone ? (
                  <span className="flex size-6 items-center justify-center rounded-full bg-white text-zinc-950"><Icon name="check" className="size-3.5" /></span>
                ) : isNow ? (
                  <>
                    <span aria-hidden className="absolute size-4 rounded-full bg-white/50 motion-safe:animate-ping" />
                    <span className="size-2.5 rounded-full bg-white" />
                  </>
                ) : (
                  <span className="size-2.5 rounded-full border border-white/40" />
                )}
              </span>
              <span className="flex-1">{s.status}</span>
              <span className="text-xs text-white/35 tabular-nums">{pad(i + 1)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
