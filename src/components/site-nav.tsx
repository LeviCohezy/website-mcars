"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/site";
import NavPill from "./nav-pill";

/**
 * Interior navigation — visually identical to the homepage hero nav:
 * a centered white logo tab, a dark translucent pill of links and the
 * Tracking / Offerte buttons. Over the dark hero it reads exactly like the
 * homepage. Mobile gets a matching drawer.
 */
export default function SiteNav({ theme }: { theme?: "light" | "onDark" }) {
  void theme; // kept for backwards-compatible call sites
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [overLight, setOverLight] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLAnchorElement>(null);

  // The translucent Tracking button flips to dark-on-light whenever the page
  // behind it is light, and back over photos, video and dark panels.
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const btn = trackingRef.current;
      if (!btn || !rootRef.current) return;
      const r = btn.getBoundingClientRect();
      if (r.width === 0) return; // hidden on mobile
      setOverLight(!isDarkBehind(r.left + r.width / 2, r.top + r.height / 2, rootRef.current));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Close the drawer whenever the route changes (state-during-render, no effect).
  const [drawerPath, setDrawerPath] = useState(pathname);
  if (drawerPath !== pathname) {
    setDrawerPath(pathname);
    setMobileOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Fixed page frame: the white top edge and the hero's rounded top
          corners stay in place while content scrolls underneath. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-2 bg-white" />
      <span aria-hidden className="absolute top-2 left-2 size-8 bg-[radial-gradient(circle_at_100%_100%,transparent_31.5px,white_32px)]" />
      <span aria-hidden className="absolute top-2 right-2 size-8 bg-[radial-gradient(circle_at_0%_100%,transparent_31.5px,white_32px)]" />

      {/* Centered white logo tab (identical to homepage) */}
      <div className="pointer-events-auto absolute top-2 left-1/2 z-20 -translate-x-1/2">
        <Link href="/" aria-label="Mcars — home" className="relative block rounded-b-[1.5rem] bg-white px-6 pt-0.5 pb-2 sm:px-8 sm:pt-1 sm:pb-2.5">
          <Image src="/logo.png" alt="Mcars" width={447} height={447} priority className="h-14 w-auto scale-125 sm:h-16" />
          <span aria-hidden className="absolute top-0 -left-5 size-5 bg-[radial-gradient(circle_at_0%_100%,transparent_19px,white_20px)]" />
          <span aria-hidden className="absolute top-0 -right-5 size-5 bg-[radial-gradient(circle_at_100%_100%,transparent_19px,white_20px)]" />
        </Link>
      </div>

      <div className="relative flex w-full items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-5">
        {/* Left: dark pill nav (with Diensten/Routes/Ontdek dropdowns) */}
        <div className="pointer-events-auto">
          <NavPill />
          {/* Mobile: one-tap call on the left balances the menu button on the right */}
          <a
            href={site.phoneHref}
            aria-label={`Bel ${site.name}: ${site.phone}`}
            className="flex size-11 items-center justify-center rounded-2xl bg-zinc-900/85 text-white backdrop-blur-xl transition-colors hover:bg-zinc-800 md:hidden"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
            </svg>
          </a>
        </div>

        {/* Right: Tracking + Offerte */}
        <div className="pointer-events-auto ml-auto flex items-center gap-2">
          <Link
            ref={trackingRef}
            href="/contact"
            className={`hidden items-center gap-2 rounded-2xl border py-2 pr-2 pl-5 text-sm font-medium backdrop-blur-xl transition-colors duration-300 lg:flex ${
              overLight
                ? "border-zinc-200 bg-white/70 text-zinc-950 hover:bg-zinc-100"
                : "border-white/20 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Tracking
            <ArrowChip inverted={overLight} />
          </Link>
          <Link
            href="/offerte"
            className="hidden items-center gap-2 rounded-2xl bg-zinc-950 md:flex py-2 pr-2 pl-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Offerte aanvragen
            <ArrowChip />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            className="flex size-11 items-center justify-center rounded-2xl bg-zinc-900/85 text-white backdrop-blur-xl transition-colors hover:bg-zinc-800 lg:hidden"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="pointer-events-auto relative mx-4 mt-2 overflow-hidden rounded-2xl bg-zinc-900/95 p-2 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col">
            {nav.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-sm transition-colors ${
                  isActive(link.href) ? "bg-white font-medium text-zinc-900" : "text-white/85 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/offerte" className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-zinc-900">
            Offerte aanvragen
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      )}
    </div>
  );
}

function ArrowChip({ inverted = false }: { inverted?: boolean }) {
  return (
    <span
      className={`flex size-7 items-center justify-center rounded-full transition-colors duration-300 ${
        inverted ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
      }`}
    >
      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17L17 7M9 7h8v8" />
      </svg>
    </span>
  );
}

/** Is the page content under (x, y) dark? Skips the nav itself; photos,
 *  video and background images count as dark, otherwise the first opaque
 *  background colour decides. */
function isDarkBehind(x: number, y: number, nav: HTMLElement) {
  for (const el of document.elementsFromPoint(x, y)) {
    if (nav.contains(el)) continue;
    if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement) return true;
    const style = getComputedStyle(el);
    if (style.backgroundImage !== "none") return true;
    const m = style.backgroundColor.match(/[\d.]+/g);
    if (!m) continue;
    const [r, g, b, a = "1"] = m.map(String);
    if (Number(a) < 0.5) continue;
    return 0.2126 * Number(r) + 0.7152 * Number(g) + 0.0722 * Number(b) < 140;
  }
  return false;
}
