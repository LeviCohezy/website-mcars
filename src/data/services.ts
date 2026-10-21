/**
 * SERVICE CONTENT MODEL — the CMS "collection" behind every service page.
 *
 * Every service page (/diensten/[slug]) is rendered from one entry in this
 * file by a single template. Edit copy, swap images and reorder highlights
 * here (or via the visual editor at /studio) and the page updates. Add a new
 * object to `services` and a new page exists automatically.
 *
 * House rules baked in (from the client intake — do NOT break these):
 *  - Never show prices or "from" prices.
 *  - Never promise lead times / doorlooptijden.
 *  - Speak equally to private clients and businesses.
 */

export type IconKey =
  | "shield" | "clock" | "route" | "truck" | "car" | "wrench"
  | "star" | "users" | "globe" | "check" | "box" | "map" | "spark" | "phone";

export type Faq = { q: string; a: string };
export type Highlight = { title: string; body: string; icon: IconKey };
export type ProcessStep = { title: string; body: string };
export type Stat = { value: string; label: string };

export type Service = {
  slug: string;
  nav: string;
  category: string;
  title: string;
  subtitle: string;
  intro: string;
  heroImage: string;
  gallery?: string[];
  audience: string;
  vehicleTypes?: string[];
  highlights: Highlight[];
  process?: ProcessStep[];
  benefits: string[];
  stats?: Stat[];
  faq: Faq[];
  related: string[];
  relatedRoutes?: string[];
  seo: { title: string; description: string };
  /** Internal note — what real photography/copy still has to replace stock. */
  contentNote?: string;
};

/** Default 4-step process reused when a service doesn't override it. */
export const defaultProcess: ProcessStep[] = [
  { title: "Offerte aanvragen", body: "U vraagt uw transport aan via de website, telefonisch of via WhatsApp. U krijgt binnen 24 uur een antwoord met de prijs en de mogelijke planning." },
  { title: "Inplannen", body: "Na uw goedkeuring leggen we samen de ophaaldatum vast. Op de dag zelf belt de chauffeur wanneer hij ter plaatse zal zijn." },
  { title: "Ophaling met CMR", body: "We halen uw wagen op waar u wil. Ter plaatse maken we de CMR-vrachtbrief op en inspecteren en fotograferen we het voertuig als bewijsstuk." },
  { title: "Levering & betaling", body: "We bellen wanneer we bij het leveradres aankomen. Particulieren betalen vóór ophaling, bedrijven eenvoudig op factuur." },
];

export const defaultVehicleTypes = [
  "Personenwagens & SUV's", "Oldtimers & klassiekers", "Sportwagens & exclusief",
  "Camionettes & bestelwagens", "Moto's & quads", "Buggy's & projectwagens",
  "Niet-rijdende voertuigen", "Boten & aanhangwagens",
];

