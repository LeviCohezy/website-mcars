import type { Metadata } from "next";
import OverOnsFlow from "@/components/over-ons-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { aboutMetadata } from "@/data/about";

// Over ons 01 — one composed flow (see over-ons-flow.tsx); versions differ in hero and tone rhythm.
export const metadata: Metadata = aboutMetadata;

export default function OverOnsPage() {
  return (
    <PageShell>
      <OverOnsFlow version={1} />
      <VariantSwitcher sectionId="over-ons" />
    </PageShell>
  );
}
