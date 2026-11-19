/**
 * ROUTE CONTENT MODEL — the CMS "collection" behind every route page.
 *
 * Each route page (/routes/[slug]) renders from one entry via a single
 * template. Two kinds: `country` (autotransport in a country) and `corridor`
 * (transport from country A to country B). Same house rules as services:
 * no prices, no promised lead times, equal tone for private & business.
 */

import type { Highlight, Faq, Stat } from "./services";

export type Flag =
  | "belgie" | "nederland" | "frankrijk" | "italie"
  | "spanje" | "duitsland" | "luxemburg" | "zwitserland"
  | "oostenrijk" | "polen";

export type Place = { name: string; flag: Flag };

export type Route = {
  slug: string;
  nav: string;
  kind: "country" | "corridor";
  /** country pages */
  place?: Place;
  /** corridor pages */
  from?: Place;
  to?: Place;
  /** corridor pages: a fixed corridor on the weekly planning (vs. planned on request). */
  fixed?: boolean;
  title: string;
  subtitle: string;
  intro: string;
  heroImage: string;
  frequency: string;
  stats: Stat[];
  cities: string[];
  highlights: Highlight[];
  faq: Faq[];
  related: string[];
  relatedServices?: string[];
  seo: { title: string; description: string };
  contentNote?: string;
};

/** Flag-truck badge assets live in /public/countryflags. */
export const flagAsset: Record<Flag, string> = {
  belgie: "/countryflags/truck-flag-belgie.png",
  nederland: "/countryflags/truck-flag-nederland.png",
  frankrijk: "/countryflags/truck-flag-frankrijk.png",
  italie: "/countryflags/truck-flag-italie.png",
  spanje: "/countryflags/truck-flag-spanje.png",
  duitsland: "/countryflags/truck-flag-duitsland.png",
  luxemburg: "/countryflags/truck-flag-luxemburg.png",
  zwitserland: "/countryflags/truck-flag-zwitserland.png",
  oostenrijk: "/countryflags/truck-flag-oostenrijk.png",
  polen: "/countryflags/truck-flag-polen.png",
};

const commonHighlights: Highlight[] = [
  { icon: "shield", title: "Verzekerd & gedocumenteerd", body: "Elke wagen wordt geïnspecteerd, gefotografeerd en op een CMR-vrachtbrief gezet." },
  { icon: "users", title: "Twee talen aan boord", body: "Nederlandstalige én Franstalige chauffeurs — vlot contact op elke bestemming." },
  { icon: "truck", title: "Meerdere wagens per rit", body: "Slim combineren op onze routes houdt het transport per wagen voordelig." },
];

/** A fitting fleet photo per destination country (corridor heroes). */
const heroByFlag: Record<Flag, string> = {
  belgie: "/fleet/city-loaded.jpg",
  nederland: "/fleet/port-docks.jpg",
  frankrijk: "/fleet/countryside-highway.jpg",
  spanje: "/fleet/barcelona-sagrada.jpg",
  italie: "/fleet/mountain-suvs.jpg",
  duitsland: "/fleet/germany-autobahn.jpg",
  luxemburg: "/fleet/oldtown.jpg",
  zwitserland: "/fleet/valley-sunset.jpg",
  oostenrijk: "/fleet/dramatic-sky.jpg",
  polen: "/fleet/actros-motion.jpg",
};


// ─── Corridors ─────────────────────────────────────────────────────
// A page for every ordered pair of these countries (10 × 9 = 90). The copy is
// assembled from per-country facts, so each page names real pickup/delivery
// cities, its own road distance and fitting FAQ — not just swapped names.

export type CountryFacts = {
  name: string;
  /** Main pickup/delivery cities, most important first. */
  cities: string[];
  /** How we work there when picking up. */
  pickup: string;
  /** How we work there when delivering. */
  delivery: string;
  /** Extra FAQ entry specific to this country (as origin or destination). */
  faq?: Faq;
};

