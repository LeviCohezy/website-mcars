import Image from "next/image";
import Link from "next/link";
import type { ArticleBlock, ArticlePageData } from "@/data/blog";
import { Inline } from "./article";
import { Reveal } from "./scroll";
import { V3Arrow, V3Block, V3Button, V3Head, V3Hero, V3Tick } from "./v3-kit";

/*
 * Artikel 03 — "Donker & premium". Black page, centred cinematic hero, then a
 * single centred ~65ch column with large light type: an oversized "In het
 * kort", a numbered contents strip, sections with big numerals, a full-width
 * photo break, and dark photo cards for related pages. Same content as 01.
 */

const LINK = "text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white";

function Body({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if ("p" in b) return <p key={i}><Inline text={b.p} linkClass={LINK} /></p>;
        if ("list" in b) {
          const ListTag = b.ordered ? "ol" : "ul";
          return (
            <ListTag key={i} className="grid gap-4">
              {b.list.map((item, j) => (
                <li key={j} className="flex gap-4">
                  {b.ordered ? (
                    <span className="w-7 flex-none text-sm font-light tabular-nums text-white/40">{String(j + 1).padStart(2, "0")}</span>
                  ) : (
                    <V3Tick />
                  )}
                  <span><Inline text={item} linkClass={LINK} /></span>
                </li>
              ))}
            </ListTag>
          );
        }
        return (
          <aside key={i} className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 sm:p-8">
            {b.title && <p className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">{b.title}</p>}
            <p className="mt-3 text-lg leading-relaxed font-light text-white/85 sm:text-xl"><Inline text={b.tip} linkClass={LINK} /></p>
          </aside>
        );
      })}
    </>
  );
}

export default function ArticleV3({ data }: { data: ArticlePageData }) {
  const { article, services, routes, more, minutes, date } = data;
  // Photo break roughly halfway through the article.
  const breakAt = Math.ceil(article.sections.length / 2);

  return (
    <>
      <V3Hero image={article.image} short crumbs={[{ href: "/blog", label: "Blog" }, { label: article.category }]} title={article.title} intro={article.excerpt}>
        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/55">
          <span className="rounded-full border border-white/20 px-3 py-1 text-white/80">{article.category}</span>
          <span>{date}</span>
          <span aria-hidden className="text-white/25">·</span>
          <span>{minutes} min leestijd</span>
        </p>
      </V3Hero>

      {/* In het kort — oversized, centred */}
      <V3Block className="pt-12 sm:pt-16">
        <Reveal className="mx-auto max-w-3xl">
          <p className="flex items-center justify-center gap-2.5 text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
            <span aria-hidden className="h-px w-6 bg-white/40" />
            In het kort
          </p>
          <ul className="mt-10 grid border-t border-white/10">
            {article.summary.map((s, i) => (
              <li key={s} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/10 py-6 sm:grid-cols-[4.5rem_1fr]">
                <span className="text-3xl font-light tracking-[-0.04em] text-white/30 tabular-nums sm:text-4xl">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-xl leading-snug font-light tracking-[-0.01em] text-balance text-white sm:text-2xl">{s}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Contents strip */}
        <nav aria-label="Inhoud" className="mx-auto mt-14 max-w-3xl">
          <ol className="flex flex-wrap justify-center gap-2">
            {article.sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-left text-sm text-white/70 transition-colors hover:border-white/50 hover:text-white">
                  <span className="text-xs tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </V3Block>

      {/* Body */}
      <div className="px-5 pb-20 sm:px-10 sm:pb-32 lg:px-14">
        {article.sections.map((s, i) => (
          <div key={s.id}>
            {i === breakAt && (
              <figure className="relative -mx-5 my-20 aspect-[4/3] overflow-hidden sm:-mx-10 sm:my-28 sm:aspect-[21/9] lg:-mx-14">
                <Image src={article.image} alt={article.imageAlt} fill sizes="100vw" className="object-cover opacity-80" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
              </figure>
            )}
            <section id={s.id} className={`mx-auto max-w-[65ch] scroll-mt-28 break-words ${i > 0 && i !== breakAt ? "mt-20 sm:mt-24" : ""}`}>
              <p className="text-5xl font-light tracking-[-0.05em] text-white/20 tabular-nums sm:text-6xl">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-4 text-3xl font-light leading-[1.08] tracking-[-0.03em] text-balance text-white sm:text-4xl">{s.title}</h2>
              <div className="mt-7 grid gap-6 text-[1.0625rem] leading-[1.8] text-white/65 sm:text-lg">
                <Body blocks={s.body} />
              </div>
            </section>
          </div>
        ))}

        <div className="mx-auto mt-20 max-w-[65ch] border-t border-white/10 pt-10 text-center">
          <p className="text-2xl font-light tracking-[-0.02em] text-balance text-white sm:text-3xl">Klaar om uw transport in te plannen?</p>
          <p className="mt-3 text-base text-white/55">U krijgt binnen 24 uur een persoonlijk antwoord.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <V3Button href="/offerte">Prijs aanvragen</V3Button>
            <V3Button href="/contact" variant="ghost">Contact</V3Button>
          </div>
        </div>
      </div>

      {/* Related — dark photo cards */}
      <V3Block className="border-t border-white/10">
        <V3Head label="Verder met" lead="Verwante diensten" trail="en routes." center />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...services, ...routes].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-6">
                <Image src={l.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <span className="relative text-xs font-medium tracking-[0.2em] text-white/55 uppercase">{l.meta}</span>
                <span className="relative mt-2 flex items-end justify-between gap-4">
                  <span className="text-2xl font-light tracking-[-0.02em]">{l.label}</span>
                  <span className="flex size-10 flex-none items-center justify-center rounded-full border border-white/25 transition-colors group-hover:bg-white group-hover:text-zinc-950">
                    <V3Arrow />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </V3Block>

      {/* More articles */}
      <V3Block className="pt-0 sm:pt-0">
        <V3Head label="Lees ook" lead="Meer uit" trail="de kennisbank." />
        <ul className="border-t border-white/10">
          {more.map((a, i) => (
            <li key={a.slug} className="border-b border-white/10">
              <Link href={`/blog/${a.slug}`} className="group grid items-baseline gap-3 py-7 sm:grid-cols-[4rem_1fr_auto] sm:gap-8">
                <span className="text-sm font-light tabular-nums text-white/35">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-xs font-medium tracking-[0.2em] text-white/45 uppercase">{a.category}</span>
                  <span className="mt-2 block text-2xl font-light leading-snug tracking-[-0.02em] text-balance transition-transform duration-500 motion-safe:group-hover:translate-x-1 sm:text-3xl">{a.title}</span>
                </span>
                <span className="hidden text-white/50 transition-colors group-hover:text-white sm:block"><V3Arrow className="size-5" /></span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <V3Button href="/blog" variant="ghost">Alle artikels</V3Button>
        </div>
      </V3Block>
    </>
  );
}
