import fs from "node:fs";
import path from "node:path";

/**
 * Translations for the content in src/data and src/lib/site.ts.
 *
 * That content stays written in Dutch in the code. messages/<locale>/data.json
 * maps each Dutch string to its translation; `localize` swaps every string in a
 * value (object, array, string) that has one. Strings without a translation —
 * slugs, paths, icon names, text not translated yet — stay as they are.
 * Server only (reads from disk). `npm run i18n` lists what is missing.
 */

const cache = new Map<string, Record<string, string>>();

function dict(locale: string): Record<string, string> {
  if (!cache.has(locale) || process.env.NODE_ENV === "development") {
    const file = path.join(process.cwd(), "messages", locale, "data.json");
    cache.set(locale, fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {});
  }
  return cache.get(locale)!;
}

export function localize<T>(locale: string, value: T): T {
  if (locale === "nl") return value;
  const d = dict(locale);
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") return d[v] ?? v;
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype)
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return walk(value) as T;
}