export const FACTS: Record<Flag, CountryFacts> = {
  belgie: {
    name: "België",
    cities: ["Roeselare", "Gent", "Antwerpen", "Brussel", "Brugge", "Hasselt"],
    pickup: "In België zijn we thuis: vanuit ons depot in Roeselare halen we dagelijks op, van de kust tot Limburg",
    delivery: "In België leveren we tot aan de deur, of u haalt de wagen op ons depot in Roeselare op — dat kan 24/7",
  },
  nederland: {
    name: "Nederland",
    cities: ["Rotterdam", "Amsterdam", "Utrecht", "Eindhoven", "Breda", "Den Haag"],
    pickup: "Nederland ligt op onze vaste routes: we halen op bij particulieren, dealers en leasingmaatschappijen",
    delivery: "In Nederland leveren we bij u thuis, bij uw dealer of op het adres van de koper",
  },
  luxemburg: {
    name: "Luxemburg",
    cities: ["Luxemburg-stad", "Esch-sur-Alzette", "Differdange", "Ettelbruck", "Diekirch", "Wiltz"],
    pickup: "Luxemburg ligt vlak bij onze vaste assen: we halen er op bij particulieren en dealers, vaak voor leasingwagens",
    delivery: "In Luxemburg leveren we bij u thuis, bij uw dealer of bij de leasingmaatschappij",
  },
  frankrijk: {
    name: "Frankrijk",
    cities: ["Parijs", "Lille", "Lyon", "Bordeaux", "Marseille", "Straatsburg"],
    pickup: "In Frankrijk zitten we elke week, tot in de stockageparken (o.a. BCA en TEA) en bij particulieren en handelaars",
    delivery: "In Frankrijk leveren we overal, met Franstalige chauffeurs die vlot afspreken ter plaatse",
  },
  duitsland: {
    name: "Duitsland",
    cities: ["Keulen", "Düsseldorf", "Frankfurt", "München", "Hamburg", "Stuttgart"],
    pickup: "In Duitsland halen we op bij dealers, veilingen en particulieren — ideaal voor een aankoop over de grens",
    delivery: "In Duitsland leveren we bij u of bij de koper, met alle papieren netjes in orde",
  },
  spanje: {
    name: "Spanje",
    cities: ["Barcelona", "Madrid", "Valencia", "Bilbao", "Málaga", "Alicante"],
    pickup: "In Spanje halen we op aan uw tweede verblijf, bij dealers of bij particulieren",
    delivery: "In Spanje staat uw wagen klaar aan uw verblijf: u vliegt, wij rijden",
    faq: { q: "Kan mijn wagen klaarstaan aan mijn tweede verblijf in Spanje?", a: "Ja, dat doen we regelmatig voor tweedeverblijvers. U vliegt zorgeloos, en uw eigen wagen staat bij aankomst klaar." },
  },
  italie: {
    name: "Italië",
    cities: ["Milaan", "Turijn", "Rome", "Bologna", "Verona", "Florence"],
    pickup: "In Italië halen we op bij dealers, verzamelaars en particulieren — ook oldtimers en klassiekers",
    delivery: "In Italië leveren we tot op het afgesproken adres, ook voor rally's en evenementen",
    faq: { q: "Kan een oldtimer mee van of naar Italië?", a: "Zeker. We vervoeren oldtimers en klassiekers, zacht geladen en professioneel vastgezet." },
  },
  zwitserland: {
    name: "Zwitserland",
    cities: ["Zürich", "Genève", "Basel", "Bern", "Lausanne", "Luzern"],
    pickup: "In Zwitserland halen we op bij dealers en particulieren, met aandacht voor de papieren aan de grens",
    delivery: "In Zwitserland leveren we van deur tot deur, met de transportdocumenten die bij de grens horen",
    faq: { q: "Zwitserland zit niet in de EU. Wat met de douane?", a: "Voor Zwitserland komen er douaneformaliteiten bij. Vermeld het bij uw aanvraag, dan bekijken we samen wat er nodig is voor in- en uitvoer." },
  },
  oostenrijk: {
    name: "Oostenrijk",
    cities: ["Wenen", "Salzburg", "Innsbruck", "Graz", "Linz", "Klagenfurt"],
    pickup: "In Oostenrijk halen we op bij dealers en particulieren, van Wenen tot Tirol",
    delivery: "In Oostenrijk leveren we tot aan de deur, ook in de Alpen",
  },
  polen: {
    name: "Polen",
    cities: ["Warschau", "Poznań", "Wrocław", "Krakau", "Gdańsk", "Łódź"],
    pickup: "In Polen halen we op bij dealers, fabrieken en particulieren",
    delivery: "In Polen leveren we bij u, bij de dealer of bij de koper",
  },
};

