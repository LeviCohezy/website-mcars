import HomeFlow from "@/components/home-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Home 02 — the approved scroll film as opening, then the flow on black with one light curtain (see home-flow.tsx).
export default function Home() {
  return (
    <PageShell>
      <HomeFlow version={2} />
      <VariantSwitcher sectionId="home" />
    </PageShell>
  );
}
