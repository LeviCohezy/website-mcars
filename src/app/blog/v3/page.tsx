import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import BlogV3 from "@/components/blog-v3";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { V3Page } from "@/components/v3-kit";
import { blogMetadata } from "@/data/blog";

// Blog 03 — "Donker & premium". Same content as /blog, different design.
export const metadata: Metadata = blogMetadata;

export default function BlogPageV3() {
  return (
    <PageShell>
      <V3Page>
        <BlogV3 />
      </V3Page>
      <QuoteCta />
      <VariantSwitcher sectionId="blog" />
    </PageShell>
  );
}
