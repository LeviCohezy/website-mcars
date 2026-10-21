"use client";

import Image from "next/image";
import Link from "next/link";
import { Children, createContext, isValidElement, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { site } from "@/lib/site";
import QuoteFlow from "./quote-flow";

/*
 * FLOW KIT — the connective layer that turns a page into one composed piece
 * instead of a stack of blocks. Every page (all three design versions) is:
 *
 *   <FlowPage tone>                       persistent frame + route line
 *     <FlowHero …form={<QuoteFlow/>}/>    one of three hero compositions
 *     <Chapter n="01" label tone>         numbered stop on the route
 *       <ChapterIntro lead trail/>        same type-forward opener every time
 *       …content aligned to <FlowGrid>…
 *     </Chapter>
 *     <ImageBridge/>                      photo straddling a tone change
 *     <Chapter curtain tone="dark">       dark chapter slides over the last one
 *     …
 *   </FlowPage>
 *
 * Borrowed compositions (see docs/DESIGN-FLOW.md):
 *  - Lithosquare (Webflow): vertical frame hairlines through the whole page,
 *    "+" crosshairs at section seams, centred type-forward intros, curved
 *    connectors between step cards  → FlowPage frame, Chapter seam, StepPath
 *  - Carlux (Webflow) + LuxAuto (Dribbble): giant wordmark behind the vehicle,
 *    scroll-scrubbed statement text  → FlowHero "wordmark", ScrollWords
 *  - Monaco Royal Limousines (Dribbble): type lines with inline vehicle
 *    images  → FlowHero "lines", InlineImageLine
 *  - Forge Automotive (Dribbble): dark cinema hero, oversized index numerals
 *    → FlowHero "cinema", IndexRow
 *  - Cruzeon (Dribbble): hairline grid with isolated trucks, bento rhythm
 *    → FlowGrid / Bento
 */

export type FlowTone = "light" | "paper" | "dark";

const TONE: Record<FlowTone, { bg: string; text: string; muted: string; faint: string; line: string; frame: string }> = {
  light: { bg: "bg-white", text: "text-zinc-950", muted: "text-zinc-500", faint: "text-zinc-400", line: "border-zinc-200", frame: "bg-zinc-950/[0.07]" },
  paper: { bg: "bg-zinc-100", text: "text-zinc-950", muted: "text-zinc-500", faint: "text-zinc-400", line: "border-zinc-300/70", frame: "bg-zinc-950/[0.08]" },
  dark: { bg: "bg-zinc-950", text: "text-white", muted: "text-white/55", faint: "text-white/35", line: "border-white/12", frame: "bg-white/[0.08]" },
};

export const toneClasses = (t: FlowTone) => TONE[t];

const ToneCtx = createContext<FlowTone>("light");
/** Current chapter tone — lets nested blocks pick light/dark styling automatically. */
export const useFlowTone = () => useContext(ToneCtx);

/* ------------------------------------------------------------------ */
/* Shared scroll plumbing                                             */
/* ------------------------------------------------------------------ */

function useReduced() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setR(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return r;
}

/** 0 → 1 as the element travels from `start` (viewport fraction of its top) to `end`. */
function useProgress<T extends HTMLElement>(start = 0.9, end = 0.3, mobile?: [number, number]) {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const [a, b] = mobile && window.innerWidth < 640 ? mobile : [start, end];
      const v = (vh * a - r.top) / (vh * (a - b) + r.height * 0.5);
      setP(Math.min(1, Math.max(0, v)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [start, end, mobile]);
  return [ref, p] as const;
}

/** Adds `is-in` once the element enters the viewport (one-shot). */
function useInView<T extends HTMLElement>(margin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [inView, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIn(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, inView] as const;
}

/* ------------------------------------------------------------------ */
/* Page frame                                                         */
/* ------------------------------------------------------------------ */

/** Content container every chapter aligns to — the frame lines sit on its edges. */
export const FRAME = "mx-auto w-full max-w-[88rem] px-5 sm:px-10 lg:px-14";

/**
 * Wraps the page: renders the persistent vertical frame hairlines (Lithosquare)
 * and the route line — a thin rail on the left that fills as you scroll, with a
 * small marker travelling down it: the visitor's own trip "van A naar B".
 */
export function FlowPage({ tone = "light", children, className = "" }: { tone?: FlowTone; children: React.ReactNode; className?: string }) {
  const t = TONE[tone];
  const [p, setP] = useState(0);
  const reduced = useReduced();
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  return (
    <ToneCtx.Provider value={tone}>
      <div className={`relative isolate overflow-clip rounded-[1rem] ${t.bg} ${t.text} ${className}`}>
        {children}
        <StickyQuote />
        {/* Route line — fixed to the viewport, on the left frame edge */}
        <div aria-hidden className="pointer-events-none fixed top-0 bottom-0 right-[5px] z-40 w-px opacity-50 md:right-auto md:left-[1.6rem] md:opacity-100">
          <div className="absolute inset-0 bg-zinc-500/20" />
          <div className="absolute inset-x-0 top-0 bg-zinc-500/70 mix-blend-difference" style={{ height: `${p * 100}%`, transition: reduced ? "none" : "height 120ms linear" }} />
          <div
            className="absolute -left-[2px] size-[5px] rounded-full bg-white ring-2 ring-zinc-950 mix-blend-difference md:-left-[3px] md:size-[7px]"
            style={{ top: `calc(${p * 100}% - 3px)`, transition: reduced ? "none" : "top 120ms linear" }}
          />
        </div>
      </div>
    </ToneCtx.Provider>
  );
}

/** Vertical frame hairlines, drawn per chapter so they inherit the chapter tone. */
function FrameLines({ tone }: { tone: FlowTone }) {
  const t = TONE[tone];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 -z-0 w-full max-w-[88rem] -translate-x-1/2 px-2.5 opacity-60 sm:px-10 sm:opacity-100 lg:px-14">
      <div className="relative h-full">
        <span className={`absolute inset-y-0 left-0 w-px ${t.frame}`} />
        <span className={`absolute inset-y-0 right-0 w-px ${t.frame}`} />
        <span className={`absolute inset-y-0 left-1/2 hidden w-px lg:block ${t.frame}`} />
      </div>
    </div>
  );
}

/** "+" crosshairs where a chapter seam meets the frame lines. */
function Seam({ tone }: { tone: FlowTone }) {
  const t = TONE[tone];
  const cross = `absolute -top-[6px] size-[11px] ${t.faint}`;
  const svg = (
    <svg viewBox="0 0 11 11" className="size-full" aria-hidden>
      <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 mx-auto w-full max-w-[88rem] px-2.5 sm:px-10 lg:px-14">
      <div className="relative">
        <span className={`${cross} -left-[5px]`}>{svg}</span>
        <span className={`${cross} left-1/2 hidden -translate-x-1/2 lg:block`}>{svg}</span>
        <span className={`${cross} -right-[5px]`}>{svg}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chapters                                                           */
/* ------------------------------------------------------------------ */

/**
 * A numbered stop on the page's route. Same vertical rhythm everywhere.
 * `curtain` = this chapter slides over the previous one with rounded top
 * corners (use it for every tone change into dark, and back to light).
 */
export function Chapter({
  n,
  label,
  tone = "light",
  curtain = false,
  id,
  space = "default",
  children,
  className = "",
}: {
  n?: string;
  label?: string;
  tone?: FlowTone;
  curtain?: boolean;
  id?: string;
  space?: "default" | "tight" | "loose" | "none";
  children: React.ReactNode;
  className?: string;
}) {
  const t = TONE[tone];
  const pad = { default: "py-24 sm:py-28 lg:py-32", tight: "py-16 sm:py-20", loose: "py-28 sm:py-36 lg:py-44", none: "" }[space];
  return (
    <ToneCtx.Provider value={tone}>
      <section
        id={id}
        className={`relative isolate ${t.bg} ${t.text} ${pad} ${curtain ? "-mt-10 rounded-t-[2rem] sm:-mt-14 sm:rounded-t-[2.75rem]" : ""} ${className}`}
      >
        <FrameLines tone={tone} />
        {!curtain && <Seam tone={tone} />}
        {(n || label) && (
          <div className={`relative ${FRAME} mb-8 sm:mb-14`}>
            <p className={`flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase ${t.muted}`}>
              {n && <span className={t.text}>{n}</span>}
              <span aria-hidden className={`h-px w-8 ${tone === "dark" ? "bg-white/30" : "bg-zinc-950/25"}`} />
              {label}
            </p>
          </div>
        )}
        <div className="relative">{children}</div>
      </section>
    </ToneCtx.Provider>
  );
}

/** Content aligned to the frame. */
export function FlowGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${FRAME} ${className}`}>{children}</div>;
}

/**
 * The single section opener used everywhere: a large light-weight statement
 * whose words light up as you scroll (Carlux / Lithosquare). `trail` stays muted.
 */
export function ChapterIntro({
  lead,
  trail,
  body,
  align = "left",
  action,
  className = "",
}: {
  lead: string;
  trail?: string;
  body?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
}) {
  const tone = useFlowTone();
  const t = TONE[tone];
  const center = align === "center";
  return (
    <div className={`${FRAME} ${className}`}>
      <div className={center ? "mx-auto max-w-4xl text-center" : "grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:items-end"}>
        <h2
          className={
            lead.length + (trail?.length ?? 0) > 110
              ? "text-[1.6rem] leading-[1.18] font-light tracking-[-0.025em] sm:text-3xl lg:text-[2.6rem]"
              : "text-[2.15rem] leading-[1.04] font-light tracking-[-0.035em] text-balance sm:text-5xl lg:text-[4rem]"
          }
        >
          <ScrollWords text={lead} />
          {trail && (
            <>
              {" "}
              <span className={t.faint}>{trail}</span>
            </>
          )}
        </h2>
        {(body || action) && (
          <div className={center ? "mx-auto mt-6 max-w-xl" : "lg:pb-2"}>
            {body && <p className={`text-base leading-relaxed sm:text-lg ${t.muted}`}>{body}</p>}
            {action && <div className={`mt-6 flex flex-wrap gap-3 ${center ? "justify-center" : ""}`}>{action}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

/** Phones: the reveal completes within ~a third of a screen so it never feels stuck. */
const MOBILE_WORDS: [number, number] = [0.95, 0.72];

/** Words fade from 18% to full opacity, scrubbed by scroll. */
export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const [ref, p] = useProgress<HTMLSpanElement>(0.92, 0.45, MOBILE_WORDS);
  const reduced = useReduced();
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => {
        const on = reduced ? 1 : Math.min(1, Math.max(0.18, (p * words.length - i) * 1.2 + 0.18));
        return (
          <span key={i} style={{ opacity: on, transition: "opacity 160ms linear" }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}

/** Rise-in wrapper used for every content element (one choreography site-wide). */
export function Rise({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`flow-rise ${inView ? "is-in" : ""} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** Photo with the house clip-reveal (opens from an inset rounded window). */
export function ClipImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  parallax = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  parallax?: boolean;
}) {
  const [ref, inView] = useInView<HTMLDivElement>("0px 0px -8% 0px");
  const [pref, p] = useProgress<HTMLDivElement>(1, 0);
  const reduced = useReduced();
  return (
    <div ref={pref} className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative "}overflow-hidden ${className}`}>
      <div ref={ref} className={`absolute inset-0 flow-clip ${inView ? "is-in" : ""}`}>
        <div className="absolute inset-[-8%_0]" style={parallax && !reduced ? { transform: `translateY(${(p - 0.5) * -8}%)` } : undefined}>
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        </div>
      </div>
    </div>
  );
}

/**
 * A wide photo that straddles the seam between two chapters — half in the one
 * above, half in the one below — so the eye is carried across the tone change.
 * Place it directly between two <Chapter>s with normal padding: its top half
 * is painted in the upper tone and its bottom half in the lower tone, so the
 * seam is seamless without overlapping either chapter's content.
 */
export function ImageBridge({
  src,
  alt,
  caption,
  from = "light",
  to = "dark",
  height = "aspect-[4/3] sm:aspect-auto sm:h-[68svh]",
}: {
  src: string;
  alt: string;
  caption?: string;
  from?: FlowTone;
  to?: FlowTone;
  height?: string;
}) {
  return (
    <div aria-hidden={!caption} className="relative isolate">
      <div className={`absolute inset-x-0 top-0 h-1/2 ${TONE[from].bg}`} />
      <div className={`absolute inset-x-0 bottom-0 h-1/2 ${TONE[to].bg}`} />
      <div className={`relative ${FRAME}`}>
        <ClipImage src={src} alt={alt} parallax className={`${height} rounded-[1.25rem] sm:rounded-[2rem]`} />
        {caption && (
          <p className={`relative mt-4 font-mono text-[11px] tracking-[0.2em] uppercase ${TONE[to].muted}`}>{caption}</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Heroes                                                             */
/* ------------------------------------------------------------------ */

type Crumb = { href?: string; label: string };

function Crumbs({ items, light }: { items: Crumb[]; light: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-2 text-sm ${light ? "text-zinc-500" : "text-white/60"}`}>
      {items.map((c, i) => (
        <span key={c.label} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>/</span>}
          {c.href ? (
            <Link href={c.href} className={`inline-flex min-h-11 items-center ${light ? "hover:text-zinc-950" : "hover:text-white"}`}>
              {c.label}
            </Link>
          ) : (
            <span className={light ? "text-zinc-950" : "text-white"}>{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * Three hero compositions — one per design version, same props:
 *  "cinema"   (01) full-bleed photo, title bottom-left, glass quote form right (Forge / FREIGHT)
 *  "wordmark" (02) light: giant outlined wordmark behind the isolated truck, form below (Carlux / LuxAuto / Cruzeon)
 *  "lines"    (03) dark: type lines with inline photo pills, form centred below (Monaco)
 * `form` is normally <QuoteFlow/> with the matching tone.
 */
export function FlowHero({
  variant,
  title,
  intro,
  crumbs = [],
  image,
  imageAlt = "",
  wordmark,
  lineImages = [],
  form,
  aside,
}: {
  variant: "cinema" | "wordmark" | "lines";
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  image: string;
  imageAlt?: string;
  /** Giant word for the "wordmark" hero, e.g. "PARTICULIER". Defaults to the first word of the title. */
  wordmark?: string;
  /** 2–3 photos used inline in the "lines" hero. */
  lineImages?: string[];
  form?: React.ReactNode;
  /** Small proof row under the title (reviews, CMR, …). */
  aside?: React.ReactNode;
}) {
  if (variant === "cinema") {
    return (
      <ToneCtx.Provider value="dark">
        <section className="relative isolate flex min-h-[calc(100svh-1rem)] flex-col overflow-hidden rounded-[1rem] bg-zinc-950 text-white">
          <ClipImage src={image} alt={imageAlt} priority parallax className="absolute inset-0" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/25 to-zinc-950/50" />
          <div aria-hidden className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-zinc-950/55 to-transparent" />
          <div className={`relative z-10 grid grid-cols-1 flex-1 content-end gap-8 pt-32 pb-8 sm:pb-12 lg:grid-cols-[minmax(0,1fr)_27rem] lg:items-end lg:gap-14 ${FRAME}`}>
            <div className="min-w-0">
              <Crumbs items={crumbs} light={false} />
              <h1 className="mt-4 max-w-4xl text-[2.5rem] leading-[0.98] font-light tracking-[-0.045em] text-balance sm:mt-5 sm:text-7xl lg:text-[6.5rem]">{title}</h1>
              {intro && <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">{intro}</p>}
              {aside && <div className="mt-7">{aside}</div>}
            </div>
            {form && <div className="w-full min-w-0">{form}</div>}
          </div>
        </section>
      </ToneCtx.Provider>
    );
  }

  if (variant === "wordmark") {
    const word = (wordmark ?? title.split(" ")[0]).toUpperCase();
    return (
      <ToneCtx.Provider value="light">
        <section className="relative isolate overflow-hidden bg-white pt-24 text-zinc-950 sm:pt-36">
          <FrameLines tone="light" />
          <div className={`relative ${FRAME}`}>
            <Crumbs items={crumbs} light />
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-end">
              <h1 className="text-[2.5rem] leading-[0.98] font-light tracking-[-0.045em] text-balance sm:text-7xl lg:text-[5.5rem]">{title}</h1>
              <div>
                {intro && <p className="max-w-md text-base leading-relaxed text-zinc-500 sm:text-lg">{intro}</p>}
                {aside && <div className="mt-5">{aside}</div>}
              </div>
            </div>
          </div>
          {/* Wordmark band — giant word on a studio-grey panel, the isolated truck
              (edges masked into the panel) overlapping its lower half */}
          <div className={`relative mt-10 sm:mt-14 ${FRAME}`}>
            <div className="relative overflow-hidden rounded-[1.5rem] bg-[#c3c6ce] pt-8 sm:rounded-[2.5rem] sm:pt-12">
              <p
                aria-hidden
                className="pointer-events-none text-center font-[family-name:var(--font-display)] leading-[0.8] whitespace-nowrap text-white select-none"
                style={{ fontSize: `clamp(4.5rem, ${Math.min(22, 128 / Math.max(word.length, 5))}vw, 21rem)` }}
              >
                {word}
              </p>
              <div className="relative mx-auto -mt-[7vw] aspect-[2/1] w-full max-w-6xl [mask-image:radial-gradient(ellipse_62%_62%_at_50%_56%,black_62%,transparent_100%)]">
                <Image src={image} alt={imageAlt} fill priority sizes="(min-width: 1024px) 72rem, 100vw" className="object-contain" />
              </div>
            </div>
          </div>
          {form && <div className={`relative -mt-10 pb-16 sm:-mt-20 sm:pb-24 ${FRAME}`}><div className="mx-auto max-w-3xl">{form}</div></div>}
        </section>
      </ToneCtx.Provider>
    );
  }

  // "lines" — Monaco: type lines with inline photo pills, on black
  const words = title.split(" ");
  const third = Math.ceil(words.length / 3);
  const lines = [words.slice(0, third), words.slice(third, third * 2), words.slice(third * 2)].filter((l) => l.length);
  const pills = lineImages.length ? lineImages : [image];
  return (
    <ToneCtx.Provider value="dark">
      <section className="relative isolate overflow-hidden rounded-[1rem] bg-zinc-950 pt-28 pb-16 text-white sm:pt-40 sm:pb-24">
        <FrameLines tone="dark" />
        <div className={`relative ${FRAME} text-center`}>
          <div className="flex justify-center">
            <Crumbs items={crumbs} light={false} />
          </div>
          <h1 className="mx-auto mt-6 max-w-6xl text-[2.3rem] leading-[1.06] font-light tracking-[-0.045em] sm:mt-8 sm:text-7xl lg:text-[6.25rem]">
            {lines.map((l, i) => (
              <span key={i} className="flex flex-wrap items-center justify-center gap-x-[0.25em]">
                {i > 0 && pills[(i - 1) % pills.length] && (
                  <span aria-hidden className="relative inline-block h-[0.72em] w-[1.6em] overflow-hidden rounded-full align-middle ring-1 ring-white/20">
                    <Image src={pills[(i - 1) % pills.length]} alt="" fill sizes="12rem" className="object-cover" />
                  </span>
                )}
                {l.join(" ")}
              </span>
            ))}
          </h1>
          {intro && <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">{intro}</p>}
          {aside && <div className="mt-6 flex justify-center">{aside}</div>}
          {form && <div className="mx-auto mt-10 max-w-3xl text-left">{form}</div>}
        </div>
        <div className={`relative mt-16 ${FRAME}`}>
          <ClipImage src={image} alt={imageAlt} priority parallax className="aspect-[4/3] rounded-[1.25rem] sm:aspect-auto sm:h-[62svh] sm:rounded-[2rem]" />
        </div>
      </section>
    </ToneCtx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Recurring compositions                                             */
/* ------------------------------------------------------------------ */

/**
 * Steps joined by a drawn connector (Lithosquare). Desktop: a row of cards
 * with a curved path weaving between them; mobile: a vertical line with
 * nodes. The line draws itself as the block scrolls in.
 */
export function StepPath({ steps }: { steps: { title: string; body: string; tag?: string }[] }) {
  const tone = useFlowTone();
  const t = TONE[tone];
  const [ref, p] = useProgress<HTMLDivElement>(0.85, 0.25);
  const reduced = useReduced();
  const draw = reduced ? 1 : p;
  const card = tone === "dark" ? "bg-white/[0.04] ring-1 ring-white/10" : tone === "paper" ? "bg-white ring-1 ring-zinc-950/5" : "bg-zinc-100/70 ring-1 ring-zinc-950/5";
  const n = steps.length;
  return (
    <div ref={ref} className={FRAME}>
      {/* Desktop */}
      <div className="relative hidden lg:block">
        <svg aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 h-full w-full ${t.faint}`} preserveAspectRatio="none" viewBox={`0 0 ${n * 100} 100`}>
          <path
            d={Array.from({ length: n - 1 }, (_, i) => {
              const x1 = i * 100 + 50, x2 = (i + 1) * 100 + 50;
              const yA = i % 2 ? 78 : 22, yB = i % 2 ? 22 : 78;
              return `${i === 0 ? `M${x1} ${yA}` : ""} C${x1 + 50} ${yA} ${x2 - 50} ${yB} ${x2} ${yB}`;
            }).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - draw}
          />
        </svg>
        <ol className="relative grid gap-5" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {steps.map((s, i) => (
            <li key={s.title} className={`${i % 2 ? "mt-24" : ""} rounded-2xl p-6 ${card}`}>
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[11px] tracking-[0.2em] ${t.faint}`}>{String(i + 1).padStart(2, "0")}</span>
                {s.tag && <span className={`font-mono text-[10px] tracking-[0.18em] uppercase ${t.muted}`}>{s.tag}</span>}
              </div>
              <h3 className="mt-8 text-2xl font-light tracking-[-0.02em]">{s.title}</h3>
              <p className={`mt-3 text-sm leading-relaxed ${t.muted}`}>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
      {/* Mobile / tablet */}
      <ol className="relative space-y-4 pl-8 lg:hidden">
        <span aria-hidden className={`absolute top-2 bottom-2 left-[7px] w-px ${tone === "dark" ? "bg-white/15" : "bg-zinc-950/15"}`}>
          <span className={`absolute inset-x-0 top-0 ${tone === "dark" ? "bg-white" : "bg-zinc-950"}`} style={{ height: `${draw * 100}%` }} />
        </span>
        {steps.map((s, i) => (
          <li key={s.title} className={`relative rounded-2xl p-5 ${card}`}>
            <span aria-hidden className={`absolute top-6 -left-8 size-[15px] rounded-full border-2 ${tone === "dark" ? "border-white bg-zinc-950" : "border-zinc-950 bg-white"}`} />
            <span className={`font-mono text-[11px] tracking-[0.2em] ${t.faint}`}>{String(i + 1).padStart(2, "0")}{s.tag ? ` · ${s.tag}` : ""}</span>
            <h3 className="mt-3 text-xl font-light tracking-[-0.02em]">{s.title}</h3>
            <p className={`mt-2 text-sm leading-relaxed ${t.muted}`}>{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Oversized-numeral index rows (Forge "001"). Each row: big number, title,
 * short text, optional link + thumbnail that slides in on hover (always
 * visible on touch). Use for service lists, reasons, FAQ categories.
 */
export function IndexRow({
  items,
}: {
  items: { title: string; body?: string; href?: string; image?: string; meta?: string }[];
}) {
  const tone = useFlowTone();
  const t = TONE[tone];
  return (
    <div className={FRAME}>
      <ul className={`border-t ${t.line}`}>
        {items.map((it, i) => {
          const inner = (
            <>
              <span className={`font-[family-name:var(--font-display)] text-5xl leading-none sm:text-7xl ${t.faint} transition-colors ${tone === "dark" ? "group-hover:text-white" : "group-hover:text-zinc-950"}`}>
                {String(i + 1).padStart(3, "0")}
              </span>
              <span className="min-w-0">
                <span className="block text-2xl font-light tracking-[-0.025em] sm:text-3xl">{it.title}</span>
                {it.body && <span className={`mt-2 block max-w-xl text-sm leading-relaxed sm:text-base ${t.muted}`}>{it.body}</span>}
              </span>
              <span className="hidden items-center justify-end gap-5 sm:flex">
                {it.meta && <span className={`font-mono text-[11px] tracking-[0.18em] uppercase ${t.muted}`}>{it.meta}</span>}
                {it.image && (
                  <span className="relative block h-16 w-24 overflow-hidden rounded-xl opacity-100 transition-all duration-500 lg:w-0 lg:opacity-0 lg:group-hover:w-28 lg:group-hover:opacity-100">
                    <Image src={it.image} alt="" fill sizes="7rem" className="object-cover" />
                  </span>
                )}
                {it.href && (
                  <span className={`flex size-11 flex-none items-center justify-center rounded-full ring-1 transition-colors ${tone === "dark" ? "ring-white/20 group-hover:bg-white group-hover:text-zinc-950" : "ring-zinc-950/15 group-hover:bg-zinc-950 group-hover:text-white"}`}>
                    <Arrow />
                  </span>
                )}
              </span>
            </>
          );
          const cls = `group grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-5 border-b py-6 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:gap-8 sm:py-8 ${t.line}`;
          return (
            <li key={it.title}>
              {it.href ? (
                <Link href={it.href} className={cls}>
                  {inner}
                </Link>
              ) : (
                <div className={cls}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Bento with a fixed rhythm (Cruzeon / REVEX): pass 4–7 children; they are laid
 * into a 6-column grid using a repeating pattern of wide/tall/square cells so
 * the cadence is always the same across pages.
 */
export function Bento({ children }: { children: React.ReactNode }) {
  // Phones: one column of equal 4:3-ish cells; tablets/desktop: the rhythm grid.
  const PATTERN = [
    "min-h-[19rem] lg:col-span-4 lg:row-span-2 sm:min-h-[22rem]",
    "min-h-[16rem] lg:col-span-2 sm:min-h-[14rem]",
    "min-h-[16rem] lg:col-span-2 sm:min-h-[14rem]",
    "min-h-[16rem] lg:col-span-3",
    "min-h-[16rem] lg:col-span-3",
    "min-h-[16rem] lg:col-span-2 sm:min-h-[14rem]",
    "min-h-[16rem] lg:col-span-4 sm:min-h-[14rem]",
  ];
  const kids = Children.toArray(children).filter(isValidElement);
  return (
    <div className={FRAME}>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-6">
        {kids.map((k, i) => (
          <Rise key={i} delay={(i % 3) * 80} className={`${PATTERN[i % PATTERN.length]} ${i === 0 ? "sm:col-span-2" : ""} relative overflow-hidden rounded-[1.5rem]`}>
            {k}
          </Rise>
        ))}
      </div>
    </div>
  );
}

/** A bento cell: photo with caption, or a plain toned panel. */
export function Cell({
  image,
  alt = "",
  eyebrow,
  title,
  body,
  dark = false,
  href,
  children,
}: {
  image?: string;
  alt?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  dark?: boolean;
  /** Makes the whole cell a link (with a round arrow bottom-right). */
  href?: string;
  children?: React.ReactNode;
}) {
  const tone = useFlowTone();
  const onPhoto = Boolean(image);
  const isDark = onPhoto || dark || tone === "dark";
  const panel = onPhoto ? "" : dark ? "bg-zinc-950 text-white" : tone === "dark" ? "bg-white/[0.05] ring-1 ring-white/10" : tone === "paper" ? "bg-white" : "bg-zinc-100";
  return (
    <div className={`absolute inset-0 flex flex-col justify-end p-6 sm:p-7 ${panel} ${isDark ? "text-white" : "text-zinc-950"}`}>
      {image && (
        <>
          <ClipImage src={image} alt={alt} sizes="(min-width:1024px) 50vw, 100vw" className="absolute inset-0" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/10 to-transparent" />
        </>
      )}
      <div className="relative">
        {eyebrow && <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${isDark ? "text-white/60" : "text-zinc-500"}`}>{eyebrow}</p>}
        {title && <p className="mt-2 text-2xl leading-tight font-light tracking-[-0.02em] sm:text-3xl">{title}</p>}
        {body && <p className={`mt-2 max-w-md text-sm leading-relaxed ${isDark ? "text-white/70" : "text-zinc-500"}`}>{body}</p>}
        {children}
      </div>
      {href && (
        <Link href={href} className="group absolute inset-0 z-10 flex items-end justify-end p-5" aria-label={title ?? eyebrow ?? "Bekijk"}>
          <span className={`flex size-11 items-center justify-center rounded-full ring-1 transition-colors ${isDark ? "ring-white/30 group-hover:bg-white group-hover:text-zinc-950" : "ring-zinc-950/20 group-hover:bg-zinc-950 group-hover:text-white"}`}>
            <Arrow />
          </span>
        </Link>
      )}
    </div>
  );
}

/** Big-figure row with hairline separators (stats). */
export function Figures({ items }: { items: { value: string; label: string }[] }) {
  const tone = useFlowTone();
  const t = TONE[tone];
  return (
    <div className={FRAME}>
      <dl className={`grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-4 ${t.line}`}>
        {items.map((f, i) => (
          <Rise
            key={f.label}
            delay={i * 90}
            className={`flex items-end justify-between gap-6 border-b py-6 sm:block sm:py-10 sm:pr-4 ${t.line} ${i % 2 === 0 ? "" : "sm:pl-6"} lg:border-b-0 lg:pl-6 lg:first:pl-0 ${i > 0 ? "lg:border-l" : ""}`}
          >
            <dt className={`max-w-[11rem] pb-1 font-mono text-[11px] tracking-[0.2em] uppercase sm:max-w-none sm:pb-0 ${t.muted}`}>{f.label}</dt>
            <dd
              className={`text-right font-[family-name:var(--font-display)] leading-none break-words sm:mt-3 sm:text-left ${
                f.value.length > 5 ? "text-4xl sm:text-5xl lg:text-6xl" : "text-[3.5rem] sm:text-7xl lg:text-8xl"
              }`}
            >
              {f.value}
            </dd>
          </Rise>
        ))}
      </dl>
    </div>
  );
}

/** A full-width statement line with inline photo pills (Monaco), for chapter breaks. */
export function InlineImageLine({ parts }: { parts: (string | { image: string })[] }) {
  return (
    <div className={FRAME}>
      <p className="text-center text-[2.4rem] leading-[1.08] font-light tracking-[-0.045em] sm:text-6xl lg:text-[5.5rem]">
        {parts.map((p, i) =>
          typeof p === "string" ? (
            <span key={i}>{p} </span>
          ) : (
            <span key={i} aria-hidden className="relative mx-[0.12em] inline-block h-[0.74em] w-[1.7em] -translate-y-[0.06em] overflow-hidden rounded-full align-middle">
              <Image src={p.image} alt="" fill sizes="14rem" className="object-cover" />
            </span>
          ),
        )}
      </p>
    </div>
  );
}

/** House button for flow pages (≥44px). */
export function FlowButton({ href, children, variant = "solid" }: { href: string; children: React.ReactNode; variant?: "solid" | "ghost" }) {
  const tone = useFlowTone();
  const solid = tone === "dark" ? "bg-white text-zinc-950 hover:bg-zinc-200" : "bg-zinc-950 text-white hover:bg-zinc-800";
  const ghost = tone === "dark" ? "ring-1 ring-white/25 text-white hover:ring-white/60" : "ring-1 ring-zinc-950/15 text-zinc-950 hover:ring-zinc-950/50";
  return (
    <Link href={href} className={`inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-medium transition-colors ${variant === "solid" ? solid : ghost}`}>
      {children} <Arrow />
    </Link>
  );
}

export function Arrow({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** House FAQ: hairline rows, big +, one open at a time. */
export function FlowFaq({ items }: { items: { q: string; a: string }[] }) {
  const tone = useFlowTone();
  const t = TONE[tone];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={FRAME}>
      <div className="lg:ml-[25%]">
        <ul className={`border-t ${t.line}`}>
          {items.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q} className={`border-b ${t.line}`}>
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setOpen(on ? null : i)}
                  className="flex min-h-16 w-full items-center gap-6 py-5 text-left"
                >
                  <span className={`hidden w-8 flex-none font-mono text-[11px] tracking-[0.18em] sm:inline ${t.faint}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-lg font-light tracking-[-0.015em] sm:text-2xl">{f.q}</span>
                  <span aria-hidden className={`relative size-5 flex-none transition-transform duration-500 ${on ? "rotate-45" : ""}`}>
                    <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                    <span className="absolute inset-y-0 left-1/2 w-px bg-current" />
                  </span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className={`max-w-2xl pb-6 text-base leading-relaxed sm:pl-14 ${t.muted}`}>{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/**
 * The closing chapter of every page: dark curtain that runs straight into the
 * footer, with the same QuoteFlow form the hero had — the film ends where it began.
 */
export function FlowClose({
  lead = "Klaar om uw wagen",
  trail = "te laten vervoeren?",
  body = "Vertel ons in een paar vragen wat er moet gebeuren. U krijgt binnen 24 uur een persoonlijke prijs en planning — geen calculator, geen callcenter.",
  form,
  contact,
}: {
  lead?: string;
  trail?: string;
  body?: string;
  form: React.ReactNode;
  contact?: React.ReactNode;
}) {
  return (
    <Chapter tone="dark" curtain space="loose" className="pb-28 sm:pb-40">
      <div className={`${FRAME} grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16`}>
        <div>
          <h2 className="text-[2.4rem] leading-[1.02] font-light tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
            <ScrollWords text={lead} /> <span className="text-white/35">{trail}</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/55 sm:text-lg">{body}</p>
          {contact && <div className="mt-10">{contact}</div>}
        </div>
        <div>{form}</div>
      </div>
    </Chapter>
  );
}

/**
 * Phones only: a slim bar pinned to the bottom of the screen once every
 * on-page QuoteFlow has scrolled out of view (and hidden again whenever one is
 * visible). Tapping it opens the same multi-step form in a bottom sheet, so a
 * visitor can request a price from anywhere on a long page.
 */
function StickyQuote() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const forms = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => forms.set(e.target, e.isIntersecting));
      update();
    });
    const update = () => {
      const anyVisible = [...forms.values()].some(Boolean);
      setShow(!anyVisible && window.scrollY > window.innerHeight * 0.6);
    };
    // Observe the page's own forms (not the one inside our sheet).
    document.querySelectorAll("[data-quote-flow]").forEach((el) => {
      if (!el.closest("[data-quote-sheet]")) {
        forms.set(el, false);
        io.observe(el);
      }
    });
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    root.classList.add("modal-open");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      root.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // The sheet is portalled to <body> so it layers above the fixed nav — FlowPage
  // is an isolated stacking context and would otherwise trap its z-index.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  if (!mounted) return null;
  return createPortal(
    <div className="md:hidden">
      {/* Bar */}
      <div
        className={`fixed inset-x-3 bottom-3 z-40 transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          show && !open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center gap-1.5 rounded-full bg-zinc-950/92 p-1.5 text-white shadow-[0_18px_50px_-12px_rgb(0_0_0/0.55)] ring-1 ring-white/10 backdrop-blur-xl">
          <a href={site.phoneHref} aria-label={`Bel ${site.phone}`} className="flex size-12 flex-none items-center justify-center rounded-full ring-1 ring-white/15">
            <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
            </svg>
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex min-h-12 flex-1 items-center justify-between gap-2 rounded-full bg-white pr-4 pl-5 text-sm font-medium text-zinc-950"
          >
            <span>
              Offerte aanvragen <span className="font-normal text-zinc-500">· 24u</span>
            </span>
            <Arrow />
          </button>
        </div>
      </div>

      {/* Sheet */}
      <div
        className={`fixed inset-0 z-[80] bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Offerte aanvragen"
        inert={!open}
        data-quote-sheet
        className={`fixed inset-x-0 bottom-0 z-[81] max-h-[92svh] overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-zinc-950 px-3 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between px-3 pb-3">
          <span aria-hidden className="h-1 w-10 rounded-full bg-white/20" />
          <button type="button" onClick={() => setOpen(false)} aria-label="Sluiten" className="-mr-2 flex size-12 items-center justify-center rounded-full text-white/70">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {open && <QuoteFlow tone="dark" />}
      </div>
    </div>,
    document.body,
  );
}

const noopSubscribe = () => () => {};
