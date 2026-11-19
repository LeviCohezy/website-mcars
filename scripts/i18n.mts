/**
 * Translation bookkeeping for the site (see I18N.md).
 *
 *   npm run i18n                       report what is missing or outdated per language
 *   npm run i18n:translate             translate it with the Claude API (needs ANTHROPIC_API_KEY)
 *   tsx scripts/i18n.mts export fr <dir> [size]   write the open items for one language as chunk files
 *   tsx scripts/i18n.mts import fr <file>         merge a translated chunk back
 *
 * Two sources, both Dutch:
 *   messages/nl/<Namespace>.json  → messages/<locale>/<Namespace>.json (same keys)
 *   strings in src/data + src/lib/site.ts → messages/<locale>/data.json { "Dutch": "translation" }
 * messages/<locale>/.lock.json remembers the Dutch text each message was translated from,
 * so a changed Dutch sentence is reported (and translated) again.
 */

import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { BLOG_CATEGORIES, blogPosts } from "../src/data/blog";
import { cases } from "../src/data/cases";
import { reviews } from "../src/data/reviews";
import { countryRoutes, routes } from "../src/data/routes";
import * as details from "../src/data/service-details";
import { defaultProcess, defaultVehicleTypes, services } from "../src/data/services";
import { footerOntdek, footerServices, nav, routeLinks, site } from "../src/lib/site";

const LOCALES = ["fr", "en", "de", "es", "it"];
const LANGUAGE: Record<string, string> = { fr: "French", en: "English", de: "German", es: "Spanish", it: "Italian" };
const ROOT = path.join(process.cwd(), "messages");

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

// ── Dutch sources ───────────────────────────────────────────────────────────

/** Keys whose values are identifiers, not text. */
const SKIP_KEYS = new Set([
  "slug", "href", "icon", "image", "img", "src", "heroImage", "gallery", "related", "relatedRoutes", "caseSlug",
  "flag", "kind", "date", "id", "needsMode", "category", "url", "email", "phone", "phoneHref", "whatsapp", "vat",
  "legalName", "name", "address", "social", "type", "from", "to", "place", "service",
]);
const isText = (s: string) =>
  /\p{L}{2}/u.test(s) && !/^(\/|#|https?:|mailto:|tel:)/.test(s) && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s) && !/^\S+@\S+$/.test(s);

function dataStrings(): string[] {
  const out = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === "string") return void (isText(v) && out.add(v));
    if (Array.isArray(v)) return v.forEach(walk);
    if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (!SKIP_KEYS.has(k)) walk(x);
  };
  walk([
    services, defaultProcess, defaultVehicleTypes, details, cases, reviews, blogPosts,
    nav, routeLinks, footerServices, footerOntdek, site.tagline, site.hours, site.hoursNote,
    [...BLOG_CATEGORIES], site.address.country, countryRoutes,
    routes.map((r) => ({ nav: r.nav, title: r.title, subtitle: r.subtitle })),
  ]);
  return [...out].sort((a, b) => a.localeCompare(b));
}

const readJson = <T,>(file: string, fallback: T): T => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback);
const writeJson = (file: string, value: unknown) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
};

/** Every message as "Namespace:path.to.key" → text. Array items are addressed by index. */
function flatMessages(locale: string): Record<string, string> {
  const dir = path.join(ROOT, locale);
  const out: Record<string, string> = {};
  if (!fs.existsSync(dir)) return out;
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith(".json") || file === "data.json" || file.startsWith(".")) continue;
    const ns = file.slice(0, -5);
    const walk = (v: Json, p: string) => {
      if (typeof v === "string") out[`${ns}:${p}`] = v;
      else if (Array.isArray(v)) v.forEach((x, i) => walk(x, p ? `${p}.${i}` : String(i)));
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, p ? `${p}.${k}` : k);
    };
    walk(readJson<Json>(path.join(dir, file), {}), "");
  }
  return out;
}

/** Text that never needs translating (brand, codes, numbers). */
const fixed = (s: string) => !/\p{L}{2}/u.test(s) || /^(Mcars|M Cars|CMR|FAQ|Blog|WhatsApp|Google|E-mail|Email)$/i.test(s.trim());

