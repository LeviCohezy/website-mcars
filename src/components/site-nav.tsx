"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import NavPill from "./nav-pill";

/**
 * Interior navigation — visually identical to the homepage hero nav:
 * a centered white logo tab, a dark translucent pill of links and the
 * Tracking / Offerte buttons. Over the dark hero it reads exactly like the
 * homepage; once you scroll onto white content a dark band fades in behind it
 * so everything stays legible. Mobile gets a matching drawer.
 */
export default function SiteNav({ theme }: { theme?: "light" | "onDark" }) {
  void theme; // kept for backwards-compatible call sites
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Dark band that fades in on scroll to keep the nav legible over white */}
      <div
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        } bg-gradient-to-b from-zinc-950/80 via-zinc-950/55 to-transparent backdrop-blur-[2px]`}
      />

      {/* Centered white logo tab (identical to homepage) */}
      <div className="pointer-events-auto absolute top-0 left-1/2 z-20 -translate-x-1/2">
        <Link href="/" aria-label="Mcars — home" className="relative block rounded-b-[1.5rem] bg-white px-6 pt-0.5 pb-2 sm:px-8 sm:pt-1 sm:pb-2.5">
          <Image src="/logo.png" alt="Mcars" width={447} height={447} priority className="h-14 w-auto sm:h-16" />
          <span aria-hidden className="absolute top-0 -left-5 size-5 bg-[radial-gradient(circle_at_0%_100%,transparent_19px,white_20px)]" />
          <span aria-hidden className="absolute top-0 -right-5 size-5 bg-[radial-gradient(circle_at_100%_100%,transparent_19px,white_20px)]" />
        </Link>
      </div>

      <div className="relative flex w-full items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-5">
        {/* Left: dark pill nav (with Diensten/Routes/Ontdek dropdowns) */}
        <div className="pointer-events-auto">
          <NavPill />
        </div>

        {/* Right: Tracking + Offerte */}
        <div className="pointer-events-auto ml-auto flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden items-center gap-2 rounded-2xl border border-white/20 bg-white/10 py-2 pr-2 pl-5 text-sm font-medium text-white backdrop-blur-xl transition-colors hover:bg-white/20 sm:flex"
          >
            Tracking
            <ArrowChip />
          </Link>
          <Link
            href="/offerte"
            className="flex items-center gap-2 rounded-2xl bg-zinc-950 py-2 pr-2 pl-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Offerte aanvragen
            <ArrowChip />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            className="flex size-10 items-center justify-center rounded-2xl bg-zinc-900/85 text-white backdrop-blur-xl transition-colors hover:bg-zinc-800 lg:hidden"
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

function ArrowChip() {
  return (
    <span className="flex size-7 items-center justify-center rounded-full bg-white text-zinc-900">
      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17L17 7M9 7h8v8" />
      </svg>
    </span>
  );
}
