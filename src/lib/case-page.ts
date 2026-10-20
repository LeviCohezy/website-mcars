/**
 * Everything the cases overview and a case page need, resolved once. Shared by
 * the three design versions (/cases, /cases/v2, /cases/v3 and
 * /cases/[slug], /v2, /v3) so they always show the same content.
 */

import type { Metadata } from "next";
import { cases, getCase, type Case } from "@/data/cases";
import { getService } from "@/data/services";
import { site } from "@/lib/site";

/** Overview copy shared by Cases 01 / 02 / 03. */
export const casesOverview = {
  eyebrow: "Realisaties",
  title: "Uitgevoerde transporten.",
  subtitle:
    "Een greep uit ritten voor particulieren en bedrijven — van klassiekers tot volledige handelaarsvoorraden. Anoniem, maar écht gereden.",
  intro: "Uit respect voor onze klanten houden we alle cases anoniem — geen namen, wel het echte verhaal.",
  heroImage: "/fleet/city-loaded.jpg",
  stats: [
    { value: site.reviews.clients, label: "Tevreden klanten" },
    { value: "20+", label: "Jaar ervaring" },
    { value: "Wekelijks", label: "In heel Frankrijk" },
  ],
};

export const casesMetadata: Metadata = {
  title: "Cases & realisaties | Mcars",
  description:
    "Een greep uit uitgevoerde transporten van Mcars: van oldtimerritten en importwagens tot niet-rijdende voertuigen en Europees bedrijfstransport. Anoniem, maar echt.",
};

export const caseHref = (c: Pick<Case, "slug">) => `/cases/${c.slug}`;
export const caseNumber = (c: Pick<Case, "slug">) => String(cases.findIndex((x) => x.slug === c.slug) + 1).padStart(2, "0");

export const caseStaticParams = () => cases.map((c) => ({ slug: c.slug }));

export async function caseMetadata(params: Promise<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return { title: `${c.title} | Mcars`, description: c.body };
}

export function getCasePage(slug: string) {
  const item = getCase(slug);
  if (!item) return null;

  const index = cases.indexOf(item);
  const total = cases.length;
  const prev = cases[(index - 1 + total) % total];
  const next = cases[(index + 1) % total];
  const service = item.service ? getService(item.service) : undefined;

  // A second photograph for the story section, so the page doesn't repeat its hero.
  const detailImage =
    service && service.heroImage !== item.image
      ? service.heroImage
      : cases.map((c) => c.image).find((img) => img !== item.image) ?? item.image;

  const facts: { label: string; value: string; href?: string }[] = [
    { label: "Type", value: item.tag },
    ...(item.route ? [{ label: "Traject", value: item.route }] : []),
    ...(service ? [{ label: "Dienst", value: service.nav, href: `/diensten/${service.slug}` }] : []),
  ];

  // Situatie / aanpak / resultaat. Falls back to the full body if a case has no breakdown yet.
  const story = [
    { label: "Situatie", body: item.challenge },
    { label: "Aanpak", body: item.approach },
    { label: "Resultaat", body: item.result },
  ].filter((s): s is { label: string; body: string } => Boolean(s.body));

  return {
    item,
    number: String(index + 1).padStart(2, "0"),
    total: String(total).padStart(2, "0"),
    prev,
    next,
    service,
    detailImage,
    facts,
    story: story.length > 0 ? story : [{ label: "Het verhaal", body: item.body }],
  };
}

export type CasePageData = NonNullable<ReturnType<typeof getCasePage>>;