type Open = { m: Record<string, string>; d: string[] };

function open(locale: string, nl: Record<string, string>, data: string[]): Open {
  const have = flatMessages(locale);
  const lock = readJson<Record<string, string>>(path.join(ROOT, locale, ".lock.json"), {});
  const dict = readJson<Record<string, string>>(path.join(ROOT, locale, "data.json"), {});
  const m: Record<string, string> = {};
  for (const [key, text] of Object.entries(nl)) {
    // The e-mail a form composes goes to the Mcars office: it stays Dutch.
    if (fixed(text) || /[:.]mail\./.test(key)) continue;
    if (!(key in have) || lock[key] !== text) m[key] = text;
  }
  return { m, d: data.filter((s) => !fixed(s) && !(s in dict)) };
}

// ── Writing translations back ───────────────────────────────────────────────

function setPath(root: Json, nlRoot: Json, parts: string[], value: string): Json {
  if (!parts.length) return value;
  const [head, ...rest] = parts;
  if (Array.isArray(nlRoot)) {
    // Arrays mirror the Dutch array, so untranslated items keep their Dutch text and position.
    const arr = Array.isArray(root) ? [...root] : [];
    for (let i = 0; i < nlRoot.length; i++) if (arr[i] === undefined) arr[i] = structuredClone(nlRoot[i]);
    arr.length = nlRoot.length;
    arr[Number(head)] = setPath(arr[Number(head)], nlRoot[Number(head)], rest, value);
    return arr;
  }
  const obj = root && typeof root === "object" && !Array.isArray(root) ? { ...root } : {};
  obj[head] = setPath(obj[head] ?? null, (nlRoot as { [k: string]: Json })?.[head] ?? null, rest, value);
  return obj;
}

function merge(locale: string, done: { m?: Record<string, string>; d?: Record<string, string> }, nl: Record<string, string>) {
  const dir = path.join(ROOT, locale);
  const lockFile = path.join(dir, ".lock.json");
  const lock = readJson<Record<string, string>>(lockFile, {});
  const byNs = new Map<string, [string, string][]>();
  for (const [key, text] of Object.entries(done.m ?? {})) {
    if (!(key in nl) || typeof text !== "string") continue;
    const [ns, p] = [key.slice(0, key.indexOf(":")), key.slice(key.indexOf(":") + 1)];
    byNs.set(ns, [...(byNs.get(ns) ?? []), [p, text]]);
    lock[key] = nl[key];
  }
  for (const [ns, items] of byNs) {
    const file = path.join(dir, `${ns}.json`);
    const nlRoot = readJson<Json>(path.join(ROOT, "nl", `${ns}.json`), {});
    let root = readJson<Json>(file, {});
    for (const [p, text] of items) root = setPath(root, nlRoot, p.split("."), text);
    writeJson(file, root);
  }
  writeJson(lockFile, Object.fromEntries(Object.entries(lock).filter(([k]) => k in nl).sort(([a], [b]) => a.localeCompare(b))));
  if (done.d && Object.keys(done.d).length) {
    const file = path.join(dir, "data.json");
    const dict = { ...readJson<Record<string, string>>(file, {}), ...done.d };
    writeJson(file, Object.fromEntries(Object.entries(dict).sort(([a], [b]) => a.localeCompare(b))));
  }
}

function chunks(o: Open, size: number): Open[] {
  const out: Open[] = [];
  let cur: Open = { m: {}, d: [] };
  let n = 0;
  const push = (len: number) => {
    n += len;
    if (n >= size) {
      out.push(cur);
      cur = { m: {}, d: [] };
      n = 0;
    }
  };
  for (const [k, v] of Object.entries(o.m)) {
    cur.m[k] = v;
    push(v.length);
  }
  for (const s of o.d) {
    cur.d.push(s);
    push(s.length);
  }
  if (Object.keys(cur.m).length || cur.d.length) out.push(cur);
  return out;
}

// ── Claude API ──────────────────────────────────────────────────────────────

