import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import DienstenV2 from "@/components/diensten-v2";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Diensten 02 — "Licht & strak". Same content as /diensten, different design.
export const metadata: Metadata = {
  title: "Diensten — autotransport op maat | Mcars",
  description:
    "Van particulier transport tot fleet, import, export, oldtimers en spoed. Ontdek alle autotransportdiensten van Mcars in België en Europa.",
};

export default function DienstenOverviewV2() {
  return (
    <PageShell navTheme="light">
      <DienstenV2 />
      <QuoteCta />
      <VariantSwitcher sectionId="diensten" />
    </PageShell>
  );
}
