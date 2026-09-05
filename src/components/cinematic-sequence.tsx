"use client";

/**
 * CinematicSequence — Mcars' single-page scroll-controlled film.
 *
 * ONE video is the background of the whole experience: it starts as the hero's
 * backdrop and never unmounts. Scroll position drives its timeline (no real
 * playback while scrubbing), so the story reverses naturally upward. Chapters,
 * keyed to specific moments in the source film:
 *
 *   t0–4   real truck on the road        → HERO items over the video
 *   t5–9   truck becomes white wireframe → company text + statistics
 *   t10–14 white-line tunnel, truck ahead → glass service cards grow from depth
 *                                           and fly past the camera into the
 *                                           four corners (video frozen here)
 *   t15–19 Europe map lighting up         → "WE SERVE EVERYWHERE IN EUROPE"
 *
 * At rest at the very top the film gently loops its opening so the hero feels
 * alive; the moment the user scrolls, control hands over to the scrub engine.
 * Everything on the animation path is written to refs inside one rAF loop — no
 * React state per frame — and the rendered video time is lerped toward its
 * scroll target for a weighted, cinematic feel.
 */

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { asset } from "@/lib/asset";
import HeroSearchWidget from "./hero-search-widget";
import NavPill from "./nav-pill";

export type ServiceCard = { title: string; body: string; image: string; href?: string };

export type CinematicConfig = {
  videoSrc: string;
  poster: string;
  scrollVh: number;
  lerp: number;

  // Video-time anchors (seconds) — where each moment lives in the source film.
  textTime: number; // truck turns to white wireframe
  textHold: number; // extra seconds the wireframe lingers while text holds
  blackTime: number; // everything turns black — the white-line "cool effect"
  cardsFreezeTime: number; // white-line tunnel, truck ahead (frozen for cards)
  mapTime: number; // Europe map appears

  // Progress windows [start,end], 0..1 over the whole section.
  hero: { fadeOut: [number, number] };
  intro: { fadeIn: [number, number]; fadeOut: [number, number] };
  stats: { fadeIn: [number, number]; fadeOut: [number, number] };
  black: { fadeIn: [number, number]; fadeOut: [number, number] };
  cardsChapter: [number, number];
  map: { fadeIn: [number, number]; fadeOut: [number, number] };

  heroBadge: string;
  heroHeadline: string[];
  introText: string;
  statistics: { nr: string; label: string }[];
  blackText: string;
  cards: ServiceCard[];
  mapHeadline: string[];
  mapSupporting?: string;
};