/** Countries with a corridor page to every other one, in display order. */
export const CORRIDOR_COUNTRIES: Flag[] = [
  "belgie", "nederland", "luxemburg", "frankrijk", "duitsland",
  "spanje", "italie", "zwitserland", "oostenrijk", "polen",
];
const CORRIDOR_PAIRS = CORRIDOR_COUNTRIES.flatMap((a) =>
  CORRIDOR_COUNTRIES.filter((b) => b !== a).map((b) => [a, b] as [Flag, Flag])
);

/** Our weekly core: the fixed corridors between these. */
export const CORE: Flag[] = ["belgie", "nederland", "frankrijk"];

// Road distance between the hub cities (OSRM / OpenStreetMap), rounded to 50 km.
const KM: Record<string, number> = {"belgie-nederland":150,"belgie-luxemburg":200,"belgie-frankrijk":300,"belgie-duitsland":400,"belgie-spanje":1600,"belgie-italie":1500,"belgie-zwitserland":650,"belgie-oostenrijk":1100,"belgie-polen":1300,"nederland-luxemburg":400,"nederland-frankrijk":450,"nederland-duitsland":400,"nederland-spanje":1750,"nederland-italie":1600,"nederland-zwitserland":800,"nederland-oostenrijk":1100,"nederland-polen":1200,"luxemburg-frankrijk":350,"luxemburg-duitsland":250,"luxemburg-spanje":1600,"luxemburg-italie":1250,"luxemburg-zwitserland":450,"luxemburg-oostenrijk":950,"luxemburg-polen":1300,"frankrijk-duitsland":550,"frankrijk-spanje":1250,"frankrijk-italie":1450,"frankrijk-zwitserland":650,"frankrijk-oostenrijk":1250,"frankrijk-polen":1600,"duitsland-spanje":1850,"duitsland-italie":1250,"duitsland-zwitserland":400,"duitsland-oostenrijk":700,"duitsland-polen":1100,"spanje-italie":1950,"spanje-zwitserland":1650,"spanje-oostenrijk":2400,"spanje-polen":2850,"italie-zwitserland":850,"italie-oostenrijk":1100,"italie-polen":1750,"zwitserland-oostenrijk":750,"zwitserland-polen":1400,"oostenrijk-polen":650};
export const km = (a: Flag, b: Flag) => KM[`${a}-${b}`] ?? KM[`${b}-${a}`];

/** Country pages that exist, for related links. */
export const COUNTRY_PAGES = new Set(["belgie", "nederland", "frankrijk", "spanje", "italie"]);

export const corridorSlug = (from: Flag, to: Flag) => `${from}-${to}`;

