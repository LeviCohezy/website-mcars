import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { QuoteCta } from "@/components/blocks";
import Icon from "@/components/icon";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { corridorRoutes, countryRoutes, flagAsset } from "@/data/routes";

export const metadata: Metadata = {
  title: "Bestemmingen & routes — autotransport door Europa | Mcars",
  description:
    "Autotransport in België, Nederland, Frankrijk, Spanje, Italië en heel Europa, plus vaste corridors tussen de landen. Bekijk alle routes van Mcars.",
};

export default function RoutesOverview() {
  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow="Bestemmingen & routes"
        title="Tot in elke uithoek van Europa."
        subtitle="Onze niche: België en Nederland richting Frankrijk tot Noord-Spanje. En verder rijden we overal naartoe."
        crumbs={[{ label: "Routes" }]}
        video="/hero.mp4"
        bigWord="EUROPA"
        scrollCue
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* Country destinations */}
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">Landen</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl">
            Autotransport per bestemming.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countryRoutes.map((r) => (
            <Link
              key={r.slug}
              href={`/routes/${r.slug}`}
              className="group flex items-center gap-4 rounded-3xl bg-zinc-100 p-5 transition-colors hover:bg-zinc-950"
            >
              <Image src={flagAsset[r.place!.flag]} alt={r.place!.name} width={64} height={64} className="h-12 w-auto flex-none" />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-zinc-950 transition-colors group-hover:text-white">{r.place!.name}</h3>
                <p className="truncate text-xs text-zinc-500 transition-colors group-hover:text-zinc-400">{r.frequency}</p>
              </div>
              <span className="flex size-8 flex-none items-center justify-center rounded-full bg-white text-zinc-950">
                <svg className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Corridors */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="rounded-[2rem] bg-zinc-50 p-8 ring-1 ring-zinc-100 sm:p-12">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">Vaste corridors</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl">
              Rechtstreeks tussen de landen.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {corridorRoutes.map((r) => (
              <Link
                key={r.slug}
                href={`/routes/${r.slug}`}
                className="group flex items-center gap-3 rounded-2xl bg-white px-5 py-4 ring-1 ring-zinc-100 transition-colors hover:ring-zinc-950"
              >
                <Image src={flagAsset[r.from!.flag]} alt={r.from!.name} width={40} height={40} className="h-8 w-auto flex-none" />
                <Icon name="route" className="size-4 flex-none text-zinc-400" />
                <Image src={flagAsset[r.to!.flag]} alt={r.to!.name} width={40} height={40} className="h-8 w-auto flex-none" />
                <span className="ml-1 flex-1 text-sm font-medium text-zinc-950">{r.from!.name} → {r.to!.name}</span>
                <svg className="size-4 flex-none text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <QuoteCta />
    </PageShell>
  );
}
