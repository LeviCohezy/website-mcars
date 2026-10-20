import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuoteCta } from "@/components/blocks";
import CaseV3 from "@/components/case-v3";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { caseMetadata, caseStaticParams, getCasePage } from "@/lib/case-page";

// Case 03 — "Donker & premium". Same content as /cases/[slug], different design.
export const generateStaticParams = caseStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return caseMetadata(params);
}

export default async function CasePageV3({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getCasePage(slug);
  if (!data) notFound();
  return (
    <PageShell>
      <CaseV3 data={data} />
      <QuoteCta />
      <VariantSwitcher sectionId="case" base={`/cases/${slug}`} />
    </PageShell>
  );
}
