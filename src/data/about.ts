import type { Highlight, Stat } from "./services";

/*
 * "Over ons" content, shared by all three designs (/over-ons, /over-ons/v2,
 * /over-ons/v3). Facts come from docs/mcars-website-intake-briefing.md —
 * don't add figures here that aren't in the intake.
 */

export type Photo = { src: string; alt: string };

export const aboutIntro = {
  eyebrow: "Over ons",
  title: "Autotransport met korte lijnen, sinds 2009.",
  subtitle:
    "Een familiaal transportbedrijf uit Roeselare met een persoonlijke aanpak, ±20 jaar ervaring en klanten die telkens terugkomen.",
  badges: ["Familiebedrijf", "Roeselare, België"],
};

export const aboutStory = {
  label: "Wie zijn we",
  lead: "Een familiebedrijf dat autotransport door en door kent.",
  trail: "Wie één keer met Mcars rijdt, blijft.",
  paragraphs: [
    "Mcars werd opgericht in 2009, maar het verhaal begon vroeger: oprichter Filip Maertens laadde zijn eerste auto's al in 2004. Sindsdien bouwden we bijna twintig jaar ervaring op in het veilig vervoeren van voertuigen — voor particulieren én bedrijven.",
    "We houden het bewust persoonlijk. Bij ons spreekt u rechtstreeks met het team, niet met een anoniem callcenter. Ervaring betekent bij ons vooral rust: we weten hoe we een oldtimer zacht laden en hoe we een strakke planning heel Europa door waarmaken.",
  ],
};

export const aboutStats: Stat[] = [
  { value: "2009", label: "Opgericht" },
  { value: "9", label: "Eigen autotransporters" },
  { value: "8", label: "Vaste chauffeurs" },
  { value: "20+", label: "Jaar ervaring" },
];

/** Team & vloot. */
export const aboutTeam = {
  label: "Team & vloot",
  lead: "Eigen vloot,",
  trail: "vaste chauffeurs.",
  intro:
    "Negen eigen autotransporters, allemaal met Kässbohrer-opbouw. Acht vaste chauffeurs kennen hun vrachtwagen, hun routes en uw wagen — Nederlandstalig én Franstalig, zodat we overal vlot uit de voeten kunnen.",
  languages: ["Nederlandstalig", "Franstalig"],
};

export const fleet = [
  { name: "Mercedes Actros", count: "6×", note: "Kässbohrer-opbouw" },
  { name: "Scania Next Gen", count: "2×", note: "Kässbohrer-opbouw" },
  { name: "Scania Streamline", count: "1×", note: "Kässbohrer-opbouw" },
];

/*
 * Photo slots, shared by Over ons 01 / 02 / 03. The /images/generated/ shots
 * are AI placeholders (see docs/CONTENT-NEEDS.md) until real photography lands —
 * swap the src here and every design picks it up.
 */
export const aboutPhotos: { team: Photo; driver: Photo; workshop: Photo; fleet: Photo; road: Photo; depot: Photo; studio: Photo } = {
  team: { src: "/images/generated/team-depot.jpg", alt: "Het team van Mcars in werkkledij voor twee autotransporters op het depot" },
  /** Portrait (2:3) — only for tall slots. */
  driver: { src: "/images/generated/driver-portrait.jpg", alt: "Een chauffeur van Mcars aan het open raam van zijn cabine" },
  workshop: { src: "/images/generated/workshop.jpg", alt: "Een mecanicien controleert de hydrauliek van een oplegger in de werkplaats" },
  fleet: { src: "/images/generated/depot-night.jpg", alt: "Vier Mcars-autotransporters 's avonds voor het verlichte depot" },
  road: { src: "/fleet/dramatic-sky.jpg", alt: "Mcars autotransporter onderweg" },
  depot: { src: "/images/generated/depot-night.jpg", alt: "Vier Mcars-autotransporters 's avonds voor het verlichte depot" },
  /** Wide (2:1) side profile on a light grey studio background. */
  studio: { src: "/images/generated/truck-studio.jpg", alt: "Zijaanzicht van een volgeladen Mcars-autotransporter" },
};

export const aboutHeroImage = "/fleet/valley-sunset.jpg";
export const aboutCtaImage = "/fleet/sunset-field.jpg";

/** Werkgebied. */
export const aboutArea = {
  label: "Werkgebied",
  lead: "Elke week over heel Frankrijk,",
  trail: "en verder door Europa.",
  intro:
    "Onze niche ligt op de as van België en Nederland richting Frankrijk, tot in Noord-Spanje — met vaste stops in de stockageparken. Daarnaast zijn we actief in Duitsland, Italië, Polen en tot in Scandinavië.",
  note: "Een andere bestemming? Vraag het gerust — we staan open voor nieuwe routes.",
};

export const countries = [
  { name: "België", flag: "/countryflags/truck-flag-belgie.png", href: "/routes/autotransport-belgie" },
  { name: "Nederland", flag: "/countryflags/truck-flag-nederland.png", href: "/routes/autotransport-nederland" },
  { name: "Frankrijk", flag: "/countryflags/truck-flag-frankrijk.png", href: "/routes/autotransport-frankrijk" },
  { name: "Spanje", flag: "/countryflags/truck-flag-spanje.png", href: "/routes/autotransport-spanje" },
  { name: "Duitsland", flag: "/countryflags/truck-flag-duitsland.png", href: "/routes/autotransport-europa" },
  { name: "Italië", flag: "/countryflags/truck-flag-italie.png", href: "/routes/autotransport-italie" },
];

export const extraCountries = ["Polen", "Denemarken", "Noorwegen", "Zweden", "Finland"];

/** Verzekerd transport. */
export const aboutInsured = {
  label: "Verzekerd transport",
  lead: "Uw wagen reist",
  trail: "gedekt en gedocumenteerd.",
  items: [
    { title: "Verzekerd transport", body: "Elk voertuig is gedekt tijdens het volledige traject." },
    { title: "CMR-vrachtbrief", body: "Bevestigt de ophaling en legt de staat bij vertrek vast." },
    { title: "Intern fotobewijs", body: "Foto's als bewijsstuk bij schade — zorgvuldig en discreet bewaard." },
  ],
};

/** Waarom kiezen voor ons. */
const whyItems: Highlight[] = [
    {
      icon: "users",
      title: "Persoonlijk & familiaal",
      body: "Geen callcenter, geen nummers. U spreekt rechtstreeks met het team dat uw wagen ook effectief vervoert.",
    },
    {
      icon: "shield",
      title: "Betrouwbaar & verzekerd",
      body: "Elke rit met CMR-vrachtbrief en verzekerd transport. Duidelijke afspraken, correct nagekomen.",
    },
    {
      icon: "phone",
      title: "Spontaan, keep it simple",
      body: "Snel schakelen zonder gedoe. U vraagt aan, u krijgt binnen 24 uur een helder antwoord met prijs en planning.",
    },
    {
      icon: "route",
      title: "Transparant",
      body: "U weet steeds waar u aan toe bent. Geen verborgen kosten, geen verrassingen onderweg.",
    },
];

export const aboutWhy = {
  label: "Waarom Mcars",
  lead: "Vier redenen",
  trail: "die klanten telkens aanhalen.",
  items: whyItems,
};

export const aboutMetadata = {
  title: "Over ons | Mcars",
  description:
    "Mcars vervoert wagens met korte lijnen en een familiale, persoonlijke aanpak. Ontdek ons verhaal sinds 2009, ons team van 8 chauffeurs en onze vloot van 9 autotransporters.",
};
