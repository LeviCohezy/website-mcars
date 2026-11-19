"use client";

/**
 * Canvas globe (orthographic projection, d3-geo).
 *
 * - `cap`: only the top of the globe is in frame. It turns from the Atlantic
 *   to Europe as it scrolls into view while the served countries fill in.
 * - `stage`: a camera that flies in from the whole globe and then follows the
 *   selection: Europe, one country (`active`), or one route (`active` → `to`).
 *   Routes are drawn along real roads from public/globe/roads.json.
 *
 * Map data is public/globe/world.json: 50m outlines around Europe, 110m for
 * the rest of the world (Natural Earth via world-atlas). Roads come from
 * OpenStreetMap via OSRM, simplified.
 */

import { useEffect, useRef, type RefObject } from "react";
import { geoContains, geoDistance, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo";

export type GlobeNode = { id: string; name: string; lon: number; lat: number };

type Pt = [number, number];
type Rings = number[][][][];
type World = { near: { id?: string; name: string; c: Rings }[]; far: Rings };
type Road = { pts: Pt[]; cum: number[] };

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
let worldPromise: Promise<World> | null = null;
const loadWorld = () => (worldPromise ??= fetch(`${base}/globe/world.json`).then((r) => r.json() as Promise<World>));
let roadsPromise: Promise<Record<string, Road>> | null = null;
const loadRoads = () =>
  (roadsPromise ??= fetch(`${base}/globe/roads.json`)
    .then((r) => r.json() as Promise<Record<string, number[]>>)
    .then((raw) =>
      Object.fromEntries(
        Object.entries(raw).map(([key, flat]) => {
          const pts: Pt[] = [];
          for (let i = 0; i < flat.length; i += 2) pts.push([flat[i], flat[i + 1]]);
          const cum = [0];
          for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + geoDistance(pts[i - 1], pts[i]));
          return [key, { pts, cum }];
        })
      )
    ));

const multi = (coordinates: Rings) => ({ type: "MultiPolygon", coordinates }) as GeoPermissibleObjects;

