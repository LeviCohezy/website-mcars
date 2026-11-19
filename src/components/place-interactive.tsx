"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Globe from "@/components/globe";
import { GLOBE_COUNTRIES } from "@/data/globe-countries";

const SERVED = GLOBE_COUNTRIES.map((c) => c.id);

/**
 * The globe of /routes, fixed on this page's place: one country zoomed in, or
 * two countries with the road between them. It flies in when scrolled into view.
 */
export function PlaceGlobe({
  from,
  to,
  label,
  title,
  body,
  regions,
}: {
  from: string;
  to?: string;
  label: string;
  title: string;
  body: string;
  regions: string[];
}) {
  const a = GLOBE_COUNTRIES.find((c) => c.slug === from);
  const b = to ? GLOBE_COUNTRIES.find((c) => c.slug === to) : undefined;
  return (
    <section className="relative h-[46rem] overflow-hidden rounded-[2rem] bg-zinc-950 text-white lg:h-[min(50rem,92svh)] lg:min-h-[40rem]">
      <Globe
        preset="stage"
        theme="dark"
        served={SERVED}
        home={a?.id}
        nodes={GLOBE_COUNTRIES}
        active={a?.id ?? null}
        to={b?.id ?? null}
        label={b ? `Wereldbol met de weg van ${a?.name} naar ${b.name}` : `Wereldbol, ingezoomd op ${a?.name}`}
        className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_3%,#000_14%,#000_40%,transparent_56%)] lg:[mask-image:linear-gradient(to_right,transparent_24%,#000_50%)]"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col px-6 pb-8 sm:px-10 lg:inset-y-0 lg:right-auto lg:w-[34rem] lg:justify-center lg:py-14 lg:pr-0 lg:pl-14">
        <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/60 uppercase">
          <span aria-hidden className="size-1.5 rounded-full bg-white" />
          {label}
        </p>
        <h2 className="mt-5 text-3xl leading-[1.05] font-light tracking-[-0.03em] text-balance sm:text-4xl lg:text-5xl">{title}</h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">{body}</p>
        {regions.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {regions.map((r) => (
              <li key={r} className="rounded-full bg-white/[0.08] px-4 py-1.5 text-sm text-white/85 ring-1 ring-white/15 backdrop-blur-md">{r}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

type Step = { title: string; body: string };
type Shot = { src: string; alt: string };

const TONES = [
  { card: "bg-zinc-100 text-zinc-950", muted: "text-zinc-500", pill: "border-zinc-950/20 text-zinc-600" },
  { card: "bg-zinc-950 text-white", muted: "text-white/60", pill: "border-white/25 text-white/70" },
  { card: "bg-white text-zinc-950 ring-1 ring-zinc-200", muted: "text-zinc-500", pill: "border-zinc-950/20 text-zinc-600" },
  { card: "bg-zinc-800 text-white", muted: "text-white/65", pill: "border-white/25 text-white/70" },
];

/**
 * The step plan as a deck: every card sticks under the nav and the next one
 * slides over it, while the covered card shrinks back a little.
 */
export function StepStack({ steps, shots }: { steps: Step[]; shots: Shot[] }) {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const slots = [...el.children] as HTMLElement[];
    let raf = 0;
    const update = () => {
      raf = 0;
      slots.forEach((slot, i) => {
        const card = slot.firstElementChild as HTMLElement;
        const next = slots[i + 1];
        if (!next) return;
        const r = slot.getBoundingClientRect();
        const gap = next.getBoundingClientRect().top - r.top;
        const t = Math.min(1, Math.max(0, 1 - gap / r.height));
        card.style.transform = `scale(${1 - 0.06 * t})`;
        card.style.filter = `brightness(${1 - 0.25 * t})`;
      });
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <ol ref={root} className="space-y-5">
      {steps.map((s, i) => {
        const tone = TONES[i % TONES.length];
        const shot = shots[i % shots.length];
        return (
          <li key={s.title} className="sticky" style={{ top: `calc(5.5rem + ${i * 0.9}rem)` }}>
            <article className={`grid origin-top overflow-hidden rounded-[2rem] will-change-transform lg:min-h-[30rem] lg:grid-cols-2 ${tone.card}`}>
              <div className="flex flex-col p-7 sm:p-10 lg:p-14">
                <p className={`inline-flex self-start rounded-full border px-4 py-1.5 text-[0.7rem] font-medium tracking-[0.16em] uppercase ${tone.pill}`}>
                  Stap {i + 1} van {steps.length}
                </p>
                <div aria-hidden className="min-h-8 flex-1" />
                <p className={`text-7xl leading-none font-light tracking-[-0.05em] tabular-nums sm:text-8xl ${tone.muted}`}>{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-5 text-3xl leading-[1.05] font-light tracking-[-0.03em] sm:text-4xl lg:text-5xl">{s.title}</h3>
                <p className={`mt-4 max-w-md text-base leading-relaxed sm:text-lg ${tone.muted}`}>{s.body}</p>
              </div>
              <div className="relative m-3 mt-0 aspect-[16/9] overflow-hidden rounded-[1.5rem] lg:m-3 lg:aspect-auto">
                {shot && <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />}
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
