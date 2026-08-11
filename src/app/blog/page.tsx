import type { Metadata } from "next";
import BlogGrid from "@/components/blog-grid";
import { QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Eyebrow, SplitHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Blog & kennisbank | Mcars",
  description:
    "Tips en uitleg over autotransport: kosten, import uit Duitsland, transport binnen Europa, open of gesloten vervoer, niet-rijdende wagens en documenten.",
};

const topics = [
  "Wat kost autotransport?",
  "Auto importeren uit Duitsland",
  "Auto vervoeren van Nederland naar België",
  "Open of gesloten autotransport?",
  "Niet-rijdende auto transporteren",
  "Documenten bij auto-import",
  "Autotransport voor dealers",
];

export default function BlogPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Kennisbank"
        title="Blog & kennisbank."
        subtitle="Praktische tips en heldere uitleg over autotransport, geschreven door mensen die er elke dag mee op de baan zitten."
        crumbs={[{ label: "Blog" }]}
        image="/services/01.jpg"
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* Topics strip */}
      <section className="px-5 pt-16 sm:px-8 sm:pt-24">
        <Eyebrow>Onderwerpen</Eyebrow>
        <SplitHeading className="mt-5" lead="Waar we over schrijven," trail="voor particulier en handelaar." />
        <div className="mt-8 flex flex-wrap gap-3">
          {topics.map((t) => (
            <a
              key={t}
              href="#blog"
              className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-950 hover:text-white"
            >
              {t}
            </a>
          ))}
        </div>
      </section>

      <BlogGrid />

      {/* Newsletter / cadence note */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-100 p-8 sm:p-12">
          <div className="max-w-2xl">
            <Eyebrow>Nieuwe artikels</Eyebrow>
            <SplitHeading className="mt-5" lead="Om de twee weken" trail="een nieuw artikel." />
            <p className="mt-5 text-base leading-relaxed text-zinc-500">
              We publiceren om de twee weken een nieuw artikel over autotransport, import en
              export. Kom gerust terug voor de nieuwste tips uit de cabine.
            </p>
          </div>
        </div>
      </section>

      <QuoteCta />
    </PageShell>
  );
}
