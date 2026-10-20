/**
 * Design-variant registry — the single source of truth for the /overview
 * gallery and the on-page variant switcher (the circular button bottom-right
 * of every design).
 *
 * Each "section" of the site (Home now; About, Diensten, … later) can have
 * several built variants. The overview page lists them as cards and every
 * variant page renders <VariantSwitcher sectionId="…" /> so you can hop
 * between the variants of that section without leaving the design.
 */

export type Variant = {
  /** Stable id, e.g. "home-01". */
  id: string;
  /** Display label shown under the card and in the switcher, e.g. "Home 01". */
  label: string;
  /** Route this variant lives at. */
  href: string;
  /** One-line description of what makes this variant different. */
  tagline: string;
  /** Per-slug sections: path appended to the current page's base (e.g. "/v2"). */
  suffix?: string;
};

export type Section = {
  /** Stable id used by <VariantSwitcher sectionId>. */
  id: string;
  /** Section heading on the overview page, e.g. "Home". */
  title: string;
  /** Short blurb under the section heading. */
  description: string;
  variants: Variant[];
};

export const sections: Section[] = [
  {
    id: "home",
    title: "Home",
    description:
      "Drie richtingen voor de homepage. Home 01 staat nu live; klik een kaart om die versie te bekijken.",
    variants: [
      {
        id: "home-01",
        label: "Home 01",
        href: "/",
        tagline: "Huidige live homepage — cinematische hero met heldere merkstructuur.",
      },
      {
        id: "home-02",
        label: "Home 02",
        href: "/v2",
        tagline: "Klassieke opbouw — probleem/oplossing, routes en regiokaarten.",
      },
      {
        id: "home-03",
        label: "Home 03",
        href: "/v3",
        tagline: "Redactionele versie — services-accordion, netwerkkaart en blog.",
      },
    ],
  },
  {
    id: "dienst",
    title: "Dienstpagina",
    description:
      "Drie designrichtingen voor de dienstpagina — zelfde inhoud en secties, elk een eigen vormgeving. Werkt voor alle diensten.",
    variants: [
      {
        id: "dienst-01",
        label: "Dienst 01",
        href: "/diensten/autotransport-particulier",
        suffix: "",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "dienst-02",
        label: "Dienst 02",
        href: "/diensten/autotransport-particulier/v2",
        suffix: "/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "dienst-03",
        label: "Dienst 03",
        href: "/diensten/autotransport-particulier/v3",
        suffix: "/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en tabs.",
      },
    ],
  },
  {
    id: "diensten",
    title: "Diensten-overzicht",
    description:
      "Drie designrichtingen voor diensten-overzicht — zelfde inhoud, elk een eigen vormgeving.",
    variants: [
      {
        id: "diensten-01",
        label: "Diensten 01",
        href: "/diensten",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "diensten-02",
        label: "Diensten 02",
        href: "/diensten/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "diensten-03",
        label: "Diensten 03",
        href: "/diensten/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en lichte typografie.",
      },
    ],
  },
  {
    id: "routes",
    title: "Routes-overzicht",
    description:
      "Drie designrichtingen voor routes-overzicht — zelfde inhoud, elk een eigen vormgeving.",
    variants: [
      {
        id: "routes-01",
        label: "Routes 01",
        href: "/routes",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "routes-02",
        label: "Routes 02",
        href: "/routes/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "routes-03",
        label: "Routes 03",
        href: "/routes/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en lichte typografie.",
      },
    ],
  },
  {
    id: "route",
    title: "Routepagina",
    description:
      "Drie designrichtingen voor routepagina — zelfde inhoud, elk een eigen vormgeving. Werkt voor elke pagina van dit type.",
    variants: [
      {
        id: "route-01",
        label: "Route 01",
        href: "/routes/autotransport-frankrijk",
        suffix: "",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "route-02",
        label: "Route 02",
        href: "/routes/autotransport-frankrijk/v2",
        suffix: "/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "route-03",
        label: "Route 03",
        href: "/routes/autotransport-frankrijk/v3",
        suffix: "/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en lichte typografie.",
      },
    ],
  },
  {
    id: "hoe-werkt-het",
    title: "Zo werkt het",
    description:
      "Drie designrichtingen voor zo werkt het — zelfde inhoud, elk een eigen vormgeving.",
    variants: [
      {
        id: "hoe-werkt-het-01",
        label: "Werkwijze 01",
        href: "/hoe-werkt-het",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "hoe-werkt-het-02",
        label: "Werkwijze 02",
        href: "/hoe-werkt-het/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "hoe-werkt-het-03",
        label: "Werkwijze 03",
        href: "/hoe-werkt-het/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en lichte typografie.",
      },
    ],
  },
  {
    id: "offerte",
    title: "Offerte & prijzen",
    description:
      "Drie designrichtingen voor offerte & prijzen — zelfde inhoud, elk een eigen vormgeving.",
    variants: [
      {
        id: "offerte-01",
        label: "Offerte 01",
        href: "/offerte",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "offerte-02",
        label: "Offerte 02",
        href: "/offerte/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "offerte-03",
        label: "Offerte 03",
        href: "/offerte/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en lichte typografie.",
      },
    ],
  },
  {
    id: "over-ons",
    title: "Over ons",
    description:
      "Drie designrichtingen voor over ons — zelfde inhoud, elk een eigen vormgeving.",
    variants: [
      {
        id: "over-ons-01",
        label: "Over ons 01",
        href: "/over-ons",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "over-ons-02",
        label: "Over ons 02",
        href: "/over-ons/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "over-ons-03",
        label: "Over ons 03",
        href: "/over-ons/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en lichte typografie.",
      },
    ],
  },
  {
    id: "cases",
    title: "Cases-overzicht",
    description:
      "Drie designrichtingen voor cases-overzicht — zelfde inhoud, elk een eigen vormgeving.",
    variants: [
      {
        id: "cases-01",
        label: "Cases 01",
        href: "/cases",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "cases-02",
        label: "Cases 02",
        href: "/cases/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "cases-03",
        label: "Cases 03",
        href: "/cases/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en lichte typografie.",
      },
    ],
  },
  {
    id: "case",
    title: "Casepagina",
    description:
      "Drie designrichtingen voor casepagina — zelfde inhoud, elk een eigen vormgeving. Werkt voor elke pagina van dit type.",
    variants: [
      {
        id: "case-01",
        label: "Case 01",
        href: "/cases/oldtimer-event",
        suffix: "",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "case-02",
        label: "Case 02",
        href: "/cases/oldtimer-event/v2",
        suffix: "/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "case-03",
        label: "Case 03",
        href: "/cases/oldtimer-event/v3",
        suffix: "/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en lichte typografie.",
      },
    ],
  },
  {
    id: "reviews",
    title: "Reviews",
    description:
      "Drie designrichtingen voor reviews — zelfde inhoud, elk een eigen vormgeving.",
    variants: [
      {
        id: "reviews-01",
        label: "Reviews 01",
        href: "/reviews",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "reviews-02",
        label: "Reviews 02",
        href: "/reviews/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "reviews-03",
        label: "Reviews 03",
        href: "/reviews/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en lichte typografie.",
      },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    description:
      "Drie designrichtingen voor faq — zelfde inhoud, elk een eigen vormgeving.",
    variants: [
      {
        id: "faq-01",
        label: "FAQ 01",
        href: "/faq",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "faq-02",
        label: "FAQ 02",
        href: "/faq/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "faq-03",
        label: "FAQ 03",
        href: "/faq/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en lichte typografie.",
      },
    ],
  },
  {
    id: "blog",
    title: "Blog-overzicht",
    description:
      "Drie designrichtingen voor blog-overzicht — zelfde inhoud, elk een eigen vormgeving.",
    variants: [
      {
        id: "blog-01",
        label: "Blog 01",
        href: "/blog",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "blog-02",
        label: "Blog 02",
        href: "/blog/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "blog-03",
        label: "Blog 03",
        href: "/blog/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en lichte typografie.",
      },
    ],
  },
  {
    id: "artikel",
    title: "Blogartikel",
    description:
      "Drie designrichtingen voor blogartikel — zelfde inhoud, elk een eigen vormgeving. Werkt voor elke pagina van dit type.",
    variants: [
      {
        id: "artikel-01",
        label: "Artikel 01",
        href: "/blog/wat-kost-autotransport",
        suffix: "",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "artikel-02",
        label: "Artikel 02",
        href: "/blog/wat-kost-autotransport/v2",
        suffix: "/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "artikel-03",
        label: "Artikel 03",
        href: "/blog/wat-kost-autotransport/v3",
        suffix: "/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en lichte typografie.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    description:
      "Drie designrichtingen voor contact — zelfde inhoud, elk een eigen vormgeving.",
    variants: [
      {
        id: "contact-01",
        label: "Contact 01",
        href: "/contact",
        tagline: "Cinematisch — fotopanelen, scroll-animatie en donkere accenten.",
      },
      {
        id: "contact-02",
        label: "Contact 02",
        href: "/contact/v2",
        tagline: "Licht & strak — Zwitsers raster, haarlijnen en weinig afronding.",
      },
      {
        id: "contact-03",
        label: "Contact 03",
        href: "/contact/v3",
        tagline: "Donker & premium — zwarte pagina, grote cijfers en lichte typografie.",
      },
    ],
  },
];

/** Look up a section by its id (used by the switcher). */
export function getSection(sectionId: string): Section | undefined {
  return sections.find((s) => s.id === sectionId);
}
