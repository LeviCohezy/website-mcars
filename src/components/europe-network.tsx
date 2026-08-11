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

// The eight core corridors, in the order the loop travels them.
const CORE = [
  { iso3: "NLD", nl: "Nederland" },
  { iso3: "DEU", nl: "Duitsland" },
  { iso3: "POL", nl: "Polen" },
  { iso3: "CHE", nl: "Zwitserland" },
  { iso3: "ITA", nl: "Italië" },
  { iso3: "ESP", nl: "Spanje" },
  { iso3: "FRA", nl: "Frankrijk" },
];

const DUTCH_NAMES: Record<string, string> = {
  ALB: "Albanië", BIH: "Bosnië-Herzegovina", BGR: "Bulgarije", DNK: "Denemarken",
  IRL: "Ierland", EST: "Estland", AUT: "Oostenrijk", CZE: "Tsjechië",
  FIN: "Finland", FRA: "Frankrijk", DEU: "Duitsland", GRC: "Griekenland",
  HRV: "Kroatië", HUN: "Hongarije", ITA: "Italië", LVA: "Letland",
  BLR: "Wit-Rusland", LTU: "Litouwen", SVK: "Slowakije", MKD: "Noord-Macedonië",
  BEL: "België", AND: "Andorra", LUX: "Luxemburg", MNE: "Montenegro",
  NLD: "Nederland", NOR: "Noorwegen", POL: "Polen", PRT: "Portugal",
  ROU: "Roemenië", MDA: "Moldavië", SVN: "Slovenië", ESP: "Spanje",
  SWE: "Zweden", CHE: "Zwitserland", GBR: "Verenigd Koninkrijk",
  UKR: "Oekraïne", SRB: "Servië",
};

const flagEmoji = (iso2: string) =>
  String.fromCodePoint(
    ...[...iso2.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0))
  );

const iso2Of = (iso3: string) =>
  countries.find((c) => c.iso3 === iso3)?.iso2 ?? "";

