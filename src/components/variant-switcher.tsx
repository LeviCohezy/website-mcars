"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSection } from "@/lib/variants";

/**
 * The circular button in the bottom-right corner of every design. Tap it and it
 * expands into a little panel that lets you jump between the built variants of a
 * section (Home 01 / 02 / 03) and back to the /overview gallery.
 *
 * Hidden inside preview iframes (?preview=1) so it never shows up in thumbnails.
 */
export default function VariantSwitcher({ sectionId }: { sectionId: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(true); // assume preview until proven otherwise → no flash in thumbnails

  useEffect(() => {
    setIsPreview(new URLSearchParams(window.location.search).has("preview"));
  }, []);

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const section = getSection(sectionId);
  if (!section || isPreview) return null;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href);

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {/* Expanding panel */}
      <div
        className={`origin-bottom-right overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/90 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out ${
          open ? "pointer-events-auto max-h-[26rem] w-72 opacity-100" : "pointer-events-none max-h-0 w-72 -translate-y-1 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <span className="text-[10px] font-semibold tracking-[0.2em] text-white/50 uppercase">{section.title}-varianten</span>
          <Link href="/overview" className="text-[11px] font-medium text-white/60 transition-colors hover:text-white">
            Overzicht ↗
          </Link>
        </div>
        <div className="flex flex-col gap-1 px-2 pb-3">
          {section.variants.map((v) => {
            const active = isActive(v.href);
            return (
              <Link
                key={v.id}
                href={v.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors ${
                  active ? "bg-white text-zinc-950" : "text-white/85 hover:bg-white/10"
                }`}
              >
                <span
                  className={`flex size-8 flex-none items-center justify-center rounded-xl text-xs font-semibold ${
                    active ? "bg-zinc-950 text-white" : "bg-white/10 text-white"
                  }`}
                >
                  {v.label.replace(/\D/g, "")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {v.label}
                    {active && <span className="text-[10px] font-normal text-emerald-600">● live</span>}
                  </span>
                  <span className={`line-clamp-1 text-[11px] ${active ? "text-zinc-500" : "text-white/50"}`}>{v.tagline}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* The circular trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Sluit variant-kiezer" : "Kies een variant"}
        className="flex size-14 items-center justify-center rounded-full bg-zinc-950 text-white shadow-2xl ring-1 ring-white/10 transition-all duration-300 hover:scale-105 hover:bg-zinc-800 active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-6 transition-transform duration-300 ${open ? "rotate-90" : ""}`}
        >
          {open ? (
            <path d="M6 6l12 12M6 18L18 6" />
          ) : (
            <>
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
