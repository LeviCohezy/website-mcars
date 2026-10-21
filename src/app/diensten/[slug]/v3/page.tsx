import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuoteCta } from "@/components/blocks";
import DienstV3 from "@/components/dienst-v3";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { getServicePage, serviceMetadata, serviceStaticParams } from "@/lib/service-page";

// Dienst 03 — "Donker & premium". Same content as /diensten/[slug], different design.
export const generateStaticParams = serviceStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return serviceMetadata(params);
}

export default async function ServicePageV3({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getServicePage(slug);
  if (!data) notFound();
  return (
    <PageShell>
      <DienstV3 data={data} />
      <QuoteCta />
      <VariantSwitcher sectionId="dienst" base={`/diensten/${slug}`} />
    </PageShell>
  );
}
