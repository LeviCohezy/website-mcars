import type { ElementType, ReactNode } from "react";

/**
 * Section — the single source of truth for a page's vertical rhythm.
 *
 * Every content block on every page should be wrapped in a <Section> instead
 * of hand-typing `px-5 py-16 sm:px-8 sm:py-24`. That idiom appeared 40+ times
 * across the codebase before this component existed; centralising it here is
 * what keeps three parallel page builds from drifting apart.
 *
 * Section owns *spacing only* — it deliberately does not paint a background.
 * The house style puts colour on rounded inner panels (`rounded-3xl bg-…`),
 * not on full-bleed section blocks, so surfaces stay the author's choice.
 */

type Space = "default" | "tight" | "loose" | "flush-top" | "flush-bottom" | "none";

const VERTICAL: Record<Space, string> = {
  // The canonical rhythm — matches the site-wide `py-16 sm:py-24` idiom.
  default: "py-16 sm:py-24",
  // Denser rhythm for secondary/utility sections.
  tight: "py-12 sm:py-16",
  // Airier rhythm for standout / opening sections.
  loose: "py-20 sm:py-32",
  // First section after a hero, or any block stacked directly below another.
  "flush-top": "pb-16 sm:pb-24",
  // Last section before the footer, when the following block adds its own top.
  "flush-bottom": "pt-16 sm:pt-24",
  // No vertical padding — you own the spacing.
  none: "",
};

export type SectionProps = {
  children: ReactNode;
  /** Vertical rhythm step. Defaults to the canonical `py-16 sm:py-24`. */
  space?: Space;
  /** Constrain content to a centered max-width column (default: full-bleed). */
  container?: boolean;
  /** Drop the standard horizontal padding (for edge-to-edge media/panels). */
  bleed?: boolean;
  /** Anchor id, e.g. "offerte" for in-page links. */
  id?: string;
  /** Element to render. Defaults to <section>. */
  as?: ElementType;
  className?: string;
};

export default function Section({
  children,
  space = "default",
  container = false,
  bleed = false,
  id,
  as: Tag = "section",
  className = "",
}: SectionProps) {
  const horizontal = bleed ? "" : "px-5 sm:px-8";
  const inner = container ? "mx-auto w-full max-w-6xl" : "";

  return (
    <Tag id={id} className={`${horizontal} ${VERTICAL[space]} ${className}`.trim()}>
      {inner ? <div className={inner}>{children}</div> : children}
    </Tag>
  );
}
