import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/page-shell";
import ServiceFlow from "@/components/service-flow";
import VariantSwitcher from "@/components/variant-switcher";
import { getServicePage, serviceMetadata, serviceStaticParams } from "@/lib/service-page";

// Dienst 01 — one composed flow (see service-flow.tsx); versions differ in hero and tone rhythm.
export const generateStaticParams = serviceStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return serviceMetadata(params);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getServicePage(slug);
  if (!data) notFound();
  return (
    <PageShell>
      <ServiceFlow data={data} version={1} />
      <VariantSwitcher sectionId="dienst" base={`/diensten/${slug}`} />
    </PageShell>
  );
}
