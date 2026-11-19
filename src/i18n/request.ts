import fs from "node:fs";
import path from "node:path";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Value = string | Value[] | { [key: string]: Value };
type Messages = { [key: string]: Value };

/** messages/<locale>/<Namespace>.json → { Namespace: {...} }. `data.json` is not a namespace (see ./data.ts). */
function read(locale: string): Messages {
  const dir = path.join(process.cwd(), "messages", locale);
  if (!fs.existsSync(dir)) return {};
  const out: Messages = {};
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json") || file === "data.json") continue;
    out[file.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  }
  return out;
}

/** Translation over the Dutch source, so a missing key shows Dutch instead of breaking. */
function merge<T extends Value>(base: T, over: Value | undefined): T {
  if (over === undefined) return base;
  if (Array.isArray(base)) return (Array.isArray(over) ? base.map((b, i) => merge(b, over[i])) : base) as T;
  if (typeof base === "object") {
    if (typeof over !== "object" || Array.isArray(over)) return base;
    const out: Messages = { ...over };
    for (const [k, b] of Object.entries(base)) out[k] = merge(b, over[k]);
    return out as T;
  }
  return (typeof over === "string" ? over : base) as T;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const nl = read("nl");
  return { locale, messages: locale === "nl" ? nl : merge(nl, read(locale)) };
});