function corridor(from: Flag, to: Flag): Route {
  const A = FACTS[from], B = FACTS[to];
  const fixed = CORE.includes(from) && CORE.includes(to);
  const viaCore = CORE.includes(from) || CORE.includes(to);
  const dist = km(from, to);
  // No thousands separator: the stat's count-up would read "2.850" as 2,85.
  const distLabel = `± ${dist} km`;
  const frequency = fixed ? "Vaste corridor" : viaCore ? "Regelmatig" : "Op aanvraag";
  const plan = fixed
    ? `${A.name} naar ${B.name} rijden we structureel, als vaste corridor op onze wekelijkse planning.`
    : viaCore
      ? `${A.name} naar ${B.name} plannen we regelmatig in, aansluitend op onze vaste routes vanuit de Benelux en Frankrijk.`
      : `${A.name} naar ${B.name} rijden we op aanvraag, slim gecombineerd met onze andere ritten door Europa.`;
  const others = CORRIDOR_COUNTRIES.filter((c) => c !== from && c !== to);
  const near = others.sort((x, y) => km(from, x) - km(from, y)).slice(0, 2);

  return {
    slug: corridorSlug(from, to),
    nav: `${A.name} → ${B.name}`,
    kind: "corridor",
    from: { name: A.name, flag: from },
    to: { name: B.name, flag: to },
    fixed,
    title: `Auto transporteren van ${A.name} naar ${B.name}`,
    subtitle: fixed
      ? "Een vaste corridor op onze wekelijkse planning."
      : `Zo'n ${dist.toLocaleString("nl-BE")} km over de weg — wij rijden, u hoeft niets te doen.`,
    intro: `${plan} ${A.pickup}. ${B.delivery}. Van deur tot deur, verzekerd en met CMR-bewijs.`,
    heroImage: heroByFlag[to],
    frequency,
    stats: [
      { value: distLabel, label: "over de weg" },
      { value: fixed ? "Wekelijks" : viaCore ? "Regelmatig" : "Op aanvraag", label: "op de planning" },
      { value: "24u", label: "antwoord op uw aanvraag" },
    ],
    cities: [...A.cities.slice(0, 4), ...B.cities.slice(0, 4)],
    highlights: commonHighlights,
    faq: [
      {
        q: `Hoe vaak rijden jullie van ${A.name} naar ${B.name}?`,
        a: fixed
          ? "Dit is een vaste corridor op onze wekelijkse planning. We combineren ritten voor de beste efficiëntie — vraag naar de eerstvolgende mogelijkheid."
          : viaCore
            ? "We plannen deze route regelmatig in, aansluitend op onze vaste ritten. Vraag naar de eerstvolgende mogelijkheid."
            : "Deze route rijden we op aanvraag. We combineren uw wagen met andere ritten door Europa, zodat het transport voordelig blijft.",
      },
      { q: "Wordt mijn wagen van deur tot deur vervoerd?", a: `Ja. We halen op in ${A.name} en leveren in ${B.name} op de adressen die u opgeeft, met inspectie, foto's en CMR bij ophaling.` },
      ...[A.faq, B.faq].filter((f): f is Faq => Boolean(f)),
    ],
    related: [
      corridorSlug(to, from),
      ...near.map((c) => corridorSlug(from, c)),
      ...[from, to].filter((c) => COUNTRY_PAGES.has(c)).map((c) => `autotransport-${c}`),
    ],
    relatedServices: ["auto-importeren", "auto-exporteren", "autotransport-particulier"],
    seo: {
      title: `Auto transporteren ${A.name} naar ${B.name} | Mcars`,
      description: `Autotransport van ${A.name} naar ${B.name} (${distLabel}). Van deur tot deur, verzekerd en met CMR. Vraag uw offerte binnen 24 uur.`,
    },
  };
}

