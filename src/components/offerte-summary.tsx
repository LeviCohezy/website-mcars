"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { countries } from "@/data/europe-map";

/*
 * Overview shown after the offerte is sent: a landscape map with the start,
 * destination and an animated route, and under it the cars as a carousel of
 * cards (photo on top, details below). Locations are placed per country (capital) — or on the
 * depot in Roeselare — since the form has no geocoding.
 */

export type SummaryCar = { id: number; title: string; aantal: number; bouwjaar: string; staat: string; photo?: string };
export type SummaryStop = { label: string; country: string; depot: boolean };

// Same Mercator projection as src/data/europe-map.ts (fitted to its anchors).
const project = (lon: number, lat: number): [number, number] => [
  20.678 * lon + 228.16,
  -1185.6 * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) + 1861.47,
];

// Capitals for the countries in the form's country list.
const CAPITALS: Record<string, [number, number]> = {
  België: [4.352, 50.85],
  Nederland: [4.904, 52.368],
  Frankrijk: [2.352, 48.857],
  Duitsland: [13.405, 52.52],
  Luxemburg: [6.13, 49.61],
  Spanje: [-3.704, 40.417],
  Italië: [12.496, 41.903],
  Zwitserland: [7.447, 46.948],
  Oostenrijk: [16.374, 48.208],
  Portugal: [-9.139, 38.722],
  Polen: [21.012, 52.23],
};
const DEPOT = project(3.125, 50.947); // Roeselare

function pointOf(stop: SummaryStop): [number, number] | null {
  if (stop.depot) return DEPOT;
  const c = CAPITALS[stop.country];
  return c ? project(c[0], c[1]) : null;
}

export default function OfferteSummary({
  cars, from, to, retour,
}: {
  cars: SummaryCar[]; from: SummaryStop; to: SummaryStop; retour: boolean;
}) {
  const t = useTranslations("OfferteSummary");
  const total = cars.reduce((n, c) => n + c.aantal, 0);
  return (
    <div>
      <RouteMap from={from} to={to} retour={retour} />
      <p className="mt-8 text-sm font-medium text-white">
        {t("yourCars")} <span className="text-white/45">({total})</span>
      </p>
      <CarCarousel cars={cars} />
    </div>
  );
}

