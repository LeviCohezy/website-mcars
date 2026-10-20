import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import RoutesIndexV2 from "@/components/routes-index-v2";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Routes 02 — "Licht & strak". Same content as /routes, different design.
export const metadata: Metadata = {
  title: "Bestemmingen & routes — autotransport door Europa | Mcars",
  description:
    "Autotransport in België, Nederland, Frankrijk, Spanje, Italië en heel Europa, plus vaste corridors tussen de landen. Bekijk alle routes van Mcars.",
};

export default function RoutesOverviewV2() {
  return (
    <PageShell navTheme="light">
      <RoutesIndexV2 />
      <QuoteCta />
      <VariantSwitcher sectionId="routes" />
    </PageShell>
  );
}
