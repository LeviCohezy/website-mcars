// Lists sentences that occur on more than one page across files.
//   node scripts/dupes.mjs                  count per file (only the later file of each pair is charged)
//   node scripts/dupes.mjs <dienst> <land>  the sentences this file must reword, as JSON
import fs from "node:fs";
const root = "src/data/local";
const norm = (s) => s.toLowerCase().replace(/[^a-zà-ÿ0-9 ]/g, "").trim();
const sentences = (t) => t.split(/(?<!(?:^|[\s(])(?:St|Sta|bv|bijv|ca|nr|art|o\.a|Dr|Mr|[A-Z])\.)(?<=[.!?])\s+(?=[A-ZÀ-Ý0-9"'(])/).filter((s) => norm(s).split(" ").length >= 9);
const fields = (p) => [p.lead, ...p.facts.map((f) => f.value), ...p.sections.flatMap((s) => [...s.body, ...(s.points ?? [])]), ...p.local.map((l) => l.body), ...p.faq.map((f) => f.a)];
const files = fs.readdirSync(root).flatMap((s) => fs.readdirSync(`${root}/${s}`).filter((f) => f.endsWith(".json")).map((f) => `${s}/${f.slice(0, -5)}`)).sort();
const first = new Map(); // normalised sentence -> first page that has it
const todo = new Map(files.map((f) => [f, []]));
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(`${root}/${f}.json`, "utf8"));
  for (const [key, p] of Object.entries(data.pages)) {
    const id = `${f.split("/")[0]}/${key}`;
    const seenHere = new Set();
    for (const s of fields(p).flatMap(sentences)) {
      const n = norm(s);
      if (seenHere.has(n)) continue;
      seenHere.add(n);
      if (first.has(n) && first.get(n) !== id) todo.get(f).push({ page: key, sentence: s, alsoOn: first.get(n) });
      else first.set(n, id);
    }
  }
}
const [svc, org] = process.argv.slice(2);
if (svc) console.log(JSON.stringify(todo.get(`${svc}/${org}`) ?? [], null, 1));
else {
  let total = 0;
  for (const [f, l] of todo) { total += l.length; if (l.length) console.log(String(l.length).padStart(4), f); }
  console.log("totaal", total, "in", [...todo.values()].filter((l) => l.length).length, "bestanden");
}
