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
 *               0.00–0.15  card copy fades out
 *               0.10–0.85  film scrubs from 0:15 to 0:20 of the homepage
 *                          film (truck front → Europe map with flags/routes)
 *               0.75–0.90  tagline, then a short hold
 *   after     page scrolls on into the next section
 *
 * The clip (public/map-mobile.mp4) is that 5 s segment re-encoded with a
 * keyframe on every frame so scrubbing is smooth in both directions. It is
 * only mounted when the section approaches. The 16:9 film is shown wider
 * than the screen and centred, so the map fills a portrait phone.
 */

// Length of the clip in seconds (0:15–0:20 of cinematic-scrub.mp4).
const CLIP_SECONDS = 5;

export default function MobileMapScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
    const video = videoRef.current;
    if (!stage || !card || !intro || !map || !tagline || !video) return;

    // iOS only paints scrubbed frames after the video has played once.
    const unlock = () => {
      video.play().then(() => video.pause()).catch(() => {});
      window.removeEventListener("touchstart", unlock);
    };
    window.addEventListener("touchstart", unlock, { passive: true });
    // Scrub target for the timeline; written to currentTime on update.
    const film = { t: 0 };

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
        .to(map, { opacity: 1, duration: 0.12 }, 0.08)
        .to(
          film,
          {
            t: CLIP_SECONDS - 0.05,
            duration: 0.75,
            onUpdate: () => {
              if (video.readyState >= 1 && Math.abs(video.currentTime - film.t) > 0.01) video.currentTime = film.t;
            },
          },
          0.1,
        )
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
      window.removeEventListener("touchstart", unlock);
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
        {/* Film layer: 0:15–0:20 of the homepage film, scrubbed by the scroll.
            Rendered wider than the screen (16:9 on portrait) and centred so the
            map reads large; the edges fade into the black card. */}
        <div ref={mapRef} className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-0">
          {mapReady && (
            <video
              ref={videoRef}
              src={asset("/map-mobile.mp4")}
              poster={asset("/map-mobile-poster.jpg")}
              muted
              playsInline
              preload="auto"
              aria-hidden
              className="aspect-video w-[170vw] max-w-none flex-none object-cover [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent),linear-gradient(to_right,transparent,black_18%,black_82%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in] sm:w-[130vw]"
            />
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
