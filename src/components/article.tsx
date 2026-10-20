import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import type { ArticleBlock, ArticlePageData } from "@/data/blog";
import { LinkList } from "./blocks";
import PageHero from "./page-hero";
import { Reveal } from "./scroll";
import Section from "./section";
import { ArrowButton, ArrowChip, Eyebrow, SectionHeader } from "./ui";

/*
 * Artikel 01 — cinematic. PageHero, then a readable column (~65ch) beside a
 * sticky table of contents on desktop (a collapsible "Inhoud" on mobile),
 * related services/routes and more articles. Shares its content with 02/03
 * through src/data/blog.ts; the inline renderer below is shared too.
 */

/** Renders `[label](/href)` as links and `**text**` as bold. */
export function Inline({ text, linkClass }: { text: string; linkClass: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) return <Link key={i} href={link[2]} className={linkClass}>{link[1]}</Link>;
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i} className="font-semibold">{bold[1]}</strong>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

const LINK = "font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-950";

function Body({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if ("p" in b) return <p key={i}><Inline text={b.p} linkClass={LINK} /></p>;
        if ("list" in b) {
          const ListTag = b.ordered ? "ol" : "ul";
          return (
            <ListTag key={i} className="grid gap-3">
              {b.list.map((item, j) => (
                <li key={j} className="flex gap-4">
                  {b.ordered ? (
                    <span className="w-6 flex-none pt-0.5 text-sm font-medium tabular-nums text-zinc-400">{String(j + 1).padStart(2, "0")}</span>
                  ) : (
                    <span aria-hidden className="mt-[0.7em] size-1.5 flex-none rounded-full bg-zinc-950" />
                  )}
                  <span><Inline text={item} linkClass={LINK} /></span>
                </li>
              ))}
            </ListTag>
          );
        }
        return (
          <aside key={i} className="rounded-3xl bg-zinc-950 p-6 text-white sm:p-8">
            {b.title && <p className="text-xs font-medium tracking-[0.18em] text-white/50 uppercase">{b.title}</p>}
            <p className="mt-3 text-base leading-relaxed text-white/85 sm:text-[1.0625rem]">
              <Inline text={b.tip} linkClass="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white" />
            </p>
          </aside>
        );
      })}
    </>
  );
}

export default function Article({ data }: { data: ArticlePageData }) {
  const { article, services, routes, more, minutes, date } = data;

  return (
    <>
      <PageHero
        eyebrow={article.category}
        title={article.title}
        subtitle={article.excerpt}
        crumbs={[{ label: "Blog", href: "/blog" }, { label: article.category }]}
        image={article.image}
        badges={[{ label: date }, { label: `${minutes} min leestijd` }]}
        primaryCta={{ label: "Prijs aanvragen", href: "/offerte" }}
      />

      <Section space="loose">
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-10">
          {/* TOC — sticky rail on desktop, collapsible on mobile */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <details className="group rounded-3xl bg-zinc-100 lg:hidden">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-5 py-3 text-sm font-medium text-zinc-950">
                Inhoud van dit artikel
                <span aria-hidden className="text-lg transition-transform group-open:rotate-45">+</span>
              </summary>
              <Toc data={data} className="px-5 pb-5" />
            </details>
            <div className="hidden lg:block">
              <Eyebrow>Inhoud</Eyebrow>
              <Toc data={data} className="mt-5" />
              <div className="mt-8 border-t border-zinc-200 pt-6">
                <p className="text-sm leading-relaxed text-zinc-500">Vragen over uw transport? U krijgt binnen 24 uur een persoonlijk antwoord.</p>
                <ArrowButton href="/offerte" className="mt-5">Prijs aanvragen</ArrowButton>
              </div>
            </div>
          </aside>

          {/* Reading column */}
          <article className="max-w-[65ch] break-words text-[1.0625rem] leading-[1.75] text-zinc-600 sm:text-lg">
            <Reveal className="rounded-3xl bg-zinc-100 p-6 sm:p-8">
              <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">In het kort</p>
              <ul className="mt-4 grid gap-3 text-base leading-relaxed text-zinc-800">
                {article.summary.map((s) => (
                  <li key={s} className="flex gap-3">
                    <span aria-hidden className="mt-[0.6em] size-1.5 flex-none rounded-full bg-zinc-950" />
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>

            {article.sections.map((s) => (
              <section key={s.id} id={s.id} className="mt-14 scroll-mt-28 sm:mt-16">
                <h2 className="text-2xl font-medium leading-[1.15] tracking-[-0.02em] text-balance text-zinc-950 sm:text-3xl">{s.title}</h2>
                <div className="mt-5 grid gap-5">
                  <Body blocks={s.body} />
                </div>
              </section>
            ))}

            <div className="mt-16 flex flex-col gap-5 border-t border-zinc-950 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-base leading-relaxed text-zinc-500">Klaar om uw transport in te plannen? Vraag vrijblijvend uw prijs aan.</p>
              <ArrowButton href="/offerte" className="flex-none">Prijs aanvragen</ArrowButton>
            </div>
          </article>
        </div>
      </Section>

      {/* Related services & routes */}
      <Section space="flush-top">
        <SectionHeader label="Verder met" lead="Verwante diensten" trail="en routes." className="mb-10" />
        <div className="grid gap-8 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <span aria-hidden />
          <LinkList items={[...services, ...routes].map((l) => ({ href: l.href, label: l.label, meta: l.meta }))} />
        </div>
      </Section>

      {/* More articles */}
      <Section space="none">
        <SectionHeader label="Lees ook" lead="Meer uit" trail="de kennisbank." action={<ArrowButton href="/blog" variant="light">Alle artikels</ArrowButton>} className="mb-10" />
        <div className="grid gap-5 md:grid-cols-3">
          {more.map((a, i) => (
            <Reveal key={a.slug} delay={i * 80}>
              <Link href={`/blog/${a.slug}`} className="group flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-zinc-100">
                  <Image src={a.image} alt={a.imageAlt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.04]" />
                  <span className="absolute right-4 bottom-4"><ArrowChip /></span>
                </div>
                <p className="mt-5 text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{a.category}</p>
                <h3 className="mt-2 text-xl font-medium leading-snug tracking-tight text-balance text-zinc-950">{a.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

function Toc({ data, className = "" }: { data: ArticlePageData; className?: string }) {
  return (
    <ol className={`grid border-t border-zinc-200 ${className}`}>
      {data.article.sections.map((s, i) => (
        <li key={s.id} className="border-b border-zinc-200">
          <a href={`#${s.id}`} className="flex min-h-11 items-baseline gap-4 py-3 text-sm leading-snug text-zinc-600 transition-colors hover:text-zinc-950">
            <span className="w-5 flex-none text-xs tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );
}
