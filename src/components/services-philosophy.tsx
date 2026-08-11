"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import RegionMapDark from "./region-map-dark";

const REGIONS = [
  { iso3: "BEL", flag: "🇧🇪", label: "België", tag: "thuisbasis" },
  { iso3: "NLD", flag: "🇳🇱", label: "Nederland" },
  { iso3: "DEU", flag: "🇩🇪", label: "Duitsland" },
  { iso3: "LUX", flag: "🇱🇺", label: "Luxemburg" },
  { iso3: "CHE", flag: "🇨🇭", label: "Zwitserland" },
  { iso3: "ITA", flag: "🇮🇹", label: "Italië" },
  { iso3: "ESP", flag: "🇪🇸", label: "Spanje" },
  { iso3: "FRA", flag: "🇫🇷", label: "Frankrijk" },
];


// Split over the two sides of the expanded map, hub first.
const SIDE_LEFT = ["BEL", "NLD", "DEU", "LUX"];
const SIDE_RIGHT = ["CHE", "ITA", "ESP", "FRA"];

// Word-wave title over the expanded map, in the problems-section style.
const MAP_TITLE_WORDS = [
  { word: "Mcars", dark: true },
  { word: "transporteert", dark: true },
  { word: "auto's", dark: true },
  { word: "in", dark: false },
  { word: "heel", dark: false },
  { word: "Europa.", dark: false },
];

const rowServices = [
  { label: "Oldtimers & specials", href: "/diensten/oldtimers" },
  { label: "Niet-rijdende voertuigen", href: "/diensten/niet-rijdend" },
  { label: "Spoed & repatriëring", href: "/diensten/spoed" },
];

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

function ArrowChip({ className = "size-9" }: { className?: string }) {
  return (
    <span
      className={`flex flex-none items-center justify-center rounded-full bg-white text-zinc-950 ${className}`}
    >
      <svg
        className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 17L17 7M9 7h8v8" />
      </svg>
    </span>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="absolute top-4 left-4 flex items-center gap-1.5 rounded-lg bg-zinc-950/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
      <span className="size-1.5 rounded-full bg-white" aria-hidden />
      {label}
    </span>
  );
}

function PhotoCard({
  img,
  tag,
  caption,
  href,
  className = "",
}: {
  img: string;
  tag: string;
  caption: string;
  href: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group relative block rounded-xl transition-[filter] duration-300 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:outline-none ${className}`}
      style={{
        backgroundImage: `linear-gradient(to top, rgb(9 9 11 / 0.65), rgb(9 9 11 / 0.1) 45%), url(/about/${img}.png), linear-gradient(160deg, #3f3f46, #18181b)`,
        backgroundSize: "cover, cover, cover",
        backgroundPosition: "center, center, center",
      }}
    >
      <Tag label={tag} />
      <span className="absolute bottom-4 left-4 max-w-[75%] text-base leading-snug font-semibold text-white sm:text-lg">
        {caption}
      </span>
      <span className="absolute right-4 bottom-4">
        <ArrowChip />
      </span>
      <span
        aria-hidden
        className="sonar-ring pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-zinc-950/60 opacity-0"
      />
    </a>
  );
}

