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
  | "spanje" | "duitsland" | "luxemburg" | "zwitserland";

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
};

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
      { value: "Open of", label: "gesloten transport" },
      { value: "Verzekerd", label: "& gedocumenteerd" },
    ],
    cities: ["Milaan", "Turijn", "Rome", "Bologna", "Verona", "Florence", "Napels", "Genua", "Venetië", "Modena"],
    highlights: commonHighlights,
    faq: [
      { q: "Rijden jullie naar heel Italië?", a: "We rijden Italië op aanvraag en plannen het in op onze Europese routes. Vraag gerust naar de mogelijkheden." },
      { q: "Kan een oldtimer gesloten naar Italië?", a: "Ja. Voor waardevolle wagens bieden we gesloten transport aan." },
    ],
    related: ["autotransport-europa", "autotransport-frankrijk", "autotransport-spanje"],
    relatedServices: ["oldtimer-transport", "gesloten-autotransport"],
    seo: {
      title: "Autotransport Italië | Mcars",
      description: "Autotransport van en naar Italië, op aanvraag door heel Europa. Open of gesloten, verzekerd en van deur tot deur.",
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

  // ─── Corridor pages ──────────────────────────────────────────────
  ...(
    [
      { slug: "nederland-belgie", from: "nederland", to: "belgie" },
      { slug: "nederland-frankrijk", from: "nederland", to: "frankrijk" },
      { slug: "frankrijk-belgie", from: "frankrijk", to: "belgie" },
      { slug: "frankrijk-nederland", from: "frankrijk", to: "nederland" },
      { slug: "belgie-nederland", from: "belgie", to: "nederland" },
      { slug: "belgie-frankrijk", from: "belgie", to: "frankrijk" },
    ] as { slug: string; from: Flag; to: Flag }[]
  ).map((c): Route => {
    const label: Record<Flag, string> = {
      belgie: "België", nederland: "Nederland", frankrijk: "Frankrijk",
      italie: "Italië", spanje: "Spanje", duitsland: "Duitsland",
      luxemburg: "Luxemburg", zwitserland: "Zwitserland",
    };
    const fromName = label[c.from];
    const toName = label[c.to];
    return {
      slug: c.slug,
      nav: `${fromName} → ${toName}`,
      kind: "corridor",
      from: { name: fromName, flag: c.from },
      to: { name: toName, flag: c.to },
      title: `Auto transporteren van ${fromName} naar ${toName}`,
      subtitle: `Een vaste corridor op onze wekelijkse planning.`,
      intro: `${fromName} naar ${toName} rijden we structureel. Wij halen uw wagen op in ${fromName} en leveren hem af in ${toName} — van deur tot deur, verzekerd en met CMR-bewijs. U hoeft zelf niet te rijden, te huren of risico's te nemen.`,
      heroImage: heroByFlag[c.to],
      frequency: "Vaste corridor",
      stats: [
        { value: "Vaste route", label: `${fromName} → ${toName}` },
        { value: "Van deur", label: "tot deur" },
        { value: "24u", label: "antwoord op uw aanvraag" },
      ],
      cities: [fromName, toName, "Van deur tot deur"],
      highlights: commonHighlights,
      faq: [
        { q: `Hoe vaak rijden jullie van ${fromName} naar ${toName}?`, a: `Dit is een vaste corridor op onze planning. We combineren ritten voor de beste efficiëntie — vraag naar de eerstvolgende mogelijkheid.` },
        { q: "Wordt mijn wagen van deur tot deur vervoerd?", a: "Ja. We halen op en leveren op de adressen die u opgeeft, met inspectie en CMR bij ophaling." },
      ],
      related: ["autotransport-europa", `autotransport-${c.from}`, `autotransport-${c.to}`].filter(
        (s, i, a) => a.indexOf(s) === i
      ),
      relatedServices: ["auto-importeren", "auto-exporteren", "autotransport-particulier"],
      seo: {
        title: `Auto transporteren ${fromName} naar ${toName} | Mcars`,
        description: `Vaste route voor autotransport van ${fromName} naar ${toName}. Van deur tot deur, verzekerd en met CMR. Vraag uw offerte binnen 24 uur.`,
      },
    };
  }),
];

export const routeSlugs = routes.map((r) => r.slug);
export const getRoute = (slug: string) => routes.find((r) => r.slug === slug);
export const countryRoutes = routes.filter((r) => r.kind === "country");
export const corridorRoutes = routes.filter((r) => r.kind === "corridor");
