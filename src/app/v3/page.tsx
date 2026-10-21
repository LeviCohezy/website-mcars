import HomeFlow from "@/components/home-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Home 03 — type lines hero, dark throughout with one paper interlude (see home-flow.tsx).
export default function Home() {
  return (
    <PageShell>
      <HomeFlow version={3} />
      <VariantSwitcher sectionId="home" />
    </PageShell>
  );
}