export const defaultCinematicConfig: CinematicConfig = {
  videoSrc: "/cinematic-scrub.mp4",
  poster: "/cinematic-poster.jpg",
  scrollVh: 850,
  lerp: 0.1,

  textTime: 5.5,
  textHold: 3,
  blackTime: 10.1,
  cardsFreezeTime: 12,
  mapTime: 15,

  hero: { fadeOut: [0.05, 0.15] },
  intro: { fadeIn: [0.18, 0.26], fadeOut: [0.4, 0.46] },
  stats: { fadeIn: [0.24, 0.32], fadeOut: [0.4, 0.46] },
  black: { fadeIn: [0.5, 0.56], fadeOut: [0.62, 0.66] },
  cardsChapter: [0.68, 0.86],
  // Map appears, then the film runs to its end and the completed map holds still.
  map: { fadeIn: [0.88, 0.93], fadeOut: [0.97, 1] },

  heroBadge: "Trusted by 3000+ clients",
  heroHeadline: ["Autotransport dat verder", "gaat dan van A naar B."],
  introText:
    "Mcars is een Belgisch transportbedrijf dat auto's betrouwbaar, snel en volledig transparant vervoert over heel Europa.",
  statistics: [
    { nr: "100%", label: "Verzekerd transport" },
    { nr: "10K+", label: "Wagens geleverd" },
    { nr: "500+", label: "Vaste klanten" },
    { nr: "25+", label: "Landen in Europa" },
  ],
  blackText: "Wij verzorgen elk soort transport voor u.",
  cards: [
    { title: "Autotransport particulier", body: "Eén wagen, veilig en zorgeloos van deur tot deur.", image: "/fleet/city-street.jpg", href: "/diensten/autotransport-particulier" },
    { title: "Dealers & handel", body: "Wekelijks transport voor garages en concessies.", image: "/fleet/depot-dusk.jpg", href: "/diensten/autotransport-dealers" },
    { title: "Import & export", body: "Van deur tot deur, door heel Europa.", image: "/fleet/germany-autobahn.jpg", href: "/diensten/auto-importeren" },
    { title: "Gesloten transport", body: "Volledige bescherming voor exclusieve wagens.", image: "/fleet/actros-motion.jpg", href: "/diensten/gesloten-autotransport" },
    { title: "Spoed & repatriëring", body: "Snel geschakeld, waar u ook strandt.", image: "/fleet/hero-highway-sunset.jpg", href: "/diensten/spoedtransport" },
  ],
  mapHeadline: ["Wij rijden door heel Europa"],
  mapSupporting: "Betrouwbaar autotransport in 25+ Europese landen.",
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const range = (p: number, a: number, b: number) =>
  a === b ? (p >= b ? 1 : 0) : clamp01((p - a) / (b - a));
const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

// Corner each card sits in while it grows, as [x,y] offsets from centre
// (vw,vh): top-left, top-right, bottom-left, bottom-right.
const CARD_CORNERS: [number, number][] = [
  [-28, -22],
  [28, -22],
  [-28, 22],
  [28, 22],
];

/** Piecewise scroll-progress → video-time (the tunnel freeze lives here). */
function buildTimePoints(cfg: CinematicConfig, duration: number) {
  const tText = Math.min(cfg.textTime, duration);
  const tTextEnd = Math.min(cfg.textTime + cfg.textHold, duration);
  const tBlack = Math.min(cfg.blackTime, duration);
  const tCards = Math.min(cfg.cardsFreezeTime, duration);
  const tMap = Math.min(cfg.mapTime, duration);
  return [
    { p: 0, t: 0 },
    { p: cfg.intro.fadeIn[0], t: tText }, //   scrub 0 → wireframe truck
    { p: cfg.intro.fadeOut[1], t: tTextEnd }, // linger on wireframe as text holds
    { p: cfg.black.fadeIn[0], t: tBlack }, //   into the black white-line effect
    { p: cfg.black.fadeOut[1], t: tBlack }, //  FROZEN on black while the line holds
    { p: cfg.cardsChapter[0], t: tCards }, //   resume → the tunnel
    { p: cfg.cardsChapter[1], t: tCards }, //   FROZEN while cards rush the camera
    { p: cfg.map.fadeIn[0], t: tMap }, //       resume → Europe map appears
    { p: 0.97, t: duration }, //                play through to the end (full map)
    { p: 1, t: duration }, //                   hold the final frame — map stands still
  ];
}

function mapVideoTime(p: number, pts: { p: number; t: number }[]) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (p <= b.p) return a.t + (b.t - a.t) * range(p, a.p, b.p);
  }
  return pts[pts.length - 1].t;
}

