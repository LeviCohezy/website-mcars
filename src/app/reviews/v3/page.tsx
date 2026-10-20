import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import PageShell from "@/components/page-shell";
import ReviewsV3 from "@/components/reviews-v3";
import VariantSwitcher from "@/components/variant-switcher";
import { reviewsMetadata } from "@/data/reviews";

// Reviews 03 — "Donker & premium". Same content as /reviews, different design.
export const metadata: Metadata = reviewsMetadata;

export default function ReviewsPageV3() {
  return (
    <PageShell>
      <ReviewsV3 />
      <QuoteCta />
      <VariantSwitcher sectionId="reviews" />
    </PageShell>
  );
}
