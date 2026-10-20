import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import WerkwijzeV3 from "@/components/werkwijze-v3";
import { werkwijze } from "@/data/process";

// Werkwijze 03 — "Donker & premium". Same content as /hoe-werkt-het, different design.
export const metadata: Metadata = werkwijze.seo;

export default function HoeWerktHetV3() {
  return (
    <PageShell>
      <WerkwijzeV3 />
      <QuoteCta />
      <VariantSwitcher sectionId="hoe-werkt-het" />
    </PageShell>
  );
}
