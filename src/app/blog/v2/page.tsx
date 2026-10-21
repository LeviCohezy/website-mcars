import type { Metadata } from "next";
import BlogFlow from "@/components/blog-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { blogMetadata } from "@/data/blog";

// Blog 02 — one composed film (see blog-flow.tsx); versions differ in hero and tone rhythm.
export const metadata: Metadata = blogMetadata;

export default function BlogPageV2() {
  return (
    <PageShell>
      <BlogFlow version={2} />
      <VariantSwitcher sectionId="blog" />
    </PageShell>
  );
}
