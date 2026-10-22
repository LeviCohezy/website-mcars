"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";

/*
 * Phone / small-tablet version of the homepage "Europe map" card (< lg).
 * The desktop scene (services-philosophy.tsx) is untouched.
 *
 *   rest      compact black card: heading, one line, "Offerte"
 *   approach  as it scrolls in (top at 85% → top of screen) the card opens to a
 *             full-bleed black screen (clip-path, scrubbed, not pinned)
 *   pinned    1.5 screen-heights of scroll (GSAP ScrollTrigger, scrubbed):
 *               heading, line and "Offerte" stay visible throughout
 *               0.00–0.85  film scrubs 0:15.5 → 0:20 of the homepage film
 *                          (only the Europe map: flags light up, routes draw).
 *                          It moves only while you scroll — stop and it stops.
 *               0.75–0.90  tagline, then a short hold
 *   after     page scrolls on into the next section
 *
 * Rendered as an image sequence on a canvas (public/map-frames/001–068.jpg,
 * 15 fps), not a <video>: mobile Safari won't paint frames for a scrubbed
 * video that hasn't been "played", so a video stayed frozen on real phones.
 * Frames load when the section approaches. The 16:9 film is shown wider
 * than the screen and centred, so the map fills a portrait phone.
 */

// 0:15.5–0:20 of the homepage film — only the Europe map with its flags and
// routes, not the truck shots before it — as 68 JPG frames (15 fps).
const FRAME_COUNT = 68;
// Named one by one under the map while scrolling, then "Bekijk onze routes".
const COUNTRIES = [
  { flag: "🇧🇪", name: "België" },
  { flag: "🇪🇸", name: "Spanje" },
  { flag: "🇳🇱", name: "Nederland" },
  { flag: "🇮🇹", name: "Italië" },
  { flag: "🇩🇪", name: "Duitsland" },
  { flag: "🇫🇷", name: "Frankrijk" },
  { flag: "🇱🇺", name: "Luxemburg" },
  { flag: "🇦🇹", name: "Oostenrijk" },
];

const frameSrc = (i: number) => asset(`/map-frames/${String(i + 1).padStart(3, "0")}.jpg`);

export default function MobileMapScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
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
    const canvas = canvasRef.current;
    if (!stage || !card || !intro || !map || !tagline || !canvas) return;

    // Preload the frame sequence; draw a frame as soon as it is available.
    const ctx2d = canvas.getContext("2d");
    const frames: HTMLImageElement[] = [];
    let current = -1;
    const draw = (i: number) => {
      const img = frames[i];
      if (!ctx2d || !img || !img.complete || !img.naturalWidth) return false;
      if (canvas.width !== img.naturalWidth) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
      ctx2d.drawImage(img, 0, 0);
      current = i;
      return true;
    };
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameSrc(i);
      // First frame, or the frame the scroll is waiting on, paints when it lands.
      img.onload = () => {
        if (i === 0 && current < 0) draw(0);
        if (i === film.want) draw(i);
      };
      frames.push(img);
    }
    // Scrub target for the timeline (0 → 1), mapped to a frame index.
    const film = { p: 0, want: 0 };

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
      gsap.set(map, { opacity: 0 });
      gsap.set(tagline, { opacity: 0, y: 16 });
      gsap.set(".mms-country", { opacity: 0 });

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
      // The stage stays pinned 100% longer than the animation: during that last
      // stretch the next section slides up over the map (services-philosophy
      // pulls it up by the same amount).
      ScrollTrigger.create({ trigger: stage, start: "top top", end: "+=250%", pin: true, anticipatePin: 1, invalidateOnRefresh: true });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=150%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(map, { opacity: 1, duration: 0.04 }, 0)
        .to(
          film,
          {
            p: 1,
            duration: 0.85,
            onUpdate: () => {
              const i = Math.round(film.p * (FRAME_COUNT - 1));
              film.want = i;
              if (i !== current) draw(i);
            },
          },
          0,
        )
      // Countries under the map, one at a time while the film plays…
      const names = gsap.utils.toArray<HTMLElement>(".mms-country", stage);
      const slot = 0.78 / names.length;
      names.forEach((el, i) => {
        const at = 0.04 + i * slot;
        tl.fromTo(el, { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: slot * 0.35 }, at);
        if (i < names.length - 1) tl.to(el, { opacity: 0, yPercent: -40, duration: slot * 0.35 }, at + slot * 0.65);
      });
      // …and, as the last beat, the routes button.
      tl.to(names[names.length - 1], { opacity: 0, yPercent: -40, duration: 0.05 }, 0.84)
        .fromTo(tagline, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.06 }, 0.86)
        .to({}, { duration: 0.12 }); // short hold before the pin releases
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
        {/* Film layer: 0:15.5–0:20 of the homepage film (map only) as a frame sequence, scrubbed by the scroll.
            Rendered wider than the screen (16:9 on portrait) and centred so the
            map reads large; the edges fade into the black card. */}
        <div ref={mapRef} className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-0">
          {mapReady && (
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              aria-hidden
              className="aspect-video w-[170vw] max-w-none flex-none [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent),linear-gradient(to_right,transparent,black_18%,black_82%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in] sm:w-[130vw]"
            />
          )}
        </div>

        {/* Under the map: the countries, big and one at a time, then the routes button */}
        <div className="absolute inset-x-0 bottom-[9svh] flex h-20 items-center justify-center">
          {COUNTRIES.map((c) => (
            <p key={c.name} className="mms-country absolute flex items-center gap-4 opacity-0">
              <span className="text-4xl leading-none">{c.flag}</span>
              <span className="font-display text-6xl leading-none tracking-wide text-white">{c.name}</span>
            </p>
          ))}
          <div ref={taglineRef} className="absolute opacity-0">
            <Link
              href="/routes"
              className="inline-flex items-center gap-2 rounded-full bg-white py-3 pr-3 pl-6 text-sm font-medium text-zinc-950"
            >
              Bekijk onze routes
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Resting card content (centred; its height defines the compact card) */}
        <div ref={introRef} className="absolute inset-x-7 top-0 py-6 pr-3 pl-6 sm:inset-x-10 sm:p-8">
          {/* Two-tone like the desktop map title ("Mcars transporteert auto's in heel Europa.") */}
          <h3 className="text-[1.7rem] leading-[1.15] font-medium tracking-tight">
            <span className="text-white">De regio&apos;s </span>
            <span className="text-zinc-500">waar we rijden.</span>
          </h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-zinc-400">
            Vaste corridors vanuit onze thuisbasis in België, elke week opnieuw gereden.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
