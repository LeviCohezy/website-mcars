"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { sortedArticles, formatDate, readingTime, type ArticleBlock, type ArticlePageData } from "@/data/blog";
import { CloseContact, MetaRow, NextChapter, STUDIO, heroVariant, type Version } from "./case-flow";
import { Arrow, Chapter, ChapterIntro, FlowButton, FlowClose, FlowGrid, FlowHero, FlowPage, Rise, toneClasses, type FlowTone } from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * Article as a reading page first, film second. Same order in all versions:
 *
 *   hero (no form) → 01 het artikel ("in het kort" + reading column) →
 *   02 verder met (related services & routes) → 03 volgende artikel → close (form)
 *
 *   01 cinema    light reading with a sticky TOC on desktop · dark curtain related · light curtain next
 *   02 wordmark  light reading (inline TOC) · paper curtain related · light curtain next
 *   03 lines     dark, with the reading chapter as the one paper interlude
 *
 * The reading column aligns to the frame's 25% line (like FlowFaq), ~65ch, 17–18px.
 */

const TONES: Record<Version, { page: FlowTone; read: FlowTone; related: FlowTone; next: FlowTone }> = {
  1: { page: "light", read: "light", related: "dark", next: "light" },
  2: { page: "light", read: "light", related: "paper", next: "light" },
  3: { page: "dark", read: "paper", related: "dark", next: "dark" },
};

const RELATED_COLS: Record<number, string> = { 1: "lg:grid-cols-3", 2: "lg:grid-cols-3", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };

/** Renders `[label](/href)` as links and `**text**` as bold. */
function Inline({ text, linkClass }: { text: string; linkClass: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) return <Link key={i} href={link[2]} className={linkClass}>{link[1]}</Link>;
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i} className="font-medium text-zinc-950">{bold[1]}</strong>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

const LINK = "text-zinc-950 underline decoration-zinc-950/25 decoration-1 underline-offset-4 transition-colors hover:decoration-zinc-950";

function Body({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if ("p" in b) return <p key={i}><Inline text={b.p} linkClass={LINK} /></p>;
        if ("list" in b) {
          const ListTag = b.ordered ? "ol" : "ul";
          return (
            <ListTag key={i} className="grid border-t border-zinc-950/10">
              {b.list.map((item, j) => (
                <li key={j} className="flex gap-4 border-b border-zinc-950/10 py-3.5">
                  {b.ordered ? (
                    <span className="w-6 flex-none pt-1 font-mono text-[11px] tracking-[0.15em] text-zinc-400">{String(j + 1).padStart(2, "0")}</span>
                  ) : (
                    <span aria-hidden className="mt-[0.75em] h-px w-3 flex-none bg-zinc-950/40" />
                  )}
                  <span><Inline text={item} linkClass={LINK} /></span>
                </li>
              ))}
            </ListTag>
          );
        }
        return (
          <aside key={i} className="rounded-[1.25rem] bg-zinc-950 p-6 text-white sm:p-8">
            <p className="font-mono text-[11px] tracking-[0.2em] text-white/50 uppercase">{b.title ?? "Tip"}</p>
            <p className="mt-3 text-base leading-relaxed text-white/85 sm:text-[1.0625rem]">
              <Inline text={b.tip} linkClass="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white" />
            </p>
          </aside>
        );
      })}
    </>
  );
}

