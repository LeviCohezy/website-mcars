/**
 * SERVICE × PLACE landing pages — /diensten/<dienst>/<plaats>, where <plaats>
 * is a country ("frankrijk") or a corridor ("belgie-frankrijk").
 *
 * 11 services × 10 countries = 110 pages, 11 services × 90 corridors = 990.
 * They are not in the navigation: the footer has a collapsed index, there is
 * a full list on /alle-paginas, and every one is in the sitemap.
 *
 * Copy is assembled from per-service angles (below) and the per-country facts
 * in routes.ts, so each page names its own cities, distance and questions.
 */

import { CORE, CORRIDOR_COUNTRIES, FACTS, corridorSlug, km, COUNTRY_PAGES, type Flag } from "./routes";
import { getService, services, type Faq, type Stat } from "./services";

type Angle = {
  /** Page title for a country: "Oldtimer transport naar Frankrijk". */
  country: (c: string, home: boolean) => string;
  /** Page title for a corridor. */
  route: (a: string, b: string) => string;
  /** One sentence on what this service means on this trip. */
  pitch: (a: string, b?: string) => string;
  /** A question this service raises for the place. */
  faq: (a: string, b?: string) => Faq;
};

const naar = (c: string, home: boolean) => (home ? `in ${c}` : `naar ${c}`);

