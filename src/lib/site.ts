/**
 * Central site configuration — single source of truth for navigation,
 * contact details and legal info. Every page and the CMS templates read
 * from here so the site stays consistent as content grows.
 */

export const site = {
  name: "Mcars",
  legalName: "Mcars BV",
  vat: "BE 0816.739.802",
  founded: 2009,
  tagline: "Autotransport dat verder gaat dan van A naar B.",
  email: "info@mcars.be",
  projectEmail: "ralph@mcars.be",
  phone: "+32 471 57 79 78",
  phoneHref: "tel:+32471577978",
  whatsapp: "https://wa.me/32471577978",
  address: {
    street: "Moorseelsesteenweg 16B",
    city: "8800 Roeselare",
    country: "België",
    mapsQuery: "Mcars, Moorseelsesteenweg 16B, 8800 Roeselare",
  },
  hours: "Ma–vr: 8u – 18u",
  hoursNote: "Bezoek buiten de openingsuren kan, mits vooraf verwittigd.",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
  reviews: {
    score: "4,7",
    count: 37,
    clients: "3000+",
  },
} as const;

/** Top-level navigation with mega-menu children. hrefs point at real routes. */
export type NavChild = { label: string; href: string; desc?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const nav: NavItem[] = [
  {
    label: "Diensten",
    href: "/diensten",
    children: [
      { label: "Autotransport particulier", href: "/diensten/autotransport-particulier", desc: "Eén wagen veilig van A naar B" },
      { label: "Autotransport voor dealers", href: "/diensten/autotransport-dealers", desc: "Garages, handelaars & concessies" },
      { label: "Auto importeren", href: "/diensten/auto-importeren", desc: "Uit Duitsland, NL, Frankrijk, Italië, Spanje" },
      { label: "Auto exporteren", href: "/diensten/auto-exporteren", desc: "Van België of Nederland naar heel Europa" },
      { label: "Niet-rijdende auto", href: "/diensten/niet-rijdende-auto", desc: "Schade-, defecte en projectwagens" },
      { label: "Oldtimer transport", href: "/diensten/oldtimer-transport", desc: "Veilig vervoer voor klassiekers" },
      { label: "Open autotransport", href: "/diensten/open-autotransport", desc: "Voordelig en efficiënt" },
      { label: "Gesloten autotransport", href: "/diensten/gesloten-autotransport", desc: "Voor exclusieve en sportwagens" },
      { label: "Spoedtransport", href: "/diensten/spoedtransport", desc: "Dringende ophaling of levering" },
      { label: "Fleet & wagenpark", href: "/diensten/fleet-wagenpark", desc: "Meerdere voertuigen in één rit" },
      { label: "Eventtransport", href: "/diensten/eventtransport", desc: "Onberispelijk op elk event" },
    ],
  },
  {
    label: "Routes",
    href: "/routes",
    children: [
      { label: "Autotransport België", href: "/routes/autotransport-belgie" },
      { label: "Autotransport Nederland", href: "/routes/autotransport-nederland" },
      { label: "Autotransport Frankrijk", href: "/routes/autotransport-frankrijk" },
      { label: "Autotransport Spanje", href: "/routes/autotransport-spanje" },
      { label: "Autotransport Italië", href: "/routes/autotransport-italie" },
      { label: "Autotransport Europa", href: "/routes/autotransport-europa" },
      { label: "Nederland → België", href: "/routes/nederland-belgie" },
      { label: "Nederland → Frankrijk", href: "/routes/nederland-frankrijk" },
      { label: "Frankrijk → België", href: "/routes/frankrijk-belgie" },
      { label: "Frankrijk → Nederland", href: "/routes/frankrijk-nederland" },
      { label: "België → Nederland", href: "/routes/belgie-nederland" },
      { label: "België → Frankrijk", href: "/routes/belgie-frankrijk" },
    ],
  },
  {
    label: "Zo werkt het",
    href: "/hoe-werkt-het",
  },
  {
    label: "Ontdek",
    href: "/over-ons",
    children: [
      { label: "Over ons", href: "/over-ons", desc: "Wie we zijn en onze vloot" },
      { label: "Cases & realisaties", href: "/cases", desc: "Uitgevoerde transporten" },
      { label: "Reviews", href: "/reviews", desc: "Wat klanten over ons zeggen" },
      { label: "Blog & kennisbank", href: "/blog", desc: "Tips over autotransport" },
      { label: "FAQ", href: "/faq", desc: "Antwoorden op veelgestelde vragen" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

/** Footer link columns. */
export const footerServices: NavChild[] = nav[0].children!.slice(0, 6);
