"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProcessStep } from "@/data/services";
import Icon from "./icon";
import { Reveal } from "./scroll";
import { ArrowChip } from "./ui";

/*
 * Client-side sections for the service-page template (/diensten/[slug]):
 * the scroll-driven process story and the tick-off preparation checklist.
 */

const STEP_IMAGES = ["/fleet/depot-dusk.jpg", "/fleet/sunset-parking.jpg", "/fleet/city-loaded.jpg", "/fleet/countryside-highway.jpg", "/fleet/port-docks.jpg"];

/**
 * "Werkwijze" as a pinned scroll story (desktop): a dark screen holds while
 * the steps play one by one — the active step opens up, the photo crossfades
 * and a progress line fills. Phones get a swipeable row of step cards.
 */
export function ProcessStory({
  label,
  lead,
  trail,
  intro,
  steps,
  images = STEP_IMAGES,
  ctaHref = "#prijs",
}: {
  label: string;
  lead: string;
  trail?: string;
  intro?: string;
  steps: ProcessStep[];
  images?: string[];
  ctaHref?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const n = steps.length;
  const active = Math.min(n - 1, Math.floor(progress * n));
  const img = (i: number) => images[i % images.length];

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el || el.offsetParent === null) return; // hidden below lg
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setProgress(total > 0 ? Math.min(0.9999, Math.max(0, -r.top / total)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / n) * total, behavior: "smooth" });
  };

  const heading = (
    <>
      <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/50 uppercase">
        <span aria-hidden className="size-1.5 flex-none rounded-full bg-white" />
        {label}
      </p>
      <h2 className="mt-6 text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-white sm:text-4xl lg:text-[3.25rem]">
        {lead} {trail && <span className="text-white/40">{trail}</span>}
      </h2>
      {intro && <p className="mt-5 max-w-md text-base leading-relaxed text-white/55 lg:text-lg">{intro}</p>}
    </>
  );

  const cta = (
    <a
      href={ctaHref}
      className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
    >
      Prijs aanvragen
      <ArrowChip tone="dark" />
    </a>
  );

  return (
    <>
      {/* Desktop: pinned story */}
      <div ref={trackRef} className="relative hidden lg:block" style={{ height: `${60 + n * 55}svh` }}>
        <div className="sticky top-0 flex h-[100svh] items-stretch py-2">
          <div className="grid w-full grid-cols-[1fr_1.05fr] gap-12 overflow-hidden rounded-[2rem] bg-zinc-950 p-6 pt-28 pl-14 xl:gap-20">
            <div className="flex min-h-0 flex-col pb-8">
              {heading}
              <ol className="relative mt-10">
                {/* progress rail */}
                <span aria-hidden className="absolute top-2 bottom-2 left-[1.1875rem] w-px bg-white/10" />
                <span
                  aria-hidden
                  className="absolute top-2 left-[1.1875rem] w-px origin-top bg-white transition-[height] duration-150"
                  style={{ height: `calc(${progress * 100}% - 1rem)` }}
                />
                {steps.map((s, i) => {
                  const on = i === active;
                  const done = i < active;
                  return (
                    <li key={s.title} className="relative">
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-current={on ? "step" : undefined}
                        className="flex w-full gap-6 py-3 text-left"
                      >
                        <span
                          className={`relative z-10 flex size-10 flex-none items-center justify-center rounded-full text-sm font-medium tabular-nums transition-colors duration-300 ${
                            on ? "bg-white text-zinc-950" : done ? "bg-zinc-800 text-white" : "bg-zinc-950 text-white/40 ring-1 ring-white/15"
                          }`}
                        >
                          {done ? <Icon name="check" className="size-4" /> : String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 pt-1.5">
                          <span className={`block text-xl font-medium tracking-tight transition-colors duration-300 xl:text-2xl ${on ? "text-white" : "text-white/35"}`}>
                            {s.title}
                          </span>
                          <span className={`grid transition-[grid-template-rows,opacity] duration-500 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                            <span className="overflow-hidden">
                              <span className="block max-w-md pt-2 text-[0.95rem] leading-relaxed text-white/60">{s.body}</span>
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-auto pt-8">{cta}</div>
            </div>

            {/* Crossfading photo per step */}
            <div className="relative mb-2 overflow-hidden rounded-[1.5rem]">
              {steps.map((s, i) => (
                <Image
                  key={s.title}
                  src={img(i)}
                  alt=""
                  fill
                  sizes="50vw"
                  className={`object-cover transition-[opacity,transform] duration-700 ease-out ${i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
                />
              ))}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/10 to-transparent" />
              <div className="absolute inset-x-8 bottom-8 flex items-end justify-between gap-6">
                <p className="text-[7rem] leading-[0.8] font-medium tracking-tighter text-white tabular-nums">
                  {String(active + 1).padStart(2, "0")}
                  <span className="text-2xl tracking-normal text-white/40"> / {String(n).padStart(2, "0")}</span>
                </p>
                <p className="max-w-[14rem] pb-2 text-right text-sm leading-snug text-white/70">{steps[active].title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phones / tablets: heading + swipeable step cards */}
      <div className="rounded-[2rem] bg-zinc-950 px-5 py-14 sm:px-8 sm:py-20 lg:hidden">
        {heading}
        <ol className="-mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8">
          {steps.map((s, i) => (
            <li key={s.title} className="w-[82%] flex-none snap-start overflow-hidden rounded-[1.5rem] bg-zinc-900 sm:w-[46%]">
              <div className="relative aspect-[4/3]">
                <Image src={img(i)} alt="" fill sizes="(min-width: 640px) 46vw, 82vw" className="object-cover" />
                <span className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-white text-sm font-medium text-zinc-950 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-medium tracking-tight text-white">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-white/60">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8">{cta}</div>
      </div>
    </>
  );
}

/**
 * Preparation as a tick-off checklist: tabs per moment, items you can check,
 * and a dark card that counts down to "klaar".
 */
export function ChecklistTabs({
  cols,
  doneTitle = "Alles klaar?",
}: {
  cols: { title: string; items: string[] }[];
  doneTitle?: string;
}) {
  const [tab, setTab] = useState(0);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const total = cols.reduce((n, c) => n + c.items.length, 0);
  const count = checked.size;
  const pct = total ? count / total : 0;
  const key = (c: number, i: number) => `${c}:${i}`;
  const toggle = (k: string) =>
    setChecked((s) => {
      const next = new Set(s);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  return (
    <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
      <Reveal className="rounded-[1.75rem] bg-zinc-100 p-3 sm:p-4">
        <div role="tablist" aria-label="Voorbereiding" className="grid grid-cols-3 gap-1 rounded-2xl bg-white p-1">
          {cols.map((c, i) => {
            const doneHere = c.items.every((_, j) => checked.has(key(i, j)));
            return (
              <button
                key={c.title}
                role="tab"
                type="button"
                aria-selected={tab === i}
                onClick={() => setTab(i)}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-2 text-center text-xs font-medium transition-colors sm:text-sm ${
                  tab === i ? "bg-zinc-950 text-white" : "text-zinc-500 hover:text-zinc-950"
                }`}
              >
                {doneHere && <Icon name="check" className="size-3.5 flex-none" />}
                {c.title}
              </button>
            );
          })}
        </div>

        <ul role="tabpanel" key={tab} className="mt-3 flex flex-col gap-2 motion-safe:animate-[fade-up_0.4s_ease-out]">
          {cols[tab].items.map((it, j) => {
            const k = key(tab, j);
            const on = checked.has(k);
            return (
              <li key={k}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => toggle(k)}
                  className={`flex w-full items-start gap-4 rounded-2xl p-5 text-left transition-colors duration-300 ${
                    on ? "bg-zinc-950 text-white" : "bg-white text-zinc-800 hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex size-6 flex-none items-center justify-center rounded-full transition-colors duration-300 ${
                      on ? "bg-white text-zinc-950" : "ring-1 ring-zinc-300"
                    }`}
                  >
                    <Icon name="check" className={`size-3.5 transition-transform duration-300 ${on ? "scale-100" : "scale-0"}`} />
                  </span>
                  <span className={`text-base leading-relaxed ${on ? "text-white/70 line-through decoration-white/30" : ""}`}>{it}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {tab < cols.length - 1 && (
          <button
            type="button"
            onClick={() => setTab(tab + 1)}
            className="mt-3 ml-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white"
          >
            Volgende: {cols[tab + 1].title}
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        )}
      </Reveal>

      <Reveal delay={90} className="flex flex-col justify-between gap-10 rounded-[1.75rem] bg-zinc-950 p-7 text-white sm:p-9">
        <div className="flex items-center gap-5">
          <svg viewBox="0 0 44 44" className="size-20 -rotate-90" aria-hidden>
            <circle cx="22" cy="22" r="19" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="3" />
            <circle
              cx="22" cy="22" r="19" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 19}
              strokeDashoffset={2 * Math.PI * 19 * (1 - pct)}
              className="transition-[stroke-dashoffset] duration-500"
            />
          </svg>
          <p aria-live="polite">
            <span className="block text-4xl font-medium tracking-tight tabular-nums">
              {count}<span className="text-white/40">/{total}</span>
            </span>
            <span className="text-sm text-white/55">afgevinkt</span>
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-medium tracking-tight">{count === total ? "Klaar voor vertrek." : doneTitle}</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-white/60">
            Vink af wat u al heeft. Ontbreekt er iets? Geen probleem — we lopen het samen met u door.
          </p>
          <a
            href="#prijs"
            className="group mt-7 inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            Prijs aanvragen
            <ArrowChip tone="dark" />
          </a>
        </div>
      </Reveal>
    </div>
  );
}
