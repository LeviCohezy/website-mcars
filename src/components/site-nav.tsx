"use client";

import Image from "next/image";
import Link from "next/link";
import NavPill from "./nav-pill";
import MobileMenu from "./mobile-menu";

/**
 * Interior navigation — visually identical to the homepage hero nav:
 * a centered white logo tab, a dark translucent pill of links and the
 * Offerte button. Over the dark hero it reads exactly like the
 * homepage. Mobile gets a matching drawer.
 */
export default function SiteNav({ theme }: { theme?: "light" | "onDark" }) {
  void theme; // kept for backwards-compatible call sites
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Fixed page frame: the white top edge and the hero's rounded top
          corners stay in place while content scrolls underneath. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-2 bg-white" />
      <span aria-hidden className="absolute top-2 left-2 size-8 bg-[radial-gradient(circle_at_100%_100%,transparent_31.5px,white_32px)]" />
      <span aria-hidden className="absolute top-2 right-2 size-8 bg-[radial-gradient(circle_at_0%_100%,transparent_31.5px,white_32px)]" />

      {/* Centered white logo tab (identical to homepage) */}
      <div className="pointer-events-auto absolute top-2 left-1/2 z-20 -translate-x-1/2">
        <Link href="/" aria-label="Mcars — home" className="relative block rounded-b-[1.5rem] bg-white px-6 pt-0.5 pb-2 sm:px-8 sm:pt-1 sm:pb-2.5">
          <Image src="/logo.png" alt="Mcars" width={447} height={447} priority className="h-16 w-auto sm:scale-125" />
          <span aria-hidden className="absolute top-0 -left-5 size-5 bg-[radial-gradient(circle_at_0%_100%,transparent_19px,white_20px)]" />
          <span aria-hidden className="absolute top-0 -right-5 size-5 bg-[radial-gradient(circle_at_100%_100%,transparent_19px,white_20px)]" />
        </Link>
      </div>

      <div className="relative flex w-full items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-5">
        {/* Left: dark pill nav (with Diensten/Routes/Ontdek dropdowns) */}
        <div className="pointer-events-auto">
          <NavPill />
          <MobileMenu />
        </div>

        {/* Right: Offerte */}
        <div className="pointer-events-auto ml-auto flex items-center gap-2">
          <Link
            href="/offerte"
            className="flex items-center gap-2 rounded-2xl bg-zinc-950 py-2 pr-2 pl-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Offerte
            <ArrowChip />
          </Link>
        </div>
      </div>

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
