import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import RoutesIndexV3 from "@/components/routes-index-v3";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { V3Page } from "@/components/v3-kit";

// Routes 03 — "Donker & premium". Same content as /routes, different design.
export const metadata: Metadata = {
  title: "Bestemmingen & routes — autotransport door Europa | Mcars",
  description:
    "Autotransport in België, Nederland, Frankrijk, Spanje, Italië en heel Europa, plus vaste corridors tussen de landen. Bekijk alle routes van Mcars.",
};

export default function RoutesOverviewV3() {
  return (
    <PageShell>
      <V3Page>
        <RoutesIndexV3 />
      </V3Page>
      <QuoteCta />
      <VariantSwitcher sectionId="routes" />
    </PageShell>
  );
}
