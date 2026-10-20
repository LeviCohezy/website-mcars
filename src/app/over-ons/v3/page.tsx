import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import OverOnsV3 from "@/components/over-ons-v3";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { aboutCtaImage, aboutMetadata } from "@/data/about";

// Over ons 03 — "Donker & premium". Same content as /over-ons, different design.
export const metadata: Metadata = aboutMetadata;

export default function OverOnsPageV3() {
  return (
    <PageShell>
      <OverOnsV3 />
      <QuoteCta image={aboutCtaImage} />
      <VariantSwitcher sectionId="over-ons" />
    </PageShell>
  );
}
