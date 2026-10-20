/**
 * SERVICE DETAILS — the practical sections of each service page, keyed by
 * service slug: recognisable situations, price factors, what we need from
 * the customer, fleet & safety focus and the matching case.
 *
 * Kept apart from services.ts so the core content model stays readable.
 * Missing fields fall back to the defaults below. Same house rules: no
 * prices, no promised lead times.
 *
 * Facts reused from the FAQ page (confirmed): only the CMR is needed for the
 * transport itself and the driver fills it in · the driver calls on the day
 * itself · the Roeselare depot is reachable 24/7 by arrangement · private
 * customers pay before collection, businesses on invoice · vehicles are
 * insured during transport.
 */

import type { Faq } from "./services";

/** title = the situation as a sentence · desc = the scenario to recognise · body = what we do. */
export type Situation = { title: string; desc: string; body: string };
export type PriceFactor = { title: string; body: string };
export type Needs = { aanvraag: string[]; documenten: string[]; dagZelf: string[] };
export type SafetyItem = { title: string; body: string };

export type ServiceDetails = {
  situations: Situation[];
  priceFactors?: PriceFactor[];
  /** Saving tips under the price factors; [] hides them. */
  savingTips?: string[];
  /** Extra lines added to the default needs per column. */
  needsExtra?: Partial<Needs>;
  /** "pech" swaps the needs section for "Wat te doen bij pech". */
  needsMode?: "default" | "pech";
  /** The safety point that matters most for this service, shown first. */
  safetyFocus?: SafetyItem;
  caseSlug?: string;
  /** Leave out the shared FAQ (e.g. depannage, where payment/depot differ). */
  skipCommonFaq?: boolean;
  /** Internal: what Mcars still has to confirm for this service. */
  confirm?: string;
};

export const defaultPriceFactors: PriceFactor[] = [
  { title: "Afstand", body: "De afstand tussen ophaal- en leveradres, en of het traject binnen België blijft of de grens over gaat." },
  { title: "Type voertuig", body: "Afmetingen en gewicht: een compacte wagen laadt anders dan een SUV, bestelwagen of oldtimer." },
  { title: "Rijdend of niet", body: "Rijdt de wagen, rolt hij of is hij geblokkeerd? Daar hangt de manier van laden van af." },
  { title: "Adres of depot", body: "Ophalen en leveren aan huis, of op ons depot in Roeselare — dat is vaak voordeliger." },
  { title: "Planning", body: "Normaal ingepland op een bestaande rit, of dringend met een aparte rit." },
  { title: "Aantal wagens", body: "Meerdere wagens tegelijk combineren we op één transporter; dat drukt de prijs per wagen." },
];

export const defaultSavingTips = [
  "Lever of haal op op ons depot in Roeselare — 24/7 bereikbaar in overleg en vaak voordeliger.",
  "Flexibel met de datum? Dan sluiten we aan op een vaste rit.",
  "Meerdere wagens tegelijk? Die combineren we op één transporter.",
];

export const defaultNeeds: Needs = {
  aanvraag: [
    "Ophaal- en leveradres",
    "Merk, model en eventuele bijzonderheden (topbox, fietsdrager…)",
    "Rijdt de wagen, rolt hij of is hij geblokkeerd?",
    "Gewenste ophaal- en leverdatum",
  ],
  documenten: [
    "Voor het transport zelf niets: de chauffeur maakt de CMR-vrachtbrief op bij ophaling.",
  ],
  dagZelf: [
    "De chauffeur belt u op de dag zelf om het moment af te stemmen.",
    "Iemand aanwezig bij ophaling en levering, voor de inspectie en de CMR.",
    "Sleutels klaar en persoonlijke spullen uit de wagen.",
  ],
};

/** Fleet & safety facts shared by every service (from the Over ons page). */
export const defaultSafety: SafetyItem[] = [
  { title: "9 eigen transporters", body: "Allemaal met Kässbohrer-opbouw: 6× Mercedes Actros, 2× Scania Next Gen en 1× Scania Streamline." },
  { title: "8 vaste chauffeurs", body: "Ze kennen hun vrachtwagen, hun routes en hun klanten. Geen wisselende onderaannemers." },
  { title: "Inspectie & CMR", body: "Bij ophaling leggen we de staat van de wagen vast. De CMR-vrachtbrief is uw bewijs." },
  { title: "Verzekerd vastgezet", body: "Elke wagen wordt professioneel vastgezet en is verzekerd tijdens het transport." },
];

