/**
 * Everything a service page needs, resolved once. Shared by the three design
 * versions (/diensten/[slug], /v2, /v3) so they always show the same content.
 */

import type { Metadata } from "next";
import { getCase } from "@/data/cases";
import { getRoute } from "@/data/routes";
import { commonFaq, getServiceDetails } from "@/data/service-details";
import { defaultProcess, defaultVehicleTypes, getService, serviceSlugs } from "@/data/services";

export type RelatedItem = { href: string; label: string; meta: string; image: string; sub?: string };

/** Photographs used for secondary sections, so a page doesn't repeat its hero. */
const DETAIL_IMAGES = [
  "/fleet/dramatic-sky.jpg",
  "/fleet/sunset-parking.jpg",
  "/fleet/countryside-highway.jpg",
  "/fleet/city-loaded.jpg",
  "/fleet/mountain-suvs.jpg",
];

export const serviceStaticParams = () => serviceSlugs.map((slug) => ({ slug }));

export async function serviceMetadata(params: Promise<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return { title: s.seo.title, description: s.seo.description };
}

export function getServicePage(slug: string) {
  const service = getService(slug);
  if (!service) return null;

  const process = service.process ?? defaultProcess;
  const vehicleTypes = service.vehicleTypes ?? defaultVehicleTypes;
  const index = serviceSlugs.indexOf(service.slug);
  const detailImage =
    service.gallery?.[0] ??
    DETAIL_IMAGES.filter((img) => img !== service.heroImage)[index % (DETAIL_IMAGES.length - 1)];

  const details = getServiceDetails(service.slug);
  const practiceCase = getCase(details.caseSlug);
  const situationsImage =
    ["/fleet/countryside-highway.jpg", "/fleet/city-loaded.jpg", "/fleet/sunset-parking.jpg", "/fleet/dramatic-sky.jpg"]
      .find((img) => img !== service.heroImage && img !== detailImage) ?? "/fleet/city-loaded.jpg";
  const safetyImage = DETAIL_IMAGES.find((img) => img !== service.heroImage && img !== detailImage) ?? DETAIL_IMAGES[0];

  // The service's own questions first, then confirmed general ones it doesn't already cover.
  const covered = service.faq.map((f) => f.q.toLowerCase()).join(" ");
  const faq = [
    ...service.faq,
    ...(details.skipCommonFaq ? [] : commonFaq.filter((f) => {
      const key = ["verzekerd", "chauffeur", "document", "depot", "betaal"].find((k) => f.q.toLowerCase().includes(k));
      return !key || !covered.includes(key);
    })),
  ].slice(0, 7);

  const related: RelatedItem[] = [
    ...service.related.map(getService).filter((s) => s !== undefined).map((s) => ({
      href: `/diensten/${s.slug}`, label: s.nav, meta: "Dienst", image: s.heroImage, sub: s.subtitle,
    })),
    ...(service.relatedRoutes ?? []).map(getRoute).filter((r) => r !== undefined).map((r) => ({
      href: `/routes/${r.slug}`, label: r.nav, meta: "Route", image: r.heroImage, sub: r.subtitle,
    })),
  ].slice(0, 4);

  return { service, process, vehicleTypes, detailImage, details, practiceCase, situationsImage, safetyImage, faq, related };
}

export type ServicePageData = NonNullable<ReturnType<typeof getServicePage>>;
