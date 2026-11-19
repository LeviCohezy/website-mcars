"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { isDutchOnly, LOCALE_NAMES, locales, type Locale } from "@/i18n/routing";

/**
 * Language choice. `menu` (default): the compact dark button in the nav with a
 * dropdown of the six languages. `row`: the six flags side by side, for the
 * mobile drawer. Every option links to the same page in that language; pages
 * that only exist in Dutch send the other languages to the homepage.
 */
export default function LanguageSwitcher({
  variant = "menu",
  className = "",
  onNavigate,
}: {
  variant?: "menu" | "row";
  className?: string;
  onNavigate?: () => void;
}) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const dutchOnly = isDutchOnly(pathname);
  const hrefFor = (l: Locale) => (dutchOnly && l !== "nl" ? "/" : pathname);

  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();

  // Outside click and Escape close the dropdown.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (variant === "row") {
    return (
      <nav aria-label={t("label")} className={className}>
        <ul className="grid grid-cols-6 gap-2">
          {locales.map((l) => {
            const current = l === locale;
            return (
              <li key={l}>
                <Link
                  href={hrefFor(l)}
                  locale={l}
                  lang={l}
                  hrefLang={l}
                  title={LOCALE_NAMES[l]}
                  aria-label={LOCALE_NAMES[l]}
                  aria-current={current ? "true" : undefined}
                  onClick={onNavigate}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl py-2.5 text-xs font-medium uppercase transition-colors ${
                    current ? "bg-white text-zinc-950" : "bg-white/[0.06] text-white/75 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Flag locale={l} />
                  {l}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  const links = () => Array.from(list.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
  const focusLink = (i: number) => {
    const all = links();
    all[(i + all.length) % all.length]?.focus();
  };

  return (
    <div
      ref={root}
      className={`relative ${className}`}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
          e.preventDefault();
          setOpen(true);
          const last = e.key === "ArrowUp";
          requestAnimationFrame(() => focusLink(last ? -1 : 0));
        }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={id}
        aria-label={t("choose", { language: LOCALE_NAMES[locale] })}
        className="flex h-11 items-center gap-2 rounded-2xl bg-zinc-900/85 pr-2.5 pl-3 text-sm font-medium text-white uppercase backdrop-blur-xl transition-colors hover:bg-zinc-800"
      >
        <Flag locale={locale} />
        {locale}
        <svg className={`size-3.5 text-white/70 transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div id={id} className="absolute top-full right-0 z-50 w-52 pt-3">
          <ul
            ref={list}
            aria-label={t("label")}
            data-lenis-prevent
            onKeyDown={(e) => {
              const i = links().indexOf(document.activeElement as HTMLAnchorElement);
              if (e.key === "ArrowDown") focusLink(i + 1);
              else if (e.key === "ArrowUp") focusLink(i - 1);
              else if (e.key === "Home") focusLink(0);
              else if (e.key === "End") focusLink(-1);
              else return;
              e.preventDefault();
            }}
            className="grid max-h-[calc(100svh-6rem)] gap-1 overflow-y-auto overscroll-contain rounded-2xl bg-white p-2 shadow-2xl shadow-zinc-950/20 ring-1 ring-zinc-950/5"
          >
            {locales.map((l) => {
              const current = l === locale;
              return (
                <li key={l}>
                  <Link
                    href={hrefFor(l)}
                    locale={l}
                    lang={l}
                    hrefLang={l}
                    aria-current={current ? "true" : undefined}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      current ? "bg-zinc-100 font-medium text-zinc-950" : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                    }`}
                  >
                    <Flag locale={l} />
                    <span className="flex-1">{LOCALE_NAMES[l]}</span>
                    {current && (
                      <svg className="size-4 flex-none text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Small round flag, drawn inline (English uses the Union Jack). */
function Flag({ locale }: { locale: Locale }) {
  return (
    <span aria-hidden className="block size-5 flex-none overflow-hidden rounded-full ring-1 ring-zinc-950/10">
      <svg className="block size-full" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid slice">
        {FLAGS[locale]}
      </svg>
    </span>
  );
}

const FLAGS: Record<Locale, React.ReactNode> = {
  nl: (
    <>
      <rect width="24" height="8" fill="#AE1C28" />
      <rect y="8" width="24" height="8" fill="#fff" />
      <rect y="16" width="24" height="8" fill="#21468B" />
    </>
  ),
  fr: (
    <>
      <rect width="8" height="24" fill="#0055A4" />
      <rect x="8" width="8" height="24" fill="#fff" />
      <rect x="16" width="8" height="24" fill="#EF4135" />
    </>
  ),
  en: (
    <>
      <rect width="24" height="24" fill="#012169" />
      <path d="M0 0l24 24M24 0L0 24" stroke="#fff" strokeWidth="5" />
      <path d="M0 0l24 24M24 0L0 24" stroke="#C8102E" strokeWidth="2" />
      <path d="M12 0v24M0 12h24" stroke="#fff" strokeWidth="8" />
      <path d="M12 0v24M0 12h24" stroke="#C8102E" strokeWidth="4.5" />
    </>
  ),
  de: (
    <>
      <rect width="24" height="8" fill="#000" />
      <rect y="8" width="24" height="8" fill="#DD0000" />
      <rect y="16" width="24" height="8" fill="#FFCE00" />
    </>
  ),
  es: (
    <>
      <rect width="24" height="24" fill="#AA151B" />
      <rect y="6" width="24" height="12" fill="#F1BF00" />
    </>
  ),
  it: (
    <>
      <rect width="8" height="24" fill="#009246" />
      <rect x="8" width="8" height="24" fill="#fff" />
      <rect x="16" width="8" height="24" fill="#CE2B37" />
    </>
  ),
};
