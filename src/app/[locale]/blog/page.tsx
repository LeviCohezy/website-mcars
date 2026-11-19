import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BlogIndex, { BlogFeature } from "@/components/blog-index";
import { QuoteCta } from "@/components/blocks";
import PageShell from "@/components/page-shell";
import Section from "@/components/section";
import { BLOG_CATEGORIES, blogPosts, type BlogCategory } from "@/data/blog";
import { localize } from "@/i18n/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "PageBlog" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  // The category stays Dutch (it is the filter key); labels carry the translation.
  const posts = blogPosts.map((p) => ({ ...localize(locale, p), category: p.category }));
  const labels = localize(locale, Object.fromEntries(BLOG_CATEGORIES.map((c) => [c, c]))) as Record<BlogCategory, string>;
  const featured = posts.find((p) => p.featured) ?? posts[0];
  return (
    <PageShell>
      <BlogFeature post={featured} label={labels[featured.category]} />

      <Section space="default" id="blog">
        <BlogIndex posts={posts} labels={labels} />
      </Section>

      <QuoteCta />
    </PageShell>
  );
}
