// Builds the static GitHub Pages preview into out/:   npm run export
//
//   1. `next build` with EXPORT=true and the /website-mcars base path. The CMS (/cms) and its API
//      (/api/inbox) are left out, so the forms there fall back to a pre-filled e-mail.
//   2. Copies out/nl/* to the root of out/: without the locale proxy (no server on GitHub Pages)
//      Dutch would only exist under /nl/, while the site links to the unprefixed Dutch URLs.
//   3. `next typegen`, so .next/types lists /cms again (the export rewrote it without), and
//      `tsc` keeps agreeing with the dev server's types.
//
// Publishing out/ to the gh-pages branch stays a separate step.
import { execSync } from "node:child_process";
import fs from "node:fs";

const run = (cmd, env = {}) => execSync(cmd, { stdio: "inherit", env: { ...process.env, ...env } });

fs.rmSync("out", { recursive: true, force: true });
run("npx next build", { EXPORT: "true", NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "/website-mcars" });
fs.cpSync("out/nl", "out", { recursive: true });
fs.writeFileSync("out/.nojekyll", "");
run("npx next typegen");
console.log("\nout/ is ready for gh-pages (Dutch at the root, /fr /en /de /es /it next to it).");
