import type { Metadata } from "next";
import PageShell from "@/components/page-shell";
import ReviewsFlow from "@/components/reviews-flow";
import VariantSwitcher from "@/components/variant-switcher";
import { reviewsMetadata } from "@/data/reviews";

// Reviews 01 — one composed flow (see reviews-flow.tsx); versions differ in hero and tone rhythm.
export const metadata: Metadata = reviewsMetadata;

export default function ReviewsPage() {
  return (
    <PageShell>
      <ReviewsFlow version={1} />
      <VariantSwitcher sectionId="reviews" />
    </PageShell>
  );
}