// Curved corridor from the hub to a destination anchor.
function routePath(to: string) {
  const [x1, y1] = anchors[HUB];
  const [x2, y2] = anchors[to];
  const k = 0.18;
  const cx = (x1 + x2) / 2 - (y2 - y1) * k;
  const cy = (y1 + y2) / 2 + (x2 - x1) * k;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

const CYCLE_MS = 3200;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function EuropeNetwork() {
  const [pinned, setPinned] = useState<string | null>(null);
  const [autoIdx, setAutoIdx] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );

  // Advance the corridor loop unless the visitor pinned a country.
  useEffect(() => {
    if (pinned || reducedMotion) return;
    const id = setInterval(
      () => setAutoIdx((i) => (i + 1) % CORE.length),
      CYCLE_MS
    );
    return () => clearInterval(id);
  }, [pinned, reducedMotion]);

  const activeIso = pinned ?? CORE[autoIdx].iso3;
  const activeIsCore = CORE.some((c) => c.iso3 === activeIso);
  const showRoute = activeIsCore && activeIso !== HUB;

  const routes = useMemo(
    () => Object.fromEntries(CORE.map((c) => [c.iso3, routePath(c.iso3)])),
    []
  );

  const activeAnchor = anchors[activeIso] as [number, number] | undefined;
  const tooltipIso = hovered && hovered !== activeIso ? hovered : null;

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section id="netwerk" className="px-0 py-10 sm:py-14">
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950">
        {/* soft glow behind the map side */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_60%_at_72%_45%,rgb(255_255_255/0.07),transparent_70%)]"
        />

        <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-6 lg:p-14">
          {/* ── Copy + country chips ─────────────────────────── */}
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-sm font-medium tracking-widest text-zinc-500 uppercase">
              Ons netwerk
            </p>
            <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
              Actief in heel Europa
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400">
              Wij importeren en exporteren voertuigen in elk land van Europa,
              met vaste corridors vanuit onze thuisbasis in België. Van een
              oldtimer uit Italië tot een vloot richting Polen: uw transport
              rijdt op routes die we elke week opnieuw rijden.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
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

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-zinc-800 pt-8">
              {[
                ["37", "landen in Europa"],
                ["8", "vaste corridors"],
                ["1", "aanspreekpunt"],
              ].map(([nr, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-3xl font-medium text-white">{nr}</dd>
                  <dd className="mt-1 text-sm text-zinc-500">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Interactive map ──────────────────────────────── */}
          <div
            ref={mapRef}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
            style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
            onPointerMove={onPointerMove}
            onPointerLeave={() => {
              setHovered(null);
              setCursor(null);
            }}
          >
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="h-full w-full"
              role="img"
              aria-label="Kaart van Europa met onze transportroutes"
            >
              {countries.map((c) => {
                const isCore =
                  c.iso3 === HUB || CORE.some((k) => k.iso3 === c.iso3);
                const isActive = c.iso3 === activeIso;
                const isHovered = c.iso3 === hovered;
                return (
                  <path
                    key={c.iso3}
                    data-iso={c.iso3}
                    d={c.d}
                    className="cursor-pointer transition-[fill] duration-500"
                    fill={
                      isActive
                        ? "#e4e4e7"
                        : isHovered
                          ? "#52525b"
                          : isCore
                            ? "#3f3f46"
                            : "#27272a"
                    }
                    fillOpacity={isActive ? 0.85 : 1}
                    stroke={isActive ? "#ffffff" : "#18181b"}
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
                    stroke="#fafafa"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeDasharray="1"
                    className="route-draw"
                    style={{
                      filter: "drop-shadow(0 0 5px rgb(255 255 255 / 0.7))",
                    }}
                  />
                  {!reducedMotion && (
                    <circle r={5} fill="#ffffff">
                      <animateMotion
                        dur="2.4s"
                        repeatCount="indefinite"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                        path={routes[activeIso]}
                      />
                    </circle>
                  )}
                </g>
              )}

              {/* hub marker — always pulsing */}
              <g>
                {!reducedMotion && (
                  <circle
                    cx={anchors[HUB][0]}
                    cy={anchors[HUB][1]}
                    r={9}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="hub-ping"
                  />
                )}
                <circle
                  cx={anchors[HUB][0]}
                  cy={anchors[HUB][1]}
                  r={6}
                  fill="#ffffff"
                  stroke="#3f3f46"
                  strokeWidth={2}
                />
              </g>

              {/* destination marker */}
              {showRoute && activeAnchor && (
                <circle
                  cx={activeAnchor[0]}
                  cy={activeAnchor[1]}
                  r={5}
                  fill="#ffffff"
                  stroke="#a1a1aa"
                  strokeWidth={2}
                />
              )}
            </svg>

            {/* active-country label pinned to its anchor */}
            {activeAnchor && (
              <div
                key={activeIso}
                className="label-pop pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)]"
                style={{
                  left: `${(activeAnchor[0] / MAP_W) * 100}%`,
                  top: `${(activeAnchor[1] / MAP_H) * 100}%`,
                }}
              >
                <div className="flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-2 whitespace-nowrap shadow-lg">
                  <span className="text-lg leading-none">
                    {flagEmoji(iso2Of(activeIso))}
                  </span>
                  <span className="text-sm font-medium text-zinc-950">
                    {DUTCH_NAMES[activeIso] ?? activeIso}
                  </span>
                  <span className="text-xs text-zinc-500">
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
                <div className="flex items-center gap-2 rounded-full bg-zinc-800/95 py-1.5 pr-3.5 pl-2 whitespace-nowrap shadow-lg ring-1 ring-white/10">
                  <span className="text-base leading-none">
                    {flagEmoji(iso2Of(tooltipIso))}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {DUTCH_NAMES[tooltipIso] ?? tooltipIso}
                  </span>
                  <span className="text-xs text-zinc-400">op aanvraag</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
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
          ? "border-white/60 bg-white/10 text-white"
          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
      }`}
    >
      <span className="text-base leading-none">{flag}</span>
      {label}
      {tag && <span className="text-xs text-zinc-400">{tag}</span>}
    </button>
  );
}
