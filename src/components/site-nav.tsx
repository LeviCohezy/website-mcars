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

  // Mobile: once the page scrolls, the floating buttons get a frosted bar behind
  // them so they never sit on top of body text.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Drawer: lock page scroll while open, close on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    root.classList.add("modal-open");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      root.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

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

      {/* Mobile frosted bar behind the buttons once scrolled */}
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 h-[4.75rem] border-b border-zinc-950/5 bg-white/95 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
          scrolled && !mobileOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} isActive={isActive} />

      {/* Centered white logo tab (identical to homepage) */}
      <div className="pointer-events-auto absolute top-2 left-1/2 z-20 -translate-x-1/2">
        <Link href="/" aria-label="Mcars — home" className="relative block rounded-b-[1.5rem] bg-white px-6 pt-0.5 pb-2 sm:px-8 sm:pt-1 sm:pb-2.5">
          <Image src="/logo.png" alt="Mcars" width={447} height={447} priority className="h-14 w-auto scale-125 sm:h-16" />
          <span aria-hidden className="absolute top-0 -left-5 size-5 bg-[radial-gradient(circle_at_0%_100%,transparent_19px,white_20px)]" />
          <span aria-hidden className="absolute top-0 -right-5 size-5 bg-[radial-gradient(circle_at_100%_100%,transparent_19px,white_20px)]" />
        </Link>
      </div>

      <div className="relative z-10 flex w-full items-center justify-between gap-4 px-4 pt-3.5 sm:px-6 sm:pt-5">
        {/* Left: dark pill nav (with Diensten/Routes/Ontdek dropdowns) */}
        <div className="pointer-events-auto">
          <NavPill />
          {/* Mobile: one-tap call on the left balances the menu button on the right */}
          <a
            href={site.phoneHref}
            aria-label={`Bel ${site.name}: ${site.phone}`}
            className="flex size-12 items-center justify-center rounded-2xl bg-zinc-900/90 text-white backdrop-blur-xl transition-colors hover:bg-zinc-800 md:hidden"
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
            aria-label={mobileOpen ? "Menu sluiten" : "Menu openen"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className={`flex size-12 items-center justify-center rounded-2xl backdrop-blur-xl transition-colors lg:hidden ${
              mobileOpen ? "bg-white text-zinc-950" : "bg-zinc-900/90 text-white hover:bg-zinc-800"
            }`}
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path className={`origin-center transition-transform duration-300 ${mobileOpen ? "translate-y-[5px] rotate-45" : ""}`} d="M4 7h16" />
              <path className={`transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} d="M4 12h16" />
              <path className={`origin-center transition-transform duration-300 ${mobileOpen ? "-translate-y-[5px] -rotate-45" : ""}`} d="M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}

/** Full-screen mobile menu: big rows (≥56px), expandable groups, CTA + call/WhatsApp. */
function MobileDrawer({ open, onClose, isActive }: { open: boolean; onClose: () => void; isActive: (href: string) => boolean }) {
  const [group, setGroup] = useState<string | null>(null);
  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={`fixed inset-0 overflow-y-auto overscroll-contain bg-zinc-950 text-white transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:hidden ${
        open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
      }`}
    >
      <div className="flex min-h-full flex-col px-5 pt-28 pb-8">
        <nav aria-label="Hoofdmenu">
          <ul className="border-t border-white/10">
            {nav.map((item, i) => {
              const expanded = group === item.label;
              return (
                <li
                  key={item.label}
                  className="border-b border-white/10"
                  style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                >
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex min-h-16 flex-1 items-center text-[1.75rem] font-light tracking-[-0.03em] ${isActive(item.href) ? "text-white" : "text-white/80"}`}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <button
                        type="button"
                        onClick={() => setGroup(expanded ? null : item.label)}
                        aria-expanded={expanded}
                        aria-label={`${item.label} ${expanded ? "inklappen" : "uitklappen"}`}
                        className="flex size-12 items-center justify-center rounded-full ring-1 ring-white/15"
                      >
                        <svg className={`size-4 transition-transform duration-300 ${expanded ? "rotate-45" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {item.children && (
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <ul className="overflow-hidden">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} onClick={onClose} className="flex min-h-12 items-center text-base text-white/60 hover:text-white">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                        <li aria-hidden className="h-3" />
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-10">
          <Link href="/offerte" onClick={onClose} className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-white text-base font-medium text-zinc-950">
            Offerte aanvragen
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <a href={site.phoneHref} className="flex min-h-14 items-center justify-center rounded-full text-sm ring-1 ring-white/20">Bellen</a>
            <a href={site.whatsapp} className="flex min-h-14 items-center justify-center rounded-full text-sm ring-1 ring-white/20">WhatsApp</a>
          </div>
          <p className="mt-6 text-center text-xs text-white/40">{site.hours} · {site.address.city}</p>
        </div>
      </div>
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
