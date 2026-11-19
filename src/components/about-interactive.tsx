"use client";

/**
 * Interactive pieces of /over-ons:
 * - WordReveal: a statement whose words light up as it scrolls through view
 * - Timeline: a pinned, horizontally scrolling company history
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** Run `fn` on scroll/resize, at most once per frame. */
function useScrollFrame(fn: () => void) {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  useEffect(() => {
    let raf = 0;
    const on = () => (raf ||= requestAnimationFrame(() => ((raf = 0), ref.current())));
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
}

/** Small marker for copy the client still has to confirm. Remove once confirmed. */
export function Draft({ children = "Nog te bevestigen", dark = false }: { children?: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-dashed px-2.5 py-0.5 text-[11px] font-medium ${dark ? "border-white/40 text-white/70" : "border-zinc-400 text-zinc-500"}`}>
      <span aria-hidden className={`size-1.5 rounded-full ${dark ? "bg-white/70" : "bg-zinc-400"}`} />
      {children}
    </span>
  );
}

export function WordReveal({ text, muted, className = "" }: { text: string; muted?: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = [...text.split(" ").map((w) => ({ w, muted: false })), ...(muted ? muted.split(" ").map((w) => ({ w, muted: true })) : [])];

  useScrollFrame(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when the top enters at 88% of the viewport, 1 when the bottom passes 55%.
    const p = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.33));
    const spans = el.querySelectorAll<HTMLElement>("[data-w]");
    spans.forEach((s, i) => {
      const a = clamp(p * (spans.length + 4) - i);
      s.style.opacity = String(0.14 + 0.86 * a);
    });
  });

  return (
    <h2 ref={ref} className={className}>
      {words.map((x, i) => (
        <span key={i} data-w className={`transition-opacity duration-300 motion-reduce:!opacity-100 ${x.muted ? "text-zinc-400" : ""}`} style={{ opacity: 0.14 }}>
          {x.w}{" "}
        </span>
      ))}
    </h2>
  );
}

export type Milestone = { year: string; title: string; body: string; image?: string; draft?: boolean };

export function Timeline({ items }: { items: Milestone[] }) {
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useScrollFrame(() => {
    const el = outer.current, tr = track.current;
    if (!el || !tr) return;
    const r = el.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
    const max = Math.max(0, tr.scrollWidth - tr.parentElement!.clientWidth);
    tr.style.transform = `translate3d(${(-p * max).toFixed(1)}px, 0, 0)`;
    if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
    setActive(Math.min(items.length - 1, Math.round(p * (items.length - 1))));
  });

  const jump = (i: number) => {
    const el = outer.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((el.offsetHeight - window.innerHeight) * i) / (items.length - 1), behavior: "smooth" });
  };

  return (
    <section ref={outer} aria-label="Tijdlijn" className="relative" style={{ height: `${100 + items.length * 60}vh` }}>
      <div className="sticky top-2 flex h-[calc(100svh-1rem)] flex-col overflow-hidden rounded-[2rem] bg-zinc-950 text-white">
        <div className="flex items-end justify-between gap-6 px-6 pt-24 sm:px-10 sm:pt-28 lg:px-14">
          <div>
            <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/60 uppercase">
              <span aria-hidden className="size-1.5 rounded-full bg-white" />
              Ons verhaal
            </p>
            <h2 className="mt-4 text-3xl leading-[1.02] font-medium tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Van de eerste lading <span className="text-white/40">tot vandaag.</span>
            </h2>
          </div>
          <p aria-hidden className="hidden text-7xl leading-none font-medium tracking-[-0.05em] text-white/15 tabular-nums lg:block">
            {items[active].year}
          </p>
        </div>

        <div className="mt-6 min-h-0 flex-1 sm:mt-10">
          <ol ref={track} className="flex h-full gap-4 px-6 will-change-transform sm:gap-6 sm:px-10 lg:px-14">
            {items.map((m, i) => (
              <li
                key={m.title}
                className={`relative flex h-full w-[82vw] flex-none flex-col overflow-hidden rounded-3xl ring-1 ring-white/10 transition-opacity duration-500 sm:w-[30rem] lg:w-[34rem] ${i === active ? "opacity-100" : "opacity-45"}`}
              >
                {m.image ? (
                  <div className="relative min-h-0 flex-1">
                    <Image src={m.image} alt="" fill sizes="(min-width: 640px) 34rem, 82vw" className="object-cover" />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
                    <p className="absolute bottom-3 left-6 text-6xl leading-none font-medium tracking-[-0.05em] tabular-nums sm:left-8 sm:text-7xl">{m.year}</p>
                  </div>
                ) : (
                  <div className="dot-grid-dark relative flex min-h-0 flex-1 items-end bg-white/[0.04]">
                    <p className="px-6 pb-3 text-[5.5rem] leading-none font-medium tracking-[-0.06em] tabular-nums sm:px-8 sm:text-[9rem]">{m.year}</p>
                  </div>
                )}
                <div className="bg-zinc-950 px-6 pt-4 pb-6 sm:px-8 sm:pb-8">
                  <p className="flex flex-wrap items-center gap-3 text-xl font-medium tracking-tight sm:text-2xl">
                    {m.title}
                    {m.draft && <Draft dark />}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/60 sm:text-base">{m.body}</p>
                </div>
              </li>
            ))}
            <li aria-hidden className="w-2 flex-none sm:w-8" />
          </ol>
        </div>

        {/* Progress rail: click a year to jump */}
        <div className="px-6 pt-5 pb-6 sm:px-10 sm:pb-8 lg:px-14">
          <div className="relative h-px bg-white/15">
            <span ref={bar} className="absolute inset-0 origin-left bg-white" style={{ transform: "scaleX(0)" }} />
          </div>
          <ul className="mt-3 flex justify-between">
            {items.map((m, i) => (
              <li key={m.title}>
                <button type="button" onClick={() => jump(i)} className={`text-xs font-medium tabular-nums transition-colors sm:text-sm ${i <= active ? "text-white" : "text-white/35 hover:text-white/70"}`}>
                  {m.year}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
