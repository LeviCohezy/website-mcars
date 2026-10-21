import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleFlow from "@/components/article-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { articleMetadata, articleStaticParams, getArticlePage } from "@/data/blog";
import { site } from "@/lib/site";

// Artikel 01 — one composed reading film (see article-flow.tsx); versions differ in hero and tone rhythm.
export const generateStaticParams = articleStaticParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return articleMetadata(params);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getArticlePage(slug);
  if (!data) notFound();
  const { article } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.seo.description,
    datePublished: article.date,
    inLanguage: "nl-BE",
    author: { "@type": "Organization", name: site.legalName },
    publisher: { "@type": "Organization", name: site.legalName },
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleFlow data={data} version={1} />
      <VariantSwitcher sectionId="artikel" base={`/blog/${slug}`} />
    </PageShell>
  );
}
