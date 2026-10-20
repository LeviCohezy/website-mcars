import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuoteCta } from "@/components/blocks";
import PageShell from "@/components/page-shell";
import RouteV2 from "@/components/route-v2";
import VariantSwitcher from "@/components/variant-switcher";
import { getRoutePage, routeMetadata, routeStaticParams } from "@/lib/route-page";

// Route 02 — "Licht & strak". Same content as /routes/[slug], different design.
export const generateStaticParams = routeStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return routeMetadata(params);
}

export default async function RoutePageV2({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getRoutePage(slug);
  if (!data) notFound();
  return (
    <PageShell navTheme="light">
      <RouteV2 data={data} />
      <QuoteCta title="Klaar om deze route te boeken?" image={data.route.heroImage} />
      <VariantSwitcher sectionId="route" base={`/routes/${slug}`} />
    </PageShell>
  );
}
