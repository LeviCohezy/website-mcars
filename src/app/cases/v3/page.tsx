import type { Metadata } from "next";
import CasesFlow from "@/components/cases-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { casesMetadata } from "@/lib/case-page";

// Cases 03 — one composed film (see cases-flow.tsx); versions differ in hero and tone rhythm.
export const metadata: Metadata = casesMetadata;

export default function CasesPageV3() {
  return (
    <PageShell>
      <CasesFlow version={3} />
      <VariantSwitcher sectionId="cases" />
    </PageShell>
  );
}