export const RULES = `You translate the website of Mcars, a Belgian car transport company (open multi-level car transporters, B2C and B2B), from Dutch (Flemish) into {LANGUAGE}.
- Natural, idiomatic {LANGUAGE} as a native copywriter would write it; formal address (vous / Sie / usted / Lei / you). Keep the tone: short, concrete, warm.
- Keep unchanged: "Mcars", "CMR", car brands, place names in their usual {LANGUAGE} form, numbers, e-mail addresses, phone numbers, URLs.
- Keep every ICU placeholder and tag exactly: {name}, {count, plural, ...} (translate only the text inside the plural branches), <muted>…</muted>, <br></br>, <link>…</link>. Same tags, same order of nesting.
- Do not add or drop sentences. No prices, no delivery times that are not in the source.
- Keep leading/trailing spaces and punctuation style of the source string.`;

async function translateChunk(client: Anthropic, locale: string, chunk: Open) {
  const input = { m: chunk.m, d: Object.fromEntries(chunk.d.map((s, i) => [`d${i}`, s])) };
  const stream = client.beta.messages.stream({
    model: "claude-opus-5-5",
    max_tokens: 64000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low" },
    system: RULES.replaceAll("{LANGUAGE}", LANGUAGE[locale]),
    messages: [
      {
        role: "user",
        content: `Translate every value of this JSON. Reply with JSON only: the same structure and the same keys, values translated.\n\n${JSON.stringify(input, null, 1)}`,
      },
    ],
  });
  const message = await stream.finalMessage();
  if (message.stop_reason === "refusal" || message.stop_reason === "max_tokens") throw new Error(`Chunk not translated (${message.stop_reason})`);
  const text = message.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  const out = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)) as { m?: Record<string, string>; d?: Record<string, string> };
  return { m: out.m ?? {}, d: Object.fromEntries(chunk.d.flatMap((s, i) => (out.d?.[`d${i}`] ? [[s, out.d[`d${i}`]]] : []))) };
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const [cmd = "check", locale, target, size] = process.argv.slice(2);
const nl = flatMessages("nl");
const data = dataStrings();
writeJson(path.join(ROOT, "nl", "data.json"), data);

if (cmd === "check") {
  let total = 0;
  for (const l of LOCALES) {
    const o = open(l, nl, data);
    total += Object.keys(o.m).length + o.d.length;
    console.log(`${l}: ${Object.keys(o.m).length} messages and ${o.d.length} data strings to translate`);
  }
  console.log(`Dutch source: ${Object.keys(nl).length} messages, ${data.length} data strings.`);
  if (total && process.argv.includes("--strict")) process.exit(1);
} else if (cmd === "export") {
  const parts = chunks(open(locale, nl, data), Number(size) || 12000);
  fs.mkdirSync(target, { recursive: true });
  parts.forEach((c, i) => writeJson(path.join(target, `${locale}-${String(i + 1).padStart(2, "0")}.json`), c));
  console.log(`${locale}: ${parts.length} chunk(s) written to ${target}`);
} else if (cmd === "import") {
  merge(locale, readJson(target, {}), nl);
  const o = open(locale, nl, data);
  console.log(`${locale}: merged ${target}; still open: ${Object.keys(o.m).length} messages, ${o.d.length} data strings`);
} else if (cmd === "translate") {
  const client = new Anthropic();
  for (const l of locale ? [locale] : LOCALES) {
    const parts = chunks(open(l, nl, data), 12000);
    console.log(`${l}: ${parts.length} chunk(s)`);
    for (const [i, c] of parts.entries()) {
      try {
        merge(l, await translateChunk(client, l, c), nl);
        console.log(`  ${l} ${i + 1}/${parts.length} done`);
      } catch (error) {
        if (error instanceof Anthropic.AuthenticationError) throw error;
        if (error instanceof Anthropic.RateLimitError) console.error(`  ${l} ${i + 1}: rate limited, run again later`);
        else if (error instanceof Anthropic.APIError) console.error(`  ${l} ${i + 1}: API error ${error.status}`);
        else console.error(`  ${l} ${i + 1}: ${(error as Error).message}`);
        process.exitCode = 1;
      }
    }
  }
} else {
  console.error("Usage: tsx scripts/i18n.mts [check|translate [locale]|export <locale> <dir> [size]|import <locale> <file>]");
  process.exit(1);
}
