"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { countries } from "@/data/europe-map";
import { ANCHORS, DUTCH_NAMES, ROUTE_ISOS, SHOWN, curveBetween } from "./region-map-dark";

/*
 * Phone / small-tablet version of the homepage "Europe map" card (< lg).
 * The desktop scene (services-philosophy.tsx) is untouched.
 *
 *   rest      compact black card: heading, one line, "Offerte"
 *   approach  as it scrolls in (top at 85% → top of screen) the card opens to a
 *             full-bleed black screen (clip-path, scrubbed, not pinned)
 *   pinned    1.5 screen-heights of scroll (GSAP ScrollTrigger, scrubbed):
 *               0.00–0.15  card copy fades out
 *               0.10–1.00  map fades in with a slow Ken Burns zoom
 *               0.25–0.65  corridors draw
 *               0.30–0.70  the 8 corridor countries light up one by one
 *               0.75–0.90  tagline, then a short hold
 *   after     page scrolls on into the next section
 *
 * Performance: no video — the map is a static SVG (same Natural Earth data
 * as desktop), mounted only when the section approaches. Every tweened
 * property is transform, opacity, clip-path or stroke-dashoffset, and the
 * timeline is scrubbed (no per-frame React state).
 */

// Corridors drawn in the scene (subset of the desktop playlist, Belgium-centred).
const CORRIDORS: [string, string][] = [
  ["BEL", "DEU"],
  ["NLD", "BEL"],
  ["BEL", "FRA"],
  ["FRA", "ESP"],
  ["DEU", "CHE"],
  ["CHE", "ITA"],
];

// Portrait crop around the corridor countries (Spain → Germany/Italy).
const BOX = { x: 70, y: 540, w: 520, h: 500 };

// Marker order: from the home base outwards.
const MARKERS = ["BEL", "NLD", "LUX", "DEU", "FRA", "CHE", "ITA", "ESP"].filter((iso) => ROUTE_ISOS.includes(iso));

