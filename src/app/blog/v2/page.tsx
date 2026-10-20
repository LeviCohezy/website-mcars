import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import BlogV2 from "@/components/blog-v2";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { blogMetadata } from "@/data/blog";

// Blog 02 — "Licht & strak". Same content as /blog, different design.
export const metadata: Metadata = blogMetadata;

export default function BlogPageV2() {
  return (
    <PageShell navTheme="light">
      <BlogV2 />
      <QuoteCta />
      <VariantSwitcher sectionId="blog" />
    </PageShell>
  );
}
