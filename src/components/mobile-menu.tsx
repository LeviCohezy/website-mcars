"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { nav, site } from "@/lib/site";
import WhatsAppIcon from "./whatsapp-icon";

const noopSubscribe = () => () => {};

/**
 * Mobile/tablet menu (< lg): the hamburger that sits top-left in every header
 * (interior SiteNav, homepage hero, /v2 film) plus its full-screen drawer.
 * WhatsApp is the first item in the drawer. The drawer is portalled to <body>
 * so transformed header wrappers can't trap the fixed overlay.
 */
export default function MobileMenu({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Close on navigation (state-during-render, no effect).
  const [openedOn, setOpenedOn] = useState(pathname);
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setOpen(false);
  }

  // Lock page scroll while open; Escape closes.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menu openen"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className={`flex size-10 items-center justify-center rounded-2xl bg-zinc-900/85 text-white backdrop-blur-xl transition-colors hover:bg-zinc-800 lg:hidden ${className}`}
      >
        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {mounted &&
        createPortal(
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            inert={!open}
            className={`fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-zinc-950 text-white transition-[opacity,transform] duration-300 ease-out lg:hidden ${
              open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            <div className="flex min-h-full flex-col px-4 pt-4 pb-8 sm:px-6 sm:pt-5">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={close}
                  aria-label="Menu sluiten"
                  className="flex size-10 items-center justify-center rounded-2xl bg-white text-zinc-950"
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
                <Link href="/offerte" onClick={close} className="flex h-10 items-center rounded-2xl bg-white px-3.5 text-xs font-medium text-zinc-950">
                  Offerte
                </Link>
              </div>

              {/* WhatsApp first — the quickest way to reach Mcars */}
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="mt-8 flex items-center gap-4 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10 transition-colors hover:bg-white/10"
              >
                <span className="flex size-12 flex-none items-center justify-center rounded-full bg-[#25D366] text-white">
                  <WhatsAppIcon className="size-6" />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-medium">WhatsApp ons</span>
                  <span className="block text-sm text-white/60">{site.phone}</span>
                </span>
                <svg className="ml-auto size-4 flex-none text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>

              <nav aria-label="Hoofdmenu" className="mt-6">
                <ul className="border-t border-white/10">
                  {nav.map((item) => (
                    <li key={item.label} className="border-b border-white/10">
                      <Link
                        href={item.href}
                        onClick={close}
                        className={`flex min-h-14 items-center py-3 text-2xl font-light tracking-tight ${isActive(item.href) ? "text-white" : "text-white/75"}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto pt-10">
                <Link
                  href="/offerte"
                  onClick={close}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-white text-base font-medium text-zinc-950"
                >
                  Offerte
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <a href={site.phoneHref} className="mt-3 flex min-h-12 items-center justify-center text-sm text-white/60">
                  Of bel {site.phone}
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
