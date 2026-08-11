import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Diensten — autotransport op maat | Mcars",
  description:
    "Van particulier transport tot fleet, import, export, oldtimers en spoed. Ontdek alle autotransportdiensten van Mcars in België en Europa.",
};

export default function DienstenOverview() {
  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow="Onze diensten"
        title="Voor elk voertuig de juiste aanpak."
        subtitle="Van één particuliere wagen tot een volledig wagenpark — ontdek onze transportoplossingen in België en heel Europa."
        crumbs={[{ label: "Diensten" }]}
        image="/services/07.jpg"
        bigWord="DIENSTEN"
        scrollCue
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              href={`/diensten/${s.slug}`}
              className="group relative flex aspect-[4/5] flex-none overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:shadow-lg motion-safe:hover:shadow-zinc-950/15"
            >
              <Image
                src={s.heroImage}
                alt={s.title}
                width={640}
                height={800}
                className="absolute inset-0 size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
              />
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(9_9_11/0.85),rgb(9_9_11/0.35)_45%,rgb(9_9_11/0.05))]" />
              <span className="absolute top-6 left-6 text-sm font-medium text-white/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-medium tracking-widest text-white/60 uppercase">{s.category}</p>
                <h2 className="mt-1.5 text-xl font-semibold text-white uppercase sm:text-2xl">{s.nav}</h2>
                <p className="mt-1.5 line-clamp-2 text-sm text-white/80">{s.subtitle}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white">
                  Bekijk dienst
                  <span className="flex size-8 items-center justify-center rounded-full bg-white text-zinc-950">
                    <svg className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <QuoteCta />
    </PageShell>
  );
}
