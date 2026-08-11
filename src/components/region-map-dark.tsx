"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { anchors, countries } from "@/data/europe-map";

// Luxembourg is not in the generated anchor set; same Mercator projection.
const ANCHORS: Record<string, [number, number]> = {
  ...anchors,
  LUX: [354.4, 675.7],
};

// Same window as the light network map: Poland and everything south/west.
const VIEW = { x: 19, y: 479, w: 834, h: 622 };

const SHOWN = new Set([
  "PRT", "ESP", "AND", "FRA", "BEL", "NLD", "LUX", "DEU", "POL", "CZE",
  "SVK", "AUT", "CHE", "ITA", "SVN", "HRV", "HUN", "BIH", "SRB", "MNE",
  "ALB", "MKD", "GRC", "BGR", "ROU",
]);

// Countries that take part in the corridor routes (they have flag patterns).
const ROUTE_ISOS = ["BEL", "NLD", "DEU", "LUX", "CHE", "ITA", "ESP", "FRA"];

const DUTCH_NAMES: Record<string, string> = {
  ALB: "Albanië", BIH: "Bosnië-Herzegovina", BGR: "Bulgarije",
  AUT: "Oostenrijk", CZE: "Tsjechië", FRA: "Frankrijk", DEU: "Duitsland",
  GRC: "Griekenland", HRV: "Kroatië", HUN: "Hongarije", ITA: "Italië",
  SVK: "Slowakije", MKD: "Noord-Macedonië", BEL: "België", AND: "Andorra",
  LUX: "Luxemburg", MNE: "Montenegro", NLD: "Nederland", POL: "Polen",
  PRT: "Portugal", ROU: "Roemenië", SVN: "Slovenië", ESP: "Spanje",
  CHE: "Zwitserland", SRB: "Servië",
};

const METRICS: [string, string][] = [
  ["25+", "landen in ons netwerk"],
  ["8", "vaste corridors"],
  ["1", "vast aanspreekpunt"],
];

const flagEmoji = (iso2: string) =>
  String.fromCodePoint(
    ...[...iso2.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0))
  );

const iso2Of = (iso3: string) =>
  countries.find((c) => c.iso3 === iso3)?.iso2 ?? "";

// Curved corridor between two anchors.
function curveBetween(from: string, to: string) {
  const [x1, y1] = ANCHORS[from];
  const [x2, y2] = ANCHORS[to];
  const k = 0.18;
  const cx = (x1 + x2) / 2 - (y2 - y1) * k;
  const cy = (y1 + y2) / 2 + (x2 - x1) * k;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

type Trip = { id: number; from: string; to: string };

const TRIP_MS = 6000;
const TRIP_GAP_MS = 800;
// The truck departs after the route has drawn and arrives before the fade.
const DRIVE_DELAY_MS = 500;
const DRIVE_MS = 5000;

// Choreographed schedule: a mix of home-base and cross-country corridors.
// Two consecutive entries run simultaneously, so neighbours (including the
// wrap-around) never share a country and alternate north/south for balance.
const PLAYLIST: [string, string][] = [
  ["BEL", "DEU"],
  ["ESP", "FRA"],
  ["NLD", "BEL"],
  ["CHE", "ITA"],
  ["FRA", "DEU"],
  ["BEL", "ESP"],
  ["LUX", "NLD"],
  ["ITA", "BEL"],
  ["DEU", "CHE"],
  ["BEL", "FRA"],
  ["NLD", "DEU"],
  ["ESP", "BEL"],
  ["FRA", "CHE"],
  ["BEL", "NLD"],
  ["DEU", "ITA"],
  ["CHE", "LUX"],
];

/* The driving truck. SMIL `begin` offsets count from the document timeline,
   not from element mount — for a trip spawned later they'd already be in the
   past and the truck would sit frozen at the destination. So the animation
   starts as `indefinite` and we kick it off with beginElement() after the
   route has drawn. */
function TruckDrive({ path }: { path: string }) {
  const motionRef = useRef<SVGElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const el = motionRef.current as unknown as {
        beginElement?: () => void;
      } | null;
      el?.beginElement?.();
    }, DRIVE_DELAY_MS);
    return () => clearTimeout(t);
  }, [path]);

  return (
    <g>
      <animateMotion
        ref={motionRef as React.Ref<SVGElement>}
        begin="indefinite"
        dur={`${DRIVE_MS}ms`}
        repeatCount="1"
        fill="freeze"
        keyPoints="0;1"
        keyTimes="0;1"
        calcMode="spline"
        keySplines="0.45 0 0.25 1"
        rotate="auto"
        path={path}
      />
      <image
        href="/truck-map.png"
        x={-28}
        y={-28}
        width={56}
        height={56}
        style={{
          filter: "brightness(1.25) drop-shadow(0 2px 4px rgb(0 0 0 / 0.7))",
        }}
      />
    </g>
  );
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/* Flag patterns for the corridor countries — simple stripe/cross rects in
   objectBoundingBox coordinates so they stretch over each country shape. */
