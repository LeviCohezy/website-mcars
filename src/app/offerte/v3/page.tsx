import type { Metadata } from "next";
import OfferteV3 from "@/components/offerte-v3";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Offerte 03 — "Donker & premium". Same content as /offerte, different design.
export const metadata: Metadata = {
  title: "Offerte aanvragen | Mcars",
  description:
    "Vraag vrijblijvend uw prijs voor autotransport aan. U krijgt binnen 24 uur een persoonlijk antwoord met prijs en planning — geen calculator, geen automatische mail.",
};

export default function OffertePageV2() {
  return (
    <PageShell>
      <OfferteV3 />
      <VariantSwitcher sectionId="offerte" />
    </PageShell>
  );
}
