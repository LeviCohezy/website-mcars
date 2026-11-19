// Turns a translator's output chunk ({m, d: [...]} in the order of the exported chunk) into the
// shape `i18n.mts import` expects ({m, d: {Dutch: translation}}), after checking that every ICU
// message still parses and uses the same variables and tags.
// Usage: node scripts/i18n-merge-out.mjs <exported chunk> <translated chunk> <dest>
import fs from "node:fs";
import { parse } from "@formatjs/icu-messageformat-parser";

const [, , inFile, outFile, dest] = process.argv;
const a = JSON.parse(fs.readFileSync(inFile, "utf8"));
const b = JSON.parse(fs.readFileSync(outFile, "utf8"));
if (a.d.length !== b.d.length) throw new Error(`${outFile}: d has ${b.d.length} items, expected ${a.d.length}`);

/** Variable and tag names used anywhere in a message. */
function names(text) {
  const out = new Set();
  const walk = (els) => {
    for (const el of els) {
      if (el.type === 0) continue; // literal
      if (el.type === 7) continue; // '#'
      out.add(`${el.type === 8 ? "<>" : ""}${el.value}`);
      if (el.options) for (const o of Object.values(el.options)) walk(o.value);
      if (el.children) walk(el.children);
    }
  };
  walk(parse(text));
  return [...out].sort().join(",");
}

const m = {};
let bad = 0;
for (const [k, v] of Object.entries(a.m)) {
  const t = b.m[k];
  if (typeof t !== "string") { console.error(`missing: ${k}`); bad++; continue; }
  try {
    if (names(v) !== names(t)) { console.error(`variables differ, skipped: ${k}`); bad++; continue; }
  } catch (e) { console.error(`does not parse, skipped: ${k} (${e.message})`); bad++; continue; }
  m[k] = t;
}
const d = {};
a.d.forEach((s, i) => {
  const t = b.d[i];
  const r = t.length / s.length;
  // Every number of the source must come back (a shifted list shows up here first).
  const nums = (x) => x.match(/\d+/g) || [];
  if (typeof t !== "string" || (!process.env.LOOSE && (r < 0.35 || r > 2.8 || nums(s).some((n) => !nums(t).includes(n))))) { console.error(`suspect data item ${i}, skipped: ${s.slice(0, 50)} → ${String(t).slice(0, 50)}`); bad++; return; }
  d[s] = t;
});
fs.writeFileSync(dest, JSON.stringify({ m, d }));
console.log(`${outFile}: ${Object.keys(m).length} messages, ${Object.keys(d).length} data strings, ${bad} skipped`);
