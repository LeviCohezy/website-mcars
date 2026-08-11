"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const TEXT_MAIN = "Van aanvraag tot levering.";
const TEXT_SUB = "Zo verloopt uw transport, stap voor stap.";

const stepsData = [
  {
    nr: "01",
    title: "Offerte aanvragen",
    desc: "Via de website, telefoon of WhatsApp — binnen 24 uur hebt u prijs én planning",
    img: "01",
  },
  {
    nr: "02",
    title: "Goedkeuring",
    desc: "U keurt de offerte goed en wij leggen alles voor u vast",
    img: "02",
  },
  {
    nr: "03",
    title: "Transport inplannen",
    desc: "De ophaaldatum wordt vastgelegd; de chauffeur belt wanneer hij ter plaatse zal zijn",
    img: "03",
  },
  {
    nr: "04",
    title: "Ophaling",
    desc: "Waar u wil — ter plaatse maken we de CMR op en fotograferen we de wagen",
    img: "04",
  },
  {
    nr: "05",
    title: "Levering",
    desc: "We bellen wanneer we aankomen en leveren de wagen af waar u dat vroeg",
    img: "05",
  },
  {
    nr: "06",
    title: "Betaling",
    desc: "Particulieren betalen vóór de ophaling, bedrijven betalen op factuur",
    img: "06",
  },
];

// Share of the sticky scroll spent on the cards rising into view;
// the rest drives the sideways scroll.
const RISE_PHASE = 0.35;
// How far below their final spot the cards start, in vh.
const RISE_DISTANCE = 55;
// Share of the sticky scroll where the last card rests fully in view
// before the section releases.
const END_HOLD = 0.1;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function ProcessSection() {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState(0);
  const [rise, setRise] = useState(0);
  const [x, setX] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const wrapper = wrapperRef.current;
        const track = trackRef.current;
        if (!wrapper || !track) return;
        const top = wrapper.getBoundingClientRect().top;
        const vh = window.innerHeight;

        // Word reveal while the section scrolls into view; done once it sticks
        setReveal(clamp(1 - top / (vh * 0.85)));

        // Sticky progress: cards rise, slide sideways, then rest on the last card
        const total = wrapper.offsetHeight - vh;
        const p = clamp(-top / total);
        setRise(clamp(p / RISE_PHASE));
        const slideP = clamp((p - RISE_PHASE) / (1 - RISE_PHASE - END_HOLD));
        const max = track.scrollWidth - track.clientWidth;
        setX(-slideP * max);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  const effReveal = reducedMotion ? 1 : reveal;
  const mainWords = TEXT_MAIN.split(" ");
  const subWords = TEXT_SUB.split(" ");
  const wordP = effReveal * (mainWords.length + subWords.length);

  const heading = (
    <div className="relative w-full px-5 sm:px-8">
      <h2 className="text-3xl font-medium leading-[1.15] tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">
        {mainWords.map((word, i) => (
          <span
            key={i}
            className="transition-opacity duration-200"
            style={{ opacity: 0.12 + 0.88 * clamp(wordP - i) }}
          >
            {word}{" "}
          </span>
        ))}
      </h2>
      <p className="mt-3 text-lg text-zinc-500 sm:text-xl">
        {subWords.map((word, i) => (
          <span
            key={i}
            className="transition-opacity duration-200"
            style={{ opacity: 0.12 + 0.88 * clamp(wordP - mainWords.length - i) }}
          >
            {word}{" "}
          </span>
        ))}
      </p>
    </div>
  );

  // Reduced motion: no sticky choreography, just a native horizontal scroller.
  if (reducedMotion) {
    return (
      <section id="proces" className="py-16 sm:py-20">
        {heading}
        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8">
          {stepsData.map((step) => (
            <StepCard key={step.nr} {...step} className="snap-start" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="proces" ref={wrapperRef} className="relative h-[350vh]">
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden pt-14 sm:pt-20">
        {/* Truck outline behind the cards; they cover it as they rise */}
        <img
          src="/truck-outline.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-[55%] left-1/2 w-[72%] max-w-4xl -translate-x-1/2 -translate-y-1/2 select-none opacity-20 mix-blend-multiply [filter:brightness(1.06)]"
        />

        {heading}

        <div
          ref={trackRef}
          className="mt-10 flex gap-5 px-5 will-change-transform sm:mt-14 sm:px-8"
          style={{
            transform: `translate(${x}px, ${(1 - rise) * RISE_DISTANCE}vh)`,
          }}
        >
          {stepsData.map((step) => (
            <StepCard key={step.nr} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  nr,
  title,
  desc,
  img,
  className = "",
}: {
  nr: string;
  title: string;
  desc: string;
  img: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative aspect-[4/5] w-[85%] flex-none overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:shadow-lg motion-safe:hover:shadow-zinc-950/15 sm:w-[46%] lg:w-[27%] ${className}`}
    >
      {/* Photo — scales subtly on hover; the baked-in line graphics scale with it */}
      <div
        aria-hidden
        className="absolute inset-0 transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        style={{
          backgroundImage: `url(/services/${img}.jpg), linear-gradient(160deg, #3f3f46, #18181b)`,
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
        }}
      />
      {/* Legibility gradient: top stays open, bottom anchors the text */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgb(9_9_11/0.85),rgb(9_9_11/0.38)_28%,rgb(9_9_11/0.08)_52%,rgb(9_9_11/0.06))]"
      />

      {/* Big step number */}
      <span className="absolute top-5 left-6 text-5xl font-medium tracking-tight text-white/90 sm:text-6xl">
        {nr}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-sm font-medium tracking-widest text-white/60 uppercase">
          Stap {Number(nr)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-xl leading-snug font-semibold text-white uppercase text-balance sm:text-2xl">
          {title}
        </h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-snug text-white/80">
          {desc}
        </p>
      </div>
    </div>
  );
}
