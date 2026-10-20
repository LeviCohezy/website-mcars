import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleV3 from "@/components/article-v3";
import { QuoteCta } from "@/components/blocks";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { V3Page } from "@/components/v3-kit";
import { articleMetadata, articleStaticParams, getArticlePage } from "@/data/blog";

// Artikel 03 — "Donker & premium". Same content as /blog/[slug], different design.
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
      <V3Page>
        <ArticleV3 data={data} />
      </V3Page>
      <QuoteCta />
      <VariantSwitcher sectionId="artikel" base={`/blog/${slug}`} />
    </PageShell>
  );
}
