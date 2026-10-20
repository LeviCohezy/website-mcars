import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import PageShell from "@/components/page-shell";
import ReviewsV2 from "@/components/reviews-v2";
import VariantSwitcher from "@/components/variant-switcher";
import { reviewsMetadata } from "@/data/reviews";

// Reviews 02 — "Licht & strak". Same content as /reviews, different design.
export const metadata: Metadata = reviewsMetadata;

export default function ReviewsPageV2() {
  return (
    <PageShell navTheme="light">
      <ReviewsV2 />
      <QuoteCta />
      <VariantSwitcher sectionId="reviews" />
    </PageShell>
  );
}
