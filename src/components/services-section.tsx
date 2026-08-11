"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const TEXT_MAIN = "Voor elk voertuig de juiste aanpak.";
const TEXT_SUB = "Ontdek onze transportoplossingen in België en heel Europa.";

const services = [
  {
    nr: "01",
    title: "Import",
    full: "Import België & Europa",
    desc: "Vanuit heel Europa naar België",
    href: "/diensten/import",
  },
  {
    nr: "02",
    title: "Export",
    full: "Export België & Europa",
    desc: "Van België naar heel Europa",
    href: "/diensten/export",
  },
  {
    nr: "03",
    title: "Oldtimers & speciale voertuigen",
    full: "Oldtimer & speciaal voertuigtransport",
    desc: "Zorgvuldig vervoer voor bijzondere wagens",
    href: "/diensten/oldtimers",
  },
  {
    nr: "04",
    title: "Niet-rijdende voertuigen",
    full: "Transport van niet-rijdende voertuigen",
    desc: "Ook zonder draaiende motor veilig geladen",
    href: "/diensten/niet-rijdend",
  },
  {
    nr: "05",
    title: "Spoed & repatriëring",
    full: "Spoedtransport & repatriëring",
    desc: "Snel ter plaatse, ook in het buitenland",
    href: "/diensten/spoed",
  },
  {
    nr: "06",
    title: "Vloot & wagenpark",
    full: "Vloot- & wagenparktransport",
    desc: "Meerdere voertuigen in één transport",
    href: "/diensten/vloot",
  },
  {
    nr: "07",
    title: "Eventtransport",
    full: "Eventtransport",
    desc: "Op tijd en onberispelijk op elk event",
    href: "/diensten/event",
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

export default function ServicesSection() {
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

  // Keyboard users tab through cards the animation may have moved off-screen:
  // jump the page scroll to the position that brings the focused card into view.
  const scrollCardIntoView = (index: number) => {
    if (reducedMotion) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const total = wrapper.offsetHeight - window.innerHeight;
    const slideP = index / (services.length - 1);
    const p = RISE_PHASE + slideP * (1 - RISE_PHASE - END_HOLD);
    const top = wrapper.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.round(top + p * total) });
  };

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
      <section id="diensten" className="py-16 sm:py-20">
        {heading}
        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8">
          {services.map((service, i) => (
            <ServiceCard key={service.nr} {...service} className="snap-start" onCardFocus={() => scrollCardIntoView(i)} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="diensten" ref={wrapperRef} className="relative h-[350vh]">
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
          {services.map((service, i) => (
            <ServiceCard
              key={service.nr}
              {...service}
              onCardFocus={() => scrollCardIntoView(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  nr,
  title,
  full,
  desc,
  href,
  className = "",
  onCardFocus,
}: {
  nr: string;
  title: string;
  full: string;
  desc: string;
  href: string;
  className?: string;
  onCardFocus: () => void;
}) {
  return (
    <a
      href={href}
      aria-label={`${full} — ${desc}. Bekijk service.`}
      onFocus={onCardFocus}
      className={`group relative aspect-[4/5] w-[85%] flex-none overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:hover:-translate-y-1.5 motion-safe:hover:shadow-lg motion-safe:hover:shadow-zinc-950/15 sm:w-[46%] lg:w-[27%] ${className}`}
    >
      {/* Photo — scales subtly on hover; the baked-in line graphics scale with it */}
      <div
        aria-hidden
        className="absolute inset-0 transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        style={{
          backgroundImage: `url(/services/${nr}.jpg), linear-gradient(160deg, #3f3f46, #18181b)`,
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
        }}
      />
      {/* Legibility gradient: top stays open, bottom anchors the text */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgb(9_9_11/0.85),rgb(9_9_11/0.38)_28%,rgb(9_9_11/0.08)_52%,rgb(9_9_11/0.06))]"
      />
      {/* Slightly deeper anchor on hover */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgb(9_9_11/0.5),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <span className="absolute top-6 left-6 text-sm font-medium text-white/80">
        {nr}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="line-clamp-2 text-xl leading-snug font-semibold text-white uppercase text-balance sm:text-2xl">
          {title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-white/80">
          {desc}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="relative text-sm font-medium text-white after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 group-hover:after:scale-x-100">
            Bekijk service
          </span>
          <span className="flex size-10 flex-none items-center justify-center rounded-full bg-white text-zinc-950">
            <svg
              className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}
