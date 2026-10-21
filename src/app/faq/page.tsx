import type { Metadata } from "next";
import FaqFlow from "@/components/faq-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// FAQ 01 — one composed flow (see faq-flow.tsx); versions differ in hero and tone rhythm.
export const metadata: Metadata = {
  title: "Veelgestelde vragen | Mcars",
  description:
    "Antwoorden op veelgestelde vragen over autotransport: prijzen, verzekering, ophaling en levering, buitenland, niet-rijdende voertuigen, documenten, betaling en spoed.",
};

export default function FaqPage() {
  return (
    <PageShell>
      <FaqFlow version={1} />
      <VariantSwitcher sectionId="faq" />
    </PageShell>
  );
}
