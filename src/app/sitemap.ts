import type { MetadataRoute } from "next";
import { comboParams } from "@/data/combos";
import { blogPosts } from "@/data/blog";
import { routeSlugs } from "@/data/routes";
import { serviceSlugs } from "@/data/services";
import { defaultLocale, locales } from "@/i18n/routing";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Every public page. The main pages exist in every language and list each other as
 * hreflang alternates; route pages and service × place pages are Dutch only for now.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string, locale: string = defaultLocale) =>
    `${site.url}${locale === defaultLocale ? "" : `/${locale}`}${path === "/" && locale !== defaultLocale ? "" : path}`;
  const translated = (path: string, priority: number) =>
    locales.map((locale) => ({
      url: url(path, locale),
      priority: locale === defaultLocale ? priority : priority - 0.1,
      alternates: { languages: Object.fromEntries([...locales.map((l) => [l, url(path, l)]), ["x-default", url(path)]]) },
    }));
  const pages = [
    "/", "/diensten", "/routes", "/offerte", "/contact", "/over-ons", "/hoe-werkt-het",
    "/cases", "/reviews", "/faq", "/blog",
  ];
  return [
    ...pages.flatMap((p) => translated(p, p === "/" ? 1 : 0.8)),
    ...serviceSlugs.flatMap((s) => translated(`/diensten/${s}`, 0.8)),
    ...blogPosts.flatMap((p) => translated(`/blog/${p.slug}`, 0.6)),
    { url: url("/alle-paginas"), priority: 0.5 },
    ...routeSlugs.map((s) => ({ url: url(`/routes/${s}`), priority: 0.7 })),
    ...comboParams().map((c) => ({ url: url(`/diensten/${c.slug}/${c.place}`), priority: c.place.includes("-") ? 0.4 : 0.5 })),
  ];
}
