"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { MAP_W, MAP_H, anchors, countries } from "@/data/europe-map";

const HUB = "BEL";

// Luxembourg is not in the generated anchor set; same Mercator projection.
const ANCHORS: Record<string, [number, number]> = {
  ...anchors,
  LUX: [354.4, 675.7],
};

// Only the served region: Poland and everything south/west of it.
const SHOWN = new Set([
  "PRT", "ESP", "AND", "FRA", "BEL", "NLD", "LUX", "DEU", "POL", "CZE",
  "SVK", "AUT", "CHE", "ITA", "SVN", "HRV", "HUN", "BIH", "SRB", "MNE",
  "ALB", "MKD", "GRC", "BGR", "ROU",
]);

// Tight window around the shown countries (bbox 31..842 × 491..1089 + margin).
const VIEW = { x: 19, y: 479, w: 834, h: 622 };

// The core corridors, in the order the loop travels them.
const CORE = [
  { iso3: "NLD", nl: "Nederland" },
  { iso3: "DEU", nl: "Duitsland" },
  { iso3: "LUX", nl: "Luxemburg" },
  { iso3: "CHE", nl: "Zwitserland" },
  { iso3: "ITA", nl: "Italië" },
  { iso3: "ESP", nl: "Spanje" },
  { iso3: "FRA", nl: "Frankrijk" },
];

const DUTCH_NAMES: Record<string, string> = {
  ALB: "Albanië", BIH: "Bosnië-Herzegovina", BGR: "Bulgarije",
  AUT: "Oostenrijk", CZE: "Tsjechië", FRA: "Frankrijk", DEU: "Duitsland",
  GRC: "Griekenland", HRV: "Kroatië", HUN: "Hongarije", ITA: "Italië",
  SVK: "Slowakije", MKD: "Noord-Macedonië", BEL: "België", AND: "Andorra",
  LUX: "Luxemburg", MNE: "Montenegro", NLD: "Nederland", POL: "Polen",
  PRT: "Portugal", ROU: "Roemenië", SVN: "Slovenië", ESP: "Spanje",
  CHE: "Zwitserland", SRB: "Servië",
};

const flagEmoji = (iso2: string) =>
  String.fromCodePoint(
    ...[...iso2.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0))
  );

const iso2Of = (iso3: string) =>
  countries.find((c) => c.iso3 === iso3)?.iso2 ?? "";