export default function ServicesPhilosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const mapOverlayRef = useRef<HTMLDivElement>(null);
  const naturalHeight = useRef(0);
  const [inView, setInView] = useState(false);
  // True once the black screen is complete — starts the map title word-wave.
  const [mapShown, setMapShown] = useState(false);
  // Countries currently on a live route on the map — lights up their tag.
  const [activeIsos, setActiveIsos] = useState<string[]>([]);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );

  // Entrance fires once, when half the section is on screen (or, on small
  // viewports where 50% never fits, when it fills half the viewport).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const halfViewport =
          entry.intersectionRect.height > window.innerHeight * 0.5;
        if (entry.intersectionRatio >= 0.5 || halfViewport) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: [0.25, 0.5] }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Scroll-scrubbed expansion: while the track is pinned, the dark card grows
  // from its natural size to a full-viewport black screen and its content
  // fades away. Styles are written imperatively to keep scrolling smooth.
  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;

    const apply = () => {
      const track = trackRef.current;
      const sticky = stickyRef.current;
      const card = cardRef.current;
      const content = cardContentRef.current;
      if (!track || !sticky || !card || !content) return;

      const vh = window.innerHeight;
      const rect = track.getBoundingClientRect();

      if (!naturalHeight.current) {
        card.style.height = "";
        naturalHeight.current = card.offsetHeight;
      }
      const h0 = naturalHeight.current;

      // The card pins once it reaches the vertical center of the viewport.
      const pinTop = Math.max(0, (vh - h0) / 2);
      sticky.style.top = `${pinTop}px`;

      const scrolled = pinTop - rect.top;
      const total = rect.height - h0;
      // Finish growing at 90% of the pinned distance; the short remainder is
      // the beat where the full map holds before the section releases.
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / (total * 0.9))) : 0;
      const overlay = mapOverlayRef.current;

      if (p <= 0) {
        card.style.position = "";
        card.style.top = "";
        card.style.left = "";
        card.style.width = "";
        card.style.height = "";
        card.style.borderRadius = "";
        sticky.style.height = "";
        content.style.pointerEvents = "";
        content.style.opacity = "";
        if (overlay) {
          overlay.style.opacity = "0";
          overlay.style.transform = "scale(0.94)";
          overlay.style.pointerEvents = "none";
        }
        setMapShown(false);
        naturalHeight.current = card.offsetHeight;
        return;
      }

      const ease = p * p * (3 - 2 * p);
      const w0 = sticky.clientWidth;
      const vw = document.documentElement.clientWidth;
      const w = w0 + (vw - w0) * ease;
      const h = h0 + (vh - h0) * ease;
      // The sticky box keeps the card's in-flow footprint; the card itself
      // goes absolute inside it and grows outward from that centered spot.
      sticky.style.height = `${h0}px`;
      card.style.position = "absolute";
      card.style.top = `${(h0 - h) / 2}px`;
      card.style.left = `${(w0 - w) / 2}px`;
      card.style.width = `${w}px`;
      card.style.height = `${h}px`;
      card.style.borderRadius = `${12 * (1 - ease)}px`;
      // The whole resting content — header, country tags, logo and CTA —
      // makes way for the map and its own title and flag lists.
      content.style.opacity = `${Math.max(0, 1 - p * 2.2)}`;
      content.style.pointerEvents = p > 0.45 ? "none" : "";
      // The map takes the stage as the black screen completes.
      if (overlay) {
        const g = Math.min(1, Math.max(0, (p - 0.5) / 0.45));
        overlay.style.opacity = `${g}`;
        overlay.style.transform = `scale(${0.94 + 0.06 * g})`;
        overlay.style.pointerEvents = g > 0.85 ? "auto" : "none";
        setMapShown(g > 0.05);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    const onResize = () => {
      naturalHeight.current = 0;
      onScroll();
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reducedMotion]);

  const visible = inView || reducedMotion;
  const enter = (order: number) => ({
    className: `transition-all duration-700 ease-out ${
      visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    }`,
    style: { transitionDelay: visible ? `${order * 120}ms` : "0ms" },
  });

  return (
    <section ref={sectionRef} className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="w-full">
        {/* Header row */}
        <div
          {...enter(0)}
          className={`grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16 ${enter(0).className}`}
        >
          <div>
            <p className="mb-4 text-sm font-medium tracking-widest text-zinc-400 uppercase">
              Onze diensten
            </p>
            <h2 className="text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
              <span className="text-zinc-950">Voor elk voertuig </span>
              <span className="text-zinc-400">een oplossing.</span>
            </h2>
          </div>
          <p className="text-base leading-relaxed text-zinc-500">
            Kwaliteit, betrouwbaarheid en een persoonlijke aanpak. Van import en
            export tot volledige vloten: elke opdracht krijgt dezelfde zorg, van
            offerte tot levering. Zo maken we autotransport eenvoudig, duidelijk
            en zorgeloos — voor bedrijven én particulieren.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_0.95fr_1fr]">
          <div {...enter(1)}>
            <PhotoCard
              img="fleet"
              tag="Vloot"
              caption="Vloottransport voor uw volledige wagenpark"
              href="/diensten/vloot"
              className="h-full min-h-[300px] lg:min-h-[430px]"
            />
          </div>

          <div {...enter(2)} className={`grid grid-rows-2 gap-4 ${enter(2).className}`}>
            <PhotoCard
              img="import"
              tag="Import"
              caption="Import vanuit heel Europa"
              href="/diensten/import"
              className="min-h-[200px]"
            />
            <PhotoCard
              img="export"
              tag="Export"
              caption="Export naar elke bestemming"
              href="/diensten/export"
              className="min-h-[200px]"
            />
          </div>

          <div {...enter(3)} className={`grid grid-rows-3 gap-4 ${enter(3).className}`}>
            {rowServices.map((service) => (
              <a
                key={service.label}
                href={service.href}
                className="group relative flex items-start justify-between gap-4 rounded-xl bg-zinc-100 p-5 transition-colors duration-300 hover:bg-zinc-200/70 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <span className="self-center text-xl leading-snug font-medium tracking-tight text-zinc-950 sm:text-2xl">
                  {service.label}
                </span>
                <ArrowChip className="size-8" />
                <span
                  aria-hidden
                  className="sonar-ring pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-zinc-950/50 opacity-0"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Dark brand card — pins and grows into a full-black screen on scroll.
            It sits in normal flow with the same gap as the other bento boxes;
            the spacer div below the sticky provides the scrub distance (it
            must be real content: sticky constrains to the content box, so
            padding would give it no room to travel). The entrance here is
            opacity-only: a translate on this wrapper would create a containing
            block and also break the pinning. */}
        <div
          ref={trackRef}
          className={`relative mt-4 transition-opacity duration-700 ease-out ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: visible ? "480ms" : "0ms" }}
        >
          <div ref={stickyRef} className={reducedMotion ? "" : "sticky z-10"}>
            <div
              ref={cardRef}
              className="relative w-full overflow-hidden rounded-xl bg-zinc-950 p-6 sm:p-8"
            >
              <div ref={cardContentRef} className="relative z-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                De regio&apos;s waar we rijden:
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
                Vaste corridors vanuit onze thuisbasis in België, elke week
                opnieuw gereden. Van de Benelux tot diep in Zuid-Europa.
              </p>
            </div>
            <div className="flex max-w-sm flex-wrap gap-2 sm:justify-end">
              {REGIONS.map((region) => {
                const active = activeIsos.includes(region.iso3);
                return (
                  <span
                    key={region.label}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-500 ${
                      active
                        ? "bg-white text-zinc-950"
                        : "bg-white/10 text-white/85"
                    }`}
                  >
                    <span className="text-sm leading-none">{region.flag}</span>
                    {region.label}
                    {region.tag && (
                      <span className={active ? "text-zinc-500" : "text-white/45"}>
                        {region.tag}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          <div>
          <div className="flex justify-center py-10 sm:py-12">
            <img
              src="/logo.png"
              alt="Mcars"
              className="h-20 w-auto invert mix-blend-screen sm:h-24"
            />
          </div>

          <div className="flex justify-end">
            <a
              href="#netwerk"
              className="group flex items-center gap-2.5 rounded-full bg-white py-2.5 pr-3 pl-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              <span className="size-1.5 rounded-full bg-zinc-950" aria-hidden />
              Bekijk ons netwerk
              <svg
                className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
          </div>
              </div>

              {/* Region map — hidden in the resting card, revealed by the
                  scroll expansion once the black screen is complete. */}
              {!reducedMotion && (
                <div
                  ref={mapOverlayRef}
                  className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-8 px-6 pt-36 pb-8 opacity-0 sm:pt-40 xl:justify-between xl:px-10 2xl:px-14"
                  style={{ transform: "scale(0.94)" }}
                >
                  {/* Title over the map, word-wave like the problems section */}
                  <h3 className="absolute inset-x-0 top-8 z-20 px-6 text-center text-3xl font-medium leading-[1.15] tracking-tight sm:top-12 sm:text-4xl lg:text-5xl">
                    {MAP_TITLE_WORDS.map((t, i) => (
                      <span key={i} className="whitespace-pre">
                        <span
                          className={`inline-block transition-all duration-500 ease-out motion-reduce:transition-none ${
                            t.dark ? "text-white" : "text-zinc-500"
                          } ${
                            mapShown
                              ? "translate-y-0 opacity-100"
                              : "translate-y-6 opacity-0"
                          }`}
                          style={{
                            transitionDelay: mapShown ? `${i * 70}ms` : "0ms",
                          }}
                        >
                          {t.word}
                        </span>{" "}
                      </span>
                    ))}
                  </h3>
                  <SideCountries side="left" activeIsos={activeIsos} />
                  <RegionMapDark onActiveChange={setActiveIsos} />
                  <SideCountries side="right" activeIsos={activeIsos} />
                </div>
              )}
            </div>
          </div>
          {!reducedMotion && <div aria-hidden className="h-[110vh]" />}
        </div>
      </div>
    </section>
  );
}

/* Countries flanking the expanded map: a big flag with the name next to it,
   nothing else. A country lights up while a live route touches it. */
function SideCountries({
  side,
  activeIsos,
}: {
  side: "left" | "right";
  activeIsos: string[];
}) {
  const isos = side === "left" ? SIDE_LEFT : SIDE_RIGHT;
  const regions = isos.map((iso) => REGIONS.find((r) => r.iso3 === iso)!);
  return (
    <div className="hidden shrink-0 flex-col items-start justify-center gap-20 xl:flex">
      {regions.map((region) => {
        const active = activeIsos.includes(region.iso3);
        return (
          <div key={region.iso3} className="flex items-center gap-5">
            <span
              className={`text-5xl leading-none transition-transform duration-500 motion-reduce:transition-none ${
                active ? "scale-110" : ""
              }`}
            >
              {region.flag}
            </span>
            <span
              className={`font-display text-[3.3rem] leading-none tracking-wide transition-colors duration-500 ${
                active ? "text-white" : "text-zinc-500"
              }`}
            >
              {region.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
