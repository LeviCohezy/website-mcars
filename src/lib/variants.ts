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
];

/** Look up a section by its id (used by the switcher). */
export function getSection(sectionId: string): Section | undefined {
  return sections.find((s) => s.id === sectionId);
}
