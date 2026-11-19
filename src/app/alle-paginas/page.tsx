import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import Section from "@/components/section";
import { Eyebrow } from "@/components/ui";
import { comboIndex } from "@/data/combos";
import { corridorRoutes, countryRoutes } from "@/data/routes";

export const metadata: Metadata = {
  title: "Alle pagina's — diensten, landen en routes | Mcars",
  description: "Overzicht van alle diensten van Mcars per land en per route door Europa.",
};

/** Full index of every service × country and service × route page. Linked from the footer. */
export default function AllPages() {
  const index = comboIndex();
  return (
    <PageShell dark>
      <Section space="loose" className="pt-36 text-white sm:pt-44">
        <Eyebrow dark>Index</Eyebrow>
        <h1 className="mt-6 max-w-4xl text-5xl leading-[0.98] font-medium tracking-[-0.04em] sm:text-7xl">
          Alle pagina&apos;s <span className="text-zinc-500">per dienst, land en route.</span>
        </h1>

        <nav aria-label="Inhoud" className="mt-12 flex flex-wrap gap-2">
          <a href="#routes" className="rounded-full bg-white/[0.08] px-4 py-2 text-sm text-white/80 hover:bg-white/15">Routes</a>
          {index.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="rounded-full bg-white/[0.08] px-4 py-2 text-sm text-white/80 hover:bg-white/15">
              {s.nav}
            </a>
          ))}
        </nav>

        <section id="routes" className="mt-20 scroll-mt-28 border-t border-white/15 pt-8">
          <h2 className="text-3xl font-medium tracking-tight">Routes</h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-5">
            {[...countryRoutes, ...corridorRoutes].map((r) => (
              <li key={r.slug}>
                <Link href={`/routes/${r.slug}`} className="text-zinc-400 hover:text-white">{r.nav}</Link>
              </li>
            ))}
          </ul>
        </section>

        {index.map((s) => (
          <section key={s.slug} id={s.slug} className="mt-20 scroll-mt-28 border-t border-white/15 pt-8">
            <h2 className="text-3xl font-medium tracking-tight">
              <Link href={`/diensten/${s.slug}`} className="hover:underline">{s.nav}</Link>
            </h2>
            <p className="mt-6 text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">Per land</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-5">
              {s.countries.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-zinc-400 hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
            <p className="mt-8 text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">Per route</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-5">
              {s.routes.map((l) => (
                <li key={l.href}><Link href={l.href} title={l.label} className="text-zinc-400 hover:text-white">{l.short}</Link></li>
              ))}
            </ul>
          </section>
        ))}
      </Section>
    </PageShell>
  );
}
