import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { SectionHeader } from "@/components/ui";
import { services, type Service } from "@/data/services";

export const metadata: Metadata = {
  title: "Diensten — autotransport op maat | Mcars",
  description:
    "Van particulier transport tot fleet, import, export, oldtimers en spoed. Ontdek alle autotransportdiensten van Mcars in België en Europa.",
};

export default function DienstenOverview() {
  const [first, second, ...rest] = services;

  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow="Onze diensten"
        title="Voor elk voertuig de juiste aanpak."
        subtitle="Van één particuliere wagen tot een volledig wagenpark — transportoplossingen in België en heel Europa."
        crumbs={[{ label: "Diensten" }]}
        image="/fleet/sunset-parking.jpg"
        badges={[{ label: `${services.length} diensten` }, { label: "Eén aanspreekpunt" }]}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      <Section space="loose">
        <SectionHeader
          label="Overzicht"
          index={`${String(services.length).padStart(2, "0")}`}
          lead="Elf manieren om uw wagen te verplaatsen,"
          trail="één team dat het regelt."
          intro="Of het nu gaat om een gezinswagen, een voorraad voor de showroom of een klassieker die niet meer rijdt: u spreekt met de mensen die de rit ook effectief uitvoeren."
          className="mb-16"
        />

        <div className="grid gap-x-6 gap-y-14 lg:grid-cols-2">
          <ServiceCard service={first} index={0} large />
          <ServiceCard service={second} index={1} large />
        </div>
        <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((s, i) => (
            <ServiceCard key={s.slug} service={s} index={i + 2} />
          ))}
        </div>
      </Section>

      <QuoteCta />
    </PageShell>
  );
}

function ServiceCard({ service, index, large = false }: { service: Service; index: number; large?: boolean }) {
  return (
    <Reveal delay={(index % 3) * 80}>
      <Link href={`/diensten/${service.slug}`} className="group block">
        <div className={`relative overflow-hidden rounded-3xl bg-zinc-100 ${large ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
          <Image
            src={service.heroImage}
            alt={service.title}
            fill
            sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.04]"
          />
          <span className="absolute right-4 bottom-4 flex size-11 translate-y-2 items-center justify-center rounded-full bg-white text-zinc-950 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg>
          </span>
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-zinc-200 pt-4">
          <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{service.category}</p>
          <span className="text-xs font-medium tabular-nums text-zinc-400">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <h2 className={`mt-3 font-medium tracking-tight text-zinc-950 ${large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
          {service.nav}
        </h2>
        <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-zinc-500">{service.subtitle}</p>
      </Link>
    </Reveal>
  );
}
