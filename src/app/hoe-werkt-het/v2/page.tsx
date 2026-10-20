import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import WerkwijzeV2 from "@/components/werkwijze-v2";
import { werkwijze } from "@/data/process";

// Werkwijze 02 — "Licht & strak". Same content as /hoe-werkt-het, different design.
export const metadata: Metadata = werkwijze.seo;

export default function HoeWerktHetV2() {
  return (
    <PageShell navTheme="light">
      <WerkwijzeV2 />
      <QuoteCta />
      <VariantSwitcher sectionId="hoe-werkt-het" />
    </PageShell>
  );
}
