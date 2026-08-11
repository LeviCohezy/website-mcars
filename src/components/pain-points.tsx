"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const pains = [
  {
    nr: "01",
    title: "Onduidelijke planning",
    body: "Wanneer wordt de wagen opgehaald? Vandaag, morgen, ergens deze week?",
    agitation: {
      img: "05",
      title: "Je dag staat on hold",
      body: "Een halve dag vrijhouden voor een ophaling die pas 's avonds aankomt.",
    },
  },
  {
    nr: "02",
    title: "Weinig updates",
    body: "Eens de wagen vertrokken is, blijft het stil tot aan de levering.",
    agitation: {
      img: "02",
      title: "Zelf achter nieuws bellen",
      body: "Waar zit de wagen nu? Je belt zelf naar de planning, de chauffeur en weer terug.",
    },
  },
  {
    nr: "03",
    title: "Versnipperde communicatie",
    body: "Telefoontjes, mails en tussenpersonen — niemand heeft het volledige overzicht.",
    agitation: {
      img: "04",
      title: "Drie keer hetzelfde verhaal",
      body: "Aan elke schakel opnieuw uitleggen wat er moet gebeuren.",
    },
  },
];

const CYCLE_MS = 4000;

const TITLE_WORDS = [
  { word: "Autotransport", dark: true },
  { word: "kost", dark: true },
  { word: "vaak", dark: true },
  { word: "meer", dark: false },
  { word: "tijd", dark: false },
  { word: "en", dark: false },
  { word: "afstemming", dark: false },
  { word: "dan", dark: false },
  { word: "nodig", dark: false },
];

// File-stack roles: front file sits lowest, the files behind it each peek
// out above the one in front — like folders in a drawer.
const STACK_POS = [
  "top-[7.5rem] z-30 bg-zinc-950",
  "top-[6rem] z-20 bg-zinc-800",
  "top-[4.5rem] z-10 bg-zinc-700",
];

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function PainPoints() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [inView, setInView] = useState(false);
  const [settled, setSettled] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );

  // Entrance runs once, when the card row is (almost) fully in view.
  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.9 }
    );
    io.observe(cards);
    return () => io.disconnect();
  }, []);

  // Once the staggered entrance has played out, clear the per-element
  // delays so the shuffle loop transitions without them.
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setSettled(true), 2000);
    return () => clearTimeout(t);
  }, [inView]);

  // With reduced motion there is no entrance to wait for.
  const visible = inView || reducedMotion;

  // The shuffle loop only starts once the section is on screen.
  useEffect(() => {
    if (reducedMotion || !inView) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % pains.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [reducedMotion, inView]);

  const next = () => setIdx((i) => (i + 1) % pains.length);

  return (
    <section className="overflow-x-clip px-5 py-16 sm:px-8 sm:py-24">
      {/* Responsive folder silhouettes (objectBoundingBox = scales with the card) */}
      <svg className="absolute size-0" aria-hidden>
        <defs>
          <clipPath id="folder-shape" clipPathUnits="objectBoundingBox">
            <path d="M0,0.055 Q0,0 0.055,0 L0.50,0 Q0.525,0 0.54,0.02 L0.585,0.065 Q0.60,0.085 0.625,0.085 L0.945,0.085 Q1,0.085 1,0.14 L1,0.945 Q1,1 0.945,1 L0.055,1 Q0,1 0,0.945 Z" />
          </clipPath>
          <clipPath id="folder-shape-mirror" clipPathUnits="objectBoundingBox">
            <path d="M1,0.055 Q1,0 0.945,0 L0.50,0 Q0.475,0 0.46,0.02 L0.415,0.065 Q0.40,0.085 0.375,0.085 L0.055,0.085 Q0,0.085 0,0.14 L0,0.945 Q0,1 0.055,1 L0.945,1 Q1,1 1,0.945 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="w-full">
        {/* Wave: every word rises and fades in with its own delay */}
        <h2 className="max-w-2xl text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
          {TITLE_WORDS.map((t, i) => (
            <span key={i} className="whitespace-pre">
              <span
                className={`inline-block transition-all duration-500 ease-out ${
                  t.dark ? "text-zinc-950" : "text-zinc-400"
                } ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{
                  transitionDelay: visible && !settled ? `${i * 70}ms` : "0ms",
                }}
              >
                {t.word}
              </span>{" "}
            </span>
          ))}
        </h2>

        <div
          ref={cardsRef}
          className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:ml-auto lg:w-[70%]"
        >
          {/* Folder with the pain points as stacked files */}
          <button
            type="button"
            onClick={next}
            aria-label="Volgend probleem tonen"
            className={`relative block aspect-[5/4] w-full cursor-pointer bg-zinc-100 text-left transition-[transform,opacity] delay-200 duration-700 ease-out focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-inset focus-visible:outline-none ${
              visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{ clipPath: "url(#folder-shape)" }}
          >
            <span className="absolute top-4 left-7 text-base font-medium text-zinc-500">
              Problemen
            </span>

            {pains.map((pain, i) => {
              const role = (i - idx + pains.length) % pains.length;
              return (
                <div
                  key={pain.nr}
                  aria-hidden={role !== 0}
                  className={`absolute inset-x-5 bottom-5 flex flex-col justify-end rounded-2xl p-7 transition-all duration-700 ${STACK_POS[role]} ${
                    visible ? "translate-x-0" : "translate-x-[140%]"
                  }`}
                  style={{
                    // Files fly in from the side one by one, back file first;
                    // afterwards the delay is cleared so the shuffle stays snappy.
                    transitionDelay:
                      visible && !settled
                        ? `${500 + (pains.length - 1 - role) * 250}ms`
                        : "0ms",
                  }}
                >
                  <div
                    className={`transition-opacity duration-300 ${
                      role === 0 ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <h3 className="text-2xl leading-snug font-semibold text-white">
                      {pain.title}
                    </h3>
                    <p className="mt-2.5 text-lg leading-relaxed text-zinc-400">
                      {pain.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </button>

          {/* Agitation photo card — mirrored folder shape, crossfades in sync */}
          <div
            className={`relative aspect-[5/4] overflow-hidden transition-[transform,opacity] delay-300 duration-700 ease-out ${
              visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{ clipPath: "url(#folder-shape-mirror)" }}
          >
            {pains.map((pain, i) => (
              <div
                key={pain.nr}
                aria-hidden={i !== idx}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === idx ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgb(9 9 11 / 0.85), rgb(9 9 11 / 0.25) 45%, rgb(9 9 11 / 0.1)), url(/services/${pain.agitation.img}.jpg), linear-gradient(160deg, #3f3f46, #18181b)`,
                    backgroundSize: "cover, cover, cover",
                    backgroundPosition: "center, center, center",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-7 pr-16">
                  <p className="text-2xl leading-snug font-semibold text-white">
                    {pain.agitation.title}
                  </p>
                  <p className="mt-2.5 text-lg leading-relaxed text-white/80">
                    {pain.agitation.body}
                  </p>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={next}
              aria-label="Volgende situatie tonen"
              className="absolute right-4 bottom-4 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white text-zinc-950 transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
