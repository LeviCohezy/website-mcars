"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import HeroSearchWidget from "./hero-search-widget";
import { INTRO_EVENT } from "./intro-loader";
import NavPill from "./nav-pill";

export default function Hero({ videoSrc = "/hero.mp4" }: { videoSrc?: string } = {}) {
  const [revealed, setRevealed] = useState(false);

  // Wait for the intro hand-off; if the intro already ran (client-side
  // navigation) or never will, reveal right away / after a safety timeout.
  useEffect(() => {
    if (
      window.__mcarsIntroDone ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const t = setTimeout(() => setRevealed(true), 0);
      return () => clearTimeout(t);
    }
    const onDone = () => setRevealed(true);
    window.addEventListener(INTRO_EVENT, onDone);
    const fallback = setTimeout(onDone, 4500);
    return () => {
      window.removeEventListener(INTRO_EVENT, onDone);
      clearTimeout(fallback);
    };
  }, []);

  const rise = (delay: string) =>
    `transition-all duration-600 ease-out motion-reduce:transition-none ${delay} ${
      revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`;

  return (
    <section
      className={`hero-image relative flex min-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-[2rem] transition-transform delay-100 duration-700 ease-out will-change-transform motion-reduce:transition-none ${
        revealed ? "scale-100" : "scale-[0.7]"
      }`}
    >
      {/* Background video settles from a slight zoom as the intro lifts */}
      <video
        className={`absolute inset-0 size-full object-cover transition-transform duration-[1200ms] ease-out motion-reduce:transition-none ${
          revealed ? "scale-100" : "scale-105"
        }`}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-slate-950/30"
      />

      {/* Logo tab with concave curves into the top edge */}
      <div
        className={`absolute top-0 left-1/2 z-20 -translate-x-1/2 transition-transform delay-[650ms] duration-450 ease-out motion-reduce:transition-none ${
          revealed ? "translate-y-0" : "-translate-y-[120%]"
        }`}
      >
        <div className="relative rounded-b-[1.5rem] bg-white px-6 pt-0.5 pb-2 sm:pt-1 sm:pb-2.5 sm:px-8">
          <Image
            src="/logo.png"
            alt="M Cars"
            width={447}
            height={447}
            priority
            className="h-16 w-auto sm:h-20"
          />
          <span aria-hidden className="absolute top-0 -left-5 size-5 bg-[radial-gradient(circle_at_0%_100%,transparent_19px,white_20px)]" />
          <span aria-hidden className="absolute top-0 -right-5 size-5 bg-[radial-gradient(circle_at_100%_100%,transparent_19px,white_20px)]" />
        </div>
      </div>

      {/* Nav */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div
          className={`flex w-full items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-5 transition-all delay-[850ms] duration-600 ease-out motion-reduce:transition-none ${
            revealed ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <NavPill />

          <div className="ml-auto flex items-center gap-2">
            <a
              href="#"
              className="hidden items-center gap-2 rounded-2xl border border-white/20 bg-white/10 py-2 pr-2 pl-5 text-sm font-medium text-white backdrop-blur-xl transition-colors hover:bg-white/20 sm:flex"
            >
              Tracking
              <ArrowChip />
            </a>
            <a
              href="/offerte"
              className="flex items-center gap-2 rounded-2xl bg-zinc-950 py-2 pr-2 pl-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Offerte aanvragen
              <ArrowChip />
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex w-full flex-1 flex-col justify-end gap-10 px-5 pt-36 pb-10 sm:px-8">
        <div className="max-w-3xl">
          <span
            className={`mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-xl ${rise("delay-[950ms]")}`}
          >
            Trusted by 3000+ clients
          </span>
          <h1
            className={`text-4xl font-light leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl ${rise("delay-[1050ms]")}`}
          >
            Autotransport dat verder
            <br />
            gaat dan van A naar B.
          </h1>
          {/* Spacer keeps the title where the CTA row used to sit */}
          <div aria-hidden className="h-[4.5rem]" />
        </div>

        {/* Form bar along the hero bottom; clears the review notch on the right */}
        <div className={`lg:pr-80 ${rise("delay-[1150ms]")}`}>
          <HeroSearchWidget />
        </div>
      </div>

      {/* Bottom-right notch with the Google review score */}
      <div
        className={`absolute right-0 bottom-0 z-20 hidden transition-transform delay-[650ms] duration-450 ease-out motion-reduce:transition-none lg:block ${
          revealed ? "translate-y-0" : "translate-y-[120%]"
        }`}
      >
        <div className="relative rounded-tl-[2rem] bg-white p-3 pb-2 pl-4">
          <span aria-hidden className="absolute -top-5 right-0 size-5 bg-[radial-gradient(circle_at_0%_0%,transparent_19px,white_20px)]" />
          <span aria-hidden className="absolute bottom-0 -left-5 size-5 bg-[radial-gradient(circle_at_0%_0%,transparent_19px,white_20px)]" />
          <GoogleReviews />
        </div>
      </div>
    </section>
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
