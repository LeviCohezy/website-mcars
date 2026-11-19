import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { QuoteCta } from "@/components/blocks";
import BlogToc, { type TocItem } from "@/components/blog-toc";
import PageShell from "@/components/page-shell";
import { BLOG_CATEGORIES, blogPosts, getBlogPost, headingId, type BlogBlock, type BlogCategory } from "@/data/blog";
import { localize } from "@/i18n/data";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const found = getBlogPost(slug);
  if (!found) return {};
  const post = localize(locale, found);
  const t = await getTranslations({ locale, namespace: "PageBlogPost" });
  return { title: t("metaTitle", { title: post.title }), description: post.excerpt };
}

/*
 * Blog article as a typeset document: one centred reading column (~68ch),
 * a title page on white, a wide lead photo, and rich blocks — H2–H4,
 * summary, steps, callouts, tables, figures and pull quotes.
 */
export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const found = getBlogPost(slug);
  if (!found) notFound();
  const t = await getTranslations("PageBlogPost");
  const format = await getFormatter();
  const blogDate = (iso: string) => format.dateTime(new Date(`${iso}T12:00:00`), { day: "numeric", month: "long", year: "numeric" });
  // Everything shown is localized; the heading ids below come from the localized text.
  const labels = localize(locale, Object.fromEntries(BLOG_CATEGORIES.map((c) => [c, c]))) as Record<BlogCategory, string>;
  const post = localize(locale, found);

  const toc: TocItem[] = post.body.flatMap((b): TocItem[] =>
    b.type === "h2" || b.type === "h3" ? [{ id: headingId(b.text), text: b.text, level: b.type === "h2" ? 2 : 3 }] : [],
  );
  const related = [
    ...blogPosts.filter((p) => p.slug !== found.slug && p.category === found.category),
    ...blogPosts.filter((p) => p.slug !== found.slug && p.category !== found.category),
  ]
    .slice(0, 3)
    .map((p) => ({ post: localize(locale, p), category: p.category }));

  return (
    <PageShell>
      <article>
        {/* Hero: the article photo with title, intro and date on a frosted card */}
        <header>
          <div className="relative flex min-h-[70vh] items-end overflow-hidden rounded-[2rem] bg-zinc-950">
            <Image src={post.image} alt="" fill priority sizes="100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-zinc-950/60 to-transparent" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-950/70 to-transparent" />
            <div className="relative mx-3 mb-3 w-full max-w-[68rem] rounded-[1.25rem] bg-white/10 p-6 text-white ring-1 ring-white/20 backdrop-blur-xl sm:mx-auto sm:mb-8 sm:w-[calc(100%-4rem)] sm:p-8">
              <nav aria-label={t("breadcrumb")} className="flex flex-wrap items-center gap-2 text-sm text-white/70">
                <Link href="/blog" className="transition-colors hover:text-white">{t("blog")}</Link>
                <span aria-hidden className="text-white/35">/</span>
                <span className="text-white">{labels[found.category]}</span>
              </nav>
              <h1 className="mt-3 text-[2.25rem] leading-[1.05] font-medium tracking-[-0.03em] text-balance sm:text-5xl">{post.title}</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{post.excerpt}</p>
              <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/70">
                <span className="font-medium text-white">{t("team")}</span>
                <span aria-hidden className="text-white/35">·</span>
                <span>{blogDate(post.date)}</span>
                <span aria-hidden className="text-white/35">·</span>
                <span>{t("minRead", { minutes: post.minutes })}</span>
              </p>
            </div>
          </div>
        </header>

        {/* Body: the article, with the CTA and chapters beside it */}
        <div className="grid gap-12 px-5 pt-16 pb-8 sm:px-8 sm:pt-20 min-[1720px]:grid-cols-[minmax(0,1fr)_68rem_minmax(0,1fr)] min-[1720px]:gap-10">
          {/* Left margin stays empty so the text column is centred */}
          <div aria-hidden className="hidden min-[1720px]:block" />
          <div className="mx-auto w-full max-w-[68rem] min-w-0">
            {post.body.map((b, i) => (
              <Block key={i} block={b} first={i === 0} />
            ))}

            <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6 text-sm">
              <span className="text-zinc-500">
                {t.rich("writtenBy", { b: (c) => <span className="font-medium text-zinc-950">{c}</span>, date: blogDate(post.date) })}
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">{labels[found.category]}</span>
            </footer>
          </div>

          <aside className="hidden min-[1720px]:block min-[1720px]:pt-1">
            <div className="space-y-4 min-[1720px]:sticky min-[1720px]:top-28 min-[1720px]:max-w-[18rem]">
              <BlogToc items={toc} />
            </div>
          </aside>
        </div>
      </article>

      {/* Related */}
      <section className="px-5 pt-20 pb-4 sm:px-8 sm:pt-28">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-3xl font-medium tracking-[-0.025em] text-zinc-950 sm:text-4xl">{t("related")}</h2>
          <Link href="/blog" className="text-sm font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950">
            {t("allArticles")}
          </Link>
        </div>
        <ul className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {related.map(({ post: p, category }) => (
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
                  <span className="absolute top-3 left-3 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-zinc-950">{labels[category]}</span>
                </div>
                <h3 className="mt-5 text-xl leading-snug font-medium tracking-[-0.015em] text-zinc-950 decoration-zinc-300 underline-offset-4 group-hover:underline">{p.title}</h3>
                <p className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-600">
                  <span className="rounded-full bg-zinc-100 px-3 py-1">{t("minRead", { minutes: p.minutes })}</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1">{blogDate(p.date)}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <QuoteCta />
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */

/** Inline **bold** and [links](/path) inside article text. */
function rich(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-zinc-950">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <Link
          key={i}
          href={link[2]}
          className="mx-0.5 inline-flex items-center gap-1 rounded-md bg-zinc-100 px-1.5 py-px font-medium text-zinc-950 underline decoration-zinc-400 decoration-1 underline-offset-[3px] ring-1 ring-zinc-200 transition-colors hover:bg-zinc-950 hover:text-white hover:decoration-white/60 hover:ring-zinc-950"
        >
          {link[1]}
          <svg className="size-3 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </Link>
      );
    }
    return part;
  });
}

