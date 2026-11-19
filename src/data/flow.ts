/**
 * Copy for a service × place page (/diensten/[slug]/[place]): the fixed sales
 * flow — problem, solution, why Mcars, steps, FAQ — written per page in
 * src/data/flow/<service>/<place>.json. Pages without a file get the same flow
 * assembled from the service's own copy (see `fallbackFlow`).
 */

import fs from "node:fs";
import path from "node:path";
import type { Combo } from "./combos";
import type { Faq, ProcessStep, Service } from "./services";
import type { Situation } from "./service-details";

type Item = { title: string; body: string };

export type Flow = {
  sub: string;
  problem: { title: string; body: string; situations: Item[] };
  solution: { title: string; body: string };
  /** The four promises under the solution. */
  pillars: { betrouwbaar: string; snel: string; volgbaar: string; verzekerd: string };
  /** Why Mcars: experience, passion, rides driven, own drivers, range, renewal. */
  reasons: Item[];
  steps: Item[];
  why: { title: string; body: string; regions: string[] };
  faq: Faq[];
  seoDescription?: string;
};

const DEFAULT_PILLARS: Flow["pillars"] = {
  betrouwbaar: "Afspraak is afspraak. Vaste chauffeurs, één aanspreekpunt en een planning die we nakomen.",
  snel: "Uw aanvraag krijgt binnen 24 uur een antwoord en de rit wordt vlot ingepland.",
  volgbaar: "U weet waar uw wagen is. De chauffeur belt bij vertrek en op de dag van de levering.",
  verzekerd: "Uw wagen is verzekerd tijdens het hele transport en rijdt mee met een CMR-vrachtbrief.",
};

const DEFAULT_REASONS: Item[] = [
  { title: "Jarenlange ervaring", body: "We vervoeren al jaren wagens door Europa en weten wat er onderweg kan gebeuren." },
  { title: "Passie voor het vak", body: "Auto's en transport zijn ons vak en onze hobby. Dat merkt u aan hoe we met uw wagen omgaan." },
  { title: "Honderden ritten", body: "Elke week vertrekken onze transporters. Die routine zorgt voor een rit zonder verrassingen." },
  { title: "Eigen chauffeurs", body: "We kiezen bewust voor vaste, eigen chauffeurs. U weet wie uw wagen ophaalt en wie hem levert." },
  { title: "Breed aanbod", body: "Van één wagen tot een hele voorraad, rijdend of niet, van dagelijkse wagen tot klassieker." },
  { title: "Oog voor vernieuwing", body: "We investeren in onze vloot en in hoe u uw transport aanvraagt en opvolgt." },
];

const cache = new Map<string, Partial<Flow> | null>();

function read(service: string, place: string): Partial<Flow> | null {
  const key = `${service}/${place}`;
  if (!cache.has(key)) {
    const file = path.join(process.cwd(), "src/data/flow", service, `${place}.json`);
    cache.set(key, fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as Partial<Flow>) : null);
  }
  return cache.get(key) ?? null;
}

/** True when the page has its own written copy. */
export const hasFlow = (service: string, place: string) => read(service, place) !== null;

export function getFlow(
  service: Service,
  combo: Combo,
  base: { situations: Situation[]; process: ProcessStep[]; regions: string[] },
): Flow {
  const own = read(service.slug, combo.place);
  const fallback: Flow = {
    sub: service.subtitle,
    problem: {
      title: "Herkent u zich in een van deze situaties?",
      body: combo.intro,
      situations: base.situations.slice(0, 3).map((s) => ({ title: s.title, body: s.body })),
    },
    solution: { title: `${service.nav}, van ophaling tot levering.`, body: service.intro },
    pillars: DEFAULT_PILLARS,
    reasons: DEFAULT_REASONS,
    steps: base.process,
    why: { title: "Waar we voor u rijden.", body: combo.intro, regions: base.regions },
    faq: combo.faq,
  };
  if (!own) return fallback;
  return {
    ...fallback,
    ...own,
    pillars: own.pillars ?? DEFAULT_PILLARS,
    reasons: own.reasons?.length === 6 ? own.reasons : DEFAULT_REASONS,
  } as Flow;
}
