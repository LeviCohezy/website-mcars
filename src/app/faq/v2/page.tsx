import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import FaqV2 from "@/components/faq-v2";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// FAQ 02 — "Licht & strak". Same content as /faq, different design.
export const metadata: Metadata = {
  title: "Veelgestelde vragen | Mcars",
  description:
    "Antwoorden op veelgestelde vragen over autotransport: prijzen, verzekering, ophaling en levering, buitenland, niet-rijdende voertuigen, documenten, betaling en spoed.",
};

export default function FaqPageV2() {
  return (
    <PageShell navTheme="light">
      <FaqV2 />
      <QuoteCta />
      <VariantSwitcher sectionId="faq" />
    </PageShell>
  );
}
