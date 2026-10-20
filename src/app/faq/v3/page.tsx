import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import FaqV3 from "@/components/faq-v3";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// FAQ 03 — "Donker & premium". Same content as /faq, different design.
export const metadata: Metadata = {
  title: "Veelgestelde vragen | Mcars",
  description:
    "Antwoorden op veelgestelde vragen over autotransport: prijzen, verzekering, ophaling en levering, buitenland, niet-rijdende voertuigen, documenten, betaling en spoed.",
};

export default function FaqPageV2() {
  return (
    <PageShell>
      <FaqV3 />
      <QuoteCta />
      <VariantSwitcher sectionId="faq" />
    </PageShell>
  );
}
