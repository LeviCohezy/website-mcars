// Validates flow content: node scripts/check-flow.mjs [dienst] [plaats]
import fs from "node:fs";
const root = "src/data/flow";
const w = (s) => String(s ?? "").split(/\s+/).filter(Boolean).length;
const BAN = [[/€|\d ?euro\b|\d ?%|procent/i, "bedrag/percentage"], [/—/, "gedachtestreepje"], [/\b(A|E|N|AP|S|D)[- ]?\d{1,3}\b/, "wegnummer"], [/\b(tunnel|tol(weg|poort)?|péage|vignet|rijverbod|milieuzone|LEZ|ZFE|grensovergang|bergpas)\b/i, "wegen/regels"], [/\b(19|20)\d\d\b/, "jaartal"], [/track ?(&|and|en) ?trace|zorgeloos|ontzorg/i, "verboden belofte/cliché"]];
const [svc, plc] = process.argv.slice(2);
const files = svc ? [`${svc}/${plc}`] : fs.readdirSync(root).flatMap((s) => fs.readdirSync(`${root}/${s}`).map((f) => `${s}/${f.slice(0, -5)}`));
const errs = []; const seen = new Map();
for (const f of files) {
  let p; try { p = JSON.parse(fs.readFileSync(`${root}/${f}.json`, "utf8")); } catch (e) { errs.push(`${f}: ${e.message}`); continue; }
  const rng = (n, v, a, b) => { const c = w(v); if (c < a || c > b) errs.push(`${f}: ${n} ${c} woorden (${a}-${b})`); };
  const cnt = (n, v, a, b = a) => { if (!Array.isArray(v) || v.length < a || v.length > b) errs.push(`${f}: ${n} moet ${a}${b > a ? "-" + b : ""} items hebben`); return Array.isArray(v) ? v : []; };
  rng("sub", p.sub, 14, 28);
  rng("problem.body", p.problem?.body, 50, 90); for (const s of cnt("situations", p.problem?.situations, 3)) rng(`situatie "${s.title}"`, s.body, 18, 35);
  rng("solution.body", p.solution?.body, 60, 110);
  for (const s of cnt("usps", p.usps, 4)) rng(`usp "${s.title}"`, s.body, 18, 35);
  for (const s of cnt("steps", p.steps, 4)) rng(`stap "${s.title}"`, s.body, 18, 35);
  rng("care.body", p.care?.body, 50, 90); for (const s of cnt("care.items", p.care?.items, 4)) rng(`care-punt "${s}"`, s, 3, 8);
  rng("why.body", p.why?.body, 50, 90); cnt("why.regions", p.why?.regions, 4, 6);
  for (const s of cnt("faq", p.faq, 4)) rng(`faq "${s.q}"`, s.a, 20, 55);
  for (const k of ["problem", "solution", "care", "why"]) if (!p[k]?.title) errs.push(`${f}: ${k}.title ontbreekt`);
  if (!(p.seoDescription?.length >= 110 && p.seoDescription.length <= 160)) errs.push(`${f}: seoDescription 110-160 tekens (nu ${p.seoDescription?.length})`);
  const t = JSON.stringify(p);
  for (const [re, n] of BAN) { const m = t.match(re); if (m) errs.push(`${f}: verboden (${n}): "…${t.slice(Math.max(0, m.index - 30), m.index + 30)}…"`); }
  for (const s of t.replace(/\\"/g, "").split(/(?<=[.!?])\s+|","|":"/).map((x) => x.toLowerCase().replace(/[^a-zà-ÿ ]/g, "").trim()).filter((x) => x.split(" ").length >= 8)) { if (seen.has(s) && seen.get(s) !== f) errs.push(`${f}: zelfde zin als ${seen.get(s)}: "${s.slice(0, 70)}"`); else seen.set(s, f); }
}
console.log(`${files.length} pagina's, ${errs.length} fouten`); errs.slice(0, 80).forEach((e) => console.log(" - " + e)); process.exit(errs.length ? 1 : 0);