function CarCarousel({ cars }: { cars: SummaryCar[] }) {
  const t = useTranslations("OfferteSummary");
  const track = useRef<HTMLUListElement>(null);
  const go = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth, behavior: "smooth" });
  return (
    <div className="mt-3">
      <ul
        ref={track}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cars.map((c, i) => (
          <li key={c.id} className="w-[80%] flex-none snap-start sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)] overflow-hidden rounded-xl bg-white/[0.05] ring-1 ring-white/10">
            <div className="relative aspect-[4/3] bg-white/[0.04]">
              {c.photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- local blob preview
                <img src={c.photo} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center text-white/30">
                  <svg className="size-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M4 13l1.7-5a2 2 0 0 1 1.9-1.4h8.8a2 2 0 0 1 1.9 1.4L20 13v5h-2.5v-2h-11v2H4z" /><path d="M4 13h16" />
                  </svg>
                </div>
              )}
              <span className="absolute top-3 right-3 rounded-full bg-white px-3 py-1 text-sm font-semibold text-zinc-950 tabular-nums">
                {c.aantal}x
              </span>
            </div>
            <div className="p-4">
              <p className="truncate text-base font-medium text-white">{c.title || t("carN", { n: i + 1 })}</p>
              <dl className="mt-3 divide-y divide-white/10 border-t border-white/10 text-sm">
                {[
                  [t("quantity"), `${c.aantal}x`],
                  [t("year"), c.bouwjaar || "—"],
                  [t("condition"), c.staat],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 py-2">
                    <dt className="text-white/50">{k}</dt>
                    <dd className="truncate text-right text-white">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </li>
        ))}
      </ul>
      {cars.length > 1 && (
        <div className="mt-3 flex justify-end gap-2">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => go(d)}
              aria-label={d < 0 ? t("prevCars") : t("nextCars")}
              className="flex size-10 items-center justify-center rounded-full text-white ring-1 ring-white/25 transition-colors hover:bg-white hover:text-zinc-950"
            >
              <svg className={`size-4 ${d < 0 ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RouteMap({ from, to, retour }: { from: SummaryStop; to: SummaryStop; retour: boolean }) {
  const t = useTranslations("OfferteSummary");
  const a = pointOf(from);
  let b = pointOf(to);
  // Same spot (e.g. depot → address in Belgium): nudge the end so the route shows.
  if (a && b && Math.hypot(a[0] - b[0], a[1] - b[1]) < 12) b = [b[0] + 28, b[1] + 14];

  // Frame the route (or Western Europe when there is none yet) at 2:1.
  const pts = [a, b].filter(Boolean) as [number, number][];
  let x0 = 120, y0 = 520, x1 = 620, y1 = 1000;
  if (pts.length) {
    x0 = Math.min(...pts.map((p) => p[0])) - 90;
    x1 = Math.max(...pts.map((p) => p[0])) + 90;
    y0 = Math.min(...pts.map((p) => p[1])) - 90;
    y1 = Math.max(...pts.map((p) => p[1])) + 90;
  }
  let w = Math.max(x1 - x0, 360), h = Math.max(y1 - y0, 180);
  if (w / h > 2) h = w / 2;
  else w = h * 2;
  const vx = (x0 + x1) / 2 - w / 2, vy = (y0 + y1) / 2 - h / 2;
  const s = w / 700; // keeps strokes and pins the same size at any zoom

  let route = "";
  if (a && b) {
    const cx = (a[0] + b[0]) / 2 - (b[1] - a[1]) * 0.2;
    const cy = (a[1] + b[1]) / 2 + (b[0] - a[0]) * 0.2;
    route = `M ${a[0]} ${a[1]} Q ${cx} ${cy} ${b[0]} ${b[1]}`;
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-zinc-950 ring-1 ring-white/10">
      <svg viewBox={`${vx} ${vy} ${w} ${h}`} className="block aspect-[2/1] w-full" role="img" aria-label={route ? t("routeLabel", { from: from.label, to: to.label }) : t("mapLabel")}>
        <style>{`
          @keyframes mc-draw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
          @keyframes mc-pulse { 0% { opacity: .6; transform: scale(1) } 100% { opacity: 0; transform: scale(3) } }
          .mc-route { stroke-dasharray: 1; animation: mc-draw 1.6s cubic-bezier(.45,0,.25,1) forwards }
          .mc-pulse { transform-box: fill-box; transform-origin: center; animation: mc-pulse 1.8s ease-out infinite }
          @media (prefers-reduced-motion: reduce) { .mc-route, .mc-pulse { animation: none; stroke-dashoffset: 0 } }
        `}</style>
        {countries.map((c) => (
          <path key={c.iso3} d={c.d} fill="rgb(255 255 255 / 0.07)" stroke="rgb(255 255 255 / 0.18)" strokeWidth={0.6 * s} />
        ))}
        {route && (
          <g key={route}>
            <path d={route} fill="none" stroke="rgb(255 255 255 / 0.15)" strokeWidth={2 * s} />
            <path d={route} pathLength={1} className="mc-route" fill="none" stroke="white" strokeWidth={2.4 * s} strokeLinecap="round" />
            {/* A dot keeps driving the route */}
            <circle r={4 * s} fill="white">
              <animateMotion dur="3s" repeatCount="indefinite" path={route} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1" />
            </circle>
          </g>
        )}
        {a && <Pin at={a} s={s} label={from.label} />}
        {b && <Pin at={b} s={s} label={to.label} end />}
      </svg>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 px-4 py-3 text-sm">
        {a && b ? (
          <>
            <span className="text-white">{from.label}</span>
            <span aria-hidden className="text-white/40">{retour ? "⇄" : "→"}</span>
            <span className="text-white">{to.label}</span>
            {retour && <span className="ml-auto rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">{t("roundTrip")}</span>}
          </>
        ) : (
          <span className="text-white/50">{t("pickRoute")}</span>
        )}
      </div>
    </div>
  );
}

function Pin({ at, s, label, end = false }: { at: [number, number]; s: number; label: string; end?: boolean }) {
  const [x, y] = at;
  return (
    <g>
      <circle cx={x} cy={y} r={6 * s} fill="white" className="mc-pulse" />
      <circle cx={x} cy={y} r={6 * s} fill={end ? "white" : "#09090b"} stroke="white" strokeWidth={2.5 * s} />
      <text x={x} y={y - 12 * s} textAnchor="middle" fontSize={11 * s} fontWeight={500} fill="white" stroke="#09090b" strokeWidth={3 * s} paintOrder="stroke">
        {label}
      </text>
    </g>
  );
}