function FlagDefs() {
  const P = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <pattern
      id={id}
      patternUnits="objectBoundingBox"
      patternContentUnits="objectBoundingBox"
      width={1}
      height={1}
    >
      {children}
    </pattern>
  );
  const H = (colors: string[], sizes?: number[]) => {
    const s = sizes ?? colors.map(() => 1 / colors.length);
    let y = 0;
    return colors.map((c, i) => {
      const r = <rect key={i} x={0} y={y} width={1} height={s[i]} fill={c} />;
      y += s[i];
      return r;
    });
  };
  const V = (colors: string[]) =>
    colors.map((c, i) => (
      <rect
        key={i}
        x={i / colors.length}
        y={0}
        width={1 / colors.length}
        height={1}
        fill={c}
      />
    ));
  return (
    <defs>
      <P id="flag-BEL">{V(["#2d2926", "#fdda24", "#ef3340"])}</P>
      <P id="flag-NLD">{H(["#ae1c28", "#f5f5f5", "#21468b"])}</P>
      <P id="flag-DEU">{H(["#2d2926", "#dd0000", "#ffce00"])}</P>
      <P id="flag-LUX">{H(["#ef3340", "#f5f5f5", "#00a2e1"])}</P>
      <P id="flag-FRA">{V(["#0055a4", "#f5f5f5", "#ef4135"])}</P>
      <P id="flag-ITA">{V(["#008c45", "#f4f9f0", "#cd212a"])}</P>
      <P id="flag-ESP">{H(["#aa151b", "#f1bf00", "#aa151b"], [0.25, 0.5, 0.25])}</P>
      <P id="flag-CHE">
        <rect x={0} y={0} width={1} height={1} fill="#da291c" />
        <rect x={0.42} y={0.16} width={0.16} height={0.68} fill="#f5f5f5" />
        <rect x={0.16} y={0.42} width={0.68} height={0.16} fill="#f5f5f5" />
      </P>
    </defs>
  );
}

export default function RegionMapDark({
  onActiveChange,
}: {
  onActiveChange?: (isos: string[]) => void;
}) {
  const [trips, setTrips] = useState<(Trip | null)[]>([null]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );

  // One live trip at a time, working through the playlist in order.
  useEffect(() => {
    if (reducedMotion) return;
    let counter = 0;
    let timer: ReturnType<typeof setTimeout>;
    const spawn = () => {
      const idx = counter++;
      const [from, to] = PLAYLIST[idx % PLAYLIST.length];
      setTrips([{ id: idx, from, to }]);
      timer = setTimeout(spawn, TRIP_MS + TRIP_GAP_MS);
    };
    spawn();
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  const activeIsos = useMemo(() => {
    const s = new Set<string>();
    for (const t of trips) {
      if (t) {
        s.add(t.from);
        s.add(t.to);
      }
    }
    return s;
  }, [trips]);

  useEffect(() => {
    onActiveChange?.(Array.from(activeIsos));
  }, [activeIsos, onActiveChange]);

  const shown = useMemo(() => countries.filter((c) => SHOWN.has(c.iso3)), []);

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="w-full max-w-3xl">
      <div
        ref={mapRef}
        className="relative w-full"
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
          <FlagDefs />
          {shown.map((c) => {
            const isRouteCountry = ROUTE_ISOS.includes(c.iso3);
            const isActive = activeIsos.has(c.iso3);
            const isHovered = c.iso3 === hovered;
            return (
              <path
                key={c.iso3}
                data-iso={c.iso3}
                d={c.d}
                className="cursor-pointer transition-[fill] duration-500"
                fill={
                  isActive
                    ? `url(#flag-${c.iso3})`
                    : isHovered
                      ? "#52525b"
                      : isRouteCountry
                        ? "#3f3f46"
                        : "#27272a"
                }
                stroke={isActive ? "#fafafa" : "#18181b"}
                strokeWidth={isActive ? 1.5 : 1}
                onPointerEnter={() => setHovered(c.iso3)}
                onPointerLeave={() =>
                  setHovered((h) => (h === c.iso3 ? null : h))
                }
              />
            );
          })}

          {/* live corridors — each with its own truck driving nose-first */}
          {trips.map(
            (trip) =>
              trip && (
                <g
                  key={trip.id}
                  style={{
                    animation: `trip-life ${TRIP_MS + TRIP_GAP_MS}ms ease-in-out both`,
                  }}
                >
                  <path
                    d={curveBetween(trip.from, trip.to)}
                    pathLength={1}
                    fill="none"
                    stroke="#fafafa"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray="1"
                    className="route-draw"
                    style={{
                      filter: "drop-shadow(0 0 5px rgb(255 255 255 / 0.6))",
                    }}
                  />
                  {[trip.from, trip.to].map((iso) => (
                    <circle
                      key={iso}
                      cx={ANCHORS[iso][0]}
                      cy={ANCHORS[iso][1]}
                      r={4.5}
                      fill="#ffffff"
                      stroke="#3f3f46"
                      strokeWidth={2}
                    />
                  ))}
                  {/* the truck waits for the route to draw, then drives with
                      a gentle accelerate/decelerate ease */}
                  {!reducedMotion && (
                    <TruckDrive path={curveBetween(trip.from, trip.to)} />
                  )}
                </g>
              )
          )}
        </svg>

        {/* cursor tooltip — the only label, shown while hovering a country */}
        {hovered && cursor && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+12px)]"
            style={{ left: cursor.x, top: cursor.y }}
          >
            <div className="flex items-center gap-2 rounded-full bg-white py-1.5 pr-3.5 pl-2 whitespace-nowrap shadow-lg">
              <span className="text-base leading-none">
                {flagEmoji(iso2Of(hovered))}
              </span>
              <span className="text-sm font-medium text-zinc-950">
                {DUTCH_NAMES[hovered] ?? hovered}
              </span>
              <span className="text-xs text-zinc-500">
                {hovered === "BEL"
                  ? "thuisbasis"
                  : ROUTE_ISOS.includes(hovered)
                    ? "import & export"
                    : "op aanvraag"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* metrics under the map */}
      <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
        {METRICS.map(([nr, label]) => (
          <div key={label}>
            <dt className="sr-only">{label}</dt>
            <dd className="text-2xl font-medium text-white sm:text-3xl">
              {nr}
            </dd>
            <dd className="mt-1 text-sm text-zinc-500">{label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
