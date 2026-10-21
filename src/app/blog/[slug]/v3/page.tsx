import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleFlow from "@/components/article-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { articleMetadata, articleStaticParams, getArticlePage } from "@/data/blog";

// Artikel 03 — one composed reading film (see article-flow.tsx); versions differ in hero and tone rhythm.
export const generateStaticParams = articleStaticParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return articleMetadata(params);
}

export default async function ArticlePageV3({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getArticlePage(slug);
  if (!data) notFound();
  return (
    <PageShell>
      <ArticleFlow data={data} version={3} />
      <VariantSwitcher sectionId="artikel" base={`/blog/${slug}`} />
    </PageShell>
  );
}
