import type { Metadata } from "next";
import WerkwijzeFlow from "@/components/werkwijze-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { werkwijze } from "@/data/process";

// Werkwijze 01 — one composed flow (see werkwijze-flow.tsx); versions differ in hero and tone rhythm.
export const metadata: Metadata = werkwijze.seo;

export default function HoeWerktHetPage() {
  return (
    <PageShell>
      <WerkwijzeFlow version={1} />
      <VariantSwitcher sectionId="hoe-werkt-het" />
    </PageShell>
  );
}
