"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { nav, type NavItem } from "@/lib/site";

/**
 * The dark translucent links pill shared by the homepage hero and every
 * interior page, so the navigation is byte-for-byte identical everywhere.
 * Items that have children (Diensten, Routes, Ontdek) open a hover mega-menu.
 */
export default function NavPill() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (item: NavItem) =>
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href ||
        pathname.startsWith(item.href + "/") ||
        item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

  const openNow = (label: string) => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(label);
  };
  const closeSoon = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(null), 120);
  };

  return (
    <nav
      onMouseLeave={closeSoon}
      className="hidden items-center gap-1 rounded-2xl bg-zinc-900/85 p-2 backdrop-blur-xl lg:flex"
    >
      {nav.map((item) => {
        const has = !!item.children?.length;
        const active = isActive(item);
        return (
          <div key={item.label} className="relative" onMouseEnter={() => (has ? openNow(item.label) : closeSoon())}>
            <Link
              href={item.href}
              className={`flex items-center gap-1 rounded-xl px-4 py-2 text-sm transition-colors ${
                active ? "bg-white font-medium text-zinc-900" : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
              aria-expanded={has ? open === item.label : undefined}
            >
              {item.label}
              {has && (
                <svg className={`size-3.5 transition-transform duration-200 ${open === item.label ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              )}
            </Link>
            {has && open === item.label && <MegaMenu item={item} pathname={pathname} onNavigate={() => setOpen(null)} />}
          </div>
        );
      })}
    </nav>
  );
}

function MegaMenu({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate: () => void }) {
  const wide = item.children!.length > 6;
  return (
    <div className={`absolute top-full left-0 z-50 pt-3 ${wide ? "w-[min(90vw,680px)]" : "w-[min(90vw,340px)]"}`}>
      <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-2xl shadow-zinc-950/20 ring-1 ring-zinc-950/5">
        <div className={`grid gap-1 ${wide ? "sm:grid-cols-2" : "grid-cols-1"}`}>
          {item.children!.map((child) => {
            const active = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className={`group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${active ? "bg-zinc-100" : "hover:bg-zinc-50"}`}
              >
                <span className="mt-0.5 flex size-8 flex-none items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition-colors group-hover:bg-zinc-950 group-hover:text-white">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-zinc-950">{child.label}</span>
                  {child.desc && <span className="block truncate text-xs text-zinc-400">{child.desc}</span>}
                </span>
              </Link>
            );
          })}
        </div>
        <Link href={item.href} onClick={onNavigate} className="mt-1 flex items-center justify-between rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
          Alle {item.label.toLowerCase()} bekijken
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </Link>
      </div>
    </div>
  );
}