const body = "text-[1.125rem] leading-[1.8] text-zinc-700";

// Alerts: dark frosted glass; the tone shows only in the icon.
const TONES = {
  info: { icon: "text-sky-300", glyph: "M12 11v6M12 7.5h.01", ring: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" },
  tip: { icon: "text-emerald-300", glyph: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.4.3.6.8.6 1.2v1h6v-1c0-.4.2-.9.6-1.2A6 6 0 0 0 12 3z", ring: "" },
  warning: { icon: "text-amber-300", glyph: "M12 9v4M12 16.5h.01", ring: "M10.3 3.9L2.5 17.5A2 2 0 0 0 4.2 20.5h15.6a2 2 0 0 0 1.7-3l-7.8-13.6a2 2 0 0 0-3.4 0z" },
} as const;

function Block({ block, first }: { block: BlogBlock; first: boolean }) {
  switch (block.type) {
    case "p":
      // The opening paragraph reads as the article's lede.
      return first ? (
        <p className="text-[1.375rem] leading-[1.6] tracking-[-0.01em] text-zinc-950">{rich(block.text)}</p>
      ) : (
        <p className={`mt-6 ${body}`}>{rich(block.text)}</p>
      );

    // A clear H2 → H4 ladder: size, weight and a rule on H2 only.
    case "h2":
      return (
        <h2 id={headingId(block.text)} className="mt-20 scroll-mt-28 border-t border-zinc-950 pt-6 text-[2.25rem] leading-[1.1] font-medium tracking-[-0.03em] text-zinc-950 sm:text-[2.5rem]">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 id={headingId(block.text)} className="mt-12 scroll-mt-28 text-[1.625rem] leading-[1.2] font-medium tracking-[-0.02em] text-zinc-950">
          {block.text}
        </h3>
      );
    case "h4":
      return <h4 className="mt-9 text-[0.8125rem] font-semibold tracking-[0.16em] text-zinc-500 uppercase">{block.text}</h4>;

    case "list":
      return (
        <ul className="mt-6 space-y-3.5">
          {block.items.map((it) => (
            <li key={it} className={`relative pl-9 ${body}`}>
              <span aria-hidden className="absolute top-[0.45em] left-0 flex size-5 items-center justify-center rounded-full bg-zinc-950 text-white">
                <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </span>
              {rich(it)}
            </li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <ol className="mt-8 grid gap-3">
          {block.items.map((s, i) => (
            <li key={s.title} className="flex gap-5 rounded-2xl border border-zinc-200 p-5 sm:p-6">
              <span className="flex size-11 flex-none items-center justify-center rounded-xl bg-zinc-950 text-base font-semibold text-white tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-0.5">
                <p className="text-[1.125rem] font-semibold text-zinc-950">{s.title}</p>
                <p className="mt-1 text-[1.0625rem] leading-relaxed text-zinc-600">{rich(s.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "summary":
      return (
        <aside className="mt-10 rounded-2xl bg-zinc-100 p-7 sm:p-8">
          <p className="text-[0.8125rem] font-semibold tracking-[0.16em] text-zinc-500 uppercase">{block.title}</p>
          <ul className="mt-5 space-y-3">
            {block.items.map((it) => (
              <li key={it} className="flex gap-3 text-[1.0625rem] leading-relaxed text-zinc-900">
                <span aria-hidden className="mt-1 flex size-5 flex-none items-center justify-center rounded-full bg-zinc-950 text-white">
                  <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                {rich(it)}
              </li>
            ))}
          </ul>
        </aside>
      );

    case "callout": {
      const t = TONES[block.tone];
      return (
        <aside role="note" className="mt-8 flex gap-4 rounded-2xl bg-zinc-950/90 p-6 text-white shadow-[0_20px_40px_-24px_rgb(0_0_0/0.6)] ring-1 ring-white/10 backdrop-blur-xl sm:p-7">
          <svg className={`mt-0.5 size-6 flex-none ${t.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {t.ring && <path d={t.ring} />}
            <path d={t.glyph} />
          </svg>
          <div>
            <p className="font-semibold">{block.title}</p>
            <p className="mt-1.5 text-[1.0625rem] leading-relaxed text-white/70">{rich(block.text)}</p>
          </div>
        </aside>
      );
    }

    case "table":
      return (
        <figure className="mt-8">
          <div className="overflow-x-auto rounded-2xl border border-zinc-200">
            <table className="w-full min-w-[32rem] border-collapse text-left text-[0.975rem]">
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h} scope="col" className="bg-zinc-950 px-5 py-4 text-sm font-semibold text-white">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-t border-zinc-200 even:bg-zinc-50">
                    {row.map((cell, c) => (
                      <td key={c} className={`px-5 py-4 align-top leading-relaxed ${c === 0 ? "font-semibold text-zinc-950" : "text-zinc-600"}`}>
                        {rich(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <figcaption className="mt-3 text-sm text-zinc-500">{block.caption}</figcaption>}
        </figure>
      );

    // Images always sit in a framed card, caption inside the frame.
    case "image":
      return (
        <figure className="my-12 rounded-[1.75rem] bg-zinc-100 p-2.5">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.25rem] bg-zinc-200">
            <Image src={block.src} alt={block.alt} fill sizes="(min-width: 1088px) 1088px, 100vw" className="object-cover" />
          </div>
          {block.caption && (
            <figcaption className="flex items-start gap-2.5 px-3 pt-3.5 pb-2 text-sm leading-relaxed text-zinc-600">
              <span aria-hidden className="mt-[0.45em] size-1.5 flex-none rounded-full bg-zinc-950" />
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "quote":
      return (
        <figure className="relative my-12 overflow-hidden rounded-2xl bg-zinc-100 py-9 pr-8 pl-10 sm:pl-12">
          <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-zinc-950" />
          <svg className="size-8 text-zinc-950" viewBox="0 0 32 32" fill="currentColor" aria-hidden>
            <path d="M13 7C7.5 9 4 13.3 4 19v6h9v-9H8.5c.3-3.4 2.3-6 5.5-7.3zm15 0c-5.5 2-9 6.3-9 12v6h9v-9h-4.5c.3-3.4 2.3-6 5.5-7.3z" />
          </svg>
          <blockquote className="mt-4 text-[1.625rem] leading-[1.35] font-medium tracking-[-0.02em] text-balance text-zinc-950 sm:text-[1.875rem]">
            {block.text}
          </blockquote>
          {block.cite && <figcaption className="mt-5 text-sm font-medium text-zinc-500">{block.cite}</figcaption>}
        </figure>
      );

    case "divider":
      return (
        <div role="separator" className="my-16 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1.5 rounded-full bg-zinc-950" />
          ))}
        </div>
      );
  }
}