function Toc({ data, className = "" }: { data: ArticlePageData; className?: string }) {
  return (
    <ol className={`grid border-t border-zinc-950/10 ${className}`}>
      {data.article.sections.map((s, i) => (
        <li key={s.id} className="border-b border-zinc-950/10">
          <a href={`#${s.id}`} className="flex min-h-11 items-baseline gap-4 py-3 text-sm leading-snug text-zinc-600 transition-colors hover:text-zinc-950">
            <span className="w-5 flex-none font-mono text-[11px] text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function ArticleFlow({ data, version }: { data: ArticlePageData; version: Version }) {
  const { article, services, routes, more, minutes, date } = data;
  const T = TONES[version];
  const idx = sortedArticles.findIndex((a) => a.slug === article.slug);
  const next = sortedArticles[(idx + 1) % sortedArticles.length];
  const others = more.filter((a) => a.slug !== next.slug).slice(0, 3);
  const related = [...services, ...routes].slice(0, 5);
  const stickyToc = version === 1;

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={heroVariant(version)}
        title={article.title}
        intro={article.excerpt}
        crumbs={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }, { label: article.category }]}
        image={version === 2 ? STUDIO : article.image}
        imageAlt={version === 2 ? "Een Mcars-transporter in de studio" : article.imageAlt}
        wordmark="KENNIS"
        lineImages={[article.image, next.image]}
        aside={<MetaRow light={version === 2} items={[article.category, date, `${minutes} min leestijd`]} />}
      />

      {/* 01 — the article itself */}
      <Chapter n="01" label="Het artikel" tone={T.read} curtain={version === 3}>
        <ChapterIntro lead="In het kort," trail="wat u moet onthouden." />
        <FlowGrid className="mt-12 sm:mt-16">
          <div className={stickyToc ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]" : "lg:ml-[25%]"}>
            {stickyToc && (
              <aside className="hidden lg:block lg:pr-10">
                <div className="sticky top-28">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">Inhoud</p>
                  <Toc data={data} className="mt-5" />
                  <p className="mt-8 text-sm leading-relaxed text-zinc-500">Vragen over uw transport? U krijgt binnen 24 uur een persoonlijk antwoord.</p>
                  <div className="mt-5">
                    <FlowButton href="/offerte">Prijs aanvragen</FlowButton>
                  </div>
                </div>
              </aside>
            )}

            <article className="max-w-[65ch] text-[1.0625rem] leading-[1.75] break-words text-zinc-600 sm:text-lg">
              {/* In het kort */}
              <Rise>
                <div className={`rounded-[1.25rem] p-6 sm:p-8 ${T.read === "paper" ? "bg-white" : "bg-zinc-100"}`}>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">In het kort</p>
                  <ul className="mt-4 grid gap-3 text-base leading-relaxed text-zinc-800">
                    {article.summary.map((s) => (
                      <li key={s} className="flex gap-3">
                        <span aria-hidden className="mt-[0.8em] h-px w-3 flex-none bg-zinc-950/50" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </Rise>

              {/* TOC — collapsible on mobile (all versions), inline on desktop for 02/03 */}
              <details className={`group mt-6 rounded-[1.25rem] ring-1 ring-zinc-950/10 lg:hidden`}>
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 text-sm font-medium text-zinc-950">
                  Inhoud van dit artikel
                  <span aria-hidden className="text-lg transition-transform group-open:rotate-45">+</span>
                </summary>
                <Toc data={data} className="mx-5 mb-4" />
              </details>
              {!stickyToc && (
                <nav aria-label="Inhoud" className="mt-10 hidden lg:block">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">Inhoud</p>
                  <Toc data={data} className="mt-4" />
                </nav>
              )}

              {article.sections.map((s, i) => (
                <section key={s.id} id={s.id} className="mt-14 scroll-mt-28 sm:mt-16">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-zinc-400">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="mt-3 text-2xl leading-[1.15] font-light tracking-[-0.025em] text-balance text-zinc-950 sm:text-[2rem]">{s.title}</h2>
                  <div className="mt-5 grid gap-5">
                    <Body blocks={s.body} />
                  </div>
                </section>
              ))}

              <div className="mt-16 flex flex-col gap-5 border-t border-zinc-950/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm text-base leading-relaxed text-zinc-500">Klaar om uw transport in te plannen? Vraag vrijblijvend uw prijs aan.</p>
                <FlowButton href="/offerte">Prijs aanvragen</FlowButton>
              </div>
            </article>
          </div>
        </FlowGrid>
      </Chapter>

      {/* 02 — related services & routes */}
      {related.length > 0 && (
        <Chapter n="02" label="Verder met" tone={T.related} curtain>
          <ChapterIntro lead="Verwante diensten" trail="en routes." body="Wat u net las, in de praktijk: zo rijden we het voor u." />
          <FlowGrid className="mt-12 sm:mt-16">
            <ul className={`-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 ${RELATED_COLS[Math.min(related.length, 5)]}`}>
              {related.map((r) => (
                <li key={r.href} className="w-[78%] flex-none snap-start sm:w-auto">
                  <Link href={r.href} className="group relative block aspect-[4/5] overflow-hidden rounded-[1.25rem]">
                    <Image src={r.image} alt="" fill sizes="(min-width:1024px) 22vw, 78vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">{r.meta}</span>
                      <span className="mt-1 block text-xl font-light tracking-[-0.02em]">{r.label}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </FlowGrid>
        </Chapter>
      )}

      {/* 03 — the next article, full-bleed; then the rest as hairline rows */}
      <Chapter
        n={related.length > 0 ? "03" : "02"}
        label="Volgende artikel"
        tone={T.next}
        curtain={T.next !== (related.length > 0 ? T.related : T.read)}
      >
        <ChapterIntro lead="Lees verder." trail="Meer uit de kennisbank." action={<FlowButton href="/blog" variant="ghost">Alle artikels</FlowButton>} />
        <div className="mt-12 sm:mt-16">
          <NextChapter
            href={`/blog/${next.slug}`}
            image={next.image}
            alt={next.imageAlt}
            eyebrow={`Volgende · ${next.category} · ${readingTime(next)} min`}
            title={next.title}
            body={next.excerpt}
          />
        </div>
        {others.length > 0 && (
          <FlowGrid className="mt-14 sm:mt-20">
            <ul className={`border-t lg:ml-[25%] ${toneClasses(T.next).line}`}>
              {others.map((a) => (
                <li key={a.slug} className={`border-b ${toneClasses(T.next).line}`}>
                  <Link href={`/blog/${a.slug}`} className="group flex min-h-16 items-center gap-5 py-5">
                    <span className={`hidden w-36 flex-none font-mono text-[11px] tracking-[0.18em] uppercase sm:block ${toneClasses(T.next).faint}`}>{a.category}</span>
                    <span className="flex-1">
                      <span className="block text-lg leading-snug font-light tracking-[-0.015em] sm:text-2xl">{a.title}</span>
                      <span className={`mt-1 block text-sm ${toneClasses(T.next).muted}`}>{formatDate(a.date)} · {readingTime(a)} min</span>
                    </span>
                    <span className={`flex size-11 flex-none items-center justify-center rounded-full ring-1 transition-colors ${T.next === "dark" ? "ring-white/20 group-hover:bg-white group-hover:text-zinc-950" : "ring-zinc-950/15 group-hover:bg-zinc-950 group-hover:text-white"}`}>
                      <Arrow />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </FlowGrid>
        )}
      </Chapter>

      <FlowClose
        lead="Van lezen"
        trail="naar rijden?"
        form={<QuoteFlow tone="dark" />}
        contact={<CloseContact />}
      />
    </FlowPage>
  );
}
