import type { Metadata } from "next";
import FaqFlow from "@/components/faq-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// FAQ 03 — one composed flow (see faq-flow.tsx); versions differ in hero and tone rhythm.
export const metadata: Metadata = {
  title: "Veelgestelde vragen | Mcars",
  description:
    "Antwoorden op veelgestelde vragen over autotransport: prijzen, verzekering, ophaling en levering, buitenland, niet-rijdende voertuigen, documenten, betaling en spoed.",
};

export default function FaqPageV3() {
  return (
    <PageShell>
      <FaqFlow version={3} />
      <VariantSwitcher sectionId="faq" />
    </PageShell>
  );
}
