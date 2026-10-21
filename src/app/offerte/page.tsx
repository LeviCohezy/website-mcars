import type { Metadata } from "next";
import OfferteFlow from "@/components/offerte-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Offerte 01 — one composed flow (see offerte-flow.tsx); versions differ in hero and tone rhythm.
export const metadata: Metadata = {
  title: "Offerte aanvragen | Mcars",
  description:
    "Vraag vrijblijvend uw prijs voor autotransport aan. U krijgt binnen 24 uur een persoonlijk antwoord met prijs en planning — geen calculator, geen automatische mail.",
};

export default function OffertePage() {
  return (
    <PageShell>
      <OfferteFlow version={1} />
      <VariantSwitcher sectionId="offerte" />
    </PageShell>
  );
}
