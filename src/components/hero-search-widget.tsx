"use client";

import HeroQuoteBar from "./hero-quote-bar";

/**
 * Homepage hero form. Same look as before (glass bar, swap button, dark
 * "Plan transport" CTA), now the shared three-step quote form: route →
 * vehicle → contact details.
 */
export default function HeroSearchWidget() {
  return <HeroQuoteBar layout="home" />;
}