export const services: Service[] = [
  {
    slug: "autotransport-particulier",
    nav: "Autotransport particulier",
    category: "Voor particulieren",
    title: "Autotransport voor particulieren",
    subtitle: "Eén wagen, veilig en zorgeloos van A naar B.",
    intro:
      "Kocht u een wagen in het buitenland, verhuist u uw auto naar uw tweede verblijf of wilt u gewoon niet zelf honderden kilometers rijden? Wij halen uw voertuig op waar u wil en leveren het af waar het moet zijn — met korte lijnen en persoonlijk contact van begin tot eind.",
    heroImage: "/fleet/city-street.jpg",
    audience: "Voor iedereen die één voertuig veilig verplaatst wil zien — zonder zelf achter het stuur te kruipen.",
    highlights: [
      { icon: "shield", title: "Verzekerd & gedocumenteerd", body: "Elke wagen wordt bij ophaling geïnspecteerd, gefotografeerd en op een CMR-vrachtbrief gezet. Uw bewijs dat alles correct verliep." },
      { icon: "route", title: "Ophaling waar u wil", body: "Thuis, bij de verkoper of op ons depot in Roeselare. Levering op depot kan 24/7 en is voordeliger." },
      { icon: "phone", title: "Korte kring, snel antwoord", body: "Geen callcenter. U spreekt rechtstreeks met het team en krijgt binnen 24 uur uw prijs en planning." },
    ],
    benefits: [
      "Ophaling en levering op het adres van uw keuze",
      "CMR-vrachtbrief met foto's als bewijsstuk",
      "Nederlandstalige én Franstalige chauffeurs",
      "Ook niet-rijdende of gestalde wagens",
    ],
    stats: [
      { value: "20+", label: "jaar ervaring" },
      { value: "3000+", label: "tevreden klanten" },
      { value: "24u", label: "antwoord op uw aanvraag" },
    ],
    faq: [
      { q: "Moet mijn wagen rijden om opgehaald te worden?", a: "Nee. Verrolbare wagens trekken we met de lier op de vrachtwagen. Voor niet-verrolbare voertuigen voorzien we een oplossing ter plaatse." },
      { q: "Welke documenten heb ik nodig?", a: "Enkel een CMR is nodig. Die maken wij bij ophaling op, zo heeft u meteen bewijs dat de wagen door Mcars is opgehaald." },
      { q: "Kan ik mijn wagen op het depot laten leveren?", a: "Ja. Levering op ons depot in Roeselare kan 24/7 en is voordeliger dan levering aan huis." },
    ],
    related: ["auto-importeren", "niet-rijdende-auto", "open-autotransport"],
    relatedRoutes: ["autotransport-belgie", "autotransport-frankrijk", "autotransport-spanje"],
    seo: {
      title: "Autotransport voor particulieren | Mcars",
      description: "Laat uw wagen veilig ophalen en leveren door Mcars. Persoonlijk, verzekerd en met CMR-bewijs. Vraag uw offerte binnen 24 uur.",
    },
    contentNote: "Hero + gallery gebruiken stockfoto's uit /services. Vervang door een echte ophaling van een particuliere wagen.",
  },
  {
    slug: "autotransport-dealers",
    nav: "Autotransport voor dealers",
    category: "Voor de handel",
    title: "Autotransport voor dealers",
    subtitle: "Voor garages, autohandelaars en concessies.",
    intro:
      "Aankopen bij leasingmaatschappijen, wagens tussen vestigingen verplaatsen of einde-leasingvoertuigen ophalen: wij rijden wekelijks over heel België en Europa en nemen het transport volledig uit handen. Vaste chauffeurs, correcte documenten en één aanspreekpunt.",
    heroImage: "/fleet/depot-dusk.jpg",
    audience: "Voor garages, autohandelaars, concessies en leasingmaatschappijen die betrouwbaar en herhaaldelijk voertuigen laten vervoeren.",
    highlights: [
      { icon: "truck", title: "Meerdere wagens per rit", body: "Onze transporters laden meerdere voertuigen tegelijk — efficiënt en voordeliger per wagen." },
      { icon: "map", title: "Wekelijks over heel Frankrijk", body: "We halen wekelijks op in de Franse stockageparken (o.a. BCA, TEA) en op de Belgische leasingdepots." },
      { icon: "users", title: "Vaste, professionele relatie", body: "Wie eenmaal met ons werkt, blijft. Eén aanspreekpunt, facturatie en korte lijnen." },
    ],
    benefits: [
      "Ophaling in stockageparken en leasingdepots",
      "Meerdere voertuigen in één transport",
      "Facturatie voor bedrijven",
      "Vaste routes doorheen België en Europa",
    ],
    stats: [
      { value: "9", label: "autotransporters" },
      { value: "8", label: "vaste chauffeurs" },
      { value: "Wekelijks", label: "in heel Frankrijk" },
    ],
    faq: [
      { q: "Kunnen jullie einde-leasingwagens ophalen?", a: "Ja. We halen regelmatig einde-leasingwagens op in o.a. Tongeren, Machelen, Aartselaar, Asse en Tienen om terug te verkopen." },
      { q: "Hoe verloopt de facturatie voor bedrijven?", a: "Bedrijven betalen eenvoudig op factuur. We stemmen de praktische afspraken op voorhand met u af." },
      { q: "Vervoeren jullie ook meerdere wagens tegelijk?", a: "Zeker. Onze Kässbohrer-transporters laden meerdere voertuigen per rit, wat het transport per wagen voordeliger maakt." },
    ],
    related: ["fleet-wagenpark", "auto-importeren", "auto-exporteren"],
    relatedRoutes: ["autotransport-belgie", "autotransport-frankrijk", "autotransport-europa"],
    seo: {
      title: "Autotransport voor dealers & garages | Mcars",
      description: "Wekelijks transport voor garages, handelaars en concessies. Ophaling in stockageparken en leasingdepots, meerdere wagens per rit.",
    },
    contentNote: "Vervang stockfoto door foto van een geladen transporter met handelaarsvoorraad.",
  },
  {
    slug: "auto-importeren",
    nav: "Auto importeren",
    category: "Import",
    title: "Auto importeren",
    subtitle: "Uit Duitsland, Nederland, Frankrijk, Italië, Spanje en verder.",
    intro:
      "Een koopje gevonden in het buitenland? Wij halen uw aankoop veilig op bij de verkoper en brengen hem naar België of Nederland. U hoeft niet zelf te reizen, te huren of risico's te nemen op een onbekende weg — wij regelen het transport van deur tot deur.",
    heroImage: "/fleet/germany-autobahn.jpg",
    audience: "Voor particulieren en handelaars die een voertuig in het buitenland kopen en het veilig thuis willen laten leveren.",
    highlights: [
      { icon: "globe", title: "Heel Europa als ophaalgebied", body: "Duitsland, Nederland, Frankrijk, Italië, Spanje en verder — wij rijden er wekelijks naartoe." },
      { icon: "shield", title: "Geïnspecteerd bij ophaling", body: "De wagen wordt bij de verkoper geïnspecteerd, gefotografeerd en op de CMR gezet. Zo staat de staat bij vertrek zwart op wit." },
      { icon: "route", title: "Van deur tot deur", body: "Rechtstreeks van de verkoper naar uw adres of ons depot. Geen tussenstops, geen gedoe." },
    ],
    benefits: [
      "Ophaling rechtstreeks bij de buitenlandse verkoper",
      "Inspectie en fotodossier als bewijs",
      "Ook niet-rijdende of pas aangekochte wagens",
      "Levering aan huis of op ons depot",
    ],
    faq: [
      { q: "Uit welke landen kunnen jullie importeren?", a: "Onder meer Duitsland, Nederland, Frankrijk, Italië en Spanje — en op aanvraag verder in Europa. We staan open voor nieuwe bestemmingen." },
      { q: "Regelen jullie ook de papieren?", a: "Wij verzorgen het transport en de CMR-vrachtbrief. Voor invoerdocumenten verwijzen we u graag naar de juiste partij; vraag ernaar en we helpen u op weg." },
      { q: "Moet ik zelf ter plaatse zijn bij ophaling?", a: "Nee. Wij stemmen rechtstreeks met de verkoper af zodra de details bekend zijn." },
    ],
    related: ["auto-exporteren", "autotransport-particulier", "open-autotransport"],
    relatedRoutes: ["nederland-belgie", "frankrijk-belgie", "autotransport-europa"],
    seo: {
      title: "Auto importeren uit het buitenland | Mcars",
      description: "Laat uw in het buitenland gekochte auto veilig ophalen en importeren naar België of Nederland. Van deur tot deur, met CMR en fotodossier.",
    },
  },
  {
    slug: "auto-exporteren",
    nav: "Auto exporteren",
    category: "Export",
    title: "Auto exporteren",
    subtitle: "Van België of Nederland naar heel Europa.",
    intro:
      "Verkocht u een wagen aan een buitenlandse klant, of verhuist u een voertuig naar het buitenland? Wij brengen het veilig tot op de bestemming. Met wekelijkse routes richting Frankrijk, Spanje, Duitsland en verder vertrekt uw wagen sneller dan u denkt.",
    heroImage: "/fleet/valley-sunset.jpg",
    audience: "Voor particulieren en bedrijven die een voertuig vanuit België of Nederland naar het buitenland versturen.",
    highlights: [
      { icon: "globe", title: "Wekelijkse Europese routes", body: "Frankrijk, Spanje, Duitsland, Italië, Scandinavië — we rijden er structureel naartoe." },
      { icon: "truck", title: "Efficiënt gecombineerd", body: "Door slim te combineren op onze routes houden we het transport voordelig, ook over lange afstand." },
      { icon: "shield", title: "Zorgeloos afgeleverd", body: "Geïnspecteerd bij vertrek, geleverd op het afgesproken adres, met bewijsstuk voor beide partijen." },
    ],
    benefits: [
      "Levering tot bij de buitenlandse koper",
      "Wekelijkse routes door heel Europa",
      "CMR en fotodossier als bewijs",
      "Ook meerdere voertuigen tegelijk",
    ],
    faq: [
      { q: "Naar welke landen exporteren jullie?", a: "Onder meer Frankrijk, Spanje, Duitsland, Italië, Polen en Scandinavië. Buiten die landen? Vraag het gerust — we staan open voor nieuwe mogelijkheden." },
      { q: "Kan de wagen bij de koper geleverd worden?", a: "Ja. We leveren op het adres dat u opgeeft, van deur tot deur." },
    ],
    related: ["auto-importeren", "autotransport-dealers", "fleet-wagenpark"],
    relatedRoutes: ["belgie-frankrijk", "autotransport-spanje", "autotransport-europa"],
    seo: {
      title: "Auto exporteren naar het buitenland | Mcars",
      description: "Exporteer uw wagen vanuit België of Nederland naar heel Europa. Wekelijkse routes, van deur tot deur, verzekerd en gedocumenteerd.",
    },
  },
  {
    slug: "niet-rijdende-auto",
    nav: "Niet-rijdende auto",
    category: "Speciaal transport",
    title: "Niet-rijdende auto transporteren",
    subtitle: "Voor schadeauto's, defecte voertuigen en projectwagens.",
    intro:
      "Een wagen die niet meer start, schade opliep of al jaren stilstaat? Geen probleem. Onze transporters zijn uitgerust met een lier waarmee we verrolbare wagens veilig op de vrachtwagen trekken. Niet-verrolbaar? Dan voorzien we een heftruck ter plaatse.",
    heroImage: "/fleet/depot-wet.jpg",
    audience: "Voor particulieren, garages en depannagediensten met een niet-rijdend of niet-verrolbaar voertuig.",
    vehicleTypes: ["Schadewagens", "Defecte voertuigen", "Projectwagens", "Stilstaande oldtimers", "Niet-verrolbare wagens", "Sloop & restauratieprojecten"],
    highlights: [
      { icon: "wrench", title: "Lier aan boord", body: "Verrolbare wagens trekken we met de winch veilig op de laadvloer — geen draaiende motor nodig." },
      { icon: "box", title: "Heftruck bij blokkering", body: "Staat de wagen volledig geblokkeerd? Dan zorgen we voor een heftruck ter plaatse." },
      { icon: "shield", title: "Zorgvuldig vastgezet", body: "Elk voertuig wordt professioneel gestremd en gedocumenteerd op de CMR." },
    ],
    benefits: [
      "Lier (winch) op elke transporter",
      "Heftruck-oplossing voor geblokkeerde wagens",
      "Ideaal voor depannage en schadeherstel",
      "Ook langgestalde projectwagens",
    ],
    faq: [
      { q: "Mijn wagen start niet — kunnen jullie hem toch laden?", a: "Ja. Zolang de wagen verrolbaar is, trekken we hem met de lier op de vrachtwagen. Is hij volledig geblokkeerd, dan voorzien we een heftruck." },
      { q: "Wat als de wielen geblokkeerd zijn?", a: "Dan is een heftruck ter plaatse nodig. Vermeld dit bij uw aanvraag zodat we het correct inplannen." },
    ],
    related: ["depannage", "oldtimer-transport", "spoedtransport"],
    relatedRoutes: ["autotransport-belgie", "autotransport-frankrijk"],
    seo: {
      title: "Niet-rijdende auto transporteren | Mcars",
      description: "Schadeauto, defecte wagen of projectvoertuig? Mcars laadt niet-rijdende wagens met lier of heftruck. Veilig opgehaald en geleverd.",
    },
  },
  {
    slug: "oldtimer-transport",
    nav: "Oldtimer transport",
    category: "Zorgvuldig transport",
    title: "Oldtimer transport",
    subtitle: "Veilig vervoer voor klassieke wagens en oldtimers.",
    intro:
      "Een klassieker verdient de grootste zorg. Of het nu naar een beurs, een verkoop of een oldtimerrit gaat: wij behandelen uw wagen alsof het onze eigen is. Zacht laden en professioneel vastzetten, zodat uw klassieker aankomt zoals hij vertrok.",
    heroImage: "/fleet/dramatic-sky.jpg",
    audience: "Voor verzamelaars, liefhebbers en handelaars in klassieke en waardevolle wagens.",
    highlights: [
      { icon: "star", title: "Behandeld als een collector", body: "Zachte gordels, lage laadhoek en ervaren chauffeurs die weten hoe kwetsbaar een klassieker is." },
      { icon: "wrench", title: "Ook als hij niet meer rijdt", body: "Start uw klassieker niet meer of staat hij al jaren stil? Met de lier trekken we hem veilig aan boord." },
      { icon: "route", title: "Ook internationale ritten", body: "We vervoeren oldtimers tot in het buitenland — bijvoorbeeld voor rondritten en evenementen." },
    ],
    benefits: [
      "Zacht en laag laden zonder risico",
      "Ook stilstaande, niet-rijdende klassiekers",
      "Ervaren met waardevolle en zeldzame wagens",
      "Internationale ritten voor rally's en beurzen",
    ],
    faq: [
      { q: "Mijn oldtimer rijdt niet meer — kunnen jullie hem vervoeren?", a: "Ja. Zolang hij verrolbaar is, trekken we hem met de lier op de vrachtwagen. Vermeld het bij uw aanvraag." },
      { q: "Kan mijn oldtimer naar het buitenland?", a: "Zeker. We vervoerden al oldtimers voor rondritten tot aan de Kroatische grens en terug." },
    ],
    related: ["eventtransport", "niet-rijdende-auto", "autotransport-particulier"],
    relatedRoutes: ["autotransport-europa", "autotransport-italie"],
    seo: {
      title: "Oldtimer transport | Mcars",
      description: "Veilig transport voor klassiekers en oldtimers. Zacht geladen en professioneel vastgezet. Ook internationaal.",
    },
  },
  {
    slug: "open-autotransport",
    nav: "Open autotransport",
    category: "Standaard transport",
    title: "Open autotransport",
    subtitle: "De voordelige en efficiënte transportoplossing.",
    intro:
      "Voor de meeste wagens is open transport de slimste keuze: efficiënt, betrouwbaar en voordelig. Uw voertuig reist mee op onze meerlaagse Kässbohrer-transporters, professioneel vastgezet en volledig gedocumenteerd — de standaard waarmee we dagelijks door Europa rijden.",
    heroImage: "/fleet/countryside.jpg",
    audience: "Voor iedereen die een courant voertuig vlot en voordelig wil laten vervoeren.",
    highlights: [
      { icon: "truck", title: "Meerdere wagens, lagere kost", body: "Door te combineren op onze transporters houden we de prijs per wagen scherp." },
      { icon: "map", title: "Dagelijkse routes", body: "We rijden dagelijks door België en wekelijks door Europa — uw wagen sluit vlot aan." },
      { icon: "shield", title: "Even zorgvuldig vastgezet", body: "Open betekent niet minder zorg: elke wagen wordt correct gestremd en op CMR gezet." },
    ],
    benefits: [
      "Voordeligste optie voor courante wagens",
      "Meerlaagse Kässbohrer-transporters",
      "Snelle aansluiting op bestaande routes",
      "Volledig verzekerd en gedocumenteerd",
    ],
    faq: [
      { q: "Is open transport veilig voor mijn wagen?", a: "Ja. Elke wagen wordt professioneel vastgezet en gedocumenteerd op de CMR." },
      { q: "Bieden jullie ook gesloten transport aan?", a: "Nee, wij rijden uitsluitend met open transporters. Elke wagen wordt wel professioneel vastgezet, gedocumenteerd en is verzekerd tijdens het transport." },
    ],
    related: ["autotransport-particulier", "autotransport-dealers", "fleet-wagenpark"],
    relatedRoutes: ["autotransport-belgie", "autotransport-frankrijk", "autotransport-europa"],
    seo: {
      title: "Open autotransport | Mcars",
      description: "Voordelig en efficiënt open autotransport op meerlaagse transporters. Dagelijkse routes, verzekerd en gedocumenteerd.",
    },
  },
  {
    slug: "depannage",
    nav: "Depannage",
    category: "Pech & ongeval",
    title: "Depannage & takeldienst",
    subtitle: "Pech, panne of ongeval? Wij takelen uw wagen weg.",
    intro:
      "Valt uw wagen stil langs de weg, start hij niet meer of raakte hij betrokken bij een ongeval? Bel ons. We komen ter plaatse, laden het voertuig veilig op en brengen het naar uw garage, naar huis of naar ons depot in Roeselare — zodat u niet blijft zitten met een gestrande wagen.",
    heroImage: "/fleet/actros-motion.jpg",
    audience: "Voor particulieren, garages, leasingmaatschappijen en bedrijven met een voertuig dat na pech of een ongeval niet meer verder kan.",
    vehicleTypes: ["Personenwagens & SUV's", "Camionettes & bestelwagens", "Wagens met motorpech", "Ongevalswagens", "Niet-verrolbare voertuigen", "Leasing- & bedrijfswagens"],
    highlights: [
      { icon: "phone", title: "Eén telefoontje", body: "Vertel waar de wagen staat en wat er scheelt. U krijgt meteen een eerlijk antwoord over wanneer we er kunnen zijn." },
      { icon: "wrench", title: "Geen draaiende motor nodig", body: "Met de lier trekken we de wagen veilig aan boord, ook als hij niet meer start." },
      { icon: "route", title: "Naar waar u wil", body: "Naar uw garage, uw thuisadres, een schadehersteller of ons depot in Roeselare." },
    ],
    process: [
      { title: "Bel ons", body: "Vertel waar het voertuig staat en wat er aan de hand is. U krijgt meteen een realistisch antwoord over wat haalbaar is." },
      { title: "Ter plaatse", body: "Onze chauffeur komt naar de wagen en bekijkt hoe hij het veiligst geladen wordt." },
      { title: "Veilig geladen", body: "Met de lier trekken we het voertuig op de laadvloer en zetten we het professioneel vast." },
      { title: "Afgeleverd", body: "We brengen de wagen naar de garage, naar huis of naar ons depot — waar u wil." },
    ],
    benefits: [
      "Takelen na pech, panne of ongeval",
      "Rechtstreeks naar garage, thuisadres of depot",
      "Ook voor bedrijven en leasewagens",
      "Verzekerd en zorgvuldig vastgezet",
    ],
    faq: [
      { q: "Hoe snel zijn jullie ter plaatse?", a: "Dat hangt af van waar de wagen staat en van onze lopende ritten. Bel ons en u krijgt meteen een realistisch antwoord." },
      { q: "Waar brengen jullie mijn wagen naartoe?", a: "Waar u wil: naar uw eigen garage, een schadehersteller, uw thuisadres of ons depot in Roeselare." },
      { q: "Mijn wagen staat stil in het buitenland — kunnen jullie helpen?", a: "Ja. Voor wagens die in het buitenland stranden, zorgen we voor repatriëring. Bel ons en we bekijken samen de mogelijkheden." },
    ],
    related: ["niet-rijdende-auto", "spoedtransport", "autotransport-particulier"],
    relatedRoutes: ["autotransport-belgie"],
    seo: {
      title: "Depannage & takeldienst | Mcars",
      description: "Pech of ongeval? Mcars takelt uw wagen weg en brengt hem naar uw garage, naar huis of naar ons depot. Bel ons voor een eerlijk antwoord.",
    },
    contentNote: "Bevestigen bij klant: werkgebied, beschikbaarheid (avond/weekend?) en of er ook pechverhelping ter plaatse gebeurt. Echte foto van een depannage gewenst.",
  },
  {
    slug: "spoedtransport",
    nav: "Spoedtransport",
    category: "Dringend transport",
    title: "Spoedtransport & repatriëring",
    subtitle: "Dringende ophaling of levering van voertuigen.",
    intro:
      "Moet een wagen er snel zijn, of strandde een voertuig in het buitenland? Wij schakelen snel. Voor dringende ophalingen en repatriëringen zetten we onze routes en chauffeurs flexibel in zodat uw wagen zo snel mogelijk op de juiste plaats staat.",
    heroImage: "/fleet/hero-highway-sunset.jpg",
    audience: "Voor wie een dringend transport nodig heeft of een wagen moet laten repatriëren, in binnen- of buitenland.",
    highlights: [
      { icon: "clock", title: "Snel geschakeld", body: "We bekijken meteen wat mogelijk is en zetten onze planning flexibel in voor dringende ritten." },
      { icon: "globe", title: "Repatriëring uit het buitenland", body: "Gestrand op reis of na pech? We halen uw wagen op en brengen hem veilig thuis." },
      { icon: "phone", title: "Direct contact", body: "Bel of stuur een bericht — u krijgt meteen een realistisch antwoord over wat haalbaar is." },
    ],
    process: [
      { title: "Bel of vraag aan met 'spoed'", body: "Bel ons rechtstreeks of vermeld bij uw aanvraag dat het dringend is. Zo kunnen we meteen schakelen." },
      { title: "Een eerlijk antwoord", body: "We bekijken wat binnen onze planning mogelijk is en laten u meteen weten wat haalbaar is." },
      { title: "Ophaling met CMR", body: "We halen de wagen op waar hij staat, ook in het buitenland of als hij niet meer rijdt. Ter plaatse maken we de CMR op." },
      { title: "Levering", body: "We bellen wanneer we bij het leveradres aankomen en leveren de wagen af waar hij moet zijn." },
    ],
    benefits: [
      "Flexibele, snelle planning",
      "Repatriëring in heel Europa",
      "Ook niet-rijdende wagens na pech of schade",
      "Rechtstreeks contact, meteen antwoord",
    ],
    faq: [
      { q: "Hoe snel kunnen jullie ter plaatse zijn?", a: "Dat hangt af van de locatie en onze lopende routes. Bel of stuur een bericht en u krijgt meteen een realistisch antwoord." },
      { q: "Kunnen jullie mijn wagen uit het buitenland repatriëren?", a: "Ja. We repatriëren voertuigen uit heel Europa, ook wanneer ze niet meer rijden." },
    ],
    related: ["niet-rijdende-auto", "depannage", "auto-importeren"],
    relatedRoutes: ["autotransport-europa", "autotransport-frankrijk", "autotransport-spanje"],
    seo: {
      title: "Spoedtransport & repatriëring | Mcars",
      description: "Dringend voertuig ophalen of laten repatriëren? Mcars schakelt snel in binnen- en buitenland. Ook niet-rijdende wagens.",
    },
  },
  {
    slug: "fleet-wagenpark",
    nav: "Fleet & wagenpark",
    category: "Voor bedrijven",
    title: "Fleet- & wagenparktransport",
    subtitle: "Voor bedrijven met meerdere voertuigen.",
    intro:
      "Een volledig wagenpark verplaatsen, leasewagens omruilen of meerdere voertuigen tussen vestigingen verschuiven? Wij plannen het als één vlotte operatie. Meerdere wagens per rit, vaste chauffeurs en één aanspreekpunt dat de hele beweging overziet.",
    heroImage: "/fleet/sunset-parking.jpg",
    audience: "Voor bedrijven, leasingmaatschappijen en fleetbeheerders die meerdere voertuigen tegelijk laten vervoeren.",
    highlights: [
      { icon: "truck", title: "Meerdere wagens per rit", body: "Onze transporters laden tot meerdere voertuigen tegelijk — efficiënt en planbaar." },
      { icon: "users", title: "Eén aanspreekpunt", body: "U bespreekt de hele beweging met één persoon. Geen versnippering, wel overzicht." },
      { icon: "map", title: "Vaste routes & planning", body: "We plannen fleettransport op onze bestaande routes voor de beste efficiëntie." },
    ],
    process: [
      { title: "Uw lijst met wagens", body: "U bezorgt ons de wagens, de ophaal- en leveradressen en de gewenste periode." },
      { title: "Eén planning", body: "We leggen de ritten op onze vaste routes en bespreken de planning met één aanspreekpunt." },
      { title: "Ophaling met CMR", body: "Elke wagen wordt bij ophaling geïnspecteerd en apart op de CMR gezet." },
      { title: "Levering & facturatie", body: "We leveren op de afgesproken adressen. U ontvangt één duidelijke factuur." },
    ],
    benefits: [
      "Volledige wagenparken in één operatie",
      "Facturatie voor bedrijven",
      "Vaste chauffeurs en vast contact",
      "Ophaling en levering op meerdere adressen",
    ],
    faq: [
      { q: "Hoeveel wagens kunnen jullie tegelijk vervoeren?", a: "Met onze vloot van negen transporters plannen we grotere bewegingen vlot in, verspreid over ritten indien nodig." },
      { q: "Kunnen jullie op meerdere adressen ophalen?", a: "Ja. We stemmen de ophaal- en leveradressen op voorhand af zodat alles in één sluitende planning past." },
    ],
    related: ["autotransport-dealers", "auto-exporteren", "open-autotransport"],
    relatedRoutes: ["autotransport-belgie", "autotransport-europa"],
    seo: {
      title: "Fleet- & wagenparktransport | Mcars",
      description: "Meerdere voertuigen of een volledig wagenpark verplaatsen? Mcars plant het als één operatie. Vaste chauffeurs, één aanspreekpunt.",
    },
  },
  {
    slug: "eventtransport",
    nav: "Eventtransport",
    category: "Op maat",
    title: "Eventtransport",
    subtitle: "Op tijd en onberispelijk op elk event.",
    intro:
      "Voor autobeurzen, races, shows en oldtimerritten telt elke minuut — en elke kras. Wij zorgen dat uw voertuigen op tijd, netjes en compleet ter plaatse staan, en na afloop weer veilig thuisgeraken. Zoals bij de oldtimerrit die we tot aan de Kroatische grens brachten en na vijf dagen terug ophaalden.",
    heroImage: "/fleet/oldtown.jpg",
    audience: "Voor organisatoren, teams en liefhebbers die voertuigen naar en van evenementen laten vervoeren.",
    highlights: [
      { icon: "clock", title: "Strak op tijd", body: "Uw wagens staan klaar vóór de start van het event — geen stress, geen improvisatie." },
      { icon: "star", title: "Onberispelijk geleverd", body: "Zorgvuldig geladen en beschermd, zodat elke wagen showklaar aankomt." },
      { icon: "route", title: "Heen- én terugrit", body: "We halen na afloop weer op en brengen alles veilig thuis." },
    ],
    benefits: [
      "Levering vóór aanvang van het event",
      "Heen- en terugtransport in één afspraak",
      "Zorgvuldig vastgezet, showklaar geleverd",
      "Ervaring met internationale ritten",
    ],
    faq: [
      { q: "Regelen jullie ook de terugrit na het event?", a: "Ja. We plannen ophaling en terugbrengen mee in, zoals bij oldtimerritten met een vaste heen- en terugbeweging." },
      { q: "Kunnen meerdere wagens samen vervoerd worden?", a: "Zeker. We combineren voertuigen efficiënt op onze transporters." },
    ],
    related: ["oldtimer-transport", "open-autotransport", "fleet-wagenpark"],
    relatedRoutes: ["autotransport-europa", "autotransport-italie"],
    seo: {
      title: "Eventtransport voor wagens | Mcars",
      description: "Voertuigen op tijd en onberispelijk naar beurzen, races en oldtimerritten — heen én terug. Verzekerd en zorgvuldig geladen.",
    },
    contentNote: "Beslissing openstaand bij klant of 'Events' een aparte pagina blijft. Voorlopig behouden.",
  },
];

export const serviceSlugs = services.map((s) => s.slug);
export const getService = (slug: string) => services.find((s) => s.slug === slug);
