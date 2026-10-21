import type { Metadata } from "next";
import RoutesFlow from "@/components/routes-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Routes 03 — one composed flow (see routes-flow.tsx); versions differ in hero, centrepiece and tone rhythm.
export const metadata: Metadata = {
  title: "Bestemmingen & routes — autotransport door Europa | Mcars",
  description:
    "Autotransport in België, Nederland, Frankrijk, Spanje, Italië en heel Europa, plus vaste corridors tussen de landen. Bekijk alle routes van Mcars.",
};

export default function RoutesOverviewV3() {
  return (
    <PageShell>
      <RoutesFlow version={3} />
      <VariantSwitcher sectionId="routes" />
    </PageShell>
  );
}
