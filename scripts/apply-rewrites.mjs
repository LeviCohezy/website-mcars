// Applies sentence rewrites to one content file.
//   node scripts/apply-rewrites.mjs <dienst> <land> <map.json>
// map.json: [{ "page": "belgie-spanje", "old": "exact sentence", "new": "reworded sentence" }, ...]
import fs from "node:fs";
const [svc, org, mapFile] = process.argv.slice(2);
const file = `src/data/local/${svc}/${org}.json`;
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const map = JSON.parse(fs.readFileSync(mapFile, "utf8"));
let done = 0; const missed = [];
const swap = (v, o, n) => (typeof v === "string" && v.includes(o) ? (hit = true, v.split(o).join(n)) : v);
let hit = false;
for (const m of map) {
  const p = data.pages[m.page];
  if (!p || !m.old || !m.new || m.old === m.new) { missed.push(m.old); continue; }
  hit = false;
  p.lead = swap(p.lead, m.old, m.new);
  for (const f of p.facts) f.value = swap(f.value, m.old, m.new);
  for (const s of p.sections) { s.body = s.body.map((b) => swap(b, m.old, m.new)); if (s.points) s.points = s.points.map((b) => swap(b, m.old, m.new)); }
  for (const l of p.local) l.body = swap(l.body, m.old, m.new);
  for (const f of p.faq) f.a = swap(f.a, m.old, m.new);
  hit ? done++ : missed.push(m.old);
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
console.log(`${done} zinnen vervangen, ${missed.length} niet gevonden`);
for (const m of missed.slice(0, 20)) console.log(" - " + String(m).slice(0, 100));
