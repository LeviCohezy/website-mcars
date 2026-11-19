"use client";

import Image from "next/image";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { BLOG_CATEGORIES, type BlogCategory, type BlogPost } from "@/data/blog";

type Sort = "nieuw" | "oud" | "az";
const SORTS: Sort[] = ["nieuw", "oud", "az"];

/** Category (Dutch value = filter key) -> label shown to the visitor. */
export type CategoryLabels = Record<BlogCategory, string>;

/** Long date, e.g. "12 maart 2025", in the visitor's language. */
function useBlogDate() {
  const format = useFormatter();
  return (iso: string) => format.dateTime(new Date(`${iso}T12:00:00`), { day: "numeric", month: "long", year: "numeric" });
}

/** Blog overview grid: category filter + sort. */
export default function BlogIndex({ posts, labels }: { posts: BlogPost[]; labels: CategoryLabels }) {
  const t = useTranslations("BlogIndex");
  const locale = useLocale();
  const blogDate = useBlogDate();
  // Several categories can be on at once; none selected = everything.
  const [cats, setCats] = useState<BlogCategory[]>([]);
  const [sort, setSort] = useState<Sort>("nieuw");
  const [drawer, setDrawer] = useState(false);
  const toggle = (c: BlogCategory) => setCats((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));

  const shown = useMemo(() => {
    const list = cats.length ? posts.filter((p) => cats.includes(p.category)) : [...posts];
    if (sort === "az") list.sort((a, b) => a.title.localeCompare(b.title, locale));
    else list.sort((a, b) => (sort === "nieuw" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
    return list;
  }, [posts, cats, sort, locale]);

  const count = (c: BlogCategory | "Alles") => (c === "Alles" ? posts.length : posts.filter((p) => p.category === c).length);

  return (
    <>
      {/* Latest articles: filters + grid */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="text-4xl font-medium tracking-[-0.025em] text-zinc-950 sm:text-5xl">{t("latest")}</h2>
        <div className="flex items-center gap-2">
        {/* Phones: filters live in a side panel */}
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-950 transition-colors hover:border-zinc-400 sm:hidden"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          {t("filter")}
          {cats.length > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[0.7rem] text-white tabular-nums">{cats.length}</span>
          )}
        </button>
        <label className="flex items-center gap-3 text-sm text-zinc-500">
          <span className="hidden sm:inline">{t("sortLabel")}</span>
          <span className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 cursor-pointer appearance-none rounded-full border border-zinc-200 bg-white pr-10 pl-4 text-sm font-medium text-zinc-950 transition-colors hover:border-zinc-400 focus:border-zinc-950 focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>{t(`sort.${s}`)}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute top-1/2 right-4 size-3.5 -translate-y-1/2 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </label>
        </div>
      </div>

      {/* Tablet/desktop: pills (several can be on; "Alles" clears) */}
      <div role="group" aria-label={t("filterByCategory")} className="mt-6 hidden flex-wrap gap-2 sm:flex">
        {(["Alles", ...BLOG_CATEGORIES] as const).map((c) => {
          const on = c === "Alles" ? cats.length === 0 : cats.includes(c);
          return (
            <button
              key={c}
              type="button"
              onClick={() => (c === "Alles" ? setCats([]) : toggle(c))}
              aria-pressed={on}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
                on ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 text-zinc-700 hover:border-zinc-400"
              }`}
            >
              {c === "Alles" ? t("all") : labels[c]}
              <span className={`text-xs tabular-nums ${on ? "text-white/50" : "text-zinc-400"}`}>{count(c)}</span>
            </button>
          );
        })}
      </div>

      {cats.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 sm:hidden">
          {cats.map((c) => (
            <button key={c} type="button" onClick={() => toggle(c)} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-zinc-950 pr-2.5 pl-3 text-xs text-white">
              {labels[c]}
              <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-label={t("remove")}><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          ))}
        </div>
      )}

      {drawer && (
        <FilterDrawer
          selected={cats}
          labels={labels}
          count={count}
          total={shown.length}
          onToggle={toggle}
          onClear={() => setCats([])}
          onClose={() => setDrawer(false)}
        />
      )}

      {shown.length ? (
        <ul className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-zinc-100">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-3 left-3 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-zinc-950">{labels[p.category]}</span>
                </div>
                <h3 className="mt-5 text-xl leading-snug font-medium tracking-[-0.015em] text-zinc-950 decoration-zinc-300 underline-offset-4 group-hover:underline">
                  {p.title}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-500">{p.excerpt}</p>
                <p className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-600">
                  <span className="rounded-full bg-zinc-100 px-3 py-1">{t("minRead", { minutes: p.minutes })}</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1">{blogDate(p.date)}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-[1.25rem] bg-zinc-100 px-6 py-12 text-center text-zinc-500">
          {t("empty")}
        </p>
      )}
    </>
  );
}

/**
 * Blog hero = the featured article: a full-bleed photo with the article's
 * title, intro and an arrow on a frosted panel along the bottom.
 */
export function BlogFeature({ post, label }: { post: BlogPost; label: string }) {
  const t = useTranslations("BlogIndex");
  return (
    <section className="relative">
      <h1 className="sr-only">{t("heading")}</h1>
      <Link
        href={`/blog/${post.slug}`}
        className="group relative flex min-h-[34rem] items-end overflow-hidden rounded-[2rem] bg-zinc-950 sm:min-h-[40rem] lg:min-h-[calc(100svh-1rem)] lg:max-h-[56rem]"
      >
        <Image
          src={post.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03]"
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-zinc-950/60 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-950/70 to-transparent" />

        <div className="relative m-3 flex w-full flex-col gap-6 rounded-[1.5rem] bg-white/10 p-6 text-white ring-1 ring-white/20 backdrop-blur-xl sm:m-6 sm:flex-row sm:items-end sm:justify-between sm:p-9 lg:m-8">
          <div className="max-w-3xl">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-medium">{t("featured")}</span>
              <span aria-hidden className="text-white/40">·</span>
              <span className="text-white/75">{label}</span>
              <span aria-hidden className="text-white/40">·</span>
              <span className="text-white/75">{t("minRead", { minutes: post.minutes })}</span>
            </p>
            <h2 className="mt-4 text-3xl leading-[1.08] font-medium tracking-[-0.025em] text-balance sm:text-5xl">{post.title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{post.excerpt}</p>
          </div>
          <span className="hidden size-14 flex-none items-center justify-center rounded-full bg-white text-zinc-950 transition-transform sm:flex duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:translate-x-1">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </Link>
    </section>
  );
}

/** Phone filter panel: categories as checkboxes, several at once; portalled to <body>. */
function FilterDrawer({
  selected, labels, count, total, onToggle, onClear, onClose,
}: {
  selected: BlogCategory[]; labels: CategoryLabels; count: (c: BlogCategory) => number; total: number;
  onToggle: (c: BlogCategory) => void; onClear: () => void; onClose: () => void;
}) {
  const t = useTranslations("BlogIndex");
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={t("drawer.aria")}>
      <button type="button" aria-label={t("drawer.close")} onClick={onClose} className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm" />
      <div className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <p className="text-lg font-medium text-zinc-950">{t("filter")}</p>
          <button type="button" onClick={onClose} aria-label={t("drawer.close")} className="flex size-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <fieldset className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          <legend className="pt-2 pb-3 text-xs font-medium tracking-[0.16em] text-zinc-400 uppercase">{t("drawer.category")}</legend>
          <ul className="divide-y divide-zinc-100">
            {BLOG_CATEGORIES.map((c) => {
              const on = selected.includes(c);
              return (
                <li key={c}>
                  <label className="flex min-h-14 cursor-pointer items-center gap-3 text-[0.95rem] text-zinc-950">
                    <input type="checkbox" checked={on} onChange={() => onToggle(c)} className="peer sr-only" />
                    <span
                      aria-hidden
                      className={`flex size-5 flex-none items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-950 peer-focus-visible:ring-offset-2 ${
                        on ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 text-transparent"
                      }`}
                    >
                      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                    </span>
                    <span className="flex-1">{labels[c]}</span>
                    <span className="text-sm tabular-nums text-zinc-400">{count(c)}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <div className="flex gap-2 border-t border-zinc-200 p-4">
          <button type="button" onClick={onClear} disabled={!selected.length} className="h-12 rounded-full border border-zinc-200 px-5 text-sm font-medium text-zinc-950 disabled:opacity-40">
            {t("drawer.clear")}
          </button>
          <button type="button" onClick={onClose} className="h-12 flex-1 rounded-full bg-zinc-950 text-sm font-medium text-white">
            {t("drawer.show", { total })}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
