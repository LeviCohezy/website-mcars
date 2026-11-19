/**
 * Photo pools for the service × place pages. Each page gets a hero and three
 * section photos, picked deterministically so neighbouring pages differ:
 * destination country first, then origin, then the general fleet photos.
 */
import type { Flag } from "./routes";

export type Shot = { src: string; alt: string };

const GENERAL: Shot[] = [
  { src: "/fleet/countryside-highway.jpg", alt: "Autotransporter van Mcars op de snelweg" },
  { src: "/fleet/hero-highway-sunset.jpg", alt: "Autotransporter van Mcars bij zonsondergang" },
  { src: "/fleet/city-loaded.jpg", alt: "Geladen autotransporter van Mcars in de stad" },
  { src: "/fleet/depot-dusk.jpg", alt: "Autotransporters op het depot van Mcars in Roeselare" },
  { src: "/fleet/dramatic-sky.jpg", alt: "Autotransporter van Mcars onder een dreigende lucht" },
  { src: "/fleet/sunset-field.jpg", alt: "Autotransporter van Mcars langs de velden" },
  { src: "/about/real/loaded.jpg", alt: "Volgeladen autotransporter van Mcars" },
  { src: "/about/real/clouds.jpg", alt: "Autotransporter van Mcars onderweg" },
  { src: "/about/real/dusk.jpg", alt: "Autotransporter van Mcars in de schemering" },
  { src: "/about/real/scanias.jpg", alt: "Drie Scania-autotransporters van Mcars" },
];

/** Country pools. Generated scenery photos are added as /local/<land>-<n>.jpg. */
export const POOLS: Record<Flag, Shot[]> = {
  belgie: [
    { src: "/local/belgie-1.jpg", alt: "Autotransporter van Mcars in de West-Vlaamse polders" },
    { src: "/about/real/jubelpark.jpg", alt: "Autotransporter van Mcars aan het Jubelpark in Brussel" },
    { src: "/fleet/depot-wet.jpg", alt: "Depot van Mcars in Roeselare" },
    { src: "/about/real/fleet.jpg", alt: "De vloot van Mcars in Roeselare" },
  ],
  nederland: [{ src: "/local/nederland-2.jpg", alt: "Autotransporter van Mcars op weg naar Rotterdam" }, { src: "/local/nederland-1.jpg", alt: "Autotransporter van Mcars langs de molens in het Hollandse polderlandschap" }],
  luxemburg: [{ src: "/local/luxemburg-2.jpg", alt: "Autotransporter van Mcars langs de wijngaarden van de Moezel" }, { src: "/local/luxemburg-1.jpg", alt: "Autotransporter van Mcars bij de Adolphebrug in Luxemburg-stad" }],
  frankrijk: [{ src: "/local/frankrijk-2.jpg", alt: "Autotransporter van Mcars tussen de platanen en lavendel van de Provence" }, { src: "/local/frankrijk-1.jpg", alt: "Autotransporter van Mcars met het viaduct van Millau op de achtergrond" }, { src: "/fleet/countryside.jpg", alt: "Autotransporter van Mcars op het Franse platteland" }],
  duitsland: [{ src: "/local/duitsland-2.jpg", alt: "Autotransporter van Mcars in Opper-Beieren met de Alpen aan de horizon" }, { src: "/local/duitsland-1.jpg", alt: "Autotransporter van Mcars op een Rijnbrug met de Dom van Keulen" }, { src: "/fleet/germany-autobahn.jpg", alt: "Autotransporter van Mcars op de Duitse Autobahn" }],
  spanje: [
    { src: "/local/spanje-1.jpg", alt: "Autotransporter van Mcars tussen de olijfgaarden in Spanje" },
    { src: "/fleet/barcelona-palms.jpg", alt: "Autotransporter van Mcars tussen de palmbomen in Barcelona" },
    { src: "/fleet/barcelona-sagrada.jpg", alt: "Autotransporter van Mcars in Barcelona" },
    { src: "/fleet/spain-palms.jpg", alt: "Autotransporter van Mcars aan de Spaanse kust" },
    { src: "/fleet/spain-skyline.jpg", alt: "Autotransporter van Mcars in Spanje" },
  ],
  italie: [{ src: "/local/italie-2.jpg", alt: "Autotransporter van Mcars op een viaduct langs de Ligurische kust" }, { src: "/local/italie-1.jpg", alt: "Autotransporter van Mcars in de heuvels van Toscane" }, { src: "/fleet/oldtown.jpg", alt: "Autotransporter van Mcars in een oude stadskern" }],
  zwitserland: [{ src: "/local/zwitserland-1.jpg", alt: "Autotransporter van Mcars in een Zwitsers alpendal" }, { src: "/about/real/alps.jpg", alt: "Autotransporter van Mcars in de Alpen" }],
  oostenrijk: [{ src: "/local/oostenrijk-1.jpg", alt: "Autotransporter van Mcars in het Inntal in Tirol" }, { src: "/fleet/valley-sunset.jpg", alt: "Autotransporter van Mcars in een bergdal" }, { src: "/about/real/snow.jpg", alt: "Autotransporter van Mcars in de sneeuw" }],
  polen: [{ src: "/local/polen-2.jpg", alt: "Autotransporter van Mcars in Warschau" }, { src: "/local/polen-1.jpg", alt: "Autotransporter van Mcars op een Poolse snelweg" }],
};

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Hero + three section photos for one page, without repeats. */
export function pageShots(service: string, from: Flag, to?: Flag): { hero: Shot; shots: Shot[] } {
  const seed = hash(`${service}/${from}/${to ?? ""}`);
  const rot = <T,>(a: T[], n: number) => (a.length ? [...a.slice(n % a.length), ...a.slice(0, n % a.length)] : a);
  const dest = rot(POOLS[to ?? from], seed);
  const orig = to ? rot(POOLS[from], seed >> 3) : [];
  const general = rot(GENERAL, seed >> 5);
  // Interleave so a route shows both countries.
  const local: Shot[] = [];
  for (let i = 0; i < Math.max(dest.length, orig.length); i++) {
    if (dest[i]) local.push(dest[i]);
    if (orig[i]) local.push(orig[i]);
  }
  const all = [...local, ...general].filter((s, i, a) => a.findIndex((x) => x.src === s.src) === i);
  return { hero: all[0], shots: all.slice(1, 4) };
}
