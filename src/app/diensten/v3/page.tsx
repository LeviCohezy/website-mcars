import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import DienstenV3 from "@/components/diensten-v3";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { V3Page } from "@/components/v3-kit";

// Diensten 03 — "Donker & premium". Same content as /diensten, different design.
export const metadata: Metadata = {
  title: "Diensten — autotransport op maat | Mcars",
  description:
    "Van particulier transport tot fleet, import, export, oldtimers en spoed. Ontdek alle autotransportdiensten van Mcars in België en Europa.",
};

export default function DienstenOverviewV3() {
  return (
    <PageShell>
      <V3Page>
        <DienstenV3 />
      </V3Page>
      <QuoteCta />
      <VariantSwitcher sectionId="diensten" />
    </PageShell>
  );
}
