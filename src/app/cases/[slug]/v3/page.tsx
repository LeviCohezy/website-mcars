import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseFlow from "@/components/case-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { caseMetadata, caseStaticParams, getCasePage } from "@/lib/case-page";

// Case 03 — one composed film (see case-flow.tsx); versions differ in hero and tone rhythm.
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
      <CaseFlow data={data} version={3} />
      <VariantSwitcher sectionId="case" base={`/cases/${slug}`} />
    </PageShell>
  );
}
