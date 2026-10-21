import HomeFlow from "@/components/home-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Home 01 — cinema hero, light/paper with one dark curtain chapter (see home-flow.tsx).
export default function Home() {
  return (
    <PageShell>
      <HomeFlow version={1} />
      <VariantSwitcher sectionId="home" />
    </PageShell>
  );
}
