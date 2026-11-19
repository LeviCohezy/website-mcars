import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { STATUSES, type FileRef, type Stop, type InboxItem, type InboxPayload, type Status } from "./types";

/**
 * Local storage for the CMS inbox: one folder per request under `.data/inbox/<id>/` with
 * `request.json` and the uploaded files next to it. This is the only module that touches
 * storage, so swapping it for R2 (files) + a database (requests) later keeps the API and the
 * /cms screens as they are.
 */

const ROOT = path.join(/* turbopackIgnore: true */ process.cwd(), ".data", "inbox");

const MAX_FILE = 20 * 1024 * 1024;
const MAX_FILES = 60;
const ALLOWED = /^(image\/(jpeg|png|webp|heic|heif|gif)|application\/pdf)$/;

const ID = /^[0-9]{8}-[0-9]{6}-[a-f0-9]{6}$/;
export const isId = (id: string) => ID.test(id);

const dir = (id: string) => path.join(ROOT, id);
const jsonPath = (id: string) => path.join(dir(id), "request.json");

function newId(now: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  const stamp = `${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}-${p(now.getHours())}${p(now.getMinutes())}${p(now.getSeconds())}`;
  return `${stamp}-${crypto.randomBytes(3).toString("hex")}`;
}

const safeName = (name: string) =>
  name.normalize("NFKD").replace(/[^\w.\-]+/g, "_").replace(/_+/g, "_").slice(-80) || "bestand";

const clip = (v: unknown, n = 4000) => (typeof v === "string" ? v.trim().slice(0, n) : undefined);

/** Keeps only known fields with sane lengths, so the JSON on disk is predictable. */
function clean(p: InboxPayload): InboxPayload {
  const stop = (s?: Stop): Stop => ({
    depot: !!s?.depot || undefined,
    land: clip(s?.land, 80),
    stad: clip(s?.stad, 120),
    postcode: clip(s?.postcode, 20),
    straat: clip(s?.straat, 200),
    adres: clip(s?.adres, 300),
    datum: clip(s?.datum, 40),
    zoSnelMogelijk: !!s?.zoSnelMogelijk || undefined,
  });
  return {
    kind: p.kind === "contact" ? "contact" : "offerte",
    form: p.form,
    page: clip(p.page, 300),
    locale: clip(p.locale, 5),
    service: clip(p.service, 120),
    klant: {
      type: p.klant?.type === "Bedrijf" ? "Bedrijf" : p.klant?.type === "Particulier" ? "Particulier" : undefined,
      naam: clip(p.klant?.naam, 200) ?? "",
      email: clip(p.klant?.email, 200) ?? "",
      telefoon: clip(p.klant?.telefoon, 60),
      bedrijf: clip(p.klant?.bedrijf, 200),
      btw: clip(p.klant?.btw, 40),
    },
    onderwerp: clip(p.onderwerp, 300),
    bericht: clip(p.bericht, 10000),
    rit: p.rit ? { retour: !!p.rit.retour, van: stop(p.rit.van), naar: stop(p.rit.naar), opties: clip(p.rit.opties, 200) } : undefined,
    autos: Array.isArray(p.autos)
      ? p.autos.slice(0, 50).map((c) => ({
          merk: clip(c.merk, 80),
          model: clip(c.model, 200) ?? "",
          bouwjaar: clip(c.bouwjaar, 10),
          staat: clip(c.staat, 120),
          extra: clip(c.extra, 4000),
          aantal: Math.min(99, Math.max(1, Number(c.aantal) || 1)),
        }))
      : undefined,
  };
}

export class InboxError extends Error {}

/** Stores a new request. `files` are the multipart entries named `car<i>.photo` / `car<i>.doc`. */
export async function createItem(payload: InboxPayload, files: { field: string; file: File }[]): Promise<InboxItem> {
  const p = clean(payload);
  if (!p.klant.naam && !p.klant.email) throw new InboxError("Naam of e-mail ontbreekt");
  if (files.length > MAX_FILES) throw new InboxError(`Maximaal ${MAX_FILES} bestanden`);

  const autos = (p.autos ?? []).map((c) => ({ ...c, photos: [] as FileRef[], docs: [] as FileRef[] }));
  // Check every file before anything is written, so a rejected request leaves nothing behind.
  const accepted = files.flatMap(({ field, file }) => {
    const m = /^car(\d+)\.(photo|doc)$/.exec(field);
    const car = m && autos[Number(m[1])];
    if (!car) return [];
    if (file.size > MAX_FILE) throw new InboxError(`${file.name} is groter dan 20 MB`);
    if (!ALLOWED.test(file.type)) throw new InboxError(`${file.name}: bestandstype niet toegestaan`);
    return [{ car, kind: m[2] as "photo" | "doc", file }];
  });

  const now = new Date();
  const id = newId(now);
  await fs.mkdir(path.join(dir(id), "files"), { recursive: true });
  try {
    let n = 0;
    for (const { car, kind, file } of accepted) {
      const stored = `${String(++n).padStart(2, "0")}-${safeName(file.name)}`;
      await fs.writeFile(path.join(dir(id), "files", stored), Buffer.from(await file.arrayBuffer()));
      (kind === "photo" ? car.photos : car.docs).push({ name: file.name.slice(0, 200), file: stored, type: file.type, size: file.size });
    }
    const item: InboxItem = { ...p, autos: p.autos ? autos : undefined, id, createdAt: now.toISOString(), status: "nieuw" };
    await fs.writeFile(jsonPath(id), JSON.stringify(item, null, 2));
    return item;
  } catch (e) {
    await fs.rm(dir(id), { recursive: true, force: true });
    throw e;
  }
}

export async function listItems(): Promise<InboxItem[]> {
  let ids: string[] = [];
  try {
    ids = (await fs.readdir(ROOT)).filter(isId);
  } catch {
    return [];
  }
  const items = await Promise.all(ids.map((id) => getItem(id)));
  return items.filter((x): x is InboxItem => !!x).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getItem(id: string): Promise<InboxItem | null> {
  if (!isId(id)) return null;
  try {
    return JSON.parse(await fs.readFile(jsonPath(id), "utf8")) as InboxItem;
  } catch {
    return null;
  }
}

/** Office-side changes: status and the internal note. */
export async function updateItem(id: string, patch: { status?: Status; notitie?: string }): Promise<InboxItem | null> {
  const item = await getItem(id);
  if (!item) return null;
  if (patch.status && STATUSES.includes(patch.status)) item.status = patch.status;
  if (typeof patch.notitie === "string") item.notitie = patch.notitie.slice(0, 10000);
  item.updatedAt = new Date().toISOString();
  await fs.writeFile(jsonPath(id), JSON.stringify(item, null, 2));
  return item;
}

export async function deleteItem(id: string): Promise<boolean> {
  if (!isId(id) || !(await getItem(id))) return false;
  await fs.rm(dir(id), { recursive: true, force: true });
  return true;
}

/** An uploaded file of a request; only names listed in its request.json are served. */
export async function readFile(id: string, file: string): Promise<{ data: Buffer; ref: FileRef } | null> {
  const item = await getItem(id);
  const ref = item?.autos?.flatMap((c) => [...c.photos, ...c.docs]).find((f) => f.file === file);
  if (!ref) return null;
  return { data: await fs.readFile(path.join(dir(id), "files", path.basename(ref.file))), ref };
}
