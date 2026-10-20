"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./scroll";

/*
 * SIGNATURE SECTIONS — modern, non-traditional section patterns shared by all
 * three design versions. Each takes `tone` ("light" | "dark") so 01, 02 and 03
 * can use the same pattern in their own palette. Images carry the sections,
 * but every pattern keeps whitespace around them (no crowded collages).
 *
 *   ImageAccordion   horizontal photo panels; the active one expands
 *   StickyStory      sticky photo that swaps while steps scroll past
 *   StackedCards     cards that stack on top of each other on scroll
 *   HoverRevealList  large typographic rows; hovering reveals a floating photo
 *   CollageStatement oversized statement with three loosely placed photos
 *   MosaicGallery    asymmetric photo bento with one figure tile
 *   TypeMarquee      huge running words with photo "pills" between them
 *   SplitQuote       tall portrait beside an oversized quote
 *   HorizontalRail   pinned section whose cards travel sideways on scroll
 *
 * All motion respects prefers-reduced-motion and falls back to a static
 * layout on touch / small screens. Nothing essential is hover-only.
 */

export type Tone = "light" | "dark";
export type Panel = { title: string; body?: string; image: string; alt?: string; href?: string; meta?: string };

const t = (tone: Tone, light: string, dark: string) => (tone === "dark" ? dark : light);
const pad = (n: number) => String(n).padStart(2, "0");

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatch(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return match;
}

