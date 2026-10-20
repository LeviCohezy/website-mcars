import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuoteCta } from "@/components/blocks";
import CaseDetail from "@/components/case-detail";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";
import { caseMetadata, caseStaticParams, getCasePage } from "@/lib/case-page";

// Case 01 — cinematic. Same content as /v2 and /v3, different design.
export const generateStaticParams = caseStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return caseMetadata(params);
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getCasePage(slug);
  if (!data) notFound();
  return (
    <PageShell>
      <CaseDetail data={data} />
      <QuoteCta />
      <VariantSwitcher sectionId="case" base={`/cases/${slug}`} />
    </PageShell>
  );
}