export default function CinematicSequence({
  config,
}: {
  config?: Partial<CinematicConfig>;
}) {
  const cfg = { ...defaultCinematicConfig, ...config };
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDListElement>(null);
  const blackTextRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapLineRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const durationRef = useRef(0);
  const renderedRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const onMeta = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
    };
    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    let raf = 0;
    let wordEls: HTMLElement[] = [];
    const N = cfg.cards.length;

    const loop = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? clamp01(-rect.top / scrollable) : 0;
      const duration = durationRef.current;

      // ---- video: never plays — still at the hero, scrubbed by scroll ----
      if (duration > 0) {
        const pts = buildTimePoints(cfg, duration);
        const target = mapVideoTime(p, pts);
        let rendered = renderedRef.current;
        rendered += (target - rendered) * cfg.lerp;
        if (Math.abs(target - rendered) < 0.004) rendered = target;
        renderedRef.current = rendered;
        if (video.readyState >= 2 && Math.abs(video.currentTime - rendered) > 0.01) {
          video.currentTime = rendered;
        }
      }

      // ---- Chapter 0: hero items fade away, lifting slightly into the film ----
      if (heroRef.current) {
        const out = range(p, cfg.hero.fadeOut[0], cfg.hero.fadeOut[1]);
        heroRef.current.style.opacity = `${1 - out}`;
        heroRef.current.style.transform = `translate3d(0,${-out * 40}px,0) scale(${1 - out * 0.04})`;
        heroRef.current.style.pointerEvents = out > 0.5 ? "none" : "auto";
      }

      // ---- Chapter 1: company text (over the white wireframe truck) ----
      if (introRef.current) {
        const op =
          range(p, cfg.intro.fadeIn[0], cfg.intro.fadeIn[1]) -
          range(p, cfg.intro.fadeOut[0], cfg.intro.fadeOut[1]);
        const ty =
          (1 - range(p, cfg.intro.fadeIn[0], cfg.intro.fadeIn[1])) * 44 -
          range(p, cfg.intro.fadeOut[0], cfg.intro.fadeOut[1]) * 30;
        introRef.current.style.opacity = `${clamp01(op)}`;
        introRef.current.style.transform = `translate3d(0,${ty}px,0)`;
      }
      if (statsRef.current) {
        const op =
          range(p, cfg.stats.fadeIn[0], cfg.stats.fadeIn[1]) -
          range(p, cfg.stats.fadeOut[0], cfg.stats.fadeOut[1]);
        const inT = range(p, cfg.stats.fadeIn[0], cfg.stats.fadeIn[1]);
        const ty = (1 - inT) * 48 - range(p, cfg.stats.fadeOut[0], cfg.stats.fadeOut[1]) * 24;
        statsRef.current.style.opacity = `${clamp01(op)}`;
        statsRef.current.style.transform = `translate3d(0,${ty}px,0) scale(${0.96 + inT * 0.04})`;
      }

      // ---- black line: lens-drift in, word by word (blur → readable) ----
      if (blackTextRef.current) {
        if (!wordEls.length) {
          wordEls = Array.from(blackTextRef.current.querySelectorAll<HTMLElement>("[data-word]"));
        }
        const [ia, ib] = cfg.black.fadeIn;
        const nw = wordEls.length;
        const per = nw > 0 ? (ib - ia) / nw : 0;
        const wdur = per * 1.8; // each word overlaps the next as it sharpens
        for (let w = 0; w < nw; w++) {
          const lp = range(p, ia + per * w, ia + per * w + wdur);
          wordEls[w].style.opacity = `${lp}`;
          wordEls[w].style.filter = lp < 0.999 ? `blur(${(1 - lp) * 9}px)` : "none";
        }
        // The whole line lifts and fades away once it has held.
        const out = range(p, cfg.black.fadeOut[0], cfg.black.fadeOut[1]);
        blackTextRef.current.style.opacity = `${1 - out}`;
        blackTextRef.current.style.transform = `translate3d(0,${-out * 24}px,0)`;
      }

      // ---- Chapter 2: card grows in its corner, then moves past us off-screen ----
      const [cs, ce] = cfg.cardsChapter;
      const seg = (ce - cs) / N;
      const dur = seg * 1.35; // slight overlap so the next is already arriving
      for (let i = 0; i < N; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const lp = range(p, cs + seg * i, cs + seg * i + dur);
        const [cx, cy] = CARD_CORNERS[i % CARD_CORNERS.length];
        const grow = clamp01(lp / 0.5); // first half: grow to full size in its corner
        const move = clamp01((lp - 0.5) / 0.5); // second half: slide past us, off-screen
        const scale = 0.45 + grow * 0.65; // 0.45 → 1.1, then stays that size
        // sits at its corner, then keeps travelling that direction off the edge
        const tx = cx * (1 + move * 2.6);
        const ty = cy * (1 + move * 2.6);
        const opacity = clamp01(lp / 0.14);
        const blur = (1 - clamp01(lp / 0.4)) * 5;
        el.style.transform = `translate3d(-50%,-50%,0) translate(${tx}vw,${ty}vh) scale(${scale})`;
        el.style.opacity = `${opacity}`;
        el.style.filter = blur > 0.1 ? `blur(${blur}px)` : "none";
        el.style.zIndex = `${Math.round(lp * 100)}`;
      }

      // ---- Chapter 3: one-line Dutch map headline, wiping in left → right ----
      if (mapRef.current) {
        const op =
          range(p, cfg.map.fadeIn[0], cfg.map.fadeIn[1]) -
          range(p, cfg.map.fadeOut[0], cfg.map.fadeOut[1]);
        mapRef.current.style.opacity = `${clamp01(op)}`;
      }
      if (mapLineRef.current) {
        // fills the width from the left as the map arrives
        const reveal = range(p, cfg.map.fadeIn[0], cfg.map.fadeIn[1]);
        mapLineRef.current.style.clipPath = `inset(0 ${(1 - reveal) * 100}% 0 0)`;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onMeta);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // ---------------------------------------------------------------------------
  // Reduced motion — no scrubbing; a readable, still layout.
  // ---------------------------------------------------------------------------
  if (reduced) {
    return (
      <section className="relative -mx-2 -mt-2 overflow-hidden bg-black text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(cfg.poster)} alt="" className="h-[70svh] w-full object-cover" />
        <div className="px-6 py-16 sm:px-10">
          <p className="max-w-4xl text-2xl font-medium leading-[1.2] tracking-tight sm:text-4xl">
            {cfg.introText}
          </p>
          <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {cfg.statistics.map((s, i) => (
              <div key={s.label} className={i > 0 ? "lg:border-l lg:border-white/15 lg:pl-8" : ""}>
                <dd className="text-4xl font-medium tracking-tight sm:text-5xl">{s.nr}</dd>
                <dd className="mt-3 text-base text-white/60">{s.label}</dd>
              </div>
            ))}
          </dl>
          <h2 className="mt-20 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            {cfg.blackText}
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cfg.cards.map((c) => (
              <li key={c.title} className="overflow-hidden rounded-3xl border border-white/12 bg-white/[0.06] p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(c.image)} alt="" className="h-40 w-full rounded-2xl object-cover" />
                <h3 className="mt-4 text-xl font-medium tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm text-white/60">{c.body}</p>
                {c.href && (
                  <a href={c.href} className="mt-4 inline-flex rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-950">
                    Bekijk dienst
                  </a>
                )}
              </li>
            ))}
          </ul>
          <h2 className="mt-20 text-4xl font-semibold tracking-tight sm:text-6xl">
            {cfg.mapHeadline.join(" ")}
          </h2>
          {cfg.mapSupporting && <p className="mt-4 text-base text-white/60">{cfg.mapSupporting}</p>}
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // The film.
  // ---------------------------------------------------------------------------
  return (
    <section
      ref={containerRef}
      className="relative -mx-2 -mt-2"
      style={{ height: `${cfg.scrollVh}vh` }}
      aria-label="Mcars cinematic transport film"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-black">
        {/* The one persistent, scroll-controlled film — background of it all */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={asset(cfg.videoSrc)}
          poster={asset(cfg.poster)}
          muted
          playsInline
          preload="auto"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ "webkit-playsinline": "true" } as any)}
        />

        {/* Chapter 0 — the existing hero, now living on top of the film */}
        <div ref={heroRef} className="absolute inset-0 z-30">
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-slate-950/30"
          />

          {/* Logo tab */}
          <div className="absolute top-0 left-1/2 z-20 -translate-x-1/2">
            <div className="relative rounded-b-[1.5rem] bg-white px-6 pt-0.5 pb-2 sm:pt-1 sm:pb-2.5 sm:px-8">
              <Image src="/logo.png" alt="M Cars" width={447} height={447} priority className="h-16 w-auto sm:h-20" />
              <span aria-hidden className="absolute top-0 -left-5 size-5 bg-[radial-gradient(circle_at_0%_100%,transparent_19px,white_20px)]" />
              <span aria-hidden className="absolute top-0 -right-5 size-5 bg-[radial-gradient(circle_at_100%_100%,transparent_19px,white_20px)]" />
            </div>
          </div>

          {/* Nav */}
          <header className="absolute inset-x-0 top-0 z-30">
            <div className="flex w-full items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-5">
              <NavPill />
              <div className="ml-auto flex items-center gap-2">
                <a href="#" className="hidden items-center gap-2 rounded-2xl border border-white/20 bg-white/10 py-2 pr-2 pl-5 text-sm font-medium text-white backdrop-blur-xl transition-colors hover:bg-white/20 sm:flex">
                  Tracking
                  <ArrowChip />
                </a>
                <a href="/offerte" className="flex items-center gap-2 rounded-2xl bg-zinc-950 py-2 pr-2 pl-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
                  Offerte aanvragen
                  <ArrowChip />
                </a>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="relative z-10 flex h-full w-full flex-col justify-end gap-10 px-5 pt-36 pb-10 sm:px-8">
            <div className="max-w-3xl">
              <span className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-xl">
                {cfg.heroBadge}
              </span>
              <h1 className="text-4xl font-light leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {cfg.heroHeadline.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <div aria-hidden className="h-[4.5rem]" />
            </div>
            <div className="lg:pr-80">
              <HeroSearchWidget />
            </div>
          </div>

          {/* Review notch */}
          <div className="absolute right-0 bottom-0 z-20 hidden lg:block">
            <div className="relative rounded-tl-[2rem] bg-white p-3 pb-2 pl-4">
              <span aria-hidden className="absolute -top-5 right-0 size-5 bg-[radial-gradient(circle_at_0%_0%,transparent_19px,white_20px)]" />
              <span aria-hidden className="absolute bottom-0 -left-5 size-5 bg-[radial-gradient(circle_at_0%_0%,transparent_19px,white_20px)]" />
              <GoogleReviews />
            </div>
          </div>
        </div>

        {/* Chapter 1 — company introduction + statistics */}
        <div
          ref={introRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-[9svh] opacity-0 sm:px-10 lg:px-16"
        >
          <div aria-hidden className="absolute inset-x-0 -top-28 bottom-0 -z-10 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
          <p className="max-w-[86vw] text-3xl font-medium leading-[1.12] tracking-tight text-white sm:text-5xl lg:max-w-[80vw] lg:text-[4.2rem]">
            {cfg.introText}
          </p>
          <dl
            ref={statsRef}
            className="mt-12 grid max-w-[86vw] grid-cols-2 gap-x-8 gap-y-10 opacity-0 lg:max-w-5xl lg:grid-cols-4"
          >
            {cfg.statistics.map((s, i) => (
              <div key={s.label} className={i > 0 ? "lg:border-l lg:border-white/20 lg:pl-8" : ""}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">{s.nr}</dd>
                <dd className="mt-3 text-sm text-white/60 sm:text-base">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Chapter 1.5 — the black "cool effect" line */}
        <div
          ref={blackTextRef}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center opacity-0"
        >
          <h2 className="max-w-[1100px] text-[8vw] font-semibold leading-[1.08] tracking-tight text-white sm:text-[6.5vw] lg:text-[5.2vw]">
            <LensDriftText text={cfg.blackText} />
          </h2>
        </div>

        {/* Chapter 2 — each glass card grows in a corner, then fades away */}
        <div className="pointer-events-none absolute inset-0 z-40" style={{ perspective: "1200px" }}>
          {cfg.cards.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute top-1/2 left-1/2 w-[min(420px,82vw)] overflow-hidden rounded-[26px] border border-white/15 bg-white/[0.07] p-5 opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-[22px] sm:p-6"
              style={{ transform: "translate3d(-50%,-50%,0) scale(0.12)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(card.image)}
                alt=""
                className="h-40 w-full rounded-2xl object-cover sm:h-44"
              />
              <div className="mt-5 flex items-center gap-2">
                <span className="text-xs font-medium tracking-[0.2em] text-white/45 uppercase">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-2 text-2xl font-medium leading-tight tracking-tight text-white sm:text-[1.7rem]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{card.body}</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white py-2 pr-2 pl-5 text-sm font-medium text-zinc-950">
                Bekijk dienst
                <span className="flex size-7 items-center justify-center rounded-full bg-zinc-950 text-white">
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Chapter 3 — one Dutch line spanning the full width, wiping in L→R */}
        <div
          ref={mapRef}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-center opacity-0"
        >
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-black/25" />
          <h2
            ref={mapLineRef}
            className="w-full whitespace-nowrap px-[3vw] text-[6.4vw] font-semibold leading-[1] tracking-[-0.02em] text-white"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            {cfg.mapHeadline.join(" ")}
          </h2>
          {cfg.mapSupporting && (
            <p className="mt-4 px-[3vw] text-base text-white/70 sm:text-lg">{cfg.mapSupporting}</p>
          )}
        </div>
      </div>
    </section>
  );
}

/** Lens-drift: each WORD starts blurred/transparent, then sharpens and fades
 *  in one after another. Driven by scroll in the rAF loop (each [data-word]
 *  gets its own filter/opacity), so it plays one-way in and reverses out. */
function LensDriftText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, w) => (
        <span
          key={w}
          data-word
          aria-hidden
          className="mr-[0.28em] inline-block whitespace-nowrap"
          style={{ opacity: 0, willChange: "filter, opacity" }}
        >
          {word}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </>
  );
}

function GoogleReviews() {
  return (
    <a href="#" className="flex items-center gap-4 rounded-2xl px-3 py-2 transition-colors hover:bg-zinc-50">
      <GoogleLogo />
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-zinc-900">4,7</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} />
            ))}
          </div>
        </div>
        <p className="text-sm text-zinc-500">37 Google reviews</p>
      </div>
    </a>
  );
}

function GoogleLogo() {
  return (
    <svg className="size-9" viewBox="0 0 48 48" aria-label="Google">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Star() {
  return (
    <svg className="size-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.94 6.32 6.91.82-5.11 4.75 1.36 6.83L12 17.25l-6.1 3.47 1.36-6.83-5.11-4.75 6.91-.82L12 2z" />
    </svg>
  );
}

function ArrowChip() {
  return (
    <span className="flex size-7 items-center justify-center rounded-full bg-white text-zinc-900">
      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17L17 7M9 7h8v8" />
      </svg>
    </span>
  );
}