/** A Link when there is an href, otherwise a plain element — never an empty href. */
function LinkOr({ href, className, children, ...rest }: { href?: string; className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLElement>) {
  if (href) return <Link href={href} className={className} {...rest}>{children}</Link>;
  return <div className={className} {...rest}>{children}</div>;
}

function Arrow({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ───────────────────────── ImageAccordion ───────────────────────── */

/** Photo panels side by side; hovering/focusing one expands it and shows its text. Stacks on mobile. */
export function ImageAccordion({ items, radius = "rounded-2xl" }: { items: Panel[]; tone?: Tone; radius?: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-3 lg:h-[36rem] lg:flex-row">
      {items.map((p, i) => {
        const on = i === active;
        return (
          <LinkOr
            key={p.title}
            href={p.href}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            tabIndex={p.href ? undefined : 0}
            className={`group relative flex min-h-[14rem] flex-col sm:min-h-[17rem] justify-end overflow-hidden ${radius} bg-zinc-950 p-6 text-white transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none focus-visible:ring-2 focus-visible:ring-white sm:p-7 lg:min-h-0 ${
              on ? "lg:flex-[3.2]" : "lg:flex-1"
            }`}
          >
            <Image src={p.image} alt={p.alt ?? ""} fill sizes="(min-width: 1024px) 50vw, 100vw" className={`object-cover transition-transform duration-[1.4s] ${on ? "scale-100" : "lg:scale-110"}`} />
            <div aria-hidden className={`absolute inset-0 transition-colors duration-700 ${on ? "bg-gradient-to-t from-zinc-950/90 via-zinc-950/25 to-transparent" : "bg-zinc-950/55 lg:bg-zinc-950/65"}`} />
            <span className="absolute top-6 left-6 text-sm text-white/70 tabular-nums sm:top-7 sm:left-7">{p.meta ?? pad(i + 1)}</span>
            <div className="relative">
              {/* Collapsed panels show a vertical title on desktop */}
              <h3 className={`text-2xl leading-tight font-medium tracking-tight transition-opacity duration-500 sm:text-3xl ${on ? "" : "lg:opacity-0"}`}>{p.title}</h3>
              {p.body && (
                <p className={`mt-3 max-w-md text-[0.95rem] leading-relaxed text-white/75 transition-all duration-700 ${on ? "lg:translate-y-0 lg:opacity-100" : "lg:translate-y-3 lg:opacity-0"}`}>{p.body}</p>
              )}
              {p.href && <span className={`mt-5 inline-flex items-center gap-2 text-sm font-medium transition-opacity ${on ? "" : "lg:opacity-0"}`}>Meer lezen <Arrow /></span>}
            </div>
            <span
              aria-hidden
              className={`absolute bottom-7 left-6 hidden rotate-180 text-lg font-medium tracking-tight whitespace-nowrap text-white transition-opacity duration-500 [writing-mode:vertical-rl] lg:block ${on ? "opacity-0" : "opacity-100"}`}
            >
              {p.title}
            </span>
          </LinkOr>
        );
      })}
    </div>
  );
}

/* ───────────────────────── StickyStory ───────────────────────── */

/** A tall sticky photo on one side swaps as each step on the other side reaches the middle of the screen. */
export function StickyStory({
  steps,
  tone = "light",
  side = "left",
  radius = "rounded-2xl",
  numbered = true,
}: {
  steps: Panel[];
  tone?: Tone;
  side?: "left" | "right";
  radius?: string;
  numbered?: boolean;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  const photo = (
    <div className={`sticky top-24 hidden h-[calc(100vh-8rem)] overflow-hidden ${radius} bg-zinc-950 lg:block`}>
      {steps.map((s, i) => (
        <Image
          key={s.title}
          src={s.image}
          alt={s.alt ?? ""}
          fill
          sizes="50vw"
          className={`object-cover transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
        />
      ))}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-white">
        <span className="text-sm text-white/70">{steps[active]?.meta ?? `Stap ${pad(active + 1)}`}</span>
        <span className="text-6xl font-light tracking-[-0.05em] tabular-nums">
          {pad(active + 1)}
          <span className="text-2xl text-white/40">/{pad(steps.length)}</span>
        </span>
      </div>
    </div>
  );

  return (
    <div className={`grid gap-10 lg:grid-cols-2 lg:gap-20 ${side === "right" ? "lg:[&>*:first-child]:order-2" : ""}`}>
      {photo}
      <ol className="flex flex-col">
        {steps.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => { refs.current[i] = el; }}
            data-i={i}
            className={`flex flex-col justify-center border-t py-10 lg:min-h-[70vh] lg:py-0 ${t(tone, "border-zinc-200", "border-white/10")}`}
          >
            <div className={`relative mb-6 aspect-[16/10] overflow-hidden ${radius} lg:hidden`}>
              <Image src={s.image} alt={s.alt ?? ""} fill sizes="100vw" className="object-cover" />
            </div>
            {numbered && (
              <span className={`text-sm tabular-nums transition-colors duration-500 ${i === active ? t(tone, "text-zinc-950", "text-white") : t(tone, "text-zinc-400", "text-white/40")}`}>
                {s.meta ?? `Stap ${pad(i + 1)}`}
              </span>
            )}
            <h3 className={`mt-4 text-3xl leading-[1.08] font-medium tracking-[-0.025em] transition-colors duration-500 sm:text-4xl lg:text-5xl ${i === active ? t(tone, "text-zinc-950", "text-white") : t(tone, "text-zinc-950 lg:text-zinc-300", "text-white lg:text-white/30")}`}>
              {s.title}
            </h3>
            {s.body && <p className={`mt-5 max-w-md text-lg leading-relaxed ${t(tone, "text-zinc-500", "text-white/60")}`}>{s.body}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────────────────────── StackedCards ───────────────────────── */

/** Cards pin one below the other and stack as you scroll; each card pairs a photo with text. */
export function StackedCards({ items, tone = "light", radius = "rounded-3xl" }: { items: Panel[]; tone?: Tone; radius?: string }) {
  return (
    <ol className="relative flex flex-col gap-6">
      {items.map((c, i) => (
        <li key={c.title} className="lg:sticky" style={{ top: `${6 + i * 1.5}rem` }}>
          <div
            className={`grid overflow-hidden ${radius} shadow-[0_-20px_60px_-30px_rgb(0_0_0/0.35)] lg:grid-cols-[1.1fr_1fr] ${t(
              tone,
              i % 2 ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-950",
              i % 2 ? "bg-white text-zinc-950" : "bg-zinc-900 text-white",
            )}`}
          >
            <div className="flex flex-col p-8 sm:p-12 lg:min-h-[28rem]">
              <span className="text-7xl font-light tracking-[-0.05em] tabular-nums opacity-25 sm:text-8xl">{pad(i + 1)}</span>
              <h3 className="mt-auto pt-10 text-3xl leading-[1.08] font-medium tracking-[-0.025em] sm:text-4xl">{c.title}</h3>
              {c.body && <p className="mt-4 max-w-md text-base leading-relaxed opacity-70 sm:text-lg">{c.body}</p>}
            </div>
            <div className="relative min-h-64">
              <Image src={c.image} alt={c.alt ?? ""} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────────── HoverRevealList ───────────────────────── */

/** Large typographic rows; on desktop the hovered row's photo floats next to the cursor. */
export function HoverRevealList({ items, tone = "light" }: { items: Panel[]; tone?: Tone }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const fine = useMedia("(hover: hover) and (min-width: 1024px)");
  const reduced = useReducedMotion();

  return (
    <div
      ref={wrap}
      className="relative"
      onMouseMove={(e) => {
        const r = wrap.current?.getBoundingClientRect();
        if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setHover(null)}
    >
      <ul className={`border-t ${t(tone, "border-zinc-950", "border-white/20")}`}>
        {items.map((it, i) => {
          return (
            <li key={it.title} className={`border-b ${t(tone, "border-zinc-200", "border-white/10")}`}>
              <LinkOr
                href={it.href}
                onMouseEnter={() => setHover(i)}
                className="group grid grid-cols-[auto_1fr] items-center gap-5 py-6 sm:grid-cols-[4rem_1fr_auto] sm:gap-8 sm:py-8"
              >
                {/* Thumbnail on touch screens, so the photo is never hover-only */}
                <span className="relative block size-16 overflow-hidden rounded-lg sm:hidden">
                  <Image src={it.image} alt="" fill sizes="4rem" className="object-cover" />
                </span>
                <span className={`hidden text-sm tabular-nums sm:block ${t(tone, "text-zinc-400", "text-white/40")}`}>{it.meta ?? pad(i + 1)}</span>
                <span>
                  <span className={`block text-3xl leading-tight font-medium tracking-[-0.03em] transition-[color,transform] duration-500 sm:text-5xl lg:text-6xl ${
                    hover !== null && hover !== i ? t(tone, "lg:text-zinc-300", "lg:text-white/25") : ""
                  } group-hover:lg:translate-x-3`}>
                    {it.title}
                  </span>
                  {it.body && <span className={`mt-2 block max-w-xl text-[0.95rem] leading-relaxed ${t(tone, "text-zinc-500", "text-white/55")}`}>{it.body}</span>}
                </span>
                {it.href && (
                  <span className={`hidden size-12 items-center justify-center rounded-full border transition-colors sm:flex ${t(tone, "border-zinc-300 group-hover:bg-zinc-950 group-hover:text-white", "border-white/25 group-hover:bg-white group-hover:text-zinc-950")}`}>
                    <Arrow />
                  </span>
                )}
              </LinkOr>
            </li>
          );
        })}
      </ul>
      {fine && (
        <div
          aria-hidden
          className={`pointer-events-none absolute top-0 left-0 z-10 h-60 w-80 overflow-hidden rounded-xl shadow-2xl transition-opacity duration-300 ${hover === null ? "opacity-0" : "opacity-100"}`}
          style={{ transform: `translate3d(${pos.x + 40}px, ${pos.y - 120}px, 0) rotate(${reduced ? 0 : -3}deg)`, transition: reduced ? "opacity .3s" : "opacity .3s, transform .45s cubic-bezier(.16,1,.3,1)" }}
        >
          {items.map((it, i) => (
            <Image key={it.title} src={it.image} alt="" fill sizes="20rem" className={`object-cover transition-opacity duration-300 ${hover === i ? "opacity-100" : "opacity-0"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── CollageStatement ───────────────────────── */

/** An oversized statement with three photos placed loosely around it — airy, editorial. */
export function CollageStatement({
  eyebrow,
  statement,
  images,
  tone = "light",
  radius = "rounded-2xl",
  children,
}: {
  eyebrow?: string;
  statement: React.ReactNode;
  images: [Panel, Panel, Panel];
  tone?: Tone;
  radius?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-6">
      <Reveal className={`relative aspect-[3/4] overflow-hidden ${radius} lg:col-span-3 lg:mt-24`}>
        <Image src={images[0].image} alt={images[0].alt ?? ""} fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover" />
      </Reveal>
      <div className="flex flex-col lg:col-span-6 lg:px-6">
        {eyebrow && <p className={`text-sm ${t(tone, "text-zinc-500", "text-white/50")}`}>{eyebrow}</p>}
        <Reveal>
          <p className={`mt-6 text-3xl leading-[1.15] font-light tracking-[-0.03em] text-pretty sm:text-4xl lg:text-[2.9rem] ${t(tone, "text-zinc-950", "text-white")}`}>{statement}</p>
        </Reveal>
        {children && <div className="mt-10">{children}</div>}
        <Reveal className={`relative mt-12 hidden aspect-[16/9] overflow-hidden ${radius} lg:block`}>
          <Image src={images[1].image} alt={images[1].alt ?? ""} fill sizes="45vw" className="object-cover" />
        </Reveal>
      </div>
      <Reveal delay={120} className={`relative aspect-[4/5] overflow-hidden ${radius} lg:col-span-3 lg:-mt-6`}>
        <Image src={images[2].image} alt={images[2].alt ?? ""} fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover" />
      </Reveal>
    </div>
  );
}

/* ───────────────────────── MosaicGallery ───────────────────────── */

/** Asymmetric photo bento (one large, two stacked, one wide) plus one figure/text tile. */
export function MosaicGallery({
  images,
  figure,
  tone = "light",
  radius = "rounded-2xl",
}: {
  images: [Panel, Panel, Panel, Panel];
  figure: { value: string; label: string; body?: string };
  tone?: Tone;
  radius?: string;
}) {
  const cell = (p: Panel, cls: string, sizes: string, delay = 0) => (
    <Reveal delay={delay} className={`group relative overflow-hidden ${radius} bg-zinc-950 ${cls}`}>
      <Image src={p.image} alt={p.alt ?? ""} fill sizes={sizes} className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
      {p.title && (
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 text-sm font-medium text-zinc-950 backdrop-blur-md">{p.title}</span>
      )}
    </Reveal>
  );
  return (
    <div className="grid auto-rows-[13rem] gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[15rem]">
      {cell(images[0], "sm:col-span-2 lg:row-span-2", "(min-width: 1024px) 50vw, 100vw")}
      {cell(images[1], "", "(min-width: 1024px) 25vw, 50vw", 80)}
      <Reveal delay={140} className={`flex flex-col justify-between ${radius} p-6 ${t(tone, "bg-zinc-950 text-white", "bg-white text-zinc-950")}`}>
        <p className="text-sm opacity-60">{figure.label}</p>
        <div>
          <p className="text-6xl font-light tracking-[-0.05em] tabular-nums">{figure.value}</p>
          {figure.body && <p className="mt-2 text-sm leading-relaxed opacity-70">{figure.body}</p>}
        </div>
      </Reveal>
      {cell(images[2], "", "(min-width: 1024px) 25vw, 50vw", 200)}
      {cell(images[3], "", "(min-width: 1024px) 25vw, 50vw", 260)}
    </div>
  );
}

/* ───────────────────────── TypeMarquee ───────────────────────── */

/** Huge running words with rounded photo "pills" between them. */
export function TypeMarquee({ words, images, tone = "light", speed = 40 }: { words: string[]; images: string[]; tone?: Tone; speed?: number }) {
  const row = (
    <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8 sm:gap-12 sm:pr-12" style={{ animationDuration: `${speed}s` }}>
      {words.map((w, i) => (
        <span key={i} className="flex items-center gap-8 sm:gap-12">
          <span className={`text-6xl font-light tracking-[-0.05em] whitespace-nowrap sm:text-8xl lg:text-[9rem] ${t(tone, "text-zinc-950", "text-white")}`}>{w}</span>
          <span className="relative block h-16 w-32 flex-none overflow-hidden rounded-full sm:h-24 sm:w-48 lg:h-28 lg:w-56">
            <Image src={images[i % images.length]} alt="" fill sizes="14rem" className="object-cover" />
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden className="marquee flex overflow-hidden py-4">
      {row}
      {row}
    </div>
  );
}

/* ───────────────────────── SplitQuote ───────────────────────── */

/** A tall portrait photo beside an oversized quote with attribution. */
export function SplitQuote({
  image,
  alt,
  quote,
  name,
  role,
  tone = "light",
  radius = "rounded-2xl",
  children,
}: {
  image: string;
  alt?: string;
  quote: string;
  name: string;
  role?: string;
  tone?: Tone;
  radius?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid items-end gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <Reveal className={`relative aspect-[4/5] overflow-hidden ${radius} bg-zinc-950`}>
        <Image src={image} alt={alt ?? ""} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
      </Reveal>
      <Reveal delay={100} className="pb-2">
        <span aria-hidden className={`block text-8xl leading-none font-light ${t(tone, "text-zinc-300", "text-white/25")}`}>“</span>
        <blockquote className={`-mt-6 text-3xl leading-[1.18] font-light tracking-[-0.03em] text-pretty sm:text-4xl lg:text-5xl ${t(tone, "text-zinc-950", "text-white")}`}>{quote}</blockquote>
        <p className={`mt-8 text-base ${t(tone, "text-zinc-950", "text-white")}`}>
          <span className="font-medium">{name}</span>
          {role && <span className={t(tone, "text-zinc-500", "text-white/50")}> — {role}</span>}
        </p>
        {children && <div className="mt-8">{children}</div>}
      </Reveal>
    </div>
  );
}

/* ───────────────────────── HorizontalRail ───────────────────────── */

/** On desktop the section pins and its photo cards travel sideways as you scroll; a swipeable row elsewhere. */
export function HorizontalRail({ items, radius = "rounded-2xl", heading }: { items: Panel[]; tone?: Tone; radius?: string; heading?: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const desktop = useMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
  const [dist, setDist] = useState(0);
  const [x, setX] = useState(0);

  useEffect(() => {
    if (!desktop) return;
    const measure = () => setDist(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth + 64));
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = wrap.current?.getBoundingClientRect();
        if (!r) return;
        const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
        setX(p);
      });
    };
    measure();
    onScroll();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
    };
  }, [desktop, items.length]);

  const cards = items.map((it, i) => {
    return (
      <LinkOr
        key={it.title}
        href={it.href}
        className={`group relative flex aspect-[3/4] w-[78vw] flex-none snap-start flex-col justify-end overflow-hidden ${radius} p-6 text-white sm:w-[26rem] lg:h-[min(60vh,38rem)] lg:w-auto`}
      >
        <Image src={it.image} alt={it.alt ?? ""} fill sizes="30rem" className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/10 to-transparent" />
        <span className="absolute top-5 left-5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs backdrop-blur-md">{it.meta ?? pad(i + 1)}</span>
        <h3 className="relative text-2xl font-medium tracking-tight sm:text-3xl">{it.title}</h3>
        {it.body && <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-white/70">{it.body}</p>}
      </LinkOr>
    );
  });

  if (!desktop) {
    return (
      <div>
        {heading && <div className="mb-10">{heading}</div>}
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-12 sm:px-12">{cards}</div>
      </div>
    );
  }

  return (
    <div ref={wrap} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      {/* pt clears the fixed nav; cards are sized to the viewport height so heading + cards always fit */}
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-20 pb-6">
        {heading && <div className="mb-10">{heading}</div>}
        <div ref={track} className="flex gap-4 will-change-transform" style={{ transform: `translate3d(${-x * dist}px,0,0)` }}>
          {cards}
        </div>
      </div>
    </div>
  );
}
