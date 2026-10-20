"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

type Item = { title: string; desc?: string; body: string };

/**
 * "Herkenbare situaties" as a pinned scroll sequence: the section sticks to
 * the viewport and, one by one, each card appears large in the centre and
 * travels into its slot in the row. Desktop only — on small screens or with
 * reduced motion it renders as a plain stacked section.
 */
export default function SituationsScroll({
  items,
  image,
  title = "Herkent u zich hierin?",
  intro,
  label = "Herkenbare situaties",
}: {
  items: Item[];
  image: string;
  title?: string;
  /** One or two sentences telling the visitor what to recognise. */
  intro?: string;
  label?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)");
    const sync = () => setAnimated(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!animated) {
      cards.forEach((c) => { c.style.transform = ""; c.style.opacity = ""; c.style.zIndex = ""; });
      return;
    }

    // Resting geometry of each card relative to the stage, measured untransformed.
    let geo: { dx: number; dy: number; scale: number }[] = [];
    const measure = () => {
      const stage = stageRef.current;
      if (!stage) return;
      cards.forEach((c) => { c.style.transform = "none"; });
      const s = stage.getBoundingClientRect();
      // The big card lives in the free space under the heading, never over it.
      const headBottom = (headRef.current?.getBoundingClientRect().bottom ?? s.top) - s.top + 24;
      const free = s.height - headBottom - 24;
      geo = cards.map((c) => {
        const r = c.getBoundingClientRect();
        const cx = r.left - s.left + r.width / 2;
        const cy = r.top - s.top + r.height / 2;
        return {
          dx: s.width / 2 - cx,
          dy: headBottom + free / 2 - cy,
          scale: Math.max(1, Math.min(1.9, (s.width * 0.4) / r.width, free / r.height)),
        };
      });
    };

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    let frame = 0;
    const render = () => {
      frame = 0;
      const wrap = wrapRef.current;
      if (!wrap || geo.length !== cards.length) return;
      const r = wrap.getBoundingClientRect();
      const progress = clamp(-r.top / (r.height - window.innerHeight));
      const span = 0.9 / cards.length; // last 10% holds the finished row

      cards.forEach((c, i) => {
        const local = clamp((progress - i * span) / span);
        const appear = ease(clamp(local / 0.3)); // grow in, big and centred
        const travel = ease(clamp((local - 0.3) / 0.7)); // then fly to the slot
        const g = geo[i];
        const k = 1 - travel;
        const scale = 1 + (g.scale - 1) * k;
        c.style.transform = `translate3d(${g.dx * k}px, ${g.dy * k}px, 0) scale(${scale * (0.85 + 0.15 * appear)})`;
        c.style.opacity = String(appear);
        c.style.zIndex = local > 0 && local < 1 ? "20" : "10";
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(render); };
    const onResize = () => { measure(); render(); };

    measure();
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [animated, items.length]);

  const cols = items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <div ref={wrapRef} style={animated ? { height: `${(items.length + 1) * 85}vh` } : undefined} className="relative">
      <section
        ref={stageRef}
        className={`relative flex flex-col overflow-hidden rounded-[2rem] bg-zinc-950 ${animated ? "sticky top-2 h-[calc(100vh-1rem)]" : "min-h-[88vh]"}`}
      >
        <div aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${asset(image)})` }} />
        <div aria-hidden className="absolute inset-0 bg-zinc-950/60" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950/70" />

        <div className="relative z-10 flex flex-1 flex-col px-5 pt-24 pb-5 sm:px-8 sm:pt-28 sm:pb-8 lg:px-10 lg:pt-24">
          <div ref={headRef} className="flex items-start justify-between gap-6">
            <div>
              <h2 className="max-w-3xl text-4xl font-light leading-[1.05] tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-[3.5rem]">
                {title}
              </h2>
              {intro && <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{intro}</p>}
            </div>
            <p className="hidden flex-none pt-2 text-sm text-white/70 sm:block">[{label}]</p>
          </div>

          <div className={`mt-auto grid gap-3 pt-10 sm:grid-cols-2 ${cols}`}>
            {items.map((s, i) => (
              <div
                key={s.title}
                ref={(el) => { cardRefs.current[i] = el; }}
                style={animated ? { opacity: 0 } : undefined}
                className="relative flex origin-center flex-col gap-2 will-change-transform"
              >
                {/* The situation */}
                <div className="flex flex-col rounded-lg bg-white p-6 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)] sm:min-h-64 sm:p-7">
                  <h3 className="text-xl leading-snug font-medium tracking-tight text-balance text-zinc-950 sm:text-[1.35rem]">
                    {s.title}
                  </h3>
                  {s.desc && <p className="mt-3 text-[0.95rem] leading-relaxed text-zinc-600">{s.desc}</p>}
                  {/* Quiet index at the bottom — the sentence is what should be read first. */}
                  <p className="mt-auto pt-6 text-xs text-zinc-300 tabular-nums">Situatie {String(i + 1).padStart(2, "0")}</p>
                </div>
                {/* What we do */}
                <div className="rounded-lg bg-zinc-950 p-5 text-white ring-1 ring-white/10 sm:p-6">
                  <p className="flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-white/50 uppercase">
                    <span aria-hidden className="size-1.5 rounded-full bg-white" />
                    Wat wij doen
                  </p>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-white/85">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