const ANGLES: Record<string, Angle> = {
  "autotransport-particulier": {
    country: (c, h) => `Auto laten vervoeren ${naar(c, h)}`,
    route: (a, b) => `Auto laten vervoeren van ${a} naar ${b}`,
    pitch: (a, b) => (b ? `Verhuist u, kocht u een wagen of heeft u een tweede verblijf? Wij brengen uw auto van ${a} naar ${b}, zodat u zelf niet hoeft te rijden.` : `Een wagen gekocht, verhuisd of een tweede verblijf in ${a}? Wij vervoeren uw auto, zodat u zelf niet hoeft te rijden.`),
    faq: (a, b) => ({ q: `Moet ik zelf aanwezig zijn bij ophaling${b ? ` in ${a}` : ""}?`, a: "Niet per se. Iemand die u aanduidt kan de wagen overhandigen; we inspecteren en fotograferen hem en zetten alles op de CMR." }),
  },
  "autotransport-dealers": {
    country: (c, h) => `Autotransport voor dealers ${naar(c, h)}`,
    route: (a, b) => `Autotransport voor dealers van ${a} naar ${b}`,
    pitch: (a, b) => (b ? `Voor garages en handelaars rijden we voorraad, inruilwagens en verkochte wagens van ${a} naar ${b}, waar nodig meerdere tegelijk.` : `Voor garages, handelaars en concessies in ${a} rijden we voorraad, inruilwagens en verkochte wagens, waar nodig meerdere tegelijk.`),
    faq: () => ({ q: "Kunnen jullie meerdere wagens tegelijk meenemen?", a: "Ja. Onze meerlaagse transporters nemen meerdere wagens per rit mee; dat houdt de kost per wagen laag." }),
  },
  "auto-importeren": {
    country: (c, h) => (h ? `Auto importeren naar ${c}` : `Auto importeren uit ${c}`),
    route: (a, b) => `Auto importeren van ${a} naar ${b}`,
    pitch: (a, b) => `Een wagen gekocht in ${a}? Wij halen hem op bij de verkoper en brengen hem${b ? ` naar ${b}` : " naar uw adres of ons depot"}, met de papieren in orde voor inschrijving.`,
    faq: (a) => ({ q: `Welke documenten heb ik nodig voor een import uit ${a}?`, a: "Zorg voor het inschrijvingsbewijs, de factuur of koopovereenkomst en het gelijkvormigheidsattest (COC). We helpen u graag op weg." }),
  },
  "auto-exporteren": {
    country: (c) => `Auto exporteren naar ${c}`,
    route: (a, b) => `Auto exporteren van ${a} naar ${b}`,
    pitch: (a, b) => (b ? `Een wagen verkocht aan een koper in ${b}? Wij halen hem op in ${a} en leveren hem af bij de koper.` : `Een wagen verkocht naar ${a}? Wij halen hem op en leveren hem af bij de koper, verzekerd en met CMR.`),
    faq: () => ({ q: "Leveren jullie rechtstreeks bij de koper?", a: "Ja. We leveren op het adres dat u opgeeft en laten de koper bij aflevering tekenen op de CMR." }),
  },
  "niet-rijdende-auto": {
    country: (c, h) => `Niet-rijdende auto vervoeren ${naar(c, h)}`,
    route: (a, b) => `Niet-rijdende auto vervoeren van ${a} naar ${b}`,
    pitch: (a, b) => `Start de wagen niet meer of liep hij schade op? Met de lier trekken we hem veilig aan boord${b ? ` in ${a} en brengen we hem naar ${b}` : `, ook in ${a}`}. Volledig geblokkeerd? Dan voorzien we een heftruck.`,
    faq: () => ({ q: "Wat als de wielen volledig geblokkeerd zijn?", a: "Dan is een heftruck ter plaatse nodig. Vermeld het bij uw aanvraag, zodat we het correct inplannen." }),
  },
  "oldtimer-transport": {
    country: (c, h) => `Oldtimer transport ${naar(c, h)}`,
    route: (a, b) => `Oldtimer transport van ${a} naar ${b}`,
    pitch: (a, b) => `Een klassieker${b ? ` van ${a} naar ${b}` : ` ${a === "België" ? "in" : "naar"} ${a}`}, voor een beurs, een verkoop of een rit: zacht geladen, professioneel vastgezet en behandeld alsof het onze eigen wagen is.`,
    faq: () => ({ q: "Kan een oldtimer die niet meer rijdt mee?", a: "Ja. Zolang hij verrolbaar is, trekken we hem met de lier op de vrachtwagen. Vermeld het bij uw aanvraag." }),
  },
  "open-autotransport": {
    country: (c, h) => `Open autotransport ${naar(c, h)}`,
    route: (a, b) => `Open autotransport van ${a} naar ${b}`,
    pitch: (a, b) => `Op onze meerlaagse transporters reist uw wagen${b ? ` van ${a} naar ${b}` : ` ${a === "België" ? "door" : "naar"} ${a}`} mee met andere wagens: de voordeligste manier, even zorgvuldig vastgezet.`,
    faq: () => ({ q: "Is open transport veilig voor mijn wagen?", a: "Ja. Elke wagen wordt professioneel vastgezet, gedocumenteerd op de CMR en is verzekerd tijdens het transport." }),
  },
  depannage: {
    country: (c, h) => (h ? `Depannage in ${c}` : `Wagen gestrand in ${c}? Repatriëring`),
    route: (a, b) => `Repatriëring van een gestrande wagen van ${a} naar ${b}`,
    pitch: (a, b) => (b ? `Staat uw wagen na pech of een ongeval stil in ${a}? Wij laden hem op en brengen hem naar uw garage of uw adres in ${b}.` : `Pech of een ongeval in ${a}? Wij laden uw wagen op en brengen hem naar uw garage, naar huis of naar ons depot.`),
    faq: (a) => ({ q: `Hoe snel kunnen jullie in ${a} zijn?`, a: "Dat hangt af van waar de wagen staat en van onze lopende ritten. Bel ons en u krijgt meteen een realistisch antwoord." }),
  },
  spoedtransport: {
    country: (c, h) => `Spoedtransport ${naar(c, h)}`,
    route: (a, b) => `Spoedtransport van ${a} naar ${b}`,
    pitch: (a, b) => `Moet een wagen dringend${b ? ` van ${a} naar ${b}` : ` ${a === "België" ? "in" : "naar"} ${a}`}? Bel ons: we bekijken meteen wat er kan op onze lopende ritten en geven u een eerlijk antwoord.`,
    faq: () => ({ q: "Hoe dringend kan het?", a: "Dat hangt af van de afstand en onze planning op dat moment. Bel ons; u krijgt meteen een realistisch antwoord, zonder loze beloftes." }),
  },
  "fleet-wagenpark": {
    country: (c, h) => `Fleet & wagenpark transport ${naar(c, h)}`,
    route: (a, b) => `Fleet transport van ${a} naar ${b}`,
    pitch: (a, b) => `Leasingwagens, poolwagens of een volledige vloot${b ? ` van ${a} naar ${b}` : ` ${a === "België" ? "in" : "naar"} ${a}`}: we plannen meerdere voertuigen per rit en houden u op de hoogte per wagen.`,
    faq: () => ({ q: "Kunnen jullie een volledige vloot in één keer verplaatsen?", a: "We plannen meerdere voertuigen per rit en combineren ritten waar nodig. Geef het aantal wagens op bij uw aanvraag." }),
  },
  eventtransport: {
    country: (c, h) => `Eventtransport ${naar(c, h)}`,
    route: (a, b) => `Eventtransport van ${a} naar ${b}`,
    pitch: (a, b) => `Voor beurzen, lanceringen, fotoshoots en rally's${b ? ` van ${a} naar ${b}` : ` ${a === "België" ? "in" : "in en naar"} ${a}`}: uw wagens komen onberispelijk en op tijd aan op de locatie.`,
    faq: () => ({ q: "Leveren jullie tot op de eventlocatie?", a: "Ja, tot op de afgesproken plek. Geef toegang, tijdsvenster en contactpersoon op bij uw aanvraag." }),
  },
};

