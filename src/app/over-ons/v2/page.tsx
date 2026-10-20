import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import OverOnsV2 from "@/components/over-ons-v2";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { aboutCtaImage, aboutMetadata } from "@/data/about";

// Over ons 02 — "Licht & strak". Same content as /over-ons, different design.
export const metadata: Metadata = aboutMetadata;

export default function OverOnsPageV2() {
  return (
    <PageShell navTheme="light">
      <OverOnsV2 />
      <QuoteCta image={aboutCtaImage} />
      <VariantSwitcher sectionId="over-ons" />
    </PageShell>
  );
}
