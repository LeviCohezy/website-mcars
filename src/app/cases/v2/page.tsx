import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import CasesV2 from "@/components/cases-v2";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { casesMetadata } from "@/lib/case-page";

// Cases 02 — "Licht & strak". Same content as /cases, different design.
export const metadata: Metadata = casesMetadata;

export default function CasesPageV2() {
  return (
    <PageShell navTheme="light">
      <CasesV2 />
      <QuoteCta />
      <VariantSwitcher sectionId="cases" />
    </PageShell>
  );
}
