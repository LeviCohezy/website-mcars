import type { Metadata } from "next";
import RoutesFlow from "@/components/routes-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Routes 01 — one composed flow (see routes-flow.tsx); versions differ in hero, centrepiece and tone rhythm.
export const metadata: Metadata = {
  title: "Bestemmingen & routes — autotransport door Europa | Mcars",
  description:
    "Autotransport in België, Nederland, Frankrijk, Spanje, Italië en heel Europa, plus vaste corridors tussen de landen. Bekijk alle routes van Mcars.",
};

export default function RoutesOverview() {
  return (
    <PageShell>
      <RoutesFlow version={1} />
      <VariantSwitcher sectionId="routes" />
    </PageShell>
  );
}
