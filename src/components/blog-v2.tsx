"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { blogCategories, formatDate, readingTime, sortedArticles, type BlogCategory } from "@/data/blog";
import { V2Arrow, V2Block, V2Hero } from "./v2-kit";

/*
 * Blog 02 — "Licht & strak". Light hero with a "(NN)" counter, the newest
 * article as a featured bordered cell, then a chip bar that filters a
 * hairline list of listing rows (photo, title, meta chips, round arrow).
 */

type Filter = "Alle" | BlogCategory;

export default function BlogV2() {
  const [filter, setFilter] = useState<Filter>("Alle");
  const [featured, ...rest] = sortedArticles;
  const list = filter === "Alle" ? rest : sortedArticles.filter((a) => a.category === filter);
  const count = (c: Filter) => (c === "Alle" ? sortedArticles.length : sortedArticles.filter((a) => a.category === c).length);

  return (
    <div className="bg-white text-zinc-950">
      <V2Hero
        crumbs={[{ href: "/", label: "Home" }, { label: "Blog" }]}
        title="Kennis uit de cabine."
        count={String(sortedArticles.length).padStart(2, "0")}
        intro="Praktische uitleg over autotransport: prijs, import, documenten en routes. Geschreven door mensen die er elke dag mee op de baan zitten."
      />

      {/* Featured */}
      <section className="px-5 sm:px-12 lg:px-16">
        <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-md border border-zinc-200 lg:grid-cols-[1.5fr_1fr]">
          <div className="relative aspect-[16/10] bg-zinc-100 lg:aspect-auto lg:min-h-[28rem]">
            <Image src={featured.image} alt={featured.imageAlt} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.02]" />
            <span className="absolute top-4 left-4 rounded-sm bg-white px-3 py-1.5 text-xs font-medium tracking-[0.18em] uppercase">Nieuwste</span>
          </div>
          <div className="flex flex-col p-6 sm:p-10 lg:border-l lg:border-zinc-200">
            <Meta category={featured.category} date={formatDate(featured.date)} minutes={readingTime(featured)} />
            <h2 className="mt-6 text-3xl leading-[1.08] font-medium tracking-[-0.025em] text-balance sm:text-4xl">{featured.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-500 sm:text-lg">{featured.excerpt}</p>
            <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium">
              <span className="border-b border-zinc-950 pb-0.5">Lees het artikel</span>
              <V2Arrow className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      </section>

      {/* Filter + list */}
      <V2Block>
        <div className="flex flex-col gap-4 border-t border-zinc-950 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">
            <span className="text-zinc-950">01</span>&nbsp;&nbsp;Alle artikels
          </p>
          <div role="group" aria-label="Filter op onderwerp" className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {(["Alle", ...blogCategories] as Filter[]).map((c) => {
              const active = filter === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(c)}
                  className={`inline-flex min-h-11 flex-none snap-start items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors ${
                    active ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 text-zinc-700 hover:border-zinc-950"
                  }`}
                >
                  {c}
                  <span className={`text-xs tabular-nums ${active ? "text-white/60" : "text-zinc-400"}`}>{String(count(c)).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-8 border-t border-zinc-200" aria-live="polite">
          {list.map((a) => (
            <li key={a.slug} className="border-b border-zinc-200">
              <Link href={`/blog/${a.slug}`} className="group grid gap-5 py-6 sm:grid-cols-[11rem_1fr_auto] sm:items-center sm:gap-8">
                <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-zinc-100 sm:aspect-[4/3]">
                  <Image src={a.image} alt="" fill sizes="(min-width: 640px) 176px, 100vw" className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" />
                </div>
                <div>
                  <Meta category={a.category} date={formatDate(a.date)} minutes={readingTime(a)} />
                  <h3 className="mt-3 text-xl font-medium tracking-tight text-balance sm:text-2xl">{a.title}</h3>
                  <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-zinc-500">{a.excerpt}</p>
                </div>
                <span className="hidden size-11 items-center justify-center rounded-full border border-zinc-200 sm:flex transition-colors group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white">
                  <V2Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </V2Block>
    </div>
  );
}

function Meta({ category, date, minutes }: { category: string; date: string; minutes: number }) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-xs">
      <span className="rounded-sm border border-zinc-950 px-2 py-1 font-medium">{category}</span>
      <span className="rounded-sm border border-zinc-200 px-2 py-1 text-zinc-500">{minutes} min</span>
      <span className="text-zinc-400">{date}</span>
    </p>
  );
}
