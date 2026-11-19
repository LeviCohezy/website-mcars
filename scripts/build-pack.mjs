// Builds the fact pack for one writer: node scripts/build-pack.mjs <dienst> <land>
// (or no arguments for all 110). Slices the dossiers down to what one service
// and one origin country needs, so a writer reads one file instead of thirty.
import fs from "node:fs";
const C = { belgie: "België", nederland: "Nederland", luxemburg: "Luxemburg", frankrijk: "Frankrijk", duitsland: "Duitsland", spanje: "Spanje", italie: "Italië", zwitserland: "Zwitserland", oostenrijk: "Oostenrijk", polen: "Polen" };
const S = ["autotransport-particulier", "autotransport-dealers", "auto-importeren", "auto-exporteren", "niet-rijdende-auto", "oldtimer-transport", "open-autotransport", "depannage", "spoedtransport", "fleet-wagenpark", "eventtransport"];
const D = "docs/local-content/dossiers";
const read = (f) => (fs.existsSync(`${D}/${f}`) ? fs.readFileSync(`${D}/${f}`, "utf8") : "");
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
/** Split on "## " headings → [{ head, body }], preamble first with head "". */
const split = (md) => md.split(/^(?=## )/m).map((b) => ({ head: b.startsWith("## ") ? b.split("\n")[0].slice(3).trim() : "", body: b }));

function rules(country, service, withGeneral) {
  const parts = split(read(`${country}-regels.md`));
  const pick = parts.filter((p) => p.head === service || (withGeneral && /^algemeen/i.test(p.head)));
  return pick.map((p) => p.body.trim()).join("\n\n") || "(geen dossier)";
}
function regio(country, service, cap, rot = 0) {
  const parts = split(read(`${country}-regio.md`)).filter((p) => !/niet kunnen bevestigen|twijfels/i.test(p.head));
  if (!parts.length) return "(geen dossier)";
  const out = [];
  for (const p of parts) {
    const lines = p.body.split("\n");
    if (!/^\d/.test(p.head)) { out.push(lines.filter((l) => !l.startsWith("- [")).join("\n").trim()); continue; }
    const facts = lines.filter((l) => l.startsWith("- ["));
    let mine = facts.filter((l) => l.includes(service));
    if (mine.length < 3) mine = facts.slice(0, 5); // untagged or thin: give a few anyway
    if (mine.length > cap) { const k = (rot * 3) % mine.length; mine = [...mine.slice(k), ...mine.slice(0, k)].slice(0, cap); } // each origin sees a different slice
    const intro = lines.filter((l) => !l.startsWith("- [") && !l.startsWith("#") && l.trim()).slice(0, 3).join("\n");
    out.push(`### ${p.head}\n${intro}\n${mine.join("\n")}`);
  }
  return out.join("\n\n");
}
function route(a, b) {
  for (const f of fs.readdirSync(D).filter((f) => f.startsWith("routes-"))) {
    const hit = split(read(f)).find((p) => { const h = norm(p.head); return [a, b].every((c) => h.includes(c) || h.includes(norm(C[c]))); });
    if (hit) return hit.body.trim();
  }
  return "(geen routedossier)";
}

function build(service, origin) {
  const others = Object.keys(C).filter((c) => c !== origin);
  const md = [
    `# Feitenpak: ${service} vanuit ${C[origin]}`,
    `Alle feiten komen uit de onderzoeksdossiers en hebben een bron-URL. Gebruik enkel deze feiten.`,
    `# VERTREKLAND ${C[origin]} — regels`, rules(origin, service, true),
    ...(service === "auto-importeren" ? [`# VERTREKLAND ${C[origin]} — uitvoeren/uitschrijven (uit het exportdossier)`, rules(origin, "auto-exporteren", false)] : []),
    `# VERTREKLAND ${C[origin]} — regio's`, regio(origin, service, 14),
    ...others.flatMap((c) => [
      `# ROUTE ${origin}-${c}: de weg`, route(origin, c),
      `# AANKOMSTLAND ${C[c]} — regels voor ${service}`, rules(c, service === "auto-exporteren" ? "auto-importeren" : service, false),
      `# AANKOMSTLAND ${C[c]} — regio's`, regio(c, service, 4, Object.keys(C).indexOf(origin)),
    ]),
  ].join("\n\n");
  fs.mkdirSync(`docs/local-content/packs/${service}`, { recursive: true });
  fs.writeFileSync(`docs/local-content/packs/${service}/${origin}.md`, md);
  return md.length;
}
const [s, o] = process.argv.slice(2);
const jobs = s ? [[s, o]] : S.flatMap((x) => Object.keys(C).map((c) => [x, c]));
const sizes = jobs.map(([a, b]) => build(a, b));
console.log(`${jobs.length} packs, gemiddeld ${Math.round(sizes.reduce((x, y) => x + y, 0) / sizes.length / 1000)} kB, max ${Math.round(Math.max(...sizes) / 1000)} kB`);
