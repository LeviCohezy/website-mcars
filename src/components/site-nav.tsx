"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NavItem } from "@/lib/site";
import LanguageSwitcher from "./language-switcher";
import NavPill from "./nav-pill";
import MobileMenu from "./mobile-menu";

/**
 * Interior navigation — visually identical to the homepage hero nav:
 * a centered white logo tab, a dark translucent pill of links and the
 * Offerte button. Over the dark hero it reads exactly like the
 * homepage. Mobile gets a matching drawer.
 */
export default function SiteNav({
  theme,
  inverted = false,
  nav,
}: {
  theme?: "light" | "onDark";
  inverted?: boolean;
  /** Navigation in the visitor's language (from the server: `localize(locale, nav)`). */
  nav?: NavItem[];
}) {
  const t = useTranslations("SiteNav");
  void theme; // kept for backwards-compatible call sites
  // `inverted`: black frame and logo tab with a white logo, for full-black
  // pages (the offerte page). The links pill and Offerte button stay as-is.
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <Frame inverted={inverted} homeLabel={t("homeLabel")} />
      {/* A black copy of the frame, revealed left to right by --nav-wipe
          (set by a section that wipes to black, e.g. the /routes finder).
          Only the frame and logo tab change; the links pill stays as-is. */}
      {!inverted && (
        <div aria-hidden inert className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 [clip-path:inset(0_calc(100%_-_var(--nav-wipe,0%))_0_0)]">
          <Frame inverted homeLabel={t("homeLabel")} />
        </div>
      )}

      <div className="relative flex w-full items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-5">
        {/* Left: dark pill nav (with Diensten/Routes/Ontdek dropdowns) */}
        <div className="pointer-events-auto">
          <NavPill items={nav} />
          <MobileMenu items={nav} />
        </div>

        {/* Right: language + Offerte (below sm the language choice lives in the drawer) */}
        <div className="pointer-events-auto ml-auto flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:block" />
          <Link
            href="/offerte"
            className="flex items-center gap-2 rounded-2xl bg-zinc-950 py-2 pr-2 pl-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            {t("quote")}
            <ArrowChip />
          </Link>
        </div>
      </div>

    </div>
  );
}

/** The page frame (top edge + rounded corners) and the centered logo tab. */
function Frame({ inverted, homeLabel }: { inverted: boolean; homeLabel: string }) {
  return (
    <>
      {/* Fixed page frame: the white top edge and the hero's rounded top
          corners stay in place while content scrolls underneath. */}
      <div aria-hidden className={`absolute inset-x-0 top-0 h-2 ${inverted ? "bg-zinc-950" : "bg-white"}`} />
      <span aria-hidden className={`absolute top-2 left-2 size-8 ${inverted ? "bg-[radial-gradient(circle_at_100%_100%,transparent_31.5px,#09090b_32px)]" : "bg-[radial-gradient(circle_at_100%_100%,transparent_31.5px,white_32px)]"}`} />
      <span aria-hidden className={`absolute top-2 right-2 size-8 ${inverted ? "bg-[radial-gradient(circle_at_0%_100%,transparent_31.5px,#09090b_32px)]" : "bg-[radial-gradient(circle_at_0%_100%,transparent_31.5px,white_32px)]"}`} />

      {/* Centered white logo tab (identical to homepage) */}
      <div className="pointer-events-auto absolute top-2 left-1/2 z-20 -translate-x-1/2">
        <Link href="/" aria-label={homeLabel} className={`relative block rounded-b-[1.5rem] px-6 ${inverted ? "bg-zinc-950" : "bg-white"} pt-0.5 pb-2 sm:px-8 sm:pt-1 sm:pb-2.5`}>
          <Image src="/logo.png" alt="Mcars" width={447} height={447} priority className={`h-16 w-auto sm:scale-125 ${inverted ? "invert" : ""}`} />
          <span aria-hidden className={`absolute top-0 -left-5 size-5 ${inverted ? "bg-[radial-gradient(circle_at_0%_100%,transparent_19px,#09090b_20px)]" : "bg-[radial-gradient(circle_at_0%_100%,transparent_19px,white_20px)]"}`} />
          <span aria-hidden className={`absolute top-0 -right-5 size-5 ${inverted ? "bg-[radial-gradient(circle_at_100%_100%,transparent_19px,#09090b_20px)]" : "bg-[radial-gradient(circle_at_100%_100%,transparent_19px,white_20px)]"}`} />
        </Link>
      </div>
    </>
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
