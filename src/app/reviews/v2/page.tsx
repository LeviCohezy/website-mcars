import type { Metadata } from "next";
import PageShell from "@/components/page-shell";
import ReviewsFlow from "@/components/reviews-flow";
import VariantSwitcher from "@/components/variant-switcher";
import { reviewsMetadata } from "@/data/reviews";

// Reviews 02 — one composed flow (see reviews-flow.tsx); versions differ in hero and tone rhythm.
export const metadata: Metadata = reviewsMetadata;

export default function ReviewsPageV2() {
  return (
    <PageShell>
      <ReviewsFlow version={2} />
      <VariantSwitcher sectionId="reviews" />
    </PageShell>
  );
}
