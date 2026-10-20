import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleV2 from "@/components/article-v2";
import { QuoteCta } from "@/components/blocks";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { articleMetadata, articleStaticParams, getArticlePage } from "@/data/blog";

// Artikel 02 — "Licht & strak". Same content as /blog/[slug], different design.
export const generateStaticParams = articleStaticParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return articleMetadata(params);
}

export default async function ArticlePageV2({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getArticlePage(slug);
  if (!data) notFound();
  return (
    <PageShell navTheme="light">
      <ArticleV2 data={data} />
      <QuoteCta />
      <VariantSwitcher sectionId="artikel" base={`/blog/${slug}`} />
    </PageShell>
  );
}
