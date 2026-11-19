"use client";

/**
 * "Rechtstreeks tussen de landen" for /routes, as a pinned scroll sequence
 * that always fills exactly one viewport:
 *
 *   1. an empty white screen
 *   2. the countries pop in as pills
 *   3. black wipes in from left to right (the nav frame follows via --nav-wipe)
 *   4. the route finder: "Vertrekken van" on the left, the globe on the right.
 *      Choosing a country zooms the globe to it and lists every destination;
 *      hovering a destination zooms to that pair and draws the road between them.
 *
 * Every pair links to its corridor page (/routes/<van>-<naar>); "Vaste rit"
 * marks the fixed weekly corridors.
 */

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import Globe, { type GlobeNode } from "@/components/globe";
import { Eyebrow } from "@/components/ui";
import { GLOBE_COUNTRIES } from "@/data/globe-countries";

const COUNTRIES: (GlobeNode & { slug: string })[] = GLOBE_COUNTRIES;
const SERVED = COUNTRIES.map((c) => c.id);
const TOTAL = COUNTRIES.length * (COUNTRIES.length - 1);

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);

function Pills({ dark, names }: { dark: boolean; names: Record<string, string> }) {
  return (
    <div data-pills aria-hidden={dark || undefined} className="absolute inset-0 flex items-center justify-center px-5">
      <ul className="flex max-w-4xl flex-wrap justify-center gap-2.5 sm:gap-4">
        {COUNTRIES.map((c, i) => (
          <li
            key={c.id}
            data-pill={i}
            className={`rounded-full px-5 py-2.5 text-xl font-medium tracking-tight opacity-0 will-change-transform sm:px-8 sm:py-4 sm:text-4xl ${
              dark ? "bg-white text-zinc-950" : "bg-zinc-950 text-white"
            }`}
          >
            {names[c.id]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RoutesNetwork({ corridors }: { corridors: { slug: string; fixed: boolean }[] }) {
  const t = useTranslations("RoutesNetwork");
  const tc = useTranslations("Countries");
  const names = Object.fromEntries(COUNTRIES.map((c) => [c.id, tc(c.slug)]));
  const nodes = COUNTRIES.map((c) => ({ ...c, name: names[c.id] }));
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const outer = useRef<HTMLElement>(null);
  const black = useRef<HTMLDivElement>(null);
  const finder = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLDivElement>(null);
  const fly = useRef(0);

  // The scroll timeline. Styles are written straight to the DOM: no re-renders.
  useEffect(() => {
    const el = outer.current!;
    const root = document.documentElement;
    const pills = [...el.querySelectorAll<HTMLElement>("[data-pill]")];
    const groups = [...el.querySelectorAll<HTMLElement>("[data-pills]")];
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = clamp(-r.top / Math.max(1, r.height - vh));

      for (const pill of pills) {
        const a = ease(clamp((t - 0.06 - Number(pill.dataset.pill) * 0.022) / 0.07));
        pill.style.opacity = String(a);
        pill.style.transform = `translate3d(0, ${((1 - a) * 28).toFixed(1)}px, 0) scale(${(0.86 + 0.14 * a).toFixed(3)})`;
      }
      const wipe = ease(clamp((t - 0.4) / 0.24));
      black.current!.style.clipPath = wipe >= 1 ? "none" : `inset(0 ${((1 - wipe) * 100).toFixed(2)}% 0 0)`;
      // The nav frame turns black with the wipe, for as long as the panel is under it.
      root.style.setProperty("--nav-wipe", `${r.top <= 1 && r.bottom > 70 ? (wipe * 100).toFixed(2) : 0}%`);

      const out = ease(clamp((t - 0.66) / 0.08));
      for (const g of groups) {
        g.style.opacity = String(1 - out);
        g.style.transform = `translate3d(0, ${(-out * 48).toFixed(1)}px, 0)`;
        g.style.visibility = out >= 1 ? "hidden" : "";
      }
      const show = ease(clamp((t - 0.7) / 0.1));
      finder.current!.style.opacity = String(show);
      finder.current!.style.visibility = show > 0 ? "" : "hidden";
      finder.current!.style.pointerEvents = show > 0.9 ? "" : "none";
      fly.current = clamp((t - 0.68) / 0.2);
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.style.removeProperty("--nav-wipe");
    };
  }, []);

  // Close the dropdown on outside press or Escape.
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => !picker.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  const choose = (id: string) => {
    setFrom(id);
    setTo(null);
    setOpen(false);
  };
  // On the globe: the first country is the origin, the next one a destination.
  const onGlobe = (id: string) => (from && id !== from ? setTo(id) : choose(id));
  const origin = COUNTRIES.find((c) => c.id === from);
  const destinations = COUNTRIES.filter((c) => c.id !== from);

  return (
    <section ref={outer} aria-label={t("sectionLabel")} className="relative -mx-2 mt-20 h-[380vh] sm:mt-32">
      <div className="sticky top-0 h-svh overflow-hidden bg-white">
        <Pills dark={false} names={names} />

        <div ref={black} className="absolute inset-0 bg-zinc-950 text-white" style={{ clipPath: "inset(0 100% 0 0)" }}>
          <Pills dark names={names} />

          <div ref={finder} className="absolute inset-0" style={{ opacity: 0, visibility: "hidden" }}>
            <Globe
              preset="stage"
              theme="dark"
              served={SERVED}
              home={COUNTRIES[0].id}
              nodes={nodes}
              active={from}
              to={to}
              progress={fly}
              onSelect={onGlobe}
              label={t("globeLabel", { count: COUNTRIES.length })}
              className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_3%,#000_14%,#000_40%,transparent_56%)] lg:[mask-image:linear-gradient(to_right,transparent_24%,#000_50%)]"
            />

            <div className="absolute inset-x-0 bottom-0 flex flex-col px-5 pb-5 sm:px-10 lg:inset-y-0 lg:right-auto lg:w-[30rem] lg:justify-center lg:pt-28 lg:pr-0 lg:pb-10 lg:pl-16">
              <Eyebrow dark className="hidden lg:flex">{t("eyebrow")}</Eyebrow>
              <h2 className="text-3xl leading-[1.02] font-medium tracking-[-0.03em] lg:mt-5 lg:text-5xl">
                {t.rich("title", { muted: (c) => <span className="text-zinc-500">{c}</span> })}
              </h2>

              <div ref={picker} className="relative mt-4 lg:mt-8">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={open}
                  onClick={() => setOpen((o) => !o)}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white/[0.08] px-5 py-3 text-left ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/[0.12] lg:py-3.5"
                >
                  <span>
                    <span className="block text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">{t("departFrom")}</span>
                    <span className={`mt-0.5 block text-lg font-medium tracking-tight ${origin ? "text-white" : "text-white/50"}`}>{origin ? names[origin.id] : t("chooseCountry")}</span>
                  </span>
                  <svg className={`size-5 flex-none text-white/70 transition-transform duration-300 ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {open && (
                  <ul role="listbox" aria-label={t("departFrom")} data-lenis-prevent className="absolute inset-x-0 bottom-full z-20 mb-2 grid max-h-[46svh] grid-cols-2 gap-1 overflow-y-auto rounded-2xl bg-zinc-900 p-2 ring-1 ring-white/15 lg:top-full lg:bottom-auto lg:mt-2 lg:mb-0">
                    {COUNTRIES.map((c) => (
                      <li key={c.id} role="option" aria-selected={c.id === from}>
                        <button
                          type="button"
                          onClick={() => choose(c.id)}
                          className={`w-full rounded-xl px-3.5 py-2.5 text-left text-base font-medium transition-colors ${c.id === from ? "bg-white text-zinc-950" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
                        >
                          {names[c.id]}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {origin ? (
                <ul className="mt-3 grid grid-cols-2 gap-x-4 border-t border-white/15 lg:mt-5 lg:grid-cols-1" onMouseLeave={() => setTo(null)}>
                  {destinations.map((d) => {
                    const slug = `${origin.slug}-${d.slug}`;
                    const page = corridors.find((c) => c.slug === slug);
                    const fixed = Boolean(page?.fixed);
                    // Every pair has its own page; the quote form is only a fallback.
                    const href = page ? `/routes/${slug}` : `/offerte?van=${encodeURIComponent(origin.name)}&naar=${encodeURIComponent(d.name)}`;
                    const on = to === d.id;
                    return (
                      <li key={d.id} className="border-b border-white/10">
                        <Link
                          href={href}
                          onMouseEnter={() => setTo(d.id)}
                          onFocus={() => setTo(d.id)}
                          onClick={(e) => {
                            // Touch: the first tap shows the route, the second follows the link.
                            if (!on && window.matchMedia("(hover: none)").matches) {
                              e.preventDefault();
                              setTo(d.id);
                            }
                          }}
                          style={{ height: "min(2.9rem, 4.9svh)" }}
                          className="group flex items-center gap-3"
                        >
                          <span className={`flex-1 truncate text-base font-medium tracking-tight transition-colors duration-300 lg:text-lg ${to && !on ? "text-white/35" : "text-white"}`}>
                            <span className="hidden text-white/45 lg:inline">{names[origin.id]} </span>
                            <span className="text-white/30">→</span> {names[d.id]}
                          </span>
                          {fixed && <span className="hidden rounded-full border border-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white/60 lg:block">{t("fixed")}</span>}
                          <span className={`flex size-7 flex-none items-center justify-center rounded-full border transition-colors duration-300 ${on ? "border-white bg-white text-zinc-950" : "border-white/20 text-white/60"}`}>
                            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 max-w-sm text-base leading-relaxed text-white/55 lg:mt-6 lg:text-lg">
                  {t("hint", { count: COUNTRIES.length, total: TOTAL })}
                </p>
              )}
            </div>

            <p className="pointer-events-none absolute right-16 bottom-10 hidden text-right lg:block">
              <span className="block text-6xl leading-none font-medium tracking-[-0.05em] tabular-nums">{TOTAL}</span>
              <span className="mt-1 block text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{t("combinations")}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
