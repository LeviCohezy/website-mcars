import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SitePreview from "@/components/site-preview";
import { sections } from "@/lib/variants";

export const metadata: Metadata = {
  title: "Overzicht — MCARS website",
  description: "Alle pagina's en ontwerpvarianten van de MCARS website op één plek.",
};

export default function OverviewPage() {
  const totalVariants = sections.reduce((n, s) => n + s.variants.length, 0);

  return (
    <div className="min-h-dvh bg-zinc-950 text-white">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-5 pt-16 pb-10 sm:px-8 sm:pt-24">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Mcars" width={447} height={447} className="h-10 w-auto rounded-lg bg-white p-1.5" />
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-[0.2em] text-white/70 uppercase">
            Overzicht
          </span>
        </div>
        <h1 className="mt-8 max-w-3xl text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl">
          De MCARS website
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
          Eén plek met alle pagina&apos;s en de ontwerpvarianten die we bouwen. Klik een kaart om die versie live te
          bekijken — op elke variant vind je rechtsonder een knop om snel tussen de varianten te wisselen.
        </p>
        <p className="mt-6 text-sm text-white/35">
          {sections.length} sectie{sections.length === 1 ? "" : "s"} · {totalVariants} varianten
        </p>
      </header>

      {/* Sections */}
      <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        {sections.map((section) => (
          <section key={section.id} className="border-t border-white/10 py-12 sm:py-16">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-light tracking-tight sm:text-3xl">{section.title}</h2>
                <p className="mt-2 max-w-lg text-sm text-white/50">{section.description}</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/40">
                {section.variants.length} varianten
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.variants.map((v) => (
                <Link
                  key={v.id}
                  href={v.href}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]"
                >
                  {/* Live screenshot */}
                  <div className="relative border-b border-white/10">
                    <SitePreview href={v.href} title={v.label} />
                    <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
                    <span className="absolute right-3 top-3 flex size-9 translate-y-1 items-center justify-center rounded-full bg-white text-zinc-950 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </div>
                  {/* Label */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">{v.label}</h3>
                      {v.href === "/" && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">live</span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/50">{v.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Placeholder for the sections still to come */}
        <section className="border-t border-white/10 py-12 sm:py-16">
          <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
            <p className="text-sm font-medium text-white/60">Meer secties in aanbouw</p>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-white/35">
              About, Diensten, Routes en meer verschijnen hier zodra we hun varianten bouwen — telkens met dezelfde
              kaarten en variant-kiezer.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