/** Confirmed answers from the FAQ page, added under each service's own questions. */
export const commonFaq: Faq[] = [
  { q: "Is mijn voertuig verzekerd tijdens het transport?", a: "Ja. Uw voertuig is verzekerd tijdens het transport. De CMR-vrachtbrief documenteert bovendien de staat van de wagen bij ophaling, zodat er nadien geen discussie mogelijk is." },
  { q: "Word ik verwittigd wanneer de chauffeur langskomt?", a: "Zeker. De chauffeur belt u de dag zelf om het ophaalmoment af te stemmen. Bij aankomst op de bestemming bellen we u opnieuw voor de levering." },
  { q: "Welke documenten heb ik nodig?", a: "Voor het transport zelf is de CMR-vrachtbrief het enige nodige document. Die vult de chauffeur bij ophaling in. U hoeft vooraf niets op te stellen." },
  { q: "Kan ik mijn wagen op het depot afgeven of afhalen?", a: "Dat kan. Ons depot in Roeselare is 24/7 toegankelijk in overleg en vaak voordeliger dan levering aan huis." },
  { q: "Wanneer en hoe betaal ik?", a: "Voor particulieren gebeurt de betaling vóór de ophaling. Bedrijven en handelaars betalen op factuur. Bij uw offerte leggen we uit wat voor u van toepassing is." },
];