type Rgb = [number, number, number];
const THEMES = {
  light: {
    sphere: ["#ffffff", "#e2e2e6"],
    rim: "rgba(0,0,0,0.06)",
    land: [190, 190, 196] as Rgb,
    served: [14, 14, 16] as Rgb,
    hot: [14, 14, 16] as Rgb,
    warm: [14, 14, 16] as Rgb,
    border: "#f4f4f5",
    borderWidth: 1.1,
    ink: "9,9,11",
    paper: "255,255,255",
  },
  dark: {
    sphere: ["#232327", "#101012"],
    rim: "rgba(255,255,255,0.14)",
    land: [46, 46, 51] as Rgb,
    served: [82, 82, 91] as Rgb,
    hot: [212, 212, 216] as Rgb,
    warm: [140, 140, 150] as Rgb,
    border: "#121214",
    borderWidth: 0.9,
    ink: "255,255,255",
    paper: "9,9,11",
  },
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rgb = (c: Rgb) => `rgb(${c.map(Math.round).join(",")})`;
const mixRgb = (a: Rgb, b: Rgb, t: number): Rgb => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const smooth = (t: number) => t * t * (3 - 2 * t);

type Cam = { lon: number; lat: number; r: number; cx: number; cy: number };

/** `cap` pose for scroll progress e (0 = entering, 1 = settled). */
function capCam(w: number, h: number, e: number): Cam {
  const r1 = Math.max(0.62 * w, 0.95 * h);
  return { r: r1 * lerp(0.84, 1, e), cx: w / 2, cy: 0.05 * h + r1 + (1 - e) * 0.14 * h, lon: lerp(-70, 10, e), lat: lerp(0, 9, e) };
}

/** The part of a `stage` canvas the subject should sit in. */
function stageArea(w: number, h: number) {
  return w >= 1024 ? { l: 0.44 * w, t: 110, r: w - 48, b: h - 56 } : { l: 20, t: 92, r: w - 20, b: h * 0.45 };
}

const unit = geoOrthographic().scale(1).translate([0, 0]);

export default function Globe({
  preset,
  theme,
  served,
  home,
  marker,
  nodes,
  active = null,
  to = null,
  progress,
  onSelect,
  onHover,
  label,
  className = "",
}: {
  preset: "cap" | "stage";
  theme: "light" | "dark";
  /** world-atlas numeric country ids, e.g. "056" for Belgium. */
  served: string[];
  /** Fill-in starts here and spreads outwards. */
  home?: string;
  /** [lon, lat] of a pin (the depot). `cap` only. */
  marker?: Pt;
  /** `stage`: hub city per country; roads run between them. */
  nodes?: GlobeNode[];
  /** `stage`: origin country id. */
  active?: string | null;
  /** `stage`: destination country id; its road is drawn from `active`. */
  to?: string | null;
  /** `stage`: fly-in progress 0..1, owned by the parent's scroll timeline. */
  progress?: RefObject<number>;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
  label: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const landRef = useRef<HTMLCanvasElement>(null);
  const topRef = useRef<HTMLCanvasElement>(null);
  const live = useRef({ active, to, onSelect, onHover });
  const pickRef = useRef<(x: number, y: number) => string | null>(() => null);
  useEffect(() => {
    live.current = { active, to, onSelect, onHover };
  });

  const servedKey = served.join(",");
  const nodesKey = nodes?.map((n) => n.id).join(",") ?? "";

  useEffect(() => {
    const wrap = wrapRef.current!;
    const land = landRef.current!;
    const top = topRef.current!;
    const lctx = land.getContext("2d")!;
    const tctx = top.getContext("2d")!;
    const T = THEMES[theme];
    const stage = preset === "stage";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const proj = geoOrthographic().clipAngle(90).precision(0.5);
    const lpath = geoPath(proj, lctx);
    const list = nodes ?? [];
    const nodeIds = new Set(list.map((n) => n.id));

    let w = 0, h = 0, dpr = 1;
    let raf = 0, inView = false, dead = false;
    let p = reduced && !stage ? 1 : 0;
    let landKey = "";
    let geo: {
      far: GeoPermissibleObjects;
      rest: GeoPermissibleObjects;
      served: { id: string; g: GeoPermissibleObjects; ring: Pt[]; order: number }[];
    } | null = null;
    let roads: Record<string, Road> | null = null;
    const hot: Record<string, number> = {};
    const warm: Record<string, number> = {};
    let cam: Cam | null = null;
    let goal: Cam | null = null;
    let goalKey = "";
    let lineKey = "";
    let lineStart = 0;

    loadWorld().then((world) => {
      if (dead) return;
      const set = new Set(served);
      const mainRing = (c: Rings) => c.map((poly) => poly[0]).sort((x, y) => y.length - x.length)[0] as Pt[];
      const centre = (ring: Pt[]) => {
        const s = ring.reduce((acc, pt) => [acc[0] + pt[0], acc[1] + pt[1]], [0, 0]);
        return [s[0] / ring.length, s[1] / ring.length] as Pt;
      };
      const homeGeo = world.near.find((c) => c.id === home);
      const origin = homeGeo ? centre(mainRing(homeGeo.c)) : null;
      const found = world.near
        .filter((c) => c.id && set.has(c.id))
        .map((c) => {
          const ring = mainRing(c.c);
          return { id: c.id!, g: multi(c.c), ring, d: origin ? geoDistance(origin, centre(ring)) : 0 };
        })
        .sort((x, y) => x.d - y.d);
      geo = {
        far: multi(world.far),
        rest: multi(world.near.filter((c) => !c.id || !set.has(c.id)).flatMap((c) => c.c)),
        served: found.map((c, i) => ({ id: c.id, g: c.g, ring: c.ring, order: found.length > 1 ? i / (found.length - 1) : 0 })),
      };
      landKey = goalKey = "";
    });
    if (stage)
      loadRoads().then((r) => {
        if (dead) return;
        roads = r;
        goalKey = "";
      });

    const road = (a: string, b: string): Road | null => {
      if (!roads) return null;
      const fwd = roads[`${a}-${b}`];
      if (fwd) return fwd;
      const back = roads[`${b}-${a}`];
      if (!back) return null;
      const total = back.cum[back.cum.length - 1];
      const flipped = { pts: [...back.pts].reverse(), cum: [...back.cum].reverse().map((d) => total - d) };
      roads[`${a}-${b}`] = flipped;
      return flipped;
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = r.width; h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [land, top]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      proj.clipExtent([[-20, -20], [w + 20, h + 20]]);
      landKey = goalKey = "";
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const scrollTarget = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      return clamp((vh - r.top) / (vh * 0.5 + Math.min(r.height, vh) * 0.5));
    };

    /** Camera that frames `pts` inside the stage area. */
    const fit = (pts: Pt[], pad: number, rMin: number, rMax: number): Cam => {
      const A = stageArea(w, h);
      let l0 = Infinity, l1 = -Infinity, p0 = Infinity, p1 = -Infinity;
      for (const [x, y] of pts) {
        l0 = Math.min(l0, x); l1 = Math.max(l1, x); p0 = Math.min(p0, y); p1 = Math.max(p1, y);
      }
      const lon = (l0 + l1) / 2, lat = (p0 + p1) / 2;
      unit.rotate([-lon, -lat, 0]);
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const pt of pts) {
        const [x, y] = unit(pt)!;
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
      const r = clamp(pad * Math.min((A.r - A.l) / Math.max(x1 - x0, 1e-4), (A.b - A.t) / Math.max(y1 - y0, 1e-4)), rMin, rMax);
      return { lon, lat, r, cx: (A.l + A.r) / 2 - ((x0 + x1) / 2) * r, cy: (A.t + A.b) / 2 - ((y0 + y1) / 2) * r };
    };
    const allPts = list.map((n) => [n.lon, n.lat] as Pt);
    const stageGoal = (act: string | null, dest: string | null): Cam => {
      const A = stageArea(w, h);
      const m = Math.min(A.r - A.l, A.b - A.t);
      const over = fit(allPts, 0.74, 0, Infinity);
      if (!act) return over;
      const line = dest ? road(act, dest) : null;
      if (line) return fit(line.pts, 0.72, over.r, 7 * m);
      const ring = geo?.served.find((c) => c.id === act)?.ring;
      const node = list.find((n) => n.id === act);
      return fit(ring ?? (node ? [[node.lon, node.lat]] : allPts), 0.5, over.r * 1.25, 7 * m);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!inView || dead) return;
      raf = requestAnimationFrame(frame);
      if (!w || !h) return;

      const { active: act, to: dest } = live.current;
      const tgt = stage ? clamp(progress?.current ?? 1) : reduced ? 1 : scrollTarget();
      p = Math.abs(tgt - p) < 0.0005 ? tgt : p + (tgt - p) * (stage ? 0.12 : 0.07);

      let v: Cam;
      let fill: number;
      if (stage) {
        const key = `${act}|${dest}`;
        if (key !== goalKey) {
          goalKey = key;
          goal = stageGoal(act, dest);
        }
        if (!cam || reduced) cam = { ...goal! };
        else {
          const k = 0.075;
          cam.lon = lerp(cam.lon, goal!.lon, k);
          cam.lat = lerp(cam.lat, goal!.lat, k);
          cam.cx = lerp(cam.cx, goal!.cx, k);
          cam.cy = lerp(cam.cy, goal!.cy, k);
          cam.r = cam.r * Math.pow(goal!.r / cam.r, k);
        }
        // Fly in: whole globe over the Atlantic → the framed subject.
        const e = smooth(clamp(p / 0.8));
        const A = stageArea(w, h);
        const r0 = 0.4 * Math.min(A.r - A.l, A.b - A.t);
        v =
          e >= 1
            ? cam
            : {
                lon: lerp(cam.lon - 110, cam.lon, e),
                lat: lerp(12, cam.lat, e),
                r: r0 * Math.pow(cam.r / r0, e),
                cx: lerp((A.l + A.r) / 2, cam.cx, e),
                cy: lerp((A.t + A.b) / 2, cam.cy, e),
              };
        fill = clamp((p - 0.4) / 0.45);
      } else {
        v = capCam(w, h, smooth(clamp(p / 0.85)));
        fill = clamp((p - 0.45) / 0.5);
      }
      proj.scale(v.r).translate([v.cx, v.cy]).rotate([-v.lon, -v.lat, 0]);

      let colours = "";
      if (geo) {
        for (const c of geo.served) {
          hot[c.id] = lerp(hot[c.id] ?? 0, c.id === act ? 1 : 0, 0.14);
          warm[c.id] = lerp(warm[c.id] ?? 0, c.id === dest && c.id !== act ? 1 : 0, 0.2);
          colours += `${hot[c.id].toFixed(2)}${warm[c.id].toFixed(2)}`;
        }
      }

      // ── Land layer: only repainted when something moved ──
      const key = `${v.r.toFixed(1)}|${v.cx.toFixed(1)}|${v.cy.toFixed(1)}|${v.lon.toFixed(3)}|${v.lat.toFixed(3)}|${fill.toFixed(3)}|${colours}|${geo ? 1 : 0}`;
      if (key !== landKey) {
        landKey = key;
        lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        lctx.clearRect(0, 0, w, h);
        const g = lctx.createRadialGradient(v.cx, v.cy - v.r * 0.6, v.r * 0.05, v.cx, v.cy, v.r * 1.05);
        g.addColorStop(0, T.sphere[0]);
        g.addColorStop(1, T.sphere[1]);
        lctx.beginPath();
        lctx.arc(v.cx, v.cy, v.r, 0, Math.PI * 2);
        lctx.fillStyle = g;
        lctx.fill();
        if (geo) {
          lctx.lineJoin = "round";
          lctx.lineWidth = T.borderWidth;
          lctx.strokeStyle = T.border;
          lctx.fillStyle = rgb(T.land);
          for (const part of [geo.far, geo.rest]) {
            lctx.beginPath();
            lpath(part);
            lctx.fill();
            lctx.stroke();
          }
          for (const c of geo.served) {
            const t = smooth(clamp((fill - c.order * 0.6) / 0.4));
            let col = mixRgb(T.land, T.served, t);
            col = mixRgb(col, T.warm, warm[c.id] * t);
            col = mixRgb(col, T.hot, hot[c.id] * t);
            lctx.beginPath();
            lpath(c.g);
            lctx.fillStyle = rgb(col);
            lctx.fill();
            lctx.stroke();
          }
        }
        lctx.beginPath();
        lctx.arc(v.cx, v.cy, v.r - 0.5, 0, Math.PI * 2);
        lctx.lineWidth = 1;
        lctx.strokeStyle = T.rim;
        lctx.stroke();
      }

      // ── Top layer: roads, hubs, pin ──
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tctx.clearRect(0, 0, w, h);
      const centre: Pt = [v.lon, v.lat];
      const visible = (pt: Pt) => geoDistance(pt, centre) < Math.PI / 2 - 0.05;

      const show = stage ? clamp((p - 0.8) / 0.2) : 0;
      if (stage && show > 0) {
        tctx.lineCap = "round";
        tctx.lineJoin = "round";
        const trace = (line: Road, upto: number) => {
          const total = line.cum[line.cum.length - 1] * upto;
          tctx.beginPath();
          for (let i = 0; i < line.pts.length; i++) {
            if (line.cum[i] > total && i) {
              const f = (total - line.cum[i - 1]) / (line.cum[i] - line.cum[i - 1]);
              const a = proj(line.pts[i - 1])!, b = proj(line.pts[i])!;
              tctx.lineTo(lerp(a[0], b[0], f), lerp(a[1], b[1], f));
              break;
            }
            const [x, y] = proj(line.pts[i])!;
            if (i) tctx.lineTo(x, y);
            else tctx.moveTo(x, y);
          }
        };
        const pointAt = (line: Road, t: number): Pt => {
          const total = line.cum[line.cum.length - 1] * t;
          let i = 1;
          while (i < line.cum.length - 1 && line.cum[i] < total) i++;
          const f = clamp((total - line.cum[i - 1]) / (line.cum[i] - line.cum[i - 1] || 1));
          const a = proj(line.pts[i - 1])!, b = proj(line.pts[i])!;
          return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)];
        };

        // The road network: everything when idle, the origin's roads once chosen.
        if (roads) {
          tctx.lineWidth = 1.2;
          tctx.strokeStyle = `rgba(${T.ink},${((act ? (dest ? 0.14 : 0.42) : 0.2) * show).toFixed(3)})`;
          for (let i = 0; i < list.length; i++)
            for (let j = i + 1; j < list.length; j++) {
              const a = list[i].id, b = list[j].id;
              if (act && a !== act && b !== act) continue;
              if (act && dest && (a === dest || b === dest)) continue;
              const line = roads[`${a}-${b}`] ?? roads[`${b}-${a}`];
              if (!line) continue;
              trace(line, 1);
              tctx.stroke();
            }
        }

        // The chosen route draws itself from the origin, then a dot runs it.
        const line = act && dest ? road(act, dest) : null;
        if (line) {
          const k = `${act}|${dest}`;
          if (k !== lineKey) {
            lineKey = k;
            lineStart = now;
          }
          const t = reduced ? 1 : smooth(clamp((now - lineStart - 150) / 1200));
          trace(line, t);
          tctx.strokeStyle = `rgba(${T.paper},${0.9 * show})`;
          tctx.lineWidth = 6.5;
          tctx.stroke();
          tctx.strokeStyle = `rgba(${T.ink},${show})`;
          tctx.lineWidth = 2.6;
          tctx.stroke();
          if (t >= 1 && !reduced) {
            const u = ((now - lineStart - 1350) / 2600) % 1;
            const [x, y] = pointAt(line, u);
            tctx.beginPath();
            tctx.arc(x, y, 5, 0, Math.PI * 2);
            tctx.fillStyle = `rgb(${T.ink})`;
            tctx.fill();
            tctx.lineWidth = 2;
            tctx.strokeStyle = `rgb(${T.paper})`;
            tctx.stroke();
          }
        } else lineKey = "";

        for (const n of list) {
          const pt: Pt = [n.lon, n.lat];
          if (!visible(pt)) continue;
          const [x, y] = proj(pt)!;
          const isAct = n.id === act, isTo = n.id === dest;
          if (isAct && !reduced) {
            const t = (now / 1800) % 1;
            tctx.beginPath();
            tctx.arc(x, y, 6 + t * 16, 0, Math.PI * 2);
            tctx.strokeStyle = `rgba(${T.paper},${((1 - t) * 0.6 * show).toFixed(3)})`;
            tctx.lineWidth = 1.5;
            tctx.stroke();
          }
          tctx.beginPath();
          tctx.arc(x, y, isAct || isTo ? 5.5 : 2.5, 0, Math.PI * 2);
          tctx.fillStyle = isAct ? `rgba(${T.paper},${show})` : `rgba(${T.ink},${(isTo ? 1 : 0.75) * show})`;
          tctx.fill();
          if (isAct || isTo) {
            tctx.lineWidth = 2;
            tctx.strokeStyle = isAct ? `rgba(${T.ink},${show})` : `rgba(${T.paper},${show})`;
            tctx.stroke();
          }
        }
        // Name tags for origin and destination.
        tctx.font = `500 13px ${getComputedStyle(wrap).fontFamily}`;
        tctx.textBaseline = "middle";
        for (const n of list) {
          if (n.id !== act && n.id !== dest) continue;
          const pt: Pt = [n.lon, n.lat];
          if (!visible(pt)) continue;
          const [x, y] = proj(pt)!;
          const tw = tctx.measureText(n.name).width + 20;
          const bx = x + 14 + tw > w - 8 ? x - 14 - tw : x + 14;
          tctx.beginPath();
          tctx.roundRect(bx, y - 13, tw, 26, 13);
          tctx.fillStyle = n.id === act ? `rgba(${T.ink},${show})` : `rgba(${T.paper},${0.88 * show})`;
          tctx.fill();
          if (n.id !== act) {
            tctx.lineWidth = 1;
            tctx.strokeStyle = `rgba(${T.ink},${0.35 * show})`;
            tctx.stroke();
          }
          tctx.fillStyle = n.id === act ? `rgba(${T.paper},${show})` : `rgba(${T.ink},${show})`;
          tctx.fillText(n.name, bx + 10, y + 0.5);
        }
      }

      if (marker && visible(marker)) {
        const a = clamp((p - 0.85) / 0.15);
        if (a > 0) {
          const [x, y] = proj(marker)!;
          if (!reduced) {
            const t = (now / 2200) % 1;
            tctx.beginPath();
            tctx.arc(x, y, 7 + t * 18, 0, Math.PI * 2);
            tctx.strokeStyle = `rgba(${T.paper},${((1 - t) * 0.8 * a).toFixed(3)})`;
            tctx.lineWidth = 1.5;
            tctx.stroke();
          }
          tctx.beginPath();
          tctx.arc(x, y, 6.5 * a, 0, Math.PI * 2);
          tctx.fillStyle = `rgb(${T.paper})`;
          tctx.fill();
          tctx.lineWidth = 2.5;
          tctx.strokeStyle = `rgb(${T.ink})`;
          tctx.stroke();
        }
      }
    };

    pickRef.current = (x, y) => {
      if (!geo || p < 0.95) return null;
      // Near a hub wins, so small countries stay easy to hit.
      for (const n of list) {
        const pt = proj([n.lon, n.lat]);
        if (pt && Math.hypot(pt[0] - x, pt[1] - y) < 16) return n.id;
      }
      const ll = proj.invert?.([x, y]);
      if (!ll) return null;
      return geo.served.find((c) => nodeIds.has(c.id) && geoContains(c.g as never, ll))?.id ?? null;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !raf) raf = requestAnimationFrame(frame);
      },
      { rootMargin: "10% 0px" }
    );
    io.observe(wrap);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, theme, servedKey, home, marker?.[0], marker?.[1], nodesKey]);

  const interactive = Boolean(onSelect);
  const local = (e: React.PointerEvent | React.MouseEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    return pickRef.current(e.clientX - r.left, e.clientY - r.top);
  };

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={label}
      className={className}
      onPointerMove={
        interactive
          ? (e) => {
              if (e.pointerType !== "mouse") return;
              const id = local(e);
              wrapRef.current!.style.cursor = id ? "pointer" : "";
              live.current.onHover?.(id);
            }
          : undefined
      }
      onPointerLeave={interactive ? (e) => e.pointerType === "mouse" && live.current.onHover?.(null) : undefined}
      onClick={
        interactive
          ? (e) => {
              const id = local(e);
              if (id) live.current.onSelect?.(id);
            }
          : undefined
      }
    >
      <canvas ref={landRef} aria-hidden className="absolute inset-0 size-full" />
      <canvas ref={topRef} aria-hidden className="absolute inset-0 size-full" />
    </div>
  );
}
