/**
 * BLOG CONTENT MODEL — the "collection" behind /blog and /blog/[slug].
 *
 * All three design versions of the overview and the article page read from
 * here, so they always show the same content. House rules (same as services):
 * no prices, no promised lead times, no invented figures. Legal/administrative
 * info stays general and always points readers to the competent authority.
 *
 * Inline markup inside paragraphs, list items and tips:
 *   [label](/internal-href)  → link        **text** → bold
 */

import type { Metadata } from "next";
import { getRoute } from "./routes";
import { getService } from "./services";

export type ArticleBlock =
  | { p: string }
  | { list: string[]; ordered?: boolean }
  | { tip: string; title?: string };

export type ArticleSection = { id: string; title: string; body: ArticleBlock[] };

export type BlogCategory = "Prijs" | "Import & export" | "Routes" | "Documenten" | "Niet-rijdend" | "Advies" | "Voor dealers";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  image: string;
  imageAlt: string;
  /** "In het kort" — 3 to 4 one-line takeaways. */
  summary: string[];
  sections: ArticleSection[];
  /** Related service slugs (src/data/services.ts). */
  services: string[];
  /** Related route slugs (src/data/routes.ts). */
  routes: string[];
  seo: { title: string; description: string };
};

export const articles: Article[] = [
  // ─── 1 · Wat kost autotransport? ─────────────────────────────────
  {
    slug: "wat-kost-autotransport",
    title: "Wat kost autotransport? Dit bepaalt de prijs",
    excerpt:
      "Er bestaat geen vaste prijs per kilometer. Wel een handvol factoren die bepalen wat uw transport kost — en een paar manieren om slim te besparen.",
    category: "Prijs",
    date: "2026-09-29",
    image: "/images/generated/planning-office.jpg",
    imageAlt: "Een planner van Mcars stelt aan zijn bureau een offerte en planning samen",
    summary: [
      "Een eerlijke prijs hangt af van uw rit: afstand, voertuig, toestand, adres en planning.",
      "Flexibel zijn met de datum en ophalen of leveren op het depot drukt vaak de kost.",
      "Meerdere wagens tegelijk? Die combineren we op één transporter.",
      "U krijgt binnen 24 uur een persoonlijke prijs — geen calculator, geen verrassingen.",
    ],
    sections: [
      {
        id: "geen-vaste-prijs",
        title: "Waarom er geen vaste prijs per kilometer bestaat",
        body: [
          { p: "Het is de eerste vraag die we krijgen, en een logische: wat kost het om mijn wagen te laten vervoeren? Het eerlijke antwoord is dat het afhangt van uw rit. Twee transporten over dezelfde afstand kunnen heel anders uitvallen, omdat de ene wagen op een vaste route mee kan en de andere een aparte rit vraagt." },
          { p: "Daarom werken we niet met een online calculator. Een calculator rekent met gemiddelden en houdt geen rekening met wat uw transport bijzonder maakt. Wij bekijken elke aanvraag afzonderlijk en stellen een prijs op die klopt voor uw situatie." },
        ],
      },
      {
        id: "factoren",
        title: "De factoren die meetellen",
        body: [
          { p: "Dit zijn de elementen die de prijs van een autotransport bepalen. Hoe meer u er bij uw aanvraag over vertelt, hoe nauwkeuriger uw offerte." },
          {
            list: [
              "**Afstand en land** — de afstand tussen ophaal- en leveradres, en of de rit binnen België blijft of de grens over gaat.",
              "**Type voertuig** — afmetingen en gewicht: een compacte stadswagen laadt anders dan een SUV, een bestelwagen of een oldtimer.",
              "**Rijdend of niet** — rijdt de wagen, rolt hij of is hij geblokkeerd? Een niet-rijdende wagen trekken we met de lier aan boord; volledig geblokkeerd vraagt soms een heftruck.",
              "**Adres of depot** — ophalen en leveren aan huis, of op ons depot in Roeselare.",
              "**Planning** — sluit uw wagen aan op een bestaande rit, of moet het dringend met een aparte rit?",
              "**Extra's** — een topbox, fietsdrager of spullen in de wagen spelen mee in hoe we laden.",
            ],
          },
        ],
      },
      {
        id: "besparen",
        title: "Zo houdt u de kost onder controle",
        body: [
          { p: "U heeft zelf meer invloed op de prijs dan u misschien denkt. Drie tips die in de praktijk het verschil maken:" },
          {
            list: [
              "**Wees flexibel met de datum.** Met een paar dagen speling past uw wagen vaak op een rit die we al gepland hebben.",
              "**Kies voor het depot.** Ons depot in Roeselare is in overleg 24/7 bereikbaar en vaak voordeliger dan levering aan huis.",
              "**Combineer.** Moeten er meerdere wagens mee? Die zetten we samen op één transporter, wat de prijs per wagen drukt.",
            ],
          },
          { tip: "Is uw transport echt dringend? Dat kan, via [spoedtransport](/diensten/spoedtransport). Een paar dagen speling maakt van spoed vaak gewoon een geplande rit.", title: "Spoed of gewoon snel?" },
        ],
      },
      {
        id: "wat-inbegrepen",
        title: "Wat zit er in de prijs?",
        body: [
          { p: "Bij Mcars reist uw wagen op een van onze eigen transporters, met een vaste chauffeur. Bij ophaling leggen we de staat van de wagen vast en maken we de CMR-vrachtbrief op. Uw voertuig is verzekerd tijdens het transport." },
          { p: "Particulieren betalen vóór de ophaling, bedrijven en handelaars op factuur. Bij uw offerte leggen we duidelijk uit wat voor u van toepassing is." },
        ],
      },
      {
        id: "offerte",
        title: "Zo krijgt u snel een correcte prijs",
        body: [
          { p: "Vermeld bij uw [offerteaanvraag](/offerte) het ophaal- en leveradres, merk en model, of de wagen rijdt en wanneer het transport moet gebeuren. U krijgt binnen 24 uur een persoonlijk antwoord met prijs en mogelijke planning — van iemand van ons team, niet van een automatische mail." },
          { p: "Liever eerst even praten? Bel of stuur ons een bericht via WhatsApp; de gegevens vindt u op de [contactpagina](/contact)." },
        ],
      },
    ],
    services: ["autotransport-particulier", "open-autotransport", "spoedtransport"],
    routes: ["autotransport-belgie", "autotransport-europa"],
    seo: {
      title: "Wat kost autotransport? Dit bepaalt de prijs | Mcars",
      description: "Wat bepaalt de prijs van autotransport? Afstand, voertuig, toestand, adres en planning. Plus tips om te besparen en hoe u snel een correcte offerte krijgt.",
    },
  },

  // ─── 2 · Auto importeren uit Duitsland ───────────────────────────
  {
    slug: "auto-importeren-uit-duitsland",
    title: "Auto importeren uit Duitsland: zo pakt u het aan",
    excerpt:
      "Een wagen kopen in Duitsland is populair. Van controle bij aankoop tot transport en inschrijving in België: dit is het stappenplan.",
    category: "Import & export",
    date: "2026-09-15",
    image: "/fleet/germany-autobahn.jpg",
    imageAlt: "Een Mcars-transporter op de Duitse autosnelweg",
    summary: [
      "Controleer vóór de aankoop de papieren, de onderhoudshistoriek en de staat van de wagen.",
      "Laat de wagen ophalen in plaats van zelf te rijden: geen tijdelijke platen, geen kilometers, geen risico onderweg.",
      "Bewaar aankoopfactuur, Duitse inschrijvingsdocumenten en het COC voor de inschrijving in België.",
      "Douane, keuring en inschrijving: informeer u vooraf bij de bevoegde diensten.",
    ],
    sections: [
      {
        id: "waarom-duitsland",
        title: "Waarom zoveel mensen in Duitsland kopen",
        body: [
          { p: "Duitsland heeft een grote tweedehandsmarkt, met veel aanbod in bepaalde merken, uitvoeringen en opties. Wie een specifieke wagen zoekt, vindt hem daar vaak sneller. Dat aanbod is het voordeel; de afstand en het papierwerk zijn de uitdaging." },
        ],
      },
      {
        id: "voor-de-aankoop",
        title: "Vóór de aankoop: wat controleert u?",
        body: [
          { p: "Koop bij voorkeur niet blind. Laat de wagen ter plaatse bekijken of vraag uitgebreide foto's en documenten op. Let in het bijzonder op:" },
          {
            list: [
              "de Duitse inschrijvingsdocumenten (de Zulassungsbescheinigung Teil I en Teil II) en of het chassisnummer overeenkomt met de wagen;",
              "de onderhoudshistoriek en eventuele keuringsrapporten;",
              "het gelijkvormigheidsattest (COC) — vraag het meteen mee, u heeft het later nodig;",
              "een duidelijke aankoopfactuur met de gegevens van verkoper en koper.",
            ],
          },
          { tip: "Koopt u een recente wagen? Bij een 'nieuw vervoermiddel' gelden binnen de EU aparte btw-regels. Vraag vóór de aankoop advies aan de douane of uw boekhouder.", title: "Let op bij bijna nieuwe wagens" },
        ],
      },
      {
        id: "transport",
        title: "Zelf rijden of laten ophalen?",
        body: [
          { p: "Zelf naar Duitsland rijden kost u al snel een volledige dag, plus een treinticket of tweede chauffeur. Bovendien heeft u voor de terugrit tijdelijke uitvoerplaten en een bijhorende verzekering nodig, en zet u kilometers op een wagen die u net gekocht heeft." },
          { p: "Met [auto-importtransport](/diensten/auto-importeren) halen we de wagen op bij de verkoper, bij een dealer of op een stockagepark, en leveren we hem aan uw deur of op ons depot in Roeselare. Bij ophaling leggen we de staat van de wagen vast op de CMR-vrachtbrief — handig als u de wagen zelf nog niet gezien heeft." },
        ],
      },
      {
        id: "in-belgie",
        title: "Eenmaal in België: douane, keuring en inschrijving",
        body: [
          { p: "Binnen de Europese Unie betaalt u op een tweedehandswagen geen invoerrechten, maar er zijn wel formaliteiten voordat u ermee de weg op mag. In grote lijnen verloopt het zo:" },
          {
            list: [
              "De wagen wordt aangegeven bij de douane, die de gegevens registreert.",
              "Een erkend keuringscentrum voert een keuring uit voor ingevoerde voertuigen.",
              "Daarna volgt de inschrijving bij de DIV, meestal aangevraagd via uw verzekeraar. U ontvangt dan uw nummerplaat en inschrijvingsbewijs.",
            ],
            ordered: true,
          },
          { p: "De precieze procedure en de nodige documenten kunnen veranderen en hangen af van uw situatie. Controleer ze daarom altijd vooraf bij de douane, het keuringscentrum en de FOD Mobiliteit. In ons artikel over [documenten bij auto-import](/blog/documenten-bij-auto-import) zetten we de stukken op een rij." },
        ],
      },
      {
        id: "aanvragen",
        title: "Uw import inplannen",
        body: [
          { p: "Geef bij uw [aanvraag](/offerte) het ophaaladres in Duitsland, het type wagen en of hij rijdt. Staat de wagen op een terrein met ophaaltermijn, laat het ons weten; dan houden we daar rekening mee in de planning. U krijgt binnen 24 uur een persoonlijk antwoord." },
        ],
      },
    ],
    services: ["auto-importeren", "autotransport-dealers", "autotransport-particulier"],
    routes: ["autotransport-europa", "autotransport-belgie"],
    seo: {
      title: "Auto importeren uit Duitsland: stappenplan | Mcars",
      description: "Een auto importeren uit Duitsland: wat controleert u bij aankoop, hoe regelt u het transport en welke stappen volgen in België? Praktisch stappenplan.",
    },
  },

  // ─── 3 · Nederland → België ──────────────────────────────────────
  {
    slug: "auto-vervoeren-nederland-belgie",
    title: "Auto vervoeren van Nederland naar België",
    excerpt:
      "Een wagen gekocht in Nederland, of verhuist u naar België? Zo verloopt het transport over de grens, en dit regelt u best vooraf.",
    category: "Routes",
    date: "2026-09-01",
    image: "/images/generated/aerial-motorway.jpg",
    imageAlt: "Een Mcars-transporter op de Belgische snelweg tussen de velden, van bovenaf gezien",
    summary: [
      "Nederland → België is een vaste corridor op onze planning.",
      "Laten vervoeren bespaart u een retourrit en het gedoe met tijdelijke platen.",
      "Aan Nederlandse kant moet de wagen voor export uit het kentekenregister worden gemeld.",
      "In België volgen douane-aangifte, keuring en inschrijving.",
    ],
    sections: [
      {
        id: "vaak-gevraagd",
        title: "Een van de meest gevraagde ritten",
        body: [
          { p: "Nederland en België liggen dicht bij elkaar, en dat merkt u aan de automarkt. Particulieren kopen er een tweedehandswagen, handelaars kopen er voorraad in en wie verhuist, neemt zijn wagen mee. Voor ons is [Nederland → België](/routes/nederland-belgie) daarom een vaste corridor die we structureel rijden." },
        ],
      },
      {
        id: "waarom-laten-vervoeren",
        title: "Waarom niet gewoon zelf rijden?",
        body: [
          { p: "Het lijkt een korte rit, maar zelf rijden betekent: heen met de trein of een tweede wagen, terug met een wagen die nog niet in België is ingeschreven. Daarvoor heeft u tijdelijke platen en een passende verzekering nodig. Rijdt de wagen niet, dan is zelf rijden helemaal geen optie." },
          { p: "Laat u hem vervoeren, dan halen we de wagen op bij de verkoper of op uw oude adres en leveren we hem van deur tot deur. Bij ophaling leggen we de staat vast op de CMR-vrachtbrief." },
        ],
      },
      {
        id: "nederlandse-kant",
        title: "Aan Nederlandse kant: afmelden voor export",
        body: [
          { p: "Een wagen die Nederland definitief verlaat, wordt in het Nederlandse kentekenregister gemeld als 'export'. Bij aankoop bij een dealer doet die dat vaak zelf; bij een particuliere verkoop maakt u er best vooraf duidelijke afspraken over. Vraag in elk geval de kentekendocumenten en het bewijs van de exportmelding mee." },
          { tip: "De regels en procedures kunnen wijzigen. Controleer ze bij de RDW of vraag het na bij de verkoper vóór u de koop afrondt.", title: "Altijd even nagaan" },
        ],
      },
      {
        id: "belgische-kant",
        title: "In België: van douane tot nummerplaat",
        body: [
          { p: "Eenmaal in België verloopt het traject in grote lijnen zoals bij elke import uit een ander EU-land: aangifte bij de douane, een keuring bij een erkend keuringscentrum en daarna de inschrijving bij de DIV, meestal via uw verzekeraar. Welke stukken u daarvoor nodig heeft, leest u in [documenten bij auto-import](/blog/documenten-bij-auto-import)." },
        ],
      },
      {
        id: "klaarmaken",
        title: "Uw wagen klaarmaken voor de rit",
        body: [
          { p: "Een goede voorbereiding maakt ophaling en levering vlot. Een paar praktische punten:" },
          {
            list: [
              "Spreek met de verkoper af wie aanwezig is bij de ophaling en wie de CMR mee ondertekent.",
              "Zorg dat de sleutels, het kentekenbewijs en de aankoopdocumenten klaarliggen — of dat de verkoper ze aan de chauffeur meegeeft.",
              "Haal persoonlijke spullen uit de wagen en meld bijzonderheden zoals een trekhaak, topbox of lage bodemvrijheid.",
              "Rijdt de wagen niet of niet goed? Vermeld het bij uw aanvraag, dan nemen we de lier mee in de planning.",
            ],
          },
          { p: "Wilt u liever zelf leveren of ophalen? Ons depot in Roeselare is in overleg 24/7 bereikbaar en vaak de voordeligste optie." },
        ],
      },
      {
        id: "omgekeerd",
        title: "En de andere richting?",
        body: [
          { p: "Wagens van België naar Nederland rijden we evengoed, net als combinaties met Frankrijk. Bekijk de route [België → Nederland](/routes/belgie-nederland) of ons overzicht van [autotransport in Nederland](/routes/autotransport-nederland)." },
          { p: "Klaar om in te plannen? [Vraag uw prijs aan](/offerte) met beide adressen en het type wagen. U krijgt binnen 24 uur een persoonlijk antwoord." },
        ],
      },
    ],
    services: ["auto-importeren", "autotransport-particulier", "autotransport-dealers"],
    routes: ["nederland-belgie", "autotransport-nederland", "belgie-nederland"],
    seo: {
      title: "Auto vervoeren van Nederland naar België | Mcars",
      description: "Een auto vervoeren van Nederland naar België: zo verloopt het transport, wat regelt u aan Nederlandse kant en welke stappen volgen in België.",
    },
  },

  // ─── 4 · Open of gesloten ────────────────────────────────────────
  {
    slug: "open-of-gesloten-autotransport",
    title: "Open of gesloten autotransport: wat kiest u?",
    excerpt:
      "Open transport is de standaard in de sector, gesloten transport een specialisatie. Wat is het verschil, en wanneer volstaat open?",
    category: "Advies",
    date: "2026-08-18",
    image: "/fleet/city-loaded.jpg",
    imageAlt: "Een volgeladen open transporter van Mcars",
    summary: [
      "Open transport is de gangbare, efficiënte manier om wagens te vervoeren.",
      "Gesloten transport schermt de wagen af van weer en zicht, maar vervoert doorgaans minder wagens per rit.",
      "Voor de meeste wagens volstaat open transport ruim — mits correct vastgezet en gedocumenteerd.",
      "Mcars rijdt uitsluitend met open transporters.",
    ],
    sections: [
      {
        id: "verschil",
        title: "Het verschil in één zin",
        body: [
          { p: "Bij open transport staat uw wagen op een open oplegger, zoals u die dagelijks op de snelweg ziet rijden. Bij gesloten transport reist hij in een dichte laadruimte, afgeschermd van regen, wind en nieuwsgierige blikken." },
        ],
      },
      {
        id: "open",
        title: "Open transport: de standaard",
        body: [
          { p: "Het overgrote deel van de wagens in Europa wordt open vervoerd: nieuwe wagens naar de dealer, leasewagens, tweedehands voorraad en particuliere transporten. Dat is niet voor niets. Een open transporter laadt meerdere wagens tegelijk, wat het transport efficiënt en voordelig maakt." },
          {
            list: [
              "**Voordelig** — meer wagens per rit betekent een lagere kost per wagen.",
              "**Flexibel** — open transporters rijden dagelijks, dus uw wagen sluit sneller aan op een rit.",
              "**Zichtbaar** — de chauffeur ziet elke wagen en kan onderweg controleren of alles goed vastzit.",
            ],
          },
          { p: "Open betekent niet minder zorg. Een goede vervoerder zet elke wagen professioneel vast, inspecteert hem bij ophaling en legt de staat vast op de CMR-vrachtbrief." },
        ],
      },
      {
        id: "gesloten",
        title: "Gesloten transport: wanneer wordt het overwogen?",
        body: [
          { p: "Gesloten transport wordt vaak gekozen voor zeer zeldzame of uitzonderlijk waardevolle wagens, of wanneer een eigenaar absolute discretie wil. Omdat er doorgaans minder wagens per rit mee kunnen, ligt de kost per wagen in de regel hoger en is de planning minder flexibel." },
        ],
      },
      {
        id: "mcars",
        title: "Wat Mcars doet — en waarom",
        body: [
          { p: "Wij zijn daar duidelijk in: Mcars rijdt **uitsluitend met open transporters**. Onze vloot bestaat uit eigen meerlaagse transporters met Kässbohrer-opbouw, gereden door vaste chauffeurs. Elke wagen wordt professioneel vastgezet, gedocumenteerd en is verzekerd tijdens het transport." },
          { p: "Ook klassiekers vervoeren we open, zacht geladen met een lage laadhoek en aangepaste gordels. Meer daarover op onze pagina over [oldtimer transport](/diensten/oldtimer-transport)." },
          { tip: "Twijfelt u of open transport geschikt is voor uw wagen? Vertel ons bij uw aanvraag over de wagen en uw verwachtingen. We zeggen u eerlijk of wij de juiste partij zijn.", title: "Eerlijk advies" },
        ],
      },
      {
        id: "zelf-doen",
        title: "Wat u zelf kunt doen voor een zorgeloos transport",
        body: [
          { p: "Ook bij open transport kunt u een paar eenvoudige dingen doen die de inspectie en de levering vlotter maken:" },
          {
            list: [
              "**Was de wagen vooraf**, zodat bestaande krasjes en deukjes bij de inspectie goed zichtbaar zijn.",
              "**Maak zelf foto's** bij de ophaling, naast de vaststellingen van de chauffeur.",
              "**Verwijder losse onderdelen** zoals een afneembare antenne, fietsdrager of spullen in het interieur.",
              "**Meld bijzonderheden** zoals een lage bodemvrijheid, een spoiler of een gevoelige afwerking bij uw aanvraag.",
            ],
          },
          { p: "Bij levering controleert u de wagen samen met de chauffeur en tekent u de CMR. Heeft u een opmerking, noteer ze dan meteen op de vrachtbrief." },
        ],
      },
      {
        id: "kiezen",
        title: "Zo maakt u de keuze",
        body: [
          { p: "Gaat het om een courante wagen, een handelswagen of een gewone klassieker, dan is [open autotransport](/diensten/open-autotransport) de logische keuze. Wilt u weten wat het kost? [Vraag uw prijs aan](/offerte) — u krijgt binnen 24 uur antwoord." },
        ],
      },
    ],
    services: ["open-autotransport", "oldtimer-transport", "autotransport-particulier"],
    routes: ["autotransport-europa", "autotransport-frankrijk"],
    seo: {
      title: "Open of gesloten autotransport: wat kiest u? | Mcars",
      description: "Het verschil tussen open en gesloten autotransport, de voor- en nadelen en wanneer open transport volstaat. Eerlijk advies van Mcars.",
    },
  },

  // ─── 5 · Niet-rijdende auto ──────────────────────────────────────
  {
    slug: "niet-rijdende-auto-transporteren",
    title: "Niet-rijdende auto transporteren: dit zijn uw opties",
    excerpt:
      "Start uw wagen niet meer, of staat hij al jaren stil? Met een lier of heftruck raakt ook een defecte wagen veilig op transport. Dit moet u weten.",
    category: "Niet-rijdend",
    date: "2026-08-04",
    image: "/images/generated/nonrunning-winch.jpg",
    imageAlt: "Een beschadigde, niet-rijdende wagen wordt met de lier op de transporter getrokken",
    summary: [
      "Een draaiende motor is niet nodig: zolang de wagen rolt, trekken we hem met de lier aan boord.",
      "Volledig geblokkeerd? Dan zetten we waar nodig een heftruck in.",
      "Vertel bij uw aanvraag of de wielen rollen, het stuur draait en waar de wagen staat.",
      "Toestand en bereikbaarheid bepalen mee de aanpak en de prijs.",
    ],
    sections: [
      {
        id: "situaties",
        title: "Wanneer een wagen niet meer zelf kan rijden",
        body: [
          { p: "Er zijn veel redenen waarom een wagen niet op eigen kracht kan vertrekken: een motor die niet meer aanslaat, schade na een ongeval, een projectwagen die al jaren in de garage staat of een inruilwagen die op de laatste meters de geest gaf. In al die gevallen moet de wagen toch ergens heen — naar de garage, de hersteller, de expert of een nieuwe eigenaar." },
        ],
      },
      {
        id: "lier",
        title: "Rolt de wagen? Dan volstaat de lier",
        body: [
          { p: "Elke transporter van Mcars heeft een lier (winch) aan boord. Zolang de wielen rollen en het stuur draait, trekken we de wagen daarmee gecontroleerd de oplegger op. Een draaiende motor is daarvoor niet nodig." },
          { p: "Rolt de wagen nog, maar zijn de remmen of de handrem twijfelachtig? Meld het ons. Dan houden we daar bij het laden en vastzetten rekening mee." },
        ],
      },
      {
        id: "geblokkeerd",
        title: "Volledig geblokkeerd: heftruck",
        body: [
          { p: "Zitten de wielen vast, staat de wagen op een stuurslot zonder sleutel of ontbreken er wielen, dan is lieren niet mogelijk. In die gevallen voorzien we waar nodig een heftruck ter plaatse. Dat vraagt wat meer voorbereiding, en daarom is het belangrijk dat u de toestand vooraf eerlijk beschrijft." },
        ],
      },
      {
        id: "voorbereiden",
        title: "Wat we van u nodig hebben",
        body: [
          { p: "Hoe beter we weten wat ons te wachten staat, hoe vlotter de ophaling verloopt. Vermeld bij uw aanvraag:" },
          {
            list: [
              "of de wielen nog rollen en het stuur nog draait;",
              "waar de wagen precies staat: op straat, op een oprit, in een garage of achtertuin;",
              "of een vrachtwagen tot vlak bij de wagen kan komen;",
              "of de sleutels aanwezig zijn;",
              "foto's van de wagen en de plek, als dat kan.",
            ],
          },
          { tip: "Staat de wagen in een smalle straat of krappe garage? Een paar foto's van de toegang besparen veel tijd op de dag zelf.", title: "Foto's helpen" },
        ],
      },
      {
        id: "projectwagens",
        title: "Langgestalde wagens en projectwagens",
        body: [
          { p: "Een wagen die jaren heeft stilgestaan, vraagt extra aandacht. Banden kunnen plat of vervormd zijn, remmen kunnen vastzitten en het stuur kan stroef draaien. Probeer vooraf voorzichtig of de wagen nog rolt, en pomp de banden op als dat kan. Lukt het niet, dan bekijken we samen de beste manier van laden." },
          { p: "Gaat het om een klassieker die naar de restaurateur moet? Dan laden we hem zacht en laag; meer daarover bij [oldtimer transport](/diensten/oldtimer-transport)." },
        ],
      },
      {
        id: "pech-of-transport",
        title: "Pech onderweg of gepland transport?",
        body: [
          { p: "Staat u met pech langs de weg of na een ongeval, dan is [depannage](/diensten/depannage) wat u zoekt. Gaat het om een wagen die al stilstaat en verplaatst moet worden, dan plannen we een transport voor een [niet-rijdende auto](/diensten/niet-rijdende-auto) — ook naar het buitenland." },
          { p: "[Vraag uw prijs aan](/offerte) met de toestand van de wagen en beide adressen. U krijgt binnen 24 uur een persoonlijk antwoord." },
        ],
      },
    ],
    services: ["niet-rijdende-auto", "depannage", "oldtimer-transport"],
    routes: ["autotransport-belgie", "autotransport-europa"],
    seo: {
      title: "Niet-rijdende auto transporteren: uw opties | Mcars",
      description: "Een niet-rijdende auto laten transporteren: met lier of heftruck, ook zonder draaiende motor. Wat u vooraf meldt en hoe de ophaling verloopt.",
    },
  },

  // ─── 6 · Documenten bij auto-import ──────────────────────────────
  {
    slug: "documenten-bij-auto-import",
    title: "Documenten bij auto-import: wat heeft u nodig?",
    excerpt:
      "Voor het transport zelf heeft u bijna niets nodig. Voor de inschrijving in België des te meer. Een overzicht van de stukken die u best bijhoudt.",
    category: "Documenten",
    date: "2026-07-21",
    image: "/fleet/oldtown.jpg",
    imageAlt: "Mcars-transporter in een historische stad",
    summary: [
      "Voor het transport zelf is de CMR-vrachtbrief het enige nodige document; die maakt de chauffeur op.",
      "Voor de inschrijving in België heeft u o.a. de aankoopfactuur, de buitenlandse inschrijvingsdocumenten en het COC nodig.",
      "Vraag alle papieren mee bij de aankoop — achteraf opvragen is vaak lastig.",
      "Procedures wijzigen: controleer altijd bij douane, keuring en FOD Mobiliteit.",
    ],
    sections: [
      {
        id: "transport-vs-inschrijving",
        title: "Twee soorten papierwerk",
        body: [
          { p: "Bij een import loopt het papierwerk in twee sporen. Het eerste is het transport zelf: wie vervoert de wagen, in welke staat vertrok hij en wanneer kwam hij aan? Het tweede is de inschrijving: de wagen moet officieel in België geregistreerd worden voordat u ermee mag rijden." },
        ],
      },
      {
        id: "voor-het-transport",
        title: "Voor het transport: de CMR",
        body: [
          { p: "Voor het transport zelf hoeft u vooraf niets op te stellen. Onze chauffeur maakt bij ophaling de [CMR-vrachtbrief](/blog/wat-is-een-cmr) op. Die bewijst dat de wagen is opgehaald en legt de staat bij vertrek vast. Zorg er wel voor dat er bij ophaling en levering iemand aanwezig is om de CMR mee te ondertekenen, en dat de sleutels klaarliggen." },
        ],
      },
      {
        id: "voor-de-inschrijving",
        title: "Voor de inschrijving: de stukken op een rij",
        body: [
          { p: "Welke documenten precies nodig zijn, hangt af van het land van herkomst, het type voertuig en uw situatie. Deze stukken worden in de praktijk het vaakst gevraagd:" },
          {
            list: [
              "**Aankoopfactuur of koopcontract** — met de gegevens van verkoper en koper, het chassisnummer en de datum.",
              "**Buitenlandse inschrijvingsdocumenten** — het kentekenbewijs of inschrijvingsbewijs uit het land van herkomst, liefst alle delen.",
              "**Gelijkvormigheidsattest (COC)** — het Europese certificaat dat bevestigt dat de wagen aan de typegoedkeuring voldoet.",
              "**Bewijs van douane-aangifte** — dat u na de aangifte bij de douane ontvangt.",
              "**Keuringsbewijs** — van de keuring van het ingevoerde voertuig bij een erkend keuringscentrum.",
              "**Uw identiteitsgegevens en verzekering** — de inschrijving bij de DIV vraagt u doorgaans aan via uw verzekeraar.",
            ],
          },
          { tip: "Vraag het COC en alle delen van het inschrijvingsbewijs meteen bij de aankoop mee. Achteraf opvragen bij een buitenlandse verkoper of fabrikant kost vaak veel tijd.", title: "Tip bij aankoop" },
        ],
      },
      {
        id: "veelgemaakte-fouten",
        title: "Veelgemaakte fouten",
        body: [
          {
            list: [
              "**Het COC vergeten.** Zonder gelijkvormigheidsattest loopt de inschrijving vaak vertraging op. Vraag het bij de aankoop.",
              "**Een onvolledig inschrijvingsbewijs.** In sommige landen bestaat het uit meerdere delen. Zorg dat u alle delen ontvangt.",
              "**Een factuur zonder chassisnummer.** De gegevens op de factuur moeten overeenkomen met de wagen en de documenten.",
              "**Te laat informeren.** Wie pas na de aankoop uitzoekt wat er nodig is, verliest tijd. Ga het vooraf na bij de bevoegde diensten.",
            ],
          },
        ],
      },
      {
        id: "volgorde",
        title: "In welke volgorde?",
        body: [
          { p: "In grote lijnen: eerst het transport naar België, dan de aangifte bij de douane, daarna de keuring en ten slotte de inschrijving bij de DIV. Pas met nummerplaat en inschrijvingsbewijs mag de wagen de openbare weg op. Laat u de wagen leveren, dan hoeft u zich over tijdelijke platen voor de rit zelf geen zorgen te maken." },
          { p: "Deze informatie is algemeen en bedoeld als vertrekpunt. Regels en formulieren kunnen wijzigen; raadpleeg voor uw eigen situatie altijd de douane, het keuringscentrum en de FOD Mobiliteit." },
        ],
      },
      {
        id: "verder",
        title: "Verder lezen",
        body: [
          { p: "Plant u een aankoop over de grens? Lees ook [auto importeren uit Duitsland](/blog/auto-importeren-uit-duitsland) en [auto vervoeren van Nederland naar België](/blog/auto-vervoeren-nederland-belgie). Voor het transport zelf kunt u meteen [uw prijs aanvragen](/offerte)." },
        ],
      },
    ],
    services: ["auto-importeren", "auto-exporteren", "autotransport-dealers"],
    routes: ["autotransport-europa", "nederland-belgie", "frankrijk-belgie"],
    seo: {
      title: "Documenten bij auto-import: wat heeft u nodig? | Mcars",
      description: "Welke documenten heeft u nodig bij het importeren van een auto naar België? CMR voor het transport; factuur, inschrijvingsbewijs en COC voor de inschrijving.",
    },
  },

  // ─── 7 · Dealers ─────────────────────────────────────────────────
  {
    slug: "autotransport-voor-dealers",
    title: "Autotransport voor dealers: zo houdt u uw voorraad in beweging",
    excerpt:
      "Inkoop ophalen, verkochte wagens leveren, voorraad tussen vestigingen verschuiven. Waar let u op bij een vaste transportpartner?",
    category: "Voor dealers",
    date: "2026-07-07",
    image: "/images/generated/dealer-loading.jpg",
    imageAlt: "Een SUV wordt bij een autohandelaar op een Mcars-transporter geladen",
    summary: [
      "Meerdere wagens per rit en vaste afspraken maken transport per wagen efficiënter.",
      "We halen op bij handelaars, particulieren en stockageparken zoals BCA en TEA.",
      "Niet-rijdende inruilwagens trekken we met de lier aan boord.",
      "Bedrijven betalen op factuur; Nederlands- en Franstalige chauffeurs.",
    ],
    sections: [
      {
        id: "voorraad",
        title: "Voorraad die stilstaat, kost geld",
        body: [
          { p: "Voor een handelaar is elke dag dat een wagen niet op de juiste plek staat er één te veel. Een ingekochte wagen moet naar de werkplaats, een verkochte wagen naar de klant en een vestiging met te veel voorraad naar een vestiging met te weinig. Wie dat zelf met eigen mensen rijdt, verliest uren die elders beter besteed zijn." },
        ],
      },
      {
        id: "toepassingen",
        title: "Waarvoor dealers ons inschakelen",
        body: [
          {
            list: [
              "**Inkoop ophalen** — bij andere handelaars, particulieren of op stockageparken zoals BCA en TEA, ook verspreid over meerdere adressen.",
              "**Leveren aan huis** — verkochte wagens netjes tot bij uw klant, in binnen- of buitenland.",
              "**Tussen vestigingen** — voorraad verschuiven op onze vaste routes.",
              "**Inruilwagens die niet rijden** — met de lier aan boord, ook zonder draaiende motor.",
            ],
          },
        ],
      },
      {
        id: "partner-kiezen",
        title: "Waar let u op bij een transportpartner?",
        body: [
          { p: "Een goede transportpartner voor de handel herkent u aan een paar dingen:" },
          {
            list: [
              "**Eigen vloot en vaste chauffeurs** — geen ketting van onderaannemers, wel één aanspreekpunt.",
              "**Capaciteit** — meerlaagse transporters die meerdere wagens tegelijk laden.",
              "**Documentatie** — inspectie en CMR bij elke ophaling, zodat u bij discussie bewijs heeft.",
              "**Communicatie** — de chauffeur verwittigt bij ophaling en levering, ook in het Frans waar nodig.",
            ],
          },
          { p: "Mcars rijdt met een eigen vloot van meerlaagse Kässbohrer-transporters en vaste chauffeurs, Nederlands- en Franstalig." },
        ],
      },
      {
        id: "efficient",
        title: "Zo haalt u het meeste uit uw transport",
        body: [
          { p: "De grootste winst zit in planning. Hoe meer wagens we op één transporter kunnen combineren, hoe lager de kost per wagen. Regelmatige transporten met vaste afspraken plannen we bovendien efficiënter in dan losse ritten." },
          { tip: "Bezorg ons bij elke opdracht een lijst met de wagens, de adressen en een contactpersoon per adres. Dan kan de chauffeur zonder omwegen laden.", title: "Praktisch" },
        ],
      },
      {
        id: "over-de-grens",
        title: "Inkopen over de grens",
        body: [
          { p: "Veel handelaars kopen in bij buitenlandse partners of op stockageparken in Frankrijk, Nederland of Duitsland. Wij halen daar regelmatig wagens op en combineren ze op onze vaste Europese routes. In Frankrijk halen we wekelijks wagens op in onder meer BCA en TEA." },
          { p: "Met Nederlands- én Franstalige chauffeurs verloopt het contact ter plaatse vlot, ook met uw Franse of Waalse partners. Bekijk ook onze routes [Frankrijk → België](/routes/frankrijk-belgie) en [autotransport Frankrijk](/routes/autotransport-frankrijk)." },
        ],
      },
      {
        id: "samenwerken",
        title: "Samenwerken",
        body: [
          { p: "Bedrijven en handelaars betalen eenvoudig op factuur. Lees meer over [autotransport voor dealers](/diensten/autotransport-dealers) of, voor grotere aantallen, [fleet & wagenpark](/diensten/fleet-wagenpark). Of [vraag meteen een prijs aan](/offerte) voor uw volgende transport — u krijgt binnen 24 uur antwoord." },
        ],
      },
    ],
    services: ["autotransport-dealers", "fleet-wagenpark", "auto-importeren"],
    routes: ["autotransport-frankrijk", "autotransport-europa", "frankrijk-belgie"],
    seo: {
      title: "Autotransport voor dealers en handelaars | Mcars",
      description: "Autotransport voor dealers: inkoop ophalen, verkochte wagens leveren en voorraad verschuiven. Meerdere wagens per rit, eigen vloot, betaling op factuur.",
    },
  },

  // ─── 8 · CMR (legacy link) ───────────────────────────────────────
  {
    slug: "wat-is-een-cmr",
    title: "Wat is een CMR en waarom is het zo belangrijk?",
    excerpt:
      "De vrachtbrief bewijst dat uw wagen is opgehaald en documenteert de staat bij vertrek. Zo werkt het, en daarom tekent u best niet blind.",
    category: "Documenten",
    date: "2026-06-23",
    image: "/images/generated/pickup-inspection.jpg",
    imageAlt: "Een chauffeur van Mcars en de klant controleren de wagen met een tablet bij ophaling",
    summary: [
      "CMR staat voor het internationale verdrag over het wegvervoer van goederen; de CMR-vrachtbrief is het bijhorende document.",
      "Het legt vast wie wat vervoert, van waar naar waar, en in welke staat de wagen vertrok.",
      "Bij Mcars maakt de chauffeur de CMR op bij ophaling — u hoeft vooraf niets op te stellen.",
      "Controleer bij levering de wagen en noteer eventuele opmerkingen vóór u tekent.",
    ],
    sections: [
      {
        id: "wat-is-het",
        title: "Wat is een CMR?",
        body: [
          { p: "CMR is de afkorting van het Verdrag betreffende de overeenkomst tot internationaal vervoer van goederen over de weg — een Europees verdrag dat de afspraken tussen afzender, vervoerder en ontvanger regelt. De CMR-vrachtbrief is het document dat bij elk transport hoort. Het geldt in de vele landen die het verdrag ondertekenden, waaronder België en zijn buurlanden." },
        ],
      },
      {
        id: "wat-staat-erop",
        title: "Wat staat er op een CMR-vrachtbrief?",
        body: [
          { p: "Een CMR-vrachtbrief bevat de basisgegevens van het transport:" },
          {
            list: [
              "de afzender, de vervoerder en de ontvanger;",
              "de plaats en datum van ophaling en de plaats van levering;",
              "een omschrijving van wat vervoerd wordt — bij ons: merk, model en chassisnummer of nummerplaat;",
              "opmerkingen over de zichtbare staat bij vertrek;",
              "de handtekeningen van de betrokken partijen.",
            ],
          },
          { p: "De vrachtbrief wordt opgemaakt in meerdere exemplaren, zodat afzender, vervoerder en ontvanger elk een exemplaar hebben." },
        ],
      },
      {
        id: "waarom-belangrijk",
        title: "Waarom is de CMR zo belangrijk?",
        body: [
          { p: "De CMR is uw bewijs. Ze toont aan dat de wagen is opgehaald, door wie en wanneer — en vooral in welke staat. Bij Mcars inspecteren en fotograferen we de wagen bovendien bij ophaling. Zou er onverhoopt iets gebeuren, dan vormen die vaststellingen samen met de CMR de basis om alles correct af te handelen." },
          { p: "Ook bij een binnenlands transport werken we met een CMR-vrachtbrief. Zo verloopt elk transport op dezelfde, controleerbare manier." },
        ],
      },
      {
        id: "bij-ophaling-en-levering",
        title: "Wat doet u bij ophaling en levering?",
        body: [
          {
            list: [
              "Zorg dat er iemand aanwezig is die de inspectie kan volgen en de CMR kan ondertekenen.",
              "Kijk mee bij de vaststelling van de staat van de wagen.",
              "Controleer bij levering de wagen vóór u tekent, en noteer eventuele opmerkingen op de CMR.",
              "Bewaar uw exemplaar tot het transport volledig is afgehandeld.",
            ],
            ordered: true,
          },
          { tip: "Teken bij levering niet blind. Een opmerking die u op de CMR noteert, is achteraf veel sterker dan een melding een paar dagen later.", title: "Gouden regel" },
        ],
      },
      {
        id: "aansprakelijkheid",
        title: "CMR en aansprakelijkheid",
        body: [
          { p: "Het CMR-verdrag regelt niet alleen de vrachtbrief, maar ook de aansprakelijkheid van de vervoerder, onder meer bij verlies van of schade aan wat vervoerd wordt. Het legt vast wanneer een vervoerder aansprakelijk is en binnen welke termijnen een klacht moet worden gemeld." },
          { p: "De juridische details zijn complex en hangen af van de situatie. Voor u als klant is het belangrijkste dat de vrachtbrief correct is ingevuld en dat eventuele opmerkingen bij levering meteen worden genoteerd. Daarnaast is uw voertuig bij Mcars verzekerd tijdens het transport." },
        ],
      },
      {
        id: "geen-werk",
        title: "Hoeveel werk heeft u eraan?",
        body: [
          { p: "Zo goed als geen. De chauffeur maakt de CMR op bij ophaling; u hoeft vooraf geen documenten op te stellen. Voor het transport zelf is het ook het enige document dat nodig is. Gaat het om een import, dan heeft u voor de inschrijving wel andere stukken nodig — die zetten we op een rij in [documenten bij auto-import](/blog/documenten-bij-auto-import)." },
          { p: "Klaar om uw transport in te plannen? [Vraag uw prijs aan](/offerte)." },
        ],
      },
    ],
    services: ["autotransport-particulier", "auto-importeren", "auto-exporteren"],
    routes: ["autotransport-europa", "autotransport-belgie"],
    seo: {
      title: "Wat is een CMR-vrachtbrief? | Mcars",
      description: "Wat is een CMR-vrachtbrief, wat staat erop en waarom is ze zo belangrijk bij autotransport? Plus wat u doet bij ophaling en levering.",
    },
  },

  // ─── 9 · Spanje (legacy link) ────────────────────────────────────
  {
    slug: "auto-transporteren-naar-spanje",
    title: "Uw auto laten transporteren naar Spanje: zo werkt het",
    excerpt:
      "Van offerte tot levering aan uw tweede verblijf: dit mag u verwachten van een transport richting Spanje — en dit regelt u best vooraf.",
    category: "Routes",
    date: "2026-06-09",
    image: "/fleet/spain-palms.jpg",
    imageAlt: "Mcars-transporter tussen de palmbomen in Spanje",
    summary: [
      "Wekelijks rijden we over heel Frankrijk tot in Noord-Spanje; verder op aanvraag.",
      "U reist ontspannen met het vliegtuig, uw eigen wagen staat klaar bij aankomst.",
      "Haal persoonlijke spullen uit de wagen en geef bijzonderheden door bij de aanvraag.",
      "Blijft de wagen lang in Spanje? Informeer naar de lokale regels.",
    ],
    sections: [
      {
        id: "waarom",
        title: "Waarom uw wagen laten vervoeren?",
        body: [
          { p: "Wie een tweede verblijf in Spanje heeft, wil daar met de eigen wagen rijden. Maar de rit zelf is lang: dagen onderweg, overnachtingen, tol en brandstof, en daarna dezelfde weg terug. Steeds meer mensen kiezen ervoor om zelf te vliegen en de wagen apart te laten vervoeren. Bij aankomst staat hij klaar." },
          { p: "Ook bij een verhuis, een verkoop aan een Spaanse koper of de aankoop van een wagen in Spanje is transport vaak de rustigste oplossing." },
        ],
      },
      {
        id: "route",
        title: "Hoe we naar Spanje rijden",
        body: [
          { p: "Spanje ligt op onze vaste Europese planning. Wekelijks rijden we over heel Frankrijk tot in Noord-Spanje; bestemmingen verder in het land rijden we op aanvraag. Door ritten te combineren houden we het transport efficiënt. Meer over de route leest u op [autotransport Spanje](/routes/autotransport-spanje)." },
        ],
      },
      {
        id: "verloop",
        title: "Zo verloopt het, stap voor stap",
        body: [
          {
            list: [
              "U vraagt uw prijs aan met het ophaaladres, het leveradres in Spanje en het type wagen. Binnen 24 uur krijgt u een persoonlijk antwoord.",
              "Na uw akkoord leggen we samen de ophaaldatum vast.",
              "Bij ophaling inspecteren we de wagen en maken we de CMR-vrachtbrief op.",
              "We bellen u wanneer we bij het leveradres aankomen. Na de controle tekent u voor ontvangst.",
            ],
            ordered: true,
          },
        ],
      },
      {
        id: "voorbereiden",
        title: "Uw wagen voorbereiden",
        body: [
          {
            list: [
              "Haal persoonlijke spullen en waardevolle zaken uit de wagen.",
              "Meld een topbox, fietsdrager of andere bijzonderheden bij uw aanvraag.",
              "Leg de sleutels klaar en zorg dat iemand aanwezig is bij ophaling en levering.",
              "Spreek af wie de wagen in Spanje in ontvangst neemt, als u er zelf niet bent.",
            ],
          },
          { tip: "Blijft de wagen voor langere tijd in Spanje, of wordt hij daar verkocht? Dan gelden er Spaanse regels rond inschrijving en verzekering. Informeer u vooraf bij de Spaanse verkeersdienst of uw verzekeraar.", title: "Langer verblijf" },
        ],
      },
      {
        id: "terug",
        title: "En de terugweg?",
        body: [
          { p: "Wagens uit Spanje terug naar België of Nederland vervoeren we evengoed. Combineert u heen en terug in één afspraak, dan plannen we dat samen in. Bekijk ook [auto exporteren](/diensten/auto-exporteren) of [vraag meteen uw prijs aan](/offerte)." },
        ],
      },
    ],
    services: ["autotransport-particulier", "auto-exporteren", "oldtimer-transport"],
    routes: ["autotransport-spanje", "autotransport-frankrijk", "autotransport-europa"],
    seo: {
      title: "Auto transporteren naar Spanje | Mcars",
      description: "Uw auto laten transporteren naar Spanje: wekelijks via Frankrijk tot Noord-Spanje. Hoe het verloopt, hoe u de wagen voorbereidt en wat u vooraf regelt.",
    },
  },
];

