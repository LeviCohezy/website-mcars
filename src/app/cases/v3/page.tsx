import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import CasesV3 from "@/components/cases-v3";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { casesMetadata } from "@/lib/case-page";

// Cases 03 — "Donker & premium". Same content as /cases, different design.
export const metadata: Metadata = casesMetadata;

export default function CasesPageV3() {
  return (
    <PageShell>
      <CasesV3 />
      <QuoteCta />
      <VariantSwitcher sectionId="cases" />
    </PageShell>
  );
}