// Curved corridor from the hub to a destination anchor.
function routePath(to: string) {
  const [x1, y1] = ANCHORS[HUB];
  const [x2, y2] = ANCHORS[to];
  const k = 0.18;
  const cx = (x1 + x2) / 2 - (y2 - y1) * k;
  const cy = (y1 + y2) / 2 + (x2 - x1) * k;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

// West-to-east sweep: each country fades in based on where it sits.
function sweepDelay(d: string) {
  const x = parseFloat(d.slice(1));
  return Math.round(((x - VIEW.x) / VIEW.w) * 500);
}

const CYCLE_MS = 3200;
const SWEEP_SETTLE_MS = 1300;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

// Which countries sit on which side of the map in the sideCountries layout.
const SIDE_LEFT = ["BEL", "NLD", "DEU", "LUX"];
const SIDE_RIGHT = ["CHE", "ITA", "ESP", "FRA"];

// The truck-with-flag cutouts towing each country name through the marquee.
const MARQUEE_TRUCKS = [
  { file: "truck-flag-belgie", name: "België" },
  { file: "truck-flag-nederland", name: "Nederland" },
  { file: "truck-flag-duitsland", name: "Duitsland" },
  { file: "truck-flag-luxemburg", name: "Luxemburg" },
  { file: "truck-flag-zwitserland", name: "Zwitserland" },
  { file: "truck-flag-italie", name: "Italië" },
  { file: "truck-flag-spanje", name: "Spanje" },
  { file: "truck-flag-frankrijk", name: "Frankrijk" },
];

export default function EuropeNetworkLight({
  withTrucks = false,
  sideCountries = false,
  marquee = false,
  dark = false,
}: {
  withTrucks?: boolean;
  sideCountries?: boolean;
  marquee?: boolean;
  dark?: boolean;
}) {
  const [pinned, setPinned] = useState<string | null>(null);
  const [autoIdx, setAutoIdx] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [inView, setInView] = useState(false);
  const [settled, setSettled] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );

  // Reveal once when roughly half the section scrolls into view.
  useEffect(() => {
    if (reducedMotion) {
      setInView(true);
      setSettled(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  // After the entrance sweep, drop the per-country delays so hover stays snappy.
  useEffect(() => {
    if (!inView || settled) return;
    const t = setTimeout(() => setSettled(true), SWEEP_SETTLE_MS);
    return () => clearTimeout(t);
  }, [inView, settled]);

  // Advance the corridor loop unless the visitor pinned a country.
  useEffect(() => {
    if (!inView || pinned || reducedMotion) return;
    const id = setInterval(
      () => setAutoIdx((i) => (i + 1) % CORE.length),
      CYCLE_MS
    );
    return () => clearInterval(id);
  }, [inView, pinned, reducedMotion]);

  const activeIso = pinned ?? CORE[autoIdx].iso3;
  const activeIsCore = CORE.some((c) => c.iso3 === activeIso);
  const showRoute = settled && activeIsCore && activeIso !== HUB;

  const routes = useMemo(
    () => Object.fromEntries(CORE.map((c) => [c.iso3, routePath(c.iso3)])),
    []
  );
  const shown = useMemo(
    () => countries.filter((c) => SHOWN.has(c.iso3)),
    []
  );

  const activeAnchor = ANCHORS[activeIso] as [number, number] | undefined;
  const tooltipIso = hovered && hovered !== activeIso ? hovered : null;

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const riseClass = `transition-all duration-700 ease-out motion-reduce:transition-none ${
    inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
  }`;
  const riseDelay = (ms: number) => ({ transitionDelay: `${ms}ms` });

  return (
    <section
      ref={sectionRef}
      id="netwerk"
      className={`px-5 py-16 sm:px-8 sm:py-24 ${
        dark ? "overflow-hidden rounded-3xl bg-zinc-950" : ""
      }`}
    >
      {/* ── Heading in the house style: label, two-tone title, copy aside ── */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
        <div className={riseClass}>
          <p className="mb-4 text-sm font-medium tracking-widest text-zinc-400 uppercase">
            Ons netwerk
          </p>
          <h2 className="text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
            <span className={dark ? "text-white" : "text-zinc-950"}>
              Vaste corridors{" "}
            </span>
            <span className={dark ? "text-zinc-500" : "text-zinc-400"}>
              door heel Europa.
            </span>
          </h2>
        </div>
        <p
          className={`text-base leading-relaxed ${
            dark ? "text-zinc-400" : "text-zinc-500"
          } ${riseClass}`}
          style={riseDelay(150)}
        >
          Wij importeren en exporteren voertuigen met vaste corridors vanuit
          onze thuisbasis in België. Van een oldtimer uit Italië tot een vloot
          richting Spanje: uw transport rijdt op routes die we elke week
          opnieuw rijden.
        </p>
      </div>

      {/* ── Country chips (on the sideCountries layout they give way to the
             flag lists flanking the map; the marquee replaces them) ── */}
      {!marquee && (
        <div
          className={`mt-8 flex flex-wrap gap-2 ${
            sideCountries ? "xl:hidden " : ""
          }${riseClass}`}
          style={riseDelay(300)}
        >
          <Chip
            label="België"
            flag={flagEmoji("BE")}
            tag="thuisbasis"
            active={activeIso === HUB}
            onEnter={() => setPinned(HUB)}
            onLeave={() => setPinned(null)}
          />
          {CORE.map((c) => (
            <Chip
              key={c.iso3}
              label={c.nl}
              flag={flagEmoji(iso2Of(c.iso3))}
              active={activeIso === c.iso3}
              onEnter={() => setPinned(c.iso3)}
              onLeave={() => setPinned(null)}
            />
          ))}
        </div>
      )}

      {/* ── Big centered map ── */}
      <div
        className={`relative mx-auto mt-12 w-full transition-all duration-1000 ease-out motion-reduce:transition-none sm:mt-16 ${
          sideCountries
            ? "max-w-7xl xl:grid xl:grid-cols-[13rem_minmax(0,1fr)_13rem] xl:items-center xl:gap-8"
            : "max-w-5xl"
        } ${inView ? "scale-100 opacity-100" : "scale-[0.96] opacity-0"}`}
      >
        {sideCountries && (
          <CountryList
            isos={SIDE_LEFT}
            side="left"
            inView={inView}
            activeIso={activeIso}
            setPinned={setPinned}
          />
        )}
        <div
          ref={mapRef}
          className={`relative w-full ${
            sideCountries ? "mx-auto max-w-5xl xl:col-start-2" : ""
          }`}
          style={{ aspectRatio: `${VIEW.w} / ${VIEW.h}` }}
          onPointerMove={onPointerMove}
          onPointerLeave={() => {
            setHovered(null);
            setCursor(null);
          }}
        >
          <svg
            viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
            className="h-full w-full"
            role="img"
            aria-label="Kaart van Europa met onze transportroutes"
          >
            {shown.map((c) => {
              const isCore =
                c.iso3 === HUB || CORE.some((k) => k.iso3 === c.iso3);
              const isActive = c.iso3 === activeIso;
              const isHovered = c.iso3 === hovered;
              return (
                <path
                  key={c.iso3}
                  data-iso={c.iso3}
                  d={c.d}
                  className="cursor-pointer"
                  style={{
                    opacity: inView ? 1 : 0,
                    transition: settled
                      ? "fill 500ms"
                      : `fill 500ms, opacity 600ms ease-out ${sweepDelay(c.d)}ms`,
                  }}
                  fill={
                    dark
                      ? isActive
                        ? "#e4e4e7"
                        : isHovered
                          ? "#52525b"
                          : isCore
                            ? "#3f3f46"
                            : "#27272a"
                      : isActive
                        ? "#18181b"
                        : isHovered
                          ? "#d4d4d8"
                          : isCore
                            ? "#c8c8cd"
                            : "#ececee"
                  }
                  stroke={dark ? "#18181b" : "#ffffff"}
                  strokeWidth={isActive ? 1.5 : 1}
                  onPointerEnter={() => {
                    setHovered(c.iso3);
                    if (isCore) setPinned(c.iso3);
                  }}
                  onPointerLeave={() => {
                    setHovered((h) => (h === c.iso3 ? null : h));
                    setPinned((p) => (p === c.iso3 ? null : p));
                  }}
                />
              );
            })}

            {/* corridor of the active country */}
            {showRoute && (
              <g key={activeIso}>
                <path
                  d={routes[activeIso]}
                  pathLength={1}
                  fill="none"
                  stroke={dark ? "#fafafa" : "#18181b"}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeDasharray="1"
                  className="route-draw"
                  style={{
                    filter: dark
                      ? "drop-shadow(0 0 5px rgb(255 255 255 / 0.7))"
                      : "drop-shadow(0 1px 3px rgb(0 0 0 / 0.3))",
                  }}
                />
                {!reducedMotion &&
                  (withTrucks ? (
                    <g>
                      <animateMotion
                        dur="2.4s"
                        repeatCount="indefinite"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                        rotate="auto"
                        path={routes[activeIso]}
                      />
                      <image
                        href="/truck-map.png"
                        x={-25}
                        y={-25}
                        width={50}
                        height={50}
                        style={{
                          filter: dark
                            ? "brightness(1.25) drop-shadow(0 2px 4px rgb(0 0 0 / 0.7))"
                            : "drop-shadow(0 2px 3px rgb(0 0 0 / 0.35))",
                        }}
                      />
                    </g>
                  ) : (
                    <circle r={5} fill={dark ? "#fafafa" : "#18181b"}>
                      <animateMotion
                        dur="2.4s"
                        repeatCount="indefinite"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                        path={routes[activeIso]}
                      />
                    </circle>
                  ))}
              </g>
            )}

            {/* hub marker — always pulsing */}
            {settled && (
              <g>
                {!reducedMotion && (
                  <circle
                    cx={ANCHORS[HUB][0]}
                    cy={ANCHORS[HUB][1]}
                    r={9}
                    fill="none"
                    stroke={dark ? "#ffffff" : "#18181b"}
                    strokeWidth={2}
                    className="hub-ping"
                  />
                )}
                <circle
                  cx={ANCHORS[HUB][0]}
                  cy={ANCHORS[HUB][1]}
                  r={6}
                  fill={dark ? "#ffffff" : "#18181b"}
                  stroke={dark ? "#3f3f46" : "#ffffff"}
                  strokeWidth={2}
                />
              </g>
            )}

            {/* destination marker */}
            {showRoute && activeAnchor && (
              <circle
                cx={activeAnchor[0]}
                cy={activeAnchor[1]}
                r={5}
                fill={dark ? "#ffffff" : "#18181b"}
                stroke={dark ? "#a1a1aa" : "#ffffff"}
                strokeWidth={2}
              />
            )}
          </svg>

          {/* active-country label pinned to its anchor */}
          {settled && activeAnchor && (
            <div
              key={activeIso}
              className="label-pop pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)]"
              style={{
                left: `${((activeAnchor[0] - VIEW.x) / VIEW.w) * 100}%`,
                top: `${((activeAnchor[1] - VIEW.y) / VIEW.h) * 100}%`,
              }}
            >
              <div
                className={`flex items-center gap-2 rounded-full py-1.5 pr-4 pl-2 whitespace-nowrap shadow-lg ${
                  dark ? "bg-white" : "bg-zinc-950"
                }`}
              >
                <span className="text-lg leading-none">
                  {flagEmoji(iso2Of(activeIso))}
                </span>
                <span
                  className={`text-sm font-medium ${
                    dark ? "text-zinc-950" : "text-white"
                  }`}
                >
                  {DUTCH_NAMES[activeIso] ?? activeIso}
                </span>
                <span className={`text-xs ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                  {activeIso === HUB ? "thuisbasis" : "import & export"}
                </span>
              </div>
            </div>
          )}

          {/* cursor tooltip for every other country */}
          {tooltipIso && cursor && (
            <div
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+12px)]"
              style={{ left: cursor.x, top: cursor.y }}
            >
              <div
                className={`flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-2 whitespace-nowrap shadow-lg ring-1 ${
                  dark
                    ? "bg-zinc-800/95 ring-white/10"
                    : "bg-white ring-zinc-200"
                }`}
              >
                <span className="text-base leading-none">
                  {flagEmoji(iso2Of(tooltipIso))}
                </span>
                <span
                  className={`text-sm font-medium ${
                    dark ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {DUTCH_NAMES[tooltipIso] ?? tooltipIso}
                </span>
                <span className={`text-xs ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                  op aanvraag
                </span>
              </div>
            </div>
          )}
        </div>
        {sideCountries && (
          <CountryList
            isos={SIDE_RIGHT}
            side="right"
            inView={inView}
            activeIso={activeIso}
            setPinned={setPinned}
          />
        )}
      </div>

      {/* ── Truck marquee under the map: flag trucks driving right, each
             towing its country name ── */}
      {marquee && (
        <div
          aria-hidden
          className={`mt-14 overflow-hidden sm:mt-20 ${riseClass}`}
          style={riseDelay(450)}
        >
          <div className="animate-marquee-reverse flex w-max items-center gap-14">
            {[...MARQUEE_TRUCKS, ...MARQUEE_TRUCKS].map((truck, i) => (
              <div key={i} className="flex items-center gap-14">
                <div className="flex items-center gap-8">
                  {/* sized so the letters match the flag height in the image */}
                  <span
                    className={`text-[3.6rem] leading-none font-medium tracking-tight ${
                      dark ? "text-zinc-600" : "text-zinc-300"
                    }`}
                  >
                    {truck.name}
                  </span>
                  <img
                    src={`/countryflags/${truck.file}.png`}
                    alt=""
                    loading="lazy"
                    className="h-40 w-auto"
                  />
                </div>
                {/* separator between two countries */}
                <span
                  className={`size-3 rounded-full ${
                    dark ? "bg-zinc-700" : "bg-zinc-300"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* Countries flanking the map: a big flag with the name next to it, nothing
   else. Hovering pins the country, same as the chips. */
function CountryList({
  isos,
  side,
  inView,
  activeIso,
  setPinned,
}: {
  isos: string[];
  side: "left" | "right";
  inView: boolean;
  activeIso: string;
  setPinned: (iso: string | null) => void;
}) {
  return (
    <div
      className={`hidden flex-col justify-center gap-10 xl:flex ${
        side === "left" ? "items-end" : "items-start"
      }`}
    >
      {isos.map((iso, i) => {
        const active = iso === activeIso;
        return (
          <div
            key={iso}
            className="transition-all duration-700 ease-out motion-reduce:transition-none"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(16px)",
              transitionDelay: inView
                ? `${400 + (side === "left" ? i : i + isos.length) * 110}ms`
                : "0ms",
            }}
          >
            <button
              type="button"
              onPointerEnter={() => setPinned(iso)}
              onPointerLeave={() => setPinned(null)}
              onFocus={() => setPinned(iso)}
              onBlur={() => setPinned(null)}
              className="group flex cursor-pointer items-center gap-4"
            >
              <span
                className={`text-4xl leading-none transition-transform duration-300 motion-reduce:transition-none ${
                  active ? "scale-110" : "group-hover:scale-105"
                }`}
              >
                {flagEmoji(iso2Of(iso))}
              </span>
              <span
                className={`text-[1.65rem] font-medium tracking-tight transition-colors duration-300 ${
                  active
                    ? "text-zinc-950"
                    : "text-zinc-400 group-hover:text-zinc-600"
                }`}
              >
                {DUTCH_NAMES[iso]}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Chip({
  label,
  flag,
  tag,
  active,
  onEnter,
  onLeave,
}: {
  label: string;
  flag: string;
  tag?: string;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <button
      type="button"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className={`flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-2.5 text-sm font-medium transition-colors duration-300 ${
        active
          ? "border-zinc-950 bg-zinc-950 text-white"
          : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
      }`}
    >
      <span className="text-base leading-none">{flag}</span>
      {label}
      {tag && <span className="text-xs text-zinc-400">{tag}</span>}
    </button>
  );
}