/** Newest first. */
export const sortedArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date));

export const articleSlugs = articles.map((a) => a.slug);

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export const blogCategories: BlogCategory[] = Array.from(new Set(sortedArticles.map((a) => a.category)));

const MONTHS = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

/** "2026-07-12" → "12 juli 2026". */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

const stripMarkup = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, "");

function blockText(b: ArticleBlock) {
  if ("p" in b) return b.p;
  if ("list" in b) return b.list.join(" ");
  return `${b.title ?? ""} ${b.tip}`;
}

/** Reading time in minutes (~200 words/minute). */
export function readingTime(a: Article) {
  const text = [a.excerpt, ...a.summary, ...a.sections.flatMap((s) => [s.title, ...s.body.map(blockText)])].map(stripMarkup).join(" ");
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

export type ArticleLink = { href: string; label: string; meta: string; image: string };

/** Everything an article page needs, resolved once for all three designs. */
export function getArticlePage(slug: string) {
  const article = getArticle(slug);
  if (!article) return null;
  const services: ArticleLink[] = article.services.flatMap((s) => {
    const sv = getService(s);
    return sv ? [{ href: `/diensten/${sv.slug}`, label: sv.nav, meta: sv.category, image: sv.heroImage }] : [];
  });
  const routes: ArticleLink[] = article.routes.flatMap((r) => {
    const rt = getRoute(r);
    return rt ? [{ href: `/routes/${rt.slug}`, label: rt.nav, meta: rt.kind === "corridor" ? "Vaste corridor" : "Route", image: rt.heroImage }] : [];
  });
  const sameCategory = sortedArticles.filter((a) => a.slug !== article.slug && a.category === article.category);
  const others = sortedArticles.filter((a) => a.slug !== article.slug && a.category !== article.category);
  const more = [...sameCategory, ...others].slice(0, 3);
  return { article, services, routes, more, minutes: readingTime(article), date: formatDate(article.date) };
}

export type ArticlePageData = NonNullable<ReturnType<typeof getArticlePage>>;

/** generateStaticParams for /blog/[slug] and its /v2 and /v3. */
export const articleStaticParams = () => articleSlugs.map((slug) => ({ slug }));

/** generateMetadata for /blog/[slug] and its /v2 and /v3. */
export async function articleMetadata(params: Promise<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.seo.title,
    description: a.seo.description,
    openGraph: { title: a.seo.title, description: a.seo.description, type: "article", publishedTime: a.date },
  };
}

/** Metadata shared by /blog, /blog/v2 and /blog/v3. */
export const blogMetadata: Metadata = {
  title: "Blog & kennisbank | Mcars",
  description:
    "Praktische uitleg over autotransport: wat het kost, een auto importeren uit Duitsland of Nederland, documenten, open of gesloten transport en niet-rijdende wagens.",
};
