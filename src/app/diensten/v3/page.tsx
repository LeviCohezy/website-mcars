import type { Metadata } from "next";
import DienstenFlow from "@/components/diensten-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Diensten 03 — one composed flow (see diensten-flow.tsx); versions differ in hero, centrepiece and tone rhythm.
export const metadata: Metadata = {
  title: "Diensten — autotransport op maat | Mcars",
  description:
    "Van particulier transport tot fleet, import, export, oldtimers en spoed. Ontdek alle autotransportdiensten van Mcars in België en Europa.",
};

export default function DienstenOverviewV3() {
  return (
    <PageShell>
      <DienstenFlow version={3} />
      <VariantSwitcher sectionId="diensten" />
    </PageShell>
  );
}