export type Combo = {
  service: string;
  place: string;
  kind: "country" | "corridor";
  from: Flag;
  to?: Flag;
  title: string;
  nav: string;
  intro: string;
  frequency: string;
  stats: Stat[];
  cities: string[];
  faq: Faq[];
  related: { href: string; label: string; meta: string }[];
  seo: { title: string; description: string };
};

const SERVICE_SLUGS = services.map((s) => s.slug).filter((s) => s in ANGLES);
const PAIRS = CORRIDOR_COUNTRIES.flatMap((a) => CORRIDOR_COUNTRIES.filter((b) => b !== a).map((b) => [a, b] as [Flag, Flag]));

export const comboParams = () =>
  SERVICE_SLUGS.flatMap((service) => [
    ...CORRIDOR_COUNTRIES.map((c) => ({ slug: service, place: c as string })),
    ...PAIRS.map(([a, b]) => ({ slug: service, place: corridorSlug(a, b) })),
  ]);

export function getCombo(serviceSlug: string, place: string): Combo | null {
  const service = getService(serviceSlug);
  const angle = ANGLES[serviceSlug];
  if (!service || !angle) return null;

  const [a, b] = place.split("-") as [Flag, Flag | undefined];
  if (!CORRIDOR_COUNTRIES.includes(a) || (b !== undefined && (!CORRIDOR_COUNTRIES.includes(b) || b === a))) return null;
  if (place.split("-").length > 2) return null;

  const A = FACTS[a];
  const svc = service.nav;

  if (!b) {
    const home = a === "belgie";
    const dist = km("belgie", a);
    const title = angle.country(A.name, home);
    const frequency = home ? "Dagelijks" : CORE.includes(a) ? "Wekelijks" : a === "spanje" ? "Vaste route" : "Regelmatig";
    return {
      service: serviceSlug,
      place,
      kind: "country",
      from: a,
      title,
      nav: `${svc} · ${A.name}`,
      intro: `${angle.pitch(A.name)} ${A.pickup}. ${A.delivery}.`,
      frequency,
      stats: [
        home ? { value: "Dagelijks", label: "onderweg in België" } : { value: `± ${dist} km`, label: "vanuit Roeselare" },
        { value: frequency === "Dagelijks" ? "24/7" : frequency, label: frequency === "Dagelijks" ? "levering op ons depot" : "op de planning" },
        { value: "24u", label: "antwoord op uw aanvraag" },
      ],
      cities: A.cities,
      faq: [angle.faq(A.name), ...service.faq.slice(0, 2), ...(A.faq ? [A.faq] : [])],
      related: [
        { href: `/diensten/${serviceSlug}`, label: service.nav, meta: "Dienst" },
        ...(COUNTRY_PAGES.has(a) ? [{ href: `/routes/autotransport-${a}`, label: `Autotransport ${A.name}`, meta: "Bestemming" }] : []),
        ...(home ? [] : [{ href: `/diensten/${serviceSlug}/${corridorSlug("belgie", a)}`, label: angle.route("België", A.name), meta: "Route" }]),
        ...service.related.slice(0, 2).filter((s) => s in ANGLES).map((s) => ({ href: `/diensten/${s}/${a}`, label: ANGLES[s].country(A.name, home), meta: "Dienst" })),
      ],
      seo: {
        title: `${title} | Mcars`,
        description: `${title}: ${service.subtitle.replace(/\.$/, "")}. Verzekerd, met CMR, van deur tot deur. Vraag uw offerte binnen 24 uur.`,
      },
    };
  }

  const B = FACTS[b];
  const fixed = CORE.includes(a) && CORE.includes(b);
  const viaCore = CORE.includes(a) || CORE.includes(b);
  const dist = km(a, b);
  const frequency = fixed ? "Vaste corridor" : viaCore ? "Regelmatig" : "Op aanvraag";
  const title = angle.route(A.name, B.name);
  return {
    service: serviceSlug,
    place,
    kind: "corridor",
    from: a,
    to: b,
    title,
    nav: `${svc} · ${A.name} → ${B.name}`,
    intro: `${angle.pitch(A.name, B.name)} ${A.pickup}. ${B.delivery}.`,
    frequency,
    stats: [
      { value: `± ${dist} km`, label: "over de weg" },
      { value: fixed ? "Wekelijks" : frequency, label: "op de planning" },
      { value: "24u", label: "antwoord op uw aanvraag" },
    ],
    cities: [...A.cities.slice(0, 4), ...B.cities.slice(0, 4)],
    faq: [angle.faq(A.name, B.name), ...service.faq.slice(0, 2), ...[A.faq, B.faq].filter((f): f is Faq => Boolean(f))],
    related: [
      { href: `/routes/${corridorSlug(a, b)}`, label: `${A.name} → ${B.name}`, meta: "Route" },
      { href: `/diensten/${serviceSlug}/${corridorSlug(b, a)}`, label: angle.route(B.name, A.name), meta: "Terugweg" },
      { href: `/diensten/${serviceSlug}/${b}`, label: angle.country(B.name, b === "belgie"), meta: svc },
      { href: `/diensten/${serviceSlug}`, label: service.nav, meta: "Dienst" },
      ...service.related.slice(0, 2).filter((s) => s in ANGLES).map((s) => ({ href: `/diensten/${s}/${place}`, label: ANGLES[s].route(A.name, B.name), meta: "Dienst" })),
    ],
    seo: {
      title: `${title} | Mcars`,
      description: `${title} (± ${dist} km). ${service.subtitle.replace(/\.$/, "")}. Verzekerd, met CMR. Vraag uw offerte binnen 24 uur.`,
    },
  };
}

/** Grouped index for the footer and /alle-paginas. */
export function comboIndex() {
  return SERVICE_SLUGS.map((slug) => {
    const service = getService(slug)!;
    const angle = ANGLES[slug];
    return {
      slug,
      nav: service.nav,
      countries: CORRIDOR_COUNTRIES.map((c) => ({ href: `/diensten/${slug}/${c}`, label: angle.country(FACTS[c].name, c === "belgie"), short: FACTS[c].name })),
      routes: PAIRS.map(([a, b]) => ({ href: `/diensten/${slug}/${corridorSlug(a, b)}`, label: angle.route(FACTS[a].name, FACTS[b].name), short: `${FACTS[a].name} → ${FACTS[b].name}` })),
    };
  });
}