export const routes: Route[] = [
  // ─── Country pages ───────────────────────────────────────────────
  {
    slug: "autotransport-belgie",
    nav: "Autotransport België",
    kind: "country",
    place: { name: "België", flag: "belgie" },
    title: "Autotransport in België",
    subtitle: "Van kust tot Limburg — dagelijks onderweg door heel België.",
    intro:
      "België is ons thuisgebied. Vanuit Roeselare rijden we dagelijks door het hele land om wagens op te halen en te leveren: bij particulieren, garages en leasingdepots. Korte lijnen, snelle planning en een chauffeur die belt wanneer hij ter plaatse is.",
    heroImage: "/fleet/city-loaded.jpg",
    frequency: "Dagelijks",
    stats: [
      { value: "Dagelijks", label: "onderweg in België" },
      { value: "24/7", label: "levering op ons depot" },
      { value: "20+", label: "jaar ervaring" },
    ],
    cities: ["Roeselare", "Brugge", "Gent", "Antwerpen", "Brussel", "Machelen", "Aartselaar", "Asse", "Tongeren", "Tienen", "Genk", "Hasselt"],
    highlights: commonHighlights,
    faq: [
      { q: "Halen jullie overal in België op?", a: "Ja, van de kust tot Limburg. Vanuit ons depot in Roeselare rijden we dagelijks door heel het land." },
      { q: "Kan ik mijn wagen op het depot afleveren of ophalen?", a: "Zeker. Levering op ons depot in Roeselare kan 24/7 en is voordeliger." },
    ],
    related: ["belgie-nederland", "belgie-frankrijk", "autotransport-europa"],
    relatedServices: ["autotransport-particulier", "autotransport-dealers"],
    seo: {
      title: "Autotransport België | Mcars",
      description: "Dagelijks autotransport door heel België, van kust tot Limburg. Ophaling bij particulieren, garages en leasingdepots. Vraag uw offerte.",
    },
  },
  {
    slug: "autotransport-nederland",
    nav: "Autotransport Nederland",
    kind: "country",
    place: { name: "Nederland", flag: "nederland" },
    title: "Autotransport in Nederland",
    subtitle: "Vlot tussen Nederland en België, en verder Europa in.",
    intro:
      "Nederland ligt op onze vaste routes. Of u nu een wagen koopt in Nederland, er een naartoe stuurt of hem verder Europa in wil brengen: wij rijden er structureel naartoe en nemen het transport volledig uit handen.",
    heroImage: "/fleet/port-docks.jpg",
    frequency: "Meermaals per week",
    stats: [
      { value: "Vaste route", label: "België ↔ Nederland" },
      { value: "Van deur", label: "tot deur" },
      { value: "24u", label: "antwoord op uw aanvraag" },
    ],
    cities: ["Rotterdam", "Amsterdam", "Den Haag", "Utrecht", "Eindhoven", "Breda", "Tilburg", "Maastricht", "Arnhem", "Groningen"],
    highlights: commonHighlights,
    faq: [
      { q: "Rijden jullie vaak naar Nederland?", a: "Ja, Nederland ligt op onze vaste routes. We combineren ritten voor de beste efficiëntie." },
      { q: "Kunnen jullie in Nederland een wagen ophalen en naar Frankrijk brengen?", a: "Zeker. We rijden onder meer Nederland → Frankrijk als vaste corridor." },
    ],
    related: ["nederland-belgie", "nederland-frankrijk", "autotransport-europa"],
    relatedServices: ["auto-importeren", "auto-exporteren"],
    seo: {
      title: "Autotransport Nederland | Mcars",
      description: "Autotransport van en naar Nederland op vaste routes. Van deur tot deur, verzekerd en gedocumenteerd. Vraag uw offerte binnen 24 uur.",
    },
  },
  {
    slug: "autotransport-frankrijk",
    nav: "Autotransport Frankrijk",
    kind: "country",
    place: { name: "Frankrijk", flag: "frankrijk" },
    title: "Autotransport in Frankrijk",
    subtitle: "Elke week over heel Frankrijk — tot in de stockageparken.",
    intro:
      "Frankrijk is onze specialiteit. Kortweg: we zitten elke week over heel Frankrijk. We halen wagens op in de stockageparken (o.a. BCA, TEA), bij particulieren en handelaars, en brengen ze naar België, Nederland of verder. Met Franstalige chauffeurs verloopt alles vlot ter plaatse.",
    heroImage: "/fleet/countryside-highway.jpg",
    frequency: "Wekelijks, heel Frankrijk",
    stats: [
      { value: "Wekelijks", label: "over heel Frankrijk" },
      { value: "BCA · TEA", label: "stockageparken" },
      { value: "NL + FR", label: "sprekende chauffeurs" },
    ],
    cities: ["Parijs", "Lille", "Lyon", "Marseille", "Bordeaux", "Nice", "Toulouse", "Nantes", "Straatsburg", "Metz", "Rennes", "Montpellier"],
    highlights: [
      { icon: "map", title: "Elke week heel Frankrijk", body: "Onze vaste specialiteit — we halen wekelijks op in het hele land, tot in de stockageparken." },
      ...commonHighlights.slice(0, 2),
    ],
    faq: [
      { q: "Halen jullie op in de Franse stockageparken?", a: "Ja. We halen wekelijks wagens op in onder meer BCA en TEA, verspreid over heel Frankrijk." },
      { q: "Spreken jullie chauffeurs Frans?", a: "Ja. We werken met Nederlandstalige én Franstalige chauffeurs, zodat alles ter plaatse vlot verloopt." },
    ],
    related: ["frankrijk-belgie", "frankrijk-nederland", "autotransport-spanje"],
    relatedServices: ["auto-importeren", "autotransport-dealers"],
    seo: {
      title: "Autotransport Frankrijk | Mcars",
      description: "Elke week autotransport over heel Frankrijk, tot in de stockageparken (BCA, TEA). Franstalige chauffeurs. Vraag uw offerte.",
    },
  },
  {
    slug: "autotransport-spanje",
    nav: "Autotransport Spanje",
    kind: "country",
    place: { name: "Spanje", flag: "spanje" },
    title: "Autotransport naar Spanje",
    subtitle: "Vaste route tot Noord-Spanje en verder.",
    intro:
      "Voor tweedeverblijvers en liefhebbers rijden we uw wagen veilig tussen België en Spanje. Ideaal wanneer u zorgeloos wil vliegen en uw eigen auto bij aankomst klaar wil hebben staan. Een vaste route waarop we uw voertuig zorgvuldig en verzekerd vervoeren.",
    heroImage: "/fleet/barcelona-sagrada.jpg",
    frequency: "Vaste route",
    stats: [
      { value: "Vaste route", label: "tot Noord-Spanje" },
      { value: "Van deur", label: "tot verblijf" },
      { value: "Verzekerd", label: "& gedocumenteerd" },
    ],
    cities: ["Barcelona", "Madrid", "Valencia", "Bilbao", "Alicante", "Málaga", "Girona", "Zaragoza", "San Sebastián", "Marbella"],
    highlights: commonHighlights,
    faq: [
      { q: "Vervoeren jullie wagens voor tweedeverblijvers?", a: "Ja, dat doen we regelmatig. Zo kunt u vliegen en staat uw eigen wagen klaar bij aankomst." },
      { q: "Tot waar in Spanje rijden jullie?", a: "Onze vaste route loopt tot Noord-Spanje; verder op aanvraag. We staan open voor nieuwe bestemmingen." },
    ],
    related: ["belgie-frankrijk", "autotransport-frankrijk", "autotransport-europa"],
    relatedServices: ["autotransport-particulier", "auto-exporteren"],
    seo: {
      title: "Autotransport Spanje | Mcars",
      description: "Autotransport tussen België en Spanje op vaste route. Ideaal voor tweedeverblijvers. Verzekerd, van deur tot verblijf.",
    },
  },
  {
    slug: "autotransport-italie",
    nav: "Autotransport Italië",
    kind: "country",
    place: { name: "Italië", flag: "italie" },
    title: "Autotransport naar Italië",
    subtitle: "Van en naar Italië, op aanvraag door heel Europa.",
    intro:
      "Een aankoop uit Italië, een oldtimer voor een rally of een wagen die de Alpen over moet? We rijden Italië op aanvraag en plannen het slim in op onze Europese routes. Zorgvuldig, verzekerd en tot op het afgesproken adres.",
    heroImage: "/fleet/mountain-suvs.jpg",
    frequency: "Op aanvraag",
    stats: [
      { value: "Heel Europa", label: "als werkgebied" },
      { value: "Van deur", label: "tot deur" },
      { value: "Verzekerd", label: "& gedocumenteerd" },
    ],
    cities: ["Milaan", "Turijn", "Rome", "Bologna", "Verona", "Florence", "Napels", "Genua", "Venetië", "Modena"],
    highlights: commonHighlights,
    faq: [
      { q: "Rijden jullie naar heel Italië?", a: "We rijden Italië op aanvraag en plannen het in op onze Europese routes. Vraag gerust naar de mogelijkheden." },
      { q: "Kan een oldtimer mee naar Italië?", a: "Ja. We vervoeren oldtimers en klassiekers, zacht geladen en professioneel vastgezet — ook voor rally's en evenementen." },
    ],
    related: ["autotransport-europa", "autotransport-frankrijk", "autotransport-spanje"],
    relatedServices: ["oldtimer-transport", "eventtransport"],
    seo: {
      title: "Autotransport Italië | Mcars",
      description: "Autotransport van en naar Italië, op aanvraag door heel Europa. Verzekerd en van deur tot deur.",
    },
  },
  {
    slug: "autotransport-europa",
    nav: "Autotransport Europa",
    kind: "country",
    place: { name: "Europa", flag: "belgie" },
    title: "Autotransport door heel Europa",
    subtitle: "Waar u ook naartoe wil — wij rijden overal.",
    intro:
      "België en Nederland richting Frankrijk tot Noord-Spanje is onze niche, maar we rijden overal: Duitsland, Italië, Polen, Denemarken, Noorwegen, Zweden en verder. Geen vaste beperkingen — we staan open voor nieuwe bestemmingen en plannen uw transport in op onze Europese routes.",
    heroImage: "/fleet/sunset-field.jpg",
    frequency: "Heel Europa",
    stats: [
      { value: "10+", label: "landen bereden" },
      { value: "9", label: "autotransporters" },
      { value: "Geen", label: "vaste grenzen" },
    ],
    cities: ["België", "Nederland", "Frankrijk", "Spanje", "Duitsland", "Italië", "Polen", "Denemarken", "Noorwegen", "Zweden", "Finland"],
    highlights: commonHighlights,
    faq: [
      { q: "Naar welke landen rijden jullie?", a: "Onder meer België, Nederland, Frankrijk, Spanje, Duitsland, Italië, Polen, Denemarken, Noorwegen en Zweden. Andere bestemming? Vraag het gerust." },
      { q: "Rijden jullie ook buiten Europa?", a: "We hebben geen vaste beperkingen en staan open voor nieuwe mogelijkheden. Leg ons uw vraag voor." },
    ],
    related: ["autotransport-frankrijk", "autotransport-spanje", "autotransport-italie"],
    relatedServices: ["auto-importeren", "auto-exporteren", "fleet-wagenpark"],
    seo: {
      title: "Autotransport Europa | Mcars",
      description: "Autotransport door heel Europa: Frankrijk, Spanje, Duitsland, Italië, Scandinavië en verder. Geen vaste grenzen. Vraag uw offerte.",
    },
  },

  // ─── Corridor pages: every ordered pair of CORRIDOR_COUNTRIES ──────
  ...CORRIDOR_PAIRS.map(([from, to]) => corridor(from, to)),
];

export const routeSlugs = routes.map((r) => r.slug);
export const getRoute = (slug: string) => routes.find((r) => r.slug === slug);
export const countryRoutes = routes.filter((r) => r.kind === "country");
export const corridorRoutes = routes.filter((r) => r.kind === "corridor");
