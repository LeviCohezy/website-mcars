// Validates the local content files. Usage:
//   node scripts/check-local.mjs                       all files + cross-page similarity
//   node scripts/check-local.mjs <dienst> <land>       one file
import fs from "node:fs";
import path from "node:path";

const C = ["belgie", "nederland", "luxemburg", "frankrijk", "duitsland", "spanje", "italie", "zwitserland", "oostenrijk", "polen"];
const S = ["autotransport-particulier", "autotransport-dealers", "auto-importeren", "auto-exporteren", "niet-rijdende-auto", "oldtimer-transport", "open-autotransport", "depannage", "spoedtransport", "fleet-wagenpark", "eventtransport"];
const root = "src/data/local";
const BANNED = [
  [/€|\d ?euro\b|\beuro per\b|\bEUR \d/i, "bedrag/euro"],
  [/\bgesloten (auto)?transport\b(?! (bieden|doen|rijden) we niet)/i, "gesloten transport"],
  [/\bzorgeloos|ontzorg|uw partner\b/i, "cliché"],
  [/—/, "gedachtestreepje"],
];
const words = (s) => s.split(/\s+/).filter(Boolean).length;
const text = (p) => [p.lead, ...p.facts.flatMap((f) => [f.label, f.value]), ...p.sections.flatMap((s) => [s.heading, ...s.body, ...(s.points ?? [])]), ...p.local.flatMap((l) => [l.title, l.body]), ...p.faq.flatMap((f) => [f.q, f.a])].join(" ");

function checkFile(service, origin) {
  const errs = [];
  const file = path.join(root, service, `${origin}.json`);
  if (!fs.existsSync(file)) return { errs: [`ontbreekt: ${file}`], pages: {} };
  let data;
  try { data = JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) { return { errs: [`${file}: ongeldige JSON: ${e.message}`], pages: {} }; }
  const want = [origin, ...C.filter((c) => c !== origin).map((c) => `${origin}-${c}`)];
  for (const k of want) if (!data.pages?.[k]) errs.push(`${file}: pagina "${k}" ontbreekt`);
  for (const k of Object.keys(data.pages ?? {})) if (!want.includes(k)) errs.push(`${file}: onverwachte pagina "${k}"`);
  for (const [k, p] of Object.entries(data.pages ?? {})) {
    const at = `${service}/${k}`;
    const arr = (v, min, max, n) => { if (!Array.isArray(v) || v.length < min || v.length > max) errs.push(`${at}: ${n} moet ${min}-${max} items hebben`); return Array.isArray(v) ? v : []; };
    if (typeof p.lead !== "string" || words(p.lead) < 35 || words(p.lead) > 80) errs.push(`${at}: lead 35-80 woorden (nu ${words(p.lead ?? "")})`);
    for (const f of arr(p.facts, 4, 4, "facts")) if (!f.label || !f.value || words(f.value) > 14) errs.push(`${at}: fact "${f.label}" ongeldig of te lang`);
    for (const s of arr(p.sections, 4, 5, "sections")) {
      if (!s.heading || !Array.isArray(s.body) || !s.body.length) { errs.push(`${at}: sectie zonder heading/body`); continue; }
      const w = words(s.body.join(" ")) + words((s.points ?? []).join(" "));
      if (w < 80 || w > 190) errs.push(`${at}: sectie "${s.heading}" ${w} woorden (80-190)`);
    }
    for (const l of arr(p.local, 3, 4, "local")) if (!["event", "regel", "plek", "tip"].includes(l.kind) || !l.title || words(l.body ?? "") < 20) errs.push(`${at}: local "${l.title}" ongeldig`);
    for (const f of arr(p.faq, 3, 4, "faq")) if (!f.q || words(f.a ?? "") < 20) errs.push(`${at}: faq "${f.q}" ongeldig`);
    if (typeof p.seoDescription !== "string" || p.seoDescription.length < 110 || p.seoDescription.length > 160) errs.push(`${at}: seoDescription 110-160 tekens (nu ${p.seoDescription?.length})`);
    if (!Array.isArray(p.sources) || p.sources.length < 3) errs.push(`${at}: minstens 3 bron-URL's`);
    const t = text(p);
    const total = words(t);
    if (total < 600) errs.push(`${at}: ${total} woorden totaal (min 600)`);
    for (const [re, name] of BANNED) { const m = t.match(re); if (m) errs.push(`${at}: verboden (${name}): "…${t.slice(Math.max(0, m.index - 30), m.index + 30)}…"`); }
  }
  return { errs, pages: data.pages ?? {} };
}

// Sentence-level reuse: the same sentence (normalised) on two pages.
function dupes(all) {
  const seen = new Map();
  const out = [];
  for (const [id, p] of all) {
    const sents = new Set(text(p).split(/(?<!(?:^|[\s(])(?:St|Sta|bv|bijv|ca|nr|art|o\.a|Dr|Mr|[A-Z])\.)(?<=[.!?])\s+(?=[A-ZÀ-Ý0-9"'(])/).map((s) => s.toLowerCase().replace(/[^a-zà-ÿ0-9 ]/g, "").trim()).filter((s) => s.split(" ").length >= 9));
    for (const s of sents) { if (seen.has(s) && seen.get(s) !== id) out.push(`zelfde zin op ${seen.get(s)} en ${id}: "${s.slice(0, 90)}"`); else seen.set(s, id); }
  }
  return out;
}

const [svc, org] = process.argv.slice(2);
const todo = svc ? [[svc, org]] : S.flatMap((s) => C.map((c) => [s, c]));
let errs = [], all = [], missing = 0;
for (const [s, c] of todo) {
  const r = checkFile(s, c);
  if (r.errs[0]?.startsWith("ontbreekt") && !svc) { missing++; continue; }
  errs.push(...r.errs);
  for (const [k, p] of Object.entries(r.pages)) all.push([`${s}/${k}`, p]);
}
try { errs.push(...dupes(all)); } catch {}
console.log(`${all.length} pagina's nagekeken${missing ? `, ${missing} bestanden nog niet geschreven` : ""}, ${errs.length} fouten`);
for (const e of errs.slice(0, 2000)) console.log(" - " + e);
process.exit(errs.length ? 1 : 0);
