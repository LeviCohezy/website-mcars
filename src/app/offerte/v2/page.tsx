import type { Metadata } from "next";
import OfferteFlow from "@/components/offerte-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Offerte 02 — one composed flow (see offerte-flow.tsx); versions differ in hero and tone rhythm.
export const metadata: Metadata = {
  title: "Offerte aanvragen | Mcars",
  description:
    "Vraag vrijblijvend uw prijs voor autotransport aan. U krijgt binnen 24 uur een persoonlijk antwoord met prijs en planning — geen calculator, geen automatische mail.",
};

export default function OffertePageV2() {
  return (
    <PageShell>
      <OfferteFlow version={2} />
      <VariantSwitcher sectionId="offerte" />
    </PageShell>
  );
}
