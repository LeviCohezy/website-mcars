// Blog articles. The client writes these himself; the entries below are
// starter content (titles from the intake's topic list) until the real
// articles are in.

export const BLOG_CATEGORIES = [
  "Tips & advies",
  "Import & export",
  "Documenten & regelgeving",
  "Cases",
  "Nieuws",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

// Article content, rendered as a styled document. Text supports inline **bold** and [links](/path).
export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; tone: "info" | "tip" | "warning"; title: string; text: string }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "image"; src: string; alt: string; caption?: string; wide?: boolean }
  | { type: "summary"; title: string; items: string[] }
  | { type: "divider" };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  /** ISO date, used for sorting. */
  date: string;
  minutes: number;
  image: string;
  featured?: boolean;
  body: BlogBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "wat-is-een-cmr",
    title: "Wat is een CMR en waarom is het zo belangrijk?",
    excerpt: "De vrachtbrief bewijst dat uw wagen is opgehaald en legt de staat bij vertrek vast. Zo werkt het.",
    category: "Documenten & regelgeving",
    date: "2026-07-12",
    minutes: 5,
    image: "/services/01.jpg",
    featured: true,
    body: [
      { type: "p", text: "Wie een wagen laat vervoeren, krijgt bij Mcars altijd een **CMR-vrachtbrief**. Het is het enige document dat u voor het transport nodig heeft, en het beschermt zowel u als ons. Maar wat staat er precies op, wie vult het in, en waarom is het zo belangrijk?" },
      { type: "summary", title: "In het kort", items: ["De CMR is het bewijs dat Mcars uw wagen heeft opgehaald.", "Wij maken het document op bij de ophaling. U hoeft niets voor te bereiden.", "Samen met de foto's legt het de staat van uw wagen bij vertrek vast."] },
      { type: "h2", text: "Wat is een CMR?" },
      { type: "p", text: "CMR verwijst naar het internationale verdrag over het vervoer van goederen over de weg. De vrachtbrief die daaruit volgt, is het officiële bewijs dat een transporteur iets heeft ontvangen om te vervoeren. Bij autotransport is dat uw wagen." },
      { type: "image", src: "/fleet/depot-wet.jpg", alt: "Een Mcars-transporter op het depot in Roeselare", caption: "Bij elke ophaling, ook op ons depot in Roeselare, wordt een CMR opgemaakt.", wide: true },
      { type: "h2", text: "Wat staat er op de vrachtbrief?" },
      { type: "p", text: "De vrachtbrief bevat alle gegevens die nodig zijn om het transport achteraf te kunnen reconstrueren:" },
      { type: "table", head: ["Gegeven", "Waarom het erop staat"], rows: [["Ophaaladres", "Waar en bij wie de wagen werd meegenomen"], ["Leveradres", "Waar de wagen moet aankomen"], ["Voertuiggegevens", "Merk, model en identificatie van de wagen"], ["Datum van ophaling", "Wanneer de verantwoordelijkheid overging"], ["Handtekeningen", "Akkoord van de klant en van onze chauffeur"]], caption: "De vaste onderdelen van een CMR bij Mcars." },
      { type: "h3", text: "Wie vult de CMR in?" },
      { type: "p", text: "Onze chauffeur maakt de CMR ter plaatse op. U controleert de gegevens en tekent mee. Daarna krijgt u uw exemplaar." },
      { type: "callout", tone: "info", title: "Goed om te weten", text: "Voor het transport zelf is de CMR het enige document dat u nodig heeft. Andere documenten, zoals een gelijkvormigheidsattest, zijn pas nodig voor de inschrijving van een wagen." },
      { type: "h3", text: "Zo verloopt het bij de ophaling" },
      { type: "steps", items: [{ title: "Inspectie", text: "We bekijken de wagen samen met u en noteren eventuele bestaande schade." }, { title: "Foto's", text: "We fotograferen de wagen rondom als intern bewijsstuk." }, { title: "Ondertekening", text: "U en onze chauffeur tekenen de CMR. U krijgt uw exemplaar." }] },
      { type: "divider" },
      { type: "h2", text: "Waarom is het zo belangrijk?" },
      { type: "p", text: "De CMR bewijst zwart op wit dat uw wagen door Mcars is opgehaald, wanneer en waar. Bij de ophaling inspecteren en fotograferen we de wagen ook. Zo ligt de staat bij vertrek onbetwistbaar vast." },
      { type: "quote", text: "Mocht er ooit discussie of schade zijn, dan is de CMR met de vastgelegde staat het referentiepunt." },
      { type: "h3", text: "Bij een schadeclaim" },
      { type: "p", text: "Merkt u bij levering iets op? Meld het meteen aan de chauffeur, zodat het op de vrachtbrief genoteerd wordt. Zo kunnen we de staat bij vertrek en bij aankomst vergelijken." },
      { type: "callout", tone: "warning", title: "Teken niet blind", text: "Controleer de gegevens op de CMR voor u tekent, zowel bij ophaling als bij levering. Een opmerking die er niet op staat, is achteraf moeilijk te bewijzen." },
      { type: "h2", text: "Moet ik zelf iets voorbereiden?" },
      { type: "p", text: "Nee. Zorg dat de wagen bereikbaar is en dat de sleutels klaarliggen. De rest regelen wij ter plaatse. Meer over het verloop leest u op [Hoe werkt het](/hoe-werkt-het)." },
      { type: "h4", text: "Handig om klaar te hebben" },
      { type: "list", items: ["De sleutels, inclusief reservesleutel als u die meegeeft", "Een volmacht als iemand anders de wagen meegeeft", "Eventuele documenten die bij de wagen horen"] },
      { type: "callout", tone: "tip", title: "Tip", text: "Maak zelf ook een paar foto's van uw wagen voor de ophaling. Dubbel bewijs is nooit verkeerd." },
    ],
  },
  {
    slug: "wat-kost-autotransport",
    title: "Wat kost autotransport? Dit bepaalt uw prijs",
    excerpt: "Afstand, type wagen, rijdend of niet, en hoe dringend het is: zo komt een offerte tot stand.",
    category: "Tips & advies",
    date: "2026-07-05",
    minutes: 6,
    image: "/fleet/germany-autobahn.jpg",
    body: [
      { type: "p", text: "Een vaste prijslijst hebben we niet, en dat is bewust. Elke rit is anders, dus stellen we elke offerte **persoonlijk** op. In dit artikel leggen we uit welke factoren meewegen, zodat u weet waarom twee ritten nooit dezelfde prijs hebben." },
      { type: "summary", title: "In het kort", items: ["Afstand, type wagen en staat van de wagen bepalen het grootste deel van de prijs.", "Een rit op een vaste corridor is voordeliger dan een losse rit.", "Ophalen of leveren op ons depot is doorgaans goedkoper dan aan huis."] },
      { type: "h2", text: "De factoren op een rij" },
      { type: "p", text: "Dit zijn de vijf zaken die we bekijken bij elke [offerteaanvraag](/offerte):" },
      { type: "table", head: ["Factor", "Invloed op de prijs", "Wat u kan doen"], rows: [["Afstand en route", "Groot", "Kies, als het kan, een bestemming op een vaste corridor"], ["Type voertuig", "Middel", "Vermeld afmetingen bij bestelwagens of SUV's"], ["Staat van de wagen", "Middel", "Geef aan of hij rijdt, rolt of geblokkeerd is"], ["Planning", "Middel", "Flexibel zijn op datum houdt de prijs lager"], ["Depot of aan huis", "Klein", "Op het depot in Roeselare is het voordeliger"]] },
      { type: "h2", text: "Afstand en route" },
      { type: "p", text: "Hoe verder de rit, hoe meer kilometers en tijd. Maar de route speelt even goed mee: sluit uw transport aan op een van onze vaste corridors, dan rijdt uw wagen mee op een geplande rit." },
      { type: "image", src: "/fleet/germany-autobahn.jpg", alt: "Mcars-transporter op de snelweg in Duitsland", caption: "Wagens die op een vaste corridor meerijden, delen de rit met andere voertuigen.", wide: true },
      { type: "h2", text: "Het voertuig" },
      { type: "h3", text: "Afmetingen en gewicht" },
      { type: "p", text: "Een compacte wagen laadt anders dan een bestelwagen, een SUV of een oldtimer. Hoe groter de wagen, hoe meer plaats hij inneemt op de oplegger." },
      { type: "h3", text: "Rijdend of niet" },
      { type: "p", text: "Rijdt de wagen, is hij verrolbaar of staat hij volledig vast? Voor [niet-rijdende wagens](/diensten/niet-rijdende-auto) brengen we een lier of heftruck mee." },
      { type: "callout", tone: "tip", title: "Tip", text: "Hoe vollediger uw aanvraag, hoe scherper we uw prijs kunnen bepalen. Vermeld ook extra's zoals een topbox of fietsdrager." },
      { type: "h2", text: "Planning" },
      { type: "p", text: "Mag de wagen meerijden met een geplande rit, of moet het dringend? Spoed vraagt een aparte planning en weegt daarom mee in de prijs." },
      { type: "h2", text: "Hoe vraagt u een prijs aan?" },
      { type: "steps", items: [{ title: "Vul de aanvraag in", text: "Via de website, telefonisch of via WhatsApp." }, { title: "Ontvang uw offerte", text: "Binnen 24 uur een persoonlijk antwoord met prijs en planning." }, { title: "Geef uw akkoord", text: "Pas daarna plannen we de ophaling in." }] },
      { type: "callout", tone: "info", title: "Geen calculator", text: "Elke offerte wordt handmatig door ons team opgesteld. U krijgt geen automatische mail, maar een antwoord van een mens." },
    ],
  },
  {
    slug: "auto-transporteren-naar-spanje",
    title: "Uw auto laten transporteren naar Spanje: zo werkt het",
    excerpt: "Van offerte tot levering aan uw tweede verblijf: dit mag u verwachten van een transport richting Spanje.",
    category: "Tips & advies",
    date: "2026-06-28",
    minutes: 6,
    image: "/services/06.jpg",
    body: [
      { type: "p", text: "Veel klanten hebben een tweede verblijf in Spanje en willen hun eigen wagen daar ter beschikking. Zo verloopt een transport richting Spanje bij Mcars." },
      { type: "h2", text: "Van aanvraag tot planning" },
      { type: "p", text: "U vraagt een offerte aan met het ophaal- en leveradres. Binnen 24 uur krijgt u een prijs en een mogelijke planning. Na uw akkoord leggen we de ophaaldatum vast." },
      { type: "h2", text: "Ophaling en onderweg" },
      { type: "p", text: "Bij ophaling maken we de CMR-vrachtbrief op en leggen we de staat van de wagen vast. Daarna rijdt uw wagen mee op de oplegger richting Spanje." },
      { type: "h2", text: "Levering" },
      { type: "p", text: "We bellen wanneer we bij het leveradres aankomen. Wilt u de wagen later ook terug laten brengen? Vermeld het bij uw aanvraag, dan plannen we heen en terug." },
    ],
  },
  {
    slug: "auto-importeren-uit-duitsland",
    title: "Auto importeren uit Duitsland: stap voor stap",
    excerpt: "Aankoop, transport, keuring en inschrijving in België. Wat u regelt en wat wij voor u doen.",
    category: "Import & export",
    date: "2026-06-21",
    minutes: 7,
    image: "/fleet/actros-motion.jpg",
    body: [
      { type: "p", text: "Een wagen kopen in Duitsland kan interessant zijn. Het transport naar België regelen we voor u. Dit is het verloop, stap voor stap." },
      { type: "h2", text: "1. Aankoop" },
      { type: "p", text: "U koopt de wagen bij een dealer of particulier in Duitsland en spreekt een ophaalmoment af." },
      { type: "h2", text: "2. Transport" },
      { type: "p", text: "Wij halen de wagen op, maken de CMR-vrachtbrief op en brengen hem naar uw adres of naar ons depot in Roeselare." },
      { type: "h2", text: "3. In België" },
      { type: "list", items: ["Keuring van de wagen", "Inschrijving bij de DIV", "Verzekering op uw naam"] },
      { type: "p", text: "Twijfelt u welke documenten u nodig heeft? Bel ons gerust, we helpen u persoonlijk verder." },
    ],
  },
  {
    slug: "niet-rijdende-wagen-verplaatsen",
    title: "Niet-rijdende wagen verplaatsen? Dit zijn uw opties",
    excerpt: "Met een winch trekken we ook wagens zonder draaiende motor veilig op de oplegger. Dit moet u weten.",
    category: "Tips & advies",
    date: "2026-06-14",
    minutes: 4,
    image: "/services/04.jpg",
    body: [
      { type: "p", text: "Een wagen die niet meer start, hoeft geen probleem te zijn. Ook defecte, schade- of projectwagens vervoeren we veilig." },
      { type: "h2", text: "Verrolbaar" },
      { type: "p", text: "Start de wagen niet maar kan hij nog rollen? Dan trekken we hem met de lier op de transporter." },
      { type: "h2", text: "Volledig geblokkeerd" },
      { type: "p", text: "Staat de wagen volledig vast, dan voorzien we een heftruck ter plaatse. Vermeld de staat altijd bij uw aanvraag, zodat we het juiste materiaal meebrengen." },
      { type: "quote", text: "Hoe vollediger uw aanvraag, hoe beter we de rit kunnen voorbereiden." },
    ],
  },
  {
    slug: "documenten-bij-auto-import",
    title: "Welke documenten heeft u nodig bij auto-import?",
    excerpt: "COC, kentekenbewijs, aankoopfactuur en volmacht: een overzicht zonder vakjargon.",
    category: "Documenten & regelgeving",
    date: "2026-06-07",
    minutes: 5,
    image: "/services/02.jpg",
    body: [
      { type: "p", text: "Bij een import komt wat papierwerk kijken. Het goede nieuws: voor het transport zelf heeft u enkel een CMR nodig, en die maken wij op." },
      { type: "h2", text: "Voor het transport" },
      { type: "list", items: ["CMR-vrachtbrief: opgemaakt door Mcars bij ophaling", "Eventueel een volmacht als iemand anders de wagen meegeeft"] },
      { type: "h2", text: "Voor de inschrijving" },
      { type: "list", items: ["Kentekenbewijs van het land van herkomst", "Gelijkvormigheidsattest (COC)", "Aankoopfactuur"] },
      { type: "p", text: "Laat de documenten bij de wagen of geef ze vooraf door. Zo verloopt de ophaling vlot." },
    ],
  },
  {
    slug: "oldtimer-naar-italie",
    title: "Case: een oldtimer veilig naar Italië",
    excerpt: "Hoe we een klassieker van Roeselare tot aan het Comomeer brachten, zonder één kras.",
    category: "Cases",
    date: "2026-05-30",
    minutes: 4,
    image: "/fleet/mountain-suvs.jpg",
    body: [
      { type: "p", text: "Een klassieker vraagt om extra zorg. Voor deze klant brachten we een oldtimer van Roeselare naar Italië." },
      { type: "h2", text: "Voorbereiding" },
      { type: "p", text: "We bespraken vooraf de afmetingen, de staat en de gewenste leverdatum, en plaatsten de wagen op een beschutte positie op de oplegger." },
      { type: "h2", text: "Ophaling" },
      { type: "p", text: "Bij ophaling legden we de staat vast met foto's en de CMR-vrachtbrief. De wagen werd zorgvuldig vastgezet." },
      { type: "h2", text: "Levering" },
      { type: "p", text: "Bij aankomst belden we de klant, en de wagen werd in dezelfde staat afgeleverd als bij vertrek." },
    ],
  },
  {
    slug: "autotransport-voor-dealers",
    title: "Autotransport voor dealers: vaste ritten, één aanspreekpunt",
    excerpt: "Wekelijks wagens ophalen bij leasingmaatschappijen? Zo houden we het voor handelaars eenvoudig.",
    category: "Import & export",
    date: "2026-05-22",
    minutes: 5,
    image: "/fleet/depot-dusk.jpg",
    body: [
      { type: "p", text: "Handelaars die wekelijks wagens aankopen bij leasingmaatschappijen, hebben nood aan een vaste partner. Zo werken we met dealers." },
      { type: "h2", text: "Vaste ritten" },
      { type: "p", text: "We rijden vaste routes, onder meer langs Aartselaar, Asse, Genk, Brugge, Tongeren en Machelen. Uw wagens rijden mee op een geplande rit." },
      { type: "h2", text: "Eén aanspreekpunt" },
      { type: "p", text: "U heeft één vast contact, van offerte tot levering. Korte lijnen, geen callcenter." },
      { type: "h2", text: "Facturatie" },
      { type: "p", text: "Bedrijven betalen eenvoudig op factuur. De afspraken maken we vooraf." },
    ],
  },
  {
    slug: "nieuwe-corridor-zwitserland",
    title: "Nieuw: elke week een vaste rit naar Zwitserland",
    excerpt: "Vanaf deze maand rijden we wekelijks via Luxemburg naar Basel, Zürich en Genève.",
    category: "Nieuws",
    date: "2026-05-15",
    minutes: 3,
    image: "/fleet/valley-sunset.jpg",
    body: [
      { type: "p", text: "We breiden ons netwerk uit: vanaf nu rijden we elke week een vaste rit richting Zwitserland." },
      { type: "h2", text: "De route" },
      { type: "p", text: "Vanuit Roeselare via Luxemburg naar Basel, Zürich en Genève." },
      { type: "h2", text: "Wat betekent dat voor u?" },
      { type: "list", items: ["Vaste vertrekdagen, dus een voorspelbare planning", "Voordeliger dan een losse rit", "Ook voor één wagen"] },
      { type: "p", text: "Vraag gerust een offerte aan; we laten u weten op welke rit uw wagen mee kan." },
    ],
  },
];

export const blogDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" });

export const getBlogPost = (slug: string) => blogPosts.find((p) => p.slug === slug);

/** Stable anchor id for a heading. */
export const headingId = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
