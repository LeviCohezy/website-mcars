import { defineRouting } from "next-intl/routing";

/** Dutch is the source language and lives on the unprefixed URLs; the others get /fr, /en, … */
export const locales = ["nl", "fr", "en", "de", "es", "it"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "nl";

export const LOCALE_NAMES: Record<Locale, string> = {
  nl: "Nederlands",
  fr: "Français",
  en: "English",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  // "/" is always Dutch: no redirects based on browser language or a cookie.
  localeDetection: false,
  // hreflang comes from the sitemap; not every page exists in every language.
  alternateLinks: false,
});

/**
 * Pages that only exist in Dutch for now: the service × place pages and the
 * route pages. Links to them always go to the Dutch URL.
 */
export const isDutchOnly = (href: string) =>
  /^\/diensten\/[^/#?]+\/[^/#?]+/.test(href) || /^\/routes\/[^/#?]+/.test(href) || /^\/(alle-paginas|studio|overview|v2)(\/|#|\?|$)/.test(href);