export default function MobileMapScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  // The SVG map is only mounted once the section is about a screen away.
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMapReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    const stage = stageRef.current;
    const card = cardRef.current;
    const intro = introRef.current;
    const map = mapRef.current;
    const tagline = taglineRef.current;
    if (!stage || !card || !intro || !map || !tagline) return;

    gsap.registerPlugin(ScrollTrigger);

    // Compact card = the full-screen black layer clipped to the intro's box,
    // anchored to the top of the stage so it sits right under the previous
    // homepage box (no white band above it) and grows downward as it opens.
    const restClip = () => {
      const sh = stage.clientHeight;
      const ch = intro.offsetHeight;
      const bottom = Math.max(0, sh - ch);
      // Same side margins as the other homepage boxes (page p-2 + section px-5 / sm:px-8).
      const x = window.innerWidth >= 640 ? 40 : 28;
      return `inset(0px ${x}px ${bottom}px ${x}px round 12px)`;
    };

    const ctx = gsap.context(() => {
      gsap.set(card, { clipPath: restClip() });
      gsap.set(map, { opacity: 0, scale: 1.08, transformOrigin: "50% 45%" });
      gsap.set(".mms-route", { strokeDashoffset: 1 });
      gsap.set(".mms-marker", { opacity: 0, scale: 0.4, transformOrigin: "50% 50%", transformBox: "fill-box" });
      gsap.set(tagline, { opacity: 0, y: 16 });

      // 1) Approach (not pinned): the compact card opens as it scrolls in, so
      //    it is a full-bleed black screen exactly when it reaches the top —
      //    no white stage around a small card.
      gsap.fromTo(
        card,
        { clipPath: restClip },
        {
          clipPath: "inset(0px 0px 0px 0px round 0px)",
          ease: "none",
          scrollTrigger: { trigger: stage, start: "top 85%", end: "top top", scrub: 0.6, invalidateOnRefresh: true },
        },
      );

      // 2) Pinned for 1.5 screen-heights: copy out, map in, corridors, markers, tagline.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(intro, { opacity: 0, y: -24, duration: 0.15 }, 0)
        .to(map, { opacity: 1, duration: 0.2 }, 0.1)
        .to(map, { scale: 1.2, xPercent: -2, duration: 0.9 }, 0.1)
        .to(".mms-route", { strokeDashoffset: 0, duration: 0.18, stagger: 0.04 }, 0.25)
        .to(".mms-marker", { opacity: 1, scale: 1, duration: 0.08, stagger: 0.05, ease: "back.out(2)" }, 0.3)
        .to(tagline, { opacity: 1, y: 0, duration: 0.15 }, 0.75)
        .to({}, { duration: 0.1 }); // short hold before the pin releases
    }, stage);

    // Layout above may still settle (fonts/images): re-measure once loaded.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 400);
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [mapReady]);

  return (
    // -mx-7 / sm:-mx-10 cancel the section + page padding so the stage spans the
    // full viewport width (opened card = truly full-bleed). The margins live on
    // this wrapper, not on the pinned stage: GSAP moves a pinned element's
    // margins to its pin-spacer and would freeze the stage at the narrower width.
    <div className="-mx-7 mt-4 sm:-mx-10">
    <div ref={stageRef} className="relative h-[100svh] w-full overflow-hidden">
      <div ref={cardRef} className="absolute inset-0 bg-zinc-950 [clip-path:inset(0_28px_65%_28px_round_12px)] sm:[clip-path:inset(0_40px_65%_40px_round_12px)]">
        {/* Map layer (fades in once the card has opened) */}
        <div ref={mapRef} className="absolute inset-0 flex items-center justify-center opacity-0 will-change-transform">
          {mapReady && (
            <svg
              viewBox={`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`}
              className="h-auto w-full max-w-[34rem] [mask-image:radial-gradient(ellipse_72%_68%_at_50%_50%,black_58%,transparent_100%)]"
              aria-hidden
            >
              {countries
                .filter((c) => SHOWN.has(c.iso3))
                .map((c) => (
                  <path
                    key={c.iso3}
                    d={c.d}
                    fill={ROUTE_ISOS.includes(c.iso3) ? "#27272a" : "#141417"}
                    stroke="#3f3f46"
                    strokeWidth={0.8}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              {CORRIDORS.map(([a, b]) => (
                <path
                  key={`${a}-${b}`}
                  className="mms-route"
                  d={curveBetween(a, b)}
                  fill="none"
                  stroke="rgb(255 255 255 / 0.75)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  strokeDasharray="1"
                />
              ))}
              {MARKERS.map((iso) => {
                const [x, y] = ANCHORS[iso];
                return (
                  <g key={iso} className="mms-marker">
                    <circle cx={x} cy={y} r={11} fill="rgb(255 255 255 / 0.14)" />
                    <circle cx={x} cy={y} r={4.5} fill="#fff" />
                    <text x={x + 10} y={y - 9} fill="rgb(255 255 255 / 0.85)" fontSize={15} fontFamily="inherit">
                      {DUTCH_NAMES[iso]}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Tagline over the finished map */}
        <p
          ref={taglineRef}
          className="absolute inset-x-6 bottom-[10svh] text-center text-2xl font-light tracking-tight text-white opacity-0"
        >
          25+ landen <span className="text-white/40">·</span> elke week onderweg
        </p>

        {/* Resting card content (centred; its height defines the compact card) */}
        <div ref={introRef} className="absolute inset-x-7 top-0 p-6 sm:inset-x-10 sm:p-8">
          <h3 className="text-2xl font-medium tracking-tight text-white">De regio&apos;s waar we rijden</h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Vaste corridors vanuit onze thuisbasis in België, elke week opnieuw gereden.
          </p>
          <Link
            href="/offerte"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white py-2.5 pr-3 pl-5 text-sm font-medium text-zinc-950"
          >
            Offerte
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
