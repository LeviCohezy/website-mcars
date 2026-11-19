/**
 * Researched local content for the service × place pages.
 *
 * One JSON file per service and origin country: src/data/local/<dienst>/<land>.json
 * holds the country page ("frankrijk") and the nine routes that start there
 * ("frankrijk-belgie", …). Facts come from the dossiers in docs/local-content/.
 * Read at build time only; a page without a file falls back to the generic copy.
 */
import fs from "node:fs";
import path from "node:path";

export type LocalKind = "event" | "regel" | "plek" | "tip";
export type LocalPage = {
  lead: string;
  facts: { label: string; value: string }[];
  sections: { heading: string; body: string[]; points?: string[] }[];
  local: { kind: LocalKind; title: string; body: string }[];
  faq: { q: string; a: string }[];
  seoDescription: string;
  sources?: string[];
};
type LocalFile = { service: string; origin: string; pages: Record<string, LocalPage> };

const cache = new Map<string, LocalFile | null>();

export function getLocal(service: string, place: string): LocalPage | null {
  const origin = place.split("-")[0];
  const key = `${service}/${origin}`;
  if (!cache.has(key)) {
    const file = path.join(process.cwd(), "src/data/local", service, `${origin}.json`);
    cache.set(key, fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as LocalFile) : null);
  }
  return cache.get(key)?.pages[place] ?? null;
}
