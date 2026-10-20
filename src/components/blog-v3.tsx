import Image from "next/image";
import Link from "next/link";
import { blogCategories, formatDate, readingTime, sortedArticles, type Article } from "@/data/blog";
import { Reveal } from "./scroll";
import { ImageAccordion } from "./signature";
import { V3Arrow, V3Block, V3Head, V3Hero } from "./v3-kit";

/*
 * Blog 03 — "Donker & premium". Centred cinematic hero, then a dark magazine
 * grid: a large cover story, photo tiles with overlaid titles, and an
 * oversized, numbered index of every article by topic.
 */

/** Topic photos that don't repeat the article covers shown just above. */
const TOPIC_IMAGES = [
  "/images/generated/truck-studio.jpg",
  "/images/generated/workshop.jpg",
  "/fleet/valley-sunset.jpg",
  "/images/generated/depot-night.jpg",
  "/images/generated/strap-closeup.jpg",
  "/images/generated/team-depot.jpg",
  "/fleet/sunset-field.jpg",
];

export default function BlogV3() {
  const [cover, second, third, ...rest] = sortedArticles;

  return (
    <>
      <V3Hero
        image="/fleet/barcelona-palms.jpg"
        crumbs={[{ href: "/", label: "Home" }, { label: "Blog" }]}
        title="Kennis uit de cabine."
        intro="Praktische uitleg over autotransport — prijs, import, documenten en routes — van mensen die er elke dag mee op de baan zitten."
      >
        <div className="mx-auto mt-10 grid max-w-md grid-cols-2 border-t border-white/15">
          <div className="py-5">
            <p className="text-4xl font-light tracking-[-0.04em] tabular-nums sm:text-5xl">{String(sortedArticles.length).padStart(2, "0")}</p>
            <p className="mt-1 text-xs text-white/50">artikels</p>
          </div>
          <div className="border-l border-white/15 py-5">
            <p className="text-4xl font-light tracking-[-0.04em] tabular-nums sm:text-5xl">{String(blogCategories.length).padStart(2, "0")}</p>
            <p className="mt-1 text-xs text-white/50">onderwerpen</p>
          </div>
        </div>
      </V3Hero>

      {/* Magazine grid */}
      <V3Block className="pt-12 sm:pt-16">
        <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <Tile article={cover} big className="lg:col-span-2 lg:row-span-2" />
          <Tile article={second} />
          <Tile article={third} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 80}>
              <Link href={`/blog/${a.slug}`} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/30">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                  <Image src={a.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover opacity-75 transition-all duration-700 group-hover:scale-105 group-hover:opacity-95" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs font-medium tracking-[0.2em] text-white/45 uppercase">{a.category}</p>
                  <h3 className="mt-3 text-xl leading-snug font-light tracking-[-0.015em] text-balance">{a.title}</h3>
                  <p className="mt-auto flex items-center justify-between pt-6 text-sm text-white/45">
                    <span>{readingTime(a)} min · {formatDate(a.date)}</span>
                    <V3Arrow className="size-4 text-white/60 transition-transform motion-safe:group-hover:translate-x-0.5" />
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </V3Block>

      {/* Index by topic */}
      <V3Block className="border-t border-white/10">
        <V3Head label="Per onderwerp" lead="Alles op één plek," trail="geordend per thema." />
        {/* Compact list on small screens; the photo accordion from lg up */}
        <ul className="border-t border-white/10 lg:hidden">
          {blogCategories.map((c) => {
            const list = sortedArticles.filter((a) => a.category === c);
            return (
              <li key={c} className="border-b border-white/10">
                <Link href={`/blog/${list[0].slug}`} className="flex min-h-11 items-baseline justify-between gap-4 py-4">
                  <span className="text-xl font-light tracking-[-0.02em]">{c}</span>
                  <span className="text-sm tabular-nums text-white/40">{String(list.length).padStart(2, "0")}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="hidden lg:block">
        <ImageAccordion
          tone="dark"
          items={blogCategories.map((c, i) => {
            const list = sortedArticles.filter((a) => a.category === c);
            return {
              title: c,
              body: list.map((a) => a.title).join(" · "),
              image: TOPIC_IMAGES[i % TOPIC_IMAGES.length],
              href: `/blog/${list[0].slug}`,
              meta: `${String(list.length).padStart(2, "0")} ${list.length === 1 ? "artikel" : "artikels"}`,
            };
          })}
        />
        </div>
      </V3Block>
    </>
  );
}

function Tile({ article, big = false, className = "" }: { article: Article; big?: boolean; className?: string }) {
  return (
    <Reveal className={className}>
      <Link href={`/blog/${article.slug}`} className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-8 ${big ? "min-h-[28rem] lg:min-h-[38rem]" : "min-h-[20rem]"}`}>
        <Image src={article.image} alt={article.imageAlt} fill priority={big} sizes={big ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"} className="object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        <div className="relative">
          <p className="flex flex-wrap items-center gap-3 text-xs text-white/60">
            <span className="rounded-full border border-white/25 px-3 py-1 font-medium tracking-[0.15em] text-white/85 uppercase">{article.category}</span>
            <span>{readingTime(article)} min · {formatDate(article.date)}</span>
          </p>
          <h2 className={`mt-4 font-light tracking-[-0.03em] text-balance text-white ${big ? "max-w-2xl text-3xl leading-[1.05] sm:text-5xl" : "text-2xl leading-[1.1]"}`}>{article.title}</h2>
          {big && <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65">{article.excerpt}</p>}
          <span className="mt-6 inline-flex size-11 items-center justify-center rounded-full bg-white text-zinc-950 transition-transform motion-safe:group-hover:translate-x-1">
            <V3Arrow />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
