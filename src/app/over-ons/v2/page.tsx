import type { Metadata } from "next";
import OverOnsFlow from "@/components/over-ons-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { aboutMetadata } from "@/data/about";

// Over ons 02 — one composed flow (see over-ons-flow.tsx); versions differ in hero and tone rhythm.
export const metadata: Metadata = aboutMetadata;

export default function OverOnsPageV2() {
  return (
    <PageShell>
      <OverOnsFlow version={2} />
      <VariantSwitcher sectionId="over-ons" />
    </PageShell>
  );
}