export const serviceDetails: Record<string, ServiceDetails> = {
  "autotransport-particulier": {
    situations: [
      { title: "U kocht een wagen bij een verkoper ver van huis.", desc: "De wagen is betaald, maar staat honderden kilometers verder en u ziet het niet zitten om hem zelf op te halen.", body: "We halen de wagen rechtstreeks bij de verkoper op en leveren tot bij u thuis. U hoeft zelf niet te rijden." },
      { title: "U verhuist en uw wagen moet mee.", desc: "Er komt al genoeg kijken bij een verhuis. De wagen zelf overbrengen is dan één rit te veel.", body: "Uw wagen reist apart mee naar uw nieuwe adres, in binnen- of buitenland." },
      { title: "Uw wagen moet naar uw tweede verblijf.", desc: "U wilt ter plaatse met de eigen wagen rijden, zonder eerst urenlang zelf te moeten rijden.", body: "U reist ontspannen met het vliegtuig of de trein; uw wagen staat klaar bij aankomst." },
      { title: "U verkocht uw wagen aan iemand ver weg.", desc: "De koper woont niet in de buurt en u wilt dat de levering correct en aantoonbaar verloopt.", body: "We leveren de wagen bij de koper, met de CMR als bewijs van de staat bij vertrek." },
    ],
    caseSlug: "particulier-sportwagen",
  },
  "autotransport-dealers": {
    situations: [
      { title: "U kocht wagens in bij andere handelaars.", desc: "De wagens staan verspreid over verschillende adressen en moeten allemaal naar uw zaak.", body: "We halen ingekochte wagens op, ook verspreid over meerdere adressen, en brengen ze samen naar uw zaak." },
      { title: "Uw klant wil de wagen aan huis geleverd.", desc: "De verkoop is rond, maar uw klant woont ver of heeft geen tijd om de wagen te komen halen.", body: "Verkochte wagens leveren we netjes aan huis bij uw klant, in binnen- of buitenland." },
      { title: "Uw voorraad moet naar een andere vestiging.", desc: "In de ene vestiging staat te veel, in de andere te weinig — en niemand heeft tijd om te rijden.", body: "Voorraad verschuiven tussen vestigingen plannen we op onze vaste routes." },
      { title: "Een inruilwagen rijdt niet meer.", desc: "U nam een wagen in die niet meer start, en hij moet naar de werkplaats of de opkoper.", body: "Met de lier trekken we hem veilig aan boord, ook zonder draaiende motor." },
    ],
    priceFactors: [
      { title: "Aantal wagens per rit", body: "Hoe meer wagens we op één transporter combineren, hoe lager de prijs per wagen." },
      { title: "Vaste afspraken", body: "Regelmatige transporten plannen we efficiënter in dan losse ritten." },
      { title: "Adressen en afstand", body: "Het aantal ophaal- en leveradressen en de afstand ertussen." },
      { title: "Rijdend of niet", body: "Niet-rijdende inruilwagens laden we met de lier; dat bepaalt mee de aanpak." },
    ],
    needsExtra: { aanvraag: ["Lijst met wagens en adressen", "Contactpersoon per adres"] },
    safetyFocus: { title: "Meerdere wagens per rit", body: "Onze meerlaagse transporters laden meerdere voertuigen tegelijk, elk apart vastgezet en op de CMR." },
    caseSlug: "dealer-belgie",
  },
  "auto-importeren": {
    situations: [
      { title: "U vond uw wagen in Duitsland of Nederland.", desc: "De wagen is gekocht, maar de rit heen en terug kost u minstens een dag — en dan nog het risico onderweg.", body: "We halen de wagen op bij de verkoper en leveren tot aan uw deur, zonder dat u zelf de reis maakt." },
      { title: "U kocht op een veiling of bij een stockagepark.", desc: "De wagen staat op een groot terrein zoals BCA of TEA en moet binnen een bepaalde termijn weg.", body: "We halen op bij stockageparken zoals BCA en TEA en brengen de wagen naar uw adres of ons depot." },
      { title: "Familie in het buitenland geeft u een wagen.", desc: "De wagen staat bij familie of een kennis over de grens en moet naar België of Nederland.", body: "We halen de wagen op het afgesproken adres op, ook als hij niet meer rijdt." },
    ],
    priceFactors: [
      { title: "Land en afstand", body: "Uit welk land de wagen komt en hoe ver het ophaaladres van de grens ligt." },
      { title: "Ophaaladres", body: "Bij een particuliere verkoper, een dealer of op een stockagepark." },
      { title: "Type voertuig", body: "Afmetingen en gewicht bepalen hoe de wagen geladen wordt." },
      { title: "Rijdend of niet", body: "Rijdt, rolt of staat de wagen geblokkeerd?" },
      { title: "Planning", body: "Aansluiten op een vaste Europese rit, of een aparte rit." },
    ],
    needsExtra: { documenten: ["Voor de inschrijving achteraf bewaart u zelf de aankoopfactuur en het gelijkvormigheidsattest (COC)."] },
    caseSlug: "import-duitsland",
    confirm: "Welke import-formaliteiten Mcars zelf regelt en welke de klant (DIV, keuring, COC).",
  },
  "auto-exporteren": {
    situations: [
      { title: "U verkocht uw wagen aan een buitenlandse koper.", desc: "De koper woont in het buitenland en wil de wagen geleverd, zonder zelf naar hier te komen.", body: "We leveren de wagen tot bij de koper, met de CMR als bewijs van de staat bij vertrek." },
      { title: "U verhuist naar het buitenland.", desc: "U begint een nieuw leven over de grens en uw wagen moet mee naar uw nieuwe adres.", body: "Uw wagen gaat mee naar uw nieuwe adres in Europa." },
      { title: "Uw handelspartner in het buitenland wacht op wagens.", desc: "U levert regelmatig aan een partner over de grens en zoekt een vaste, betrouwbare vervoerder.", body: "We brengen wagens naar uw partner in het buitenland, ook meerdere tegelijk." },
    ],
    priceFactors: [
      { title: "Land en afstand", body: "Naar welk land de wagen gaat en hoe ver het leveradres ligt." },
      { title: "Type voertuig", body: "Afmetingen en gewicht bepalen hoe de wagen geladen wordt." },
      { title: "Aantal wagens", body: "Meerdere wagens combineren we op één transporter." },
      { title: "Planning", body: "Aansluiten op een vaste Europese rit, of een aparte rit." },
    ],
    caseSlug: "bedrijf-europa",
    confirm: "Welke export-formaliteiten Mcars zelf regelt en welke de klant.",
  },
  "niet-rijdende-auto": {
    situations: [
      { title: "Uw wagen start niet meer.", desc: "De motor slaat niet aan of de wagen valt telkens stil, maar hij moet wel naar de garage.", body: "Zolang hij rolt, trekken we hem met de lier op de laadvloer. Een draaiende motor is niet nodig." },
      { title: "Uw schadewagen moet naar de hersteller.", desc: "Na een ongeval staat de wagen bij u of op een terrein en moet hij naar de hersteller of de expert.", body: "We brengen de wagen van waar hij staat naar de hersteller of de expert." },
      { title: "Uw projectwagen staat al jaren stil.", desc: "Een oude wagen in de garage of achtertuin, misschien met geblokkeerde wielen, moet eindelijk weg.", body: "Ook langgestalde wagens krijgen we veilig op transport. Geblokkeerd? Dan zorgen we voor een heftruck." },
    ],
    priceFactors: [
      { title: "Verrolbaar of geblokkeerd", body: "Rolt de wagen, dan volstaat de lier. Volledig geblokkeerd vraagt een heftruck ter plaatse." },
      { title: "Bereikbaarheid", body: "Kan de vrachtwagen tot bij de wagen komen, of staat hij in een garage of achtertuin?" },
      { title: "Afstand", body: "De afstand tussen ophaal- en leveradres." },
      { title: "Type voertuig", body: "Afmetingen en gewicht van het voertuig." },
    ],
    needsExtra: { aanvraag: ["Rollen de wielen nog, en draait het stuur?", "Waar staat de wagen precies (straat, garage, oprit)?"] },
    safetyFocus: { title: "Lier en heftruck", body: "Elke transporter heeft een lier aan boord. Voor geblokkeerde wagens voorzien we een heftruck." },
    caseSlug: "niet-rijdend-project",
  },
  "oldtimer-transport": {
    situations: [
      { title: "Uw klassieker moet naar een beurs of rally.", desc: "U wilt uw oldtimer fris en zonder kilometers op de teller aan de start of op de stand.", body: "We brengen uw klassieker tot op de locatie en halen hem na afloop weer op." },
      { title: "U kocht of verkocht een oldtimer.", desc: "Een waardevolle wagen wisselt van eigenaar en moet zonder risico van A naar B.", body: "We halen hem zacht en zorgvuldig op bij de verkoper en leveren hem af bij de nieuwe eigenaar." },
      { title: "Uw oldtimer moet naar de restaurateur.", desc: "De wagen rijdt niet meer of is te kwetsbaar om zelf tot in de werkplaats te rijden.", body: "Ook een niet-rijdende klassieker brengen we veilig naar de werkplaats." },
    ],
    safetyFocus: { title: "Zacht en laag geladen", body: "Zachte gordels, een lage laadhoek en chauffeurs die weten hoe kwetsbaar een klassieker is." },
    caseSlug: "oldtimer-event",
  },
  "open-autotransport": {
    situations: [
      { title: "U zoekt een betaalbare manier om een wagen te vervoeren.", desc: "Het gaat om een gewone wagen en u wilt vooral een correcte, voordelige oplossing.", body: "Voor de meeste wagens is open transport de efficiënte en voordelige keuze." },
      { title: "U moet meerdere wagens tegelijk verplaatsen.", desc: "Als handelaar of leasebedrijf heeft u regelmatig meerdere wagens die naar een ander adres moeten.", body: "Meerdere wagens tegelijk combineren we voordelig op onze meerlaagse transporters." },
      { title: "Uw wagen moet ver weg in Europa.", desc: "Een lange rit naar het buitenland, waarbij u zelf rijden geen optie vindt.", body: "Op onze vaste Europese routes sluit uw wagen vlot aan." },
    ],
    caseSlug: "dealer-belgie",
  },
  depannage: {
    situations: [
      { title: "U staat met pech langs de weg.", desc: "De wagen valt stil op de autosnelweg of in de stad en kan niet verder.", body: "Bel ons met de locatie. We halen de wagen op en brengen hem waar u wil." },
      { title: "Uw wagen start niet meer thuis.", desc: "De wagen staat op uw oprit of in de garage en moet naar een garagist.", body: "Op uw oprit of in de garage trekken we hem met de lier aan boord." },
      { title: "U had een ongeval.", desc: "Na een aanrijding is de wagen niet meer rijklaar en moet hij weg.", body: "We brengen de wagen naar uw garage, de hersteller of ons depot." },
    ],
    priceFactors: [
      { title: "Locatie", body: "Waar de wagen staat en hoe bereikbaar die plek is." },
      { title: "Bestemming", body: "Naar uw garage, uw thuisadres, een hersteller of ons depot." },
      { title: "Toestand", body: "Rolt de wagen nog, of is hij geblokkeerd na een ongeval?" },
      { title: "Moment", body: "Wanneer we kunnen langskomen binnen onze lopende ritten." },
    ],
    savingTips: [],
    needsMode: "pech",
    safetyFocus: { title: "Lier aan boord", body: "Met de lier trekken we de wagen veilig op de laadvloer, ook als hij niet meer start." },
    caseSlug: "niet-rijdend-project",
    skipCommonFaq: true,
    confirm: "Werkgebied, beschikbaarheid (avond/weekend) en of er ook pechverhelping ter plaatse gebeurt.",
  },
  spoedtransport: {
    situations: [
      { title: "Uw wagen moet er heel snel zijn.", desc: "Een deadline, een klant die wacht of een vertrek dat vastligt — er is geen tijd om af te wachten.", body: "We bekijken meteen wat binnen onze planning mogelijk is en zeggen u eerlijk wat haalbaar is." },
      { title: "Uw wagen strandde in het buitenland.", desc: "Na pech of schade op reis staat de wagen ver van huis en moet hij terug.", body: "We repatriëren uw wagen naar huis, ook als hij niet meer rijdt." },
      { title: "Uw klant wacht dringend op zijn wagen.", desc: "Als handelaar moet u een verkochte wagen sneller leveren dan gepland.", body: "Voor handelaars plannen we een dringende levering zo vlot mogelijk in." },
    ],
    priceFactors: [
      { title: "Hoe dringend", body: "Past het op een lopende rit, of vraagt het een aparte rit?" },
      { title: "Afstand", body: "De afstand tussen ophaal- en leveradres, in binnen- of buitenland." },
      { title: "Rijdend of niet", body: "Een gestrande of defecte wagen laden we met de lier." },
      { title: "Type voertuig", body: "Afmetingen en gewicht van het voertuig." },
    ],
    savingTips: ["Een paar dagen speling? Dan past uw wagen misschien op een vaste rit en is het geen spoed meer."],
  },
  "fleet-wagenpark": {
    situations: [
      { title: "Uw leasewagens worden vervangen.", desc: "Oude wagens moeten weg en nieuwe moeten geleverd worden, liefst zonder dat uw mensen moeten rijden.", body: "Oude wagens ophalen en nieuwe leveren plannen we als één beweging." },
      { title: "Uw bedrijf verhuist naar een nieuwe vestiging.", desc: "Het volledige wagenpark moet mee, terwijl het werk gewoon doorgaat.", body: "Het volledige wagenpark verhuist mee, verspreid over ritten waar nodig." },
      { title: "Uw wagens moeten naar onderhoud of verkoop.", desc: "Meerdere wagens moeten naar de garage, de keuring of een opkoper en weer terug.", body: "We brengen wagens naar garage, keuring of opkoper en weer terug." },
    ],
    priceFactors: [
      { title: "Aantal wagens", body: "Hoe meer wagens per rit, hoe efficiënter per voertuig." },
      { title: "Aantal adressen", body: "Ophalen en leveren op één of op meerdere adressen." },
      { title: "Afstand", body: "De afstand tussen de adressen, in binnen- of buitenland." },
      { title: "Planning", body: "Gespreid over een periode of alles op één moment." },
    ],
    needsExtra: { aanvraag: ["Lijst met wagens (merk, model, nummerplaat)", "Contactpersoon per adres", "Facturatiegegevens"] },
    safetyFocus: { title: "Meerdere wagens per rit", body: "Onze meerlaagse transporters laden meerdere voertuigen tegelijk, elk apart vastgezet en op de CMR." },
    caseSlug: "bedrijf-europa",
  },
  eventtransport: {
    situations: [
      { title: "U stelt wagens tentoon op een beurs.", desc: "De wagens moeten op tijd en showklaar op de stand staan, en na afloop weer naar huis.", body: "Uw wagens staan klaar vóór de opening en gaan na afloop weer naar huis." },
      { title: "U neemt deel aan een race, rally of oldtimerrit.", desc: "De wagens moeten naar de start en na afloop terug, vaak ver van huis.", body: "Heen en terug in één afspraak, zoals onze rit tot aan de Kroatische grens." },
      { title: "U heeft een wagen nodig voor een shoot of opname.", desc: "Voor een fotoshoot, film of showroom moet de wagen op een precies moment op een precieze plek staan.", body: "We leveren de wagen op het moment en de plaats die u nodig hebt." },
    ],
    safetyFocus: { title: "Showklaar geleverd", body: "Zorgvuldig geladen en vastgezet, zodat elke wagen netjes aankomt." },
    caseSlug: "oldtimer-event",
  },
};

/** Details for one service with defaults filled in. */
export function getServiceDetails(slug: string) {
  const d = serviceDetails[slug] ?? { situations: [] };
  const needs: Needs = {
    aanvraag: [...defaultNeeds.aanvraag, ...(d.needsExtra?.aanvraag ?? [])],
    documenten: [...defaultNeeds.documenten, ...(d.needsExtra?.documenten ?? [])],
    dagZelf: [...defaultNeeds.dagZelf, ...(d.needsExtra?.dagZelf ?? [])],
  };
  const safety = d.safetyFocus
    ? [d.safetyFocus, ...defaultSafety.filter((s) => s.title !== d.safetyFocus!.title)]
    : defaultSafety;
  return {
    ...d,
    priceFactors: d.priceFactors ?? defaultPriceFactors,
    savingTips: d.savingTips ?? defaultSavingTips,
    needs,
    needsMode: d.needsMode ?? "default",
    safety,
  };
}
