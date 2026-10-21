import type { Metadata } from "next";
import CasesFlow from "@/components/cases-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { casesMetadata } from "@/lib/case-page";

// Cases 01 — one composed film (see cases-flow.tsx); versions differ in hero and tone rhythm.
export const metadata: Metadata = casesMetadata;

export default function CasesPage() {
  return (
    <PageShell>
      <CasesFlow version={1} />
      <VariantSwitcher sectionId="cases" />
    </PageShell>
  );
}
