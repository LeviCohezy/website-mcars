import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/page-shell";
import RouteFlow from "@/components/route-flow";
import VariantSwitcher from "@/components/variant-switcher";
import { getRoutePage, routeMetadata, routeStaticParams } from "@/lib/route-page";

// Route 03 — one composed flow (see route-flow.tsx); versions differ in hero and tone rhythm.
export const generateStaticParams = routeStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return routeMetadata(params);
}

export default async function RoutePageV3({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getRoutePage(slug);
  if (!data) notFound();
  return (
    <PageShell>
      <RouteFlow data={data} version={3} />
      <VariantSwitcher sectionId="route" base={`/routes/${slug}`} />
    </PageShell>
  );
}
