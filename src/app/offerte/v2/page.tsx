import type { Metadata } from "next";
import OfferteV2 from "@/components/offerte-v2";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Offerte 02 — "Licht & strak". Same content as /offerte, different design.
export const metadata: Metadata = {
  title: "Offerte aanvragen | Mcars",
  description:
    "Vraag vrijblijvend uw prijs voor autotransport aan. U krijgt binnen 24 uur een persoonlijk antwoord met prijs en planning — geen calculator, geen automatische mail.",
};

export default function OffertePageV2() {
  return (
    <PageShell navTheme="light">
      <OfferteV2 />
      <VariantSwitcher sectionId="offerte" />
    </PageShell>
  );
}
