import type { Metadata } from "next";
import BlogIndex, { BlogFeature } from "@/components/blog-index";
import { QuoteCta } from "@/components/blocks";
import PageShell from "@/components/page-shell";
import Section from "@/components/section";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog & kennisbank | Mcars",
  description:
    "Tips en uitleg over autotransport: kosten, import uit Duitsland, transport binnen Europa, depannage, niet-rijdende wagens en documenten.",
};

export default function BlogPage() {
  return (
    <PageShell>
      <BlogFeature post={blogPosts.find((p) => p.featured) ?? blogPosts[0]} />

      <Section space="default" id="blog">
        <BlogIndex posts={blogPosts} />
      </Section>

      <QuoteCta />
    </PageShell>
  );
}
