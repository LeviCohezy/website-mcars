"use client";

/**
 * ScrollVideoSection — a lighter, reusable scroll-controlled film section.
 *
 * A single <video> is pinned full-screen and its timeline is driven by scroll
 * (rAF + lerp, never real playback), with one headline that fades in over it.
 * Used for the "grote vloot" chapter after the location picker.
 */

import { useEffect, useRef, useSyncExternalStore } from "react";
import { asset } from "@/lib/asset";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const range = (p: number, a: number, b: number) =>
  a === b ? (p >= b ? 1 : 0) : clamp01((p - a) / (b - a));
const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function ScrollVideoSection({
  videoSrc,
  poster,
  headline,
  scrollVh = 400,
  lerp = 0.1,
  fadeIn = [0.18, 0.36],
  fadeOut = [0.72, 0.9],
}: {
  videoSrc: string;
  poster: string;
  headline: string;
  scrollVh?: number;
  lerp?: number;
  fadeIn?: [number, number];
  fadeOut?: [number, number];
}) {
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
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
    const loop = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? clamp01(-rect.top / scrollable) : 0;

      const duration = durationRef.current;
      if (duration > 0) {
        const target = p * duration;
        let rendered = renderedRef.current;
        rendered += (target - rendered) * lerp;
        if (Math.abs(target - rendered) < 0.004) rendered = target;
        renderedRef.current = rendered;
        if (video.readyState >= 2 && Math.abs(video.currentTime - rendered) > 0.01) {
          video.currentTime = rendered;
        }
      }

      if (textRef.current) {
        const op = range(p, fadeIn[0], fadeIn[1]) - range(p, fadeOut[0], fadeOut[1]);
        const ty =
          (1 - range(p, fadeIn[0], fadeIn[1])) * 44 - range(p, fadeOut[0], fadeOut[1]) * 30;
        textRef.current.style.opacity = `${clamp01(op)}`;
        textRef.current.style.transform = `translate3d(0,${ty}px,0)`;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onMeta);
    };
  }, [reduced, lerp, fadeIn, fadeOut]);

  if (reduced) {
    return (
      <section className="relative -mx-2 overflow-hidden bg-black text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(poster)} alt="" className="h-[70svh] w-full object-cover" />
        <h2 className="px-6 py-16 text-3xl font-semibold tracking-tight sm:px-10 sm:text-5xl">
          {headline}
        </h2>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative -mx-2" style={{ height: `${scrollVh}vh` }}>
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={asset(videoSrc)}
          poster={asset(poster)}
          muted
          playsInline
          preload="auto"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ "webkit-playsinline": "true" } as any)}
        />
        <div
          ref={textRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center px-6 opacity-0 sm:px-10 lg:px-16"
        >
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/65 via-black/20 to-black/30" />
          <h2 className="max-w-[15ch] text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {headline}
          </h2>
        </div>
      </div>
    </section>
  );
}
