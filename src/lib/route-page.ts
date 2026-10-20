/**
 * Everything a route page needs, resolved once. Shared by the three design
 * versions (/routes/[slug], /v2, /v3) so they always show the same content.
 */

import type { Metadata } from "next";
import { getRoute, routeSlugs, type Place } from "@/data/routes";
import { getService } from "@/data/services";

export type RouteRelated = { href: string; label: string; meta: string; image: string; sub?: string };
export type RouteSpec = { label: string; value: string };

/** Secondary photographs, so a page doesn't repeat its hero everywhere. */
const DETAIL_IMAGES = [
  "/fleet/countryside-highway.jpg",
  "/fleet/dramatic-sky.jpg",
  "/fleet/sunset-parking.jpg",
  "/fleet/city-loaded.jpg",
  "/fleet/germany-autobahn.jpg",
];

export const routeStaticParams = () => routeSlugs.map((slug) => ({ slug }));

export async function routeMetadata(params: Promise<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const r = getRoute(slug);
  if (!r) return {};
  return { title: r.seo.title, description: r.seo.description };
}

export function getRoutePage(slug: string) {
  const route = getRoute(slug);
  if (!route) return null;

  const isCorridor = route.kind === "corridor";
  const from = route.from as Place | undefined;
  const to = route.to as Place | undefined;
  const place = route.place as Place | undefined;

  const related: RouteRelated[] = [
    ...route.related.filter((s) => s !== route.slug).map(getRoute).filter((r) => r !== undefined).map((r) => ({
      href: `/routes/${r.slug}`, label: r.nav, meta: "Route", image: r.heroImage, sub: r.subtitle,
    })),
    ...(route.relatedServices ?? []).map(getService).filter((s) => s !== undefined).map((s) => ({
      href: `/diensten/${s.slug}`, label: s.nav, meta: "Dienst", image: s.heroImage, sub: s.subtitle,
    })),
  ];

  const detailImage = route.detailImage ?? DETAIL_IMAGES.find((img) => img !== route.heroImage) ?? DETAIL_IMAGES[0];

  /** Hero quote form copy + prefilled addresses. */
  const quote = {
    title: isCorridor ? "Prijs voor deze route" : `Prijs naar ${place!.name}`,
    defaults: isCorridor ? { van: from!.name, naar: to!.name } : { naar: place!.name },
  };

  /** Route "spec sheet": only facts that are in the route data or hold for every ride. */
  const specs: RouteSpec[] = [
    { label: "Type", value: isCorridor ? "Vaste corridor" : "Bestemming" },
    ...(isCorridor
      ? [{ label: "Van", value: from!.name }, { label: "Naar", value: to!.name }]
      : [{ label: "Bestemming", value: place!.name }]),
    { label: "Planning", value: route.frequency },
    { label: "Ophaling & levering", value: isCorridor ? "Van deur tot deur" : route.cities.slice(0, 4).join(", ") + (route.cities.length > 4 ? " en meer" : "") },
    { label: "Documenten", value: "CMR-vrachtbrief, opgemaakt bij ophaling" },
    { label: "Controle", value: "Inspectie en foto's van het voertuig bij vertrek" },
    { label: "Antwoord op aanvraag", value: "Binnen 24 uur" },
  ];

  return { route, isCorridor, from, to, place, related, detailImage, quote, specs };
}

export type RoutePageData = NonNullable<ReturnType<typeof getRoutePage>>;
