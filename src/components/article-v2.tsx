import Image from "next/image";
import Link from "next/link";
import type { ArticleBlock, ArticlePageData } from "@/data/blog";
import { Inline } from "./article";
import { V2Arrow, V2Block, V2Button, V2Check, V2Head, V2Hero } from "./v2-kit";

/*
 * Artikel 02 — "Licht & strak". White Swiss grid: light hero with a bordered
 * meta row, a wide photo, then a two-column body — a sticky rail with the
 * numbered contents and "In het kort", and a ~65ch reading column whose
 * sections are separated by hairlines. Same content as Artikel 01.
 */

const LINK = "font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-950";

function Body({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if ("p" in b) return <p key={i}><Inline text={b.p} linkClass={LINK} /></p>;
        if ("list" in b) {
          const ListTag = b.ordered ? "ol" : "ul";
          return (
            <ListTag key={i} className="border-t border-zinc-200">
              {b.list.map((item, j) => (
                <li key={j} className="flex gap-4 border-b border-zinc-200 py-4">
                  {b.ordered ? (
                    <span className="w-6 flex-none text-sm font-medium tabular-nums text-zinc-950">{String(j + 1).padStart(2, "0")}</span>
                  ) : (
                    <V2Check className="mt-1" />
                  )}
                  <span><Inline text={item} linkClass={LINK} /></span>
                </li>
              ))}
            </ListTag>
          );
        }
        return (
          <aside key={i} className="rounded-md border border-zinc-200 border-l-zinc-950 border-l-2 p-6 sm:p-7">
            {b.title && <p className="text-xs font-medium tracking-[0.18em] text-zinc-950 uppercase">{b.title}</p>}
            <p className="mt-2 text-base leading-relaxed text-zinc-600"><Inline text={b.tip} linkClass={LINK} /></p>
          </aside>
        );
      })}
    </>
  );
}

export default function ArticleV2({ data }: { data: ArticlePageData }) {
  const { article, services, routes, more, minutes, date } = data;
  const meta = [
    { k: "Categorie", v: article.category },
    { k: "Gepubliceerd", v: date },
    { k: "Leestijd", v: `${minutes} min` },
    { k: "Secties", v: String(article.sections.length).padStart(2, "0") },
  ];

  return (
    <div className="bg-white text-zinc-950">
      <V2Hero crumbs={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }, { label: article.category }]} title={article.title} intro={article.excerpt}>
        <dl className="mt-8 grid grid-cols-2 overflow-hidden rounded-md border border-zinc-200 sm:grid-cols-4">
          {meta.map((m, i) => (
            <div key={m.k} className={`p-4 sm:p-5 ${i % 2 === 1 ? "border-l border-zinc-200" : ""} ${i >= 2 ? "border-t border-zinc-200 sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}>
              <dt className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">{m.k}</dt>
              <dd className="mt-1.5 text-base font-medium tracking-tight">{m.v}</dd>
            </div>
          ))}
        </dl>
      </V2Hero>

      <div className="px-5 sm:px-12 lg:px-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-zinc-100 sm:aspect-[21/9]">
          <Image src={article.image} alt={article.imageAlt} fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>

      {/* Body — rail + reading column */}
      <V2Block>
        <div className="grid gap-12 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">In dit artikel</p>
            <ol className="mt-4 border-t border-zinc-950">
              {article.sections.map((s, i) => (
                <li key={s.id} className="border-b border-zinc-200">
                  <a href={`#${s.id}`} className="group flex min-h-11 items-baseline gap-3 py-3 text-sm leading-snug text-zinc-600 transition-colors hover:text-zinc-950">
                    <span className="w-5 flex-none text-xs font-medium tabular-nums text-zinc-950">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-md bg-zinc-100 p-6">
              <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">In het kort</p>
              <ul className="mt-4 grid gap-3">
                {article.summary.map((s) => (
                  <li key={s} className="flex gap-3 text-sm leading-relaxed text-zinc-700"><V2Check className="mt-0.5" />{s}</li>
                ))}
              </ul>
            </div>
          </aside>

          <article className="max-w-[65ch] break-words text-[1.0625rem] leading-[1.75] text-zinc-600 sm:text-lg">
            {article.sections.map((s, i) => (
              <section key={s.id} id={s.id} className={`scroll-mt-28 ${i > 0 ? "mt-14 border-t border-zinc-200 pt-10 sm:mt-16" : ""}`}>
                <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase tabular-nums">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 text-2xl font-medium leading-[1.15] tracking-[-0.025em] text-balance text-zinc-950 sm:text-3xl">{s.title}</h2>
                <div className="mt-5 grid gap-5">
                  <Body blocks={s.body} />
                </div>
              </section>
            ))}

            <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-md bg-zinc-950 p-7 text-white sm:flex-row sm:items-center sm:p-8">
              <p className="max-w-sm text-base leading-relaxed">Klaar om in te plannen? U krijgt binnen 24 uur een persoonlijk antwoord.</p>
              <Link href="/offerte" className="inline-flex min-h-11 flex-none items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
                Prijs aanvragen <V2Arrow />
              </Link>
            </div>
          </article>
        </div>
      </V2Block>

      {/* Related — bordered cells */}
      <V2Block className="bg-zinc-100">
        <V2Head index="01" label="Verder met" lead="Verwante diensten" trail="en routes." />
        <ul className="grid gap-px overflow-hidden rounded-md bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
          {[...services, ...routes].map((l) => (
            <li key={l.href} className="bg-white">
              <Link href={l.href} className="group flex min-h-36 h-full flex-col p-6 sm:p-7">
                <span className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">{l.meta}</span>
                <span className="mt-auto flex items-end justify-between gap-4 pt-8">
                  <span className="text-xl font-medium tracking-tight">{l.label}</span>
                  <span className="flex size-9 flex-none items-center justify-center rounded-sm border border-zinc-200 transition-colors group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white">
                    <V2Arrow className="size-3.5" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </V2Block>

      {/* More articles — hairline list */}
      <V2Block>
        <V2Head index="02" label="Lees ook" lead="Meer uit" trail="de kennisbank." />
        <ul className="border-t border-zinc-950">
          {more.map((a) => (
            <li key={a.slug} className="border-b border-zinc-200">
              <Link href={`/blog/${a.slug}`} className="group grid items-center gap-4 py-6 sm:grid-cols-[7rem_1fr_auto] sm:gap-8">
                <div className="relative hidden aspect-[4/3] overflow-hidden rounded-md bg-zinc-100 sm:block">
                  <Image src={a.image} alt="" fill sizes="112px" className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">{a.category}</p>
                  <h3 className="mt-2 text-xl font-medium tracking-tight text-balance sm:text-2xl">{a.title}</h3>
                </div>
                <span className="hidden size-10 items-center justify-center rounded-sm border border-zinc-200 transition-colors group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white sm:flex">
                  <V2Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <V2Button href="/blog" variant="outline">Alle artikels</V2Button>
        </div>
      </V2Block>
    </div>
  );
}
