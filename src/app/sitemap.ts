import type { MetadataRoute } from "next";
import { comboParams } from "@/data/combos";
import { blogPosts } from "@/data/blog";
import { routeSlugs } from "@/data/routes";
import { serviceSlugs } from "@/data/services";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/** Every public page, including the service × place pages that aren't in the navigation. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  const pages = [
    "/", "/diensten", "/routes", "/offerte", "/contact", "/over-ons", "/hoe-werkt-het",
    "/cases", "/reviews", "/faq", "/blog", "/alle-paginas",
  ];
  return [
    ...pages.map((p) => ({ url: url(p), priority: p === "/" ? 1 : 0.8 })),
    ...serviceSlugs.map((s) => ({ url: url(`/diensten/${s}`), priority: 0.8 })),
    ...routeSlugs.map((s) => ({ url: url(`/routes/${s}`), priority: 0.7 })),
    ...blogPosts.map((p) => ({ url: url(`/blog/${p.slug}`), priority: 0.6 })),
    ...comboParams().map((c) => ({ url: url(`/diensten/${c.slug}/${c.place}`), priority: c.place.includes("-") ? 0.4 : 0.5 })),
  ];
}
