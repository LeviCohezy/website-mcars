import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { Eyebrow, SectionHeader } from "@/components/ui";
import { site } from "@/lib/site";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact | Mcars",
  description:
    "Liever rechtstreeks contact? Bel, mail of app Mcars. Bekijk onze openingsuren, ons depot in Roeselare en neem vrijblijvend contact op voor uw autotransport.",
};

type Method = { label: string; value: string; sub?: string; href?: string };

const methods: Method[] = [
  { label: "Telefoon", value: site.phone, sub: "Rechtstreeks een planner aan de lijn.", href: site.phoneHref },
  { label: "WhatsApp", value: "Stuur een bericht", sub: "Snel een foto of vraag doorsturen.", href: site.whatsapp },
  { label: "E-mail", value: site.email, sub: "Persoonlijk antwoord binnen 24 uur.", href: `mailto:${site.email}` },
  { label: "Depot", value: `${site.address.street}, ${site.address.city}`, sub: `${site.address.country} — standplaats van onze vloot.` },
  { label: "Openingsuren", value: site.hours, sub: site.hoursNote },
];

export default function ContactPage() {
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.address.mapsQuery)}&output=embed`;

  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title="Liever rechtstreeks contact?"
        subtitle="Bel, mail of app ons — of laat hieronder een bericht achter. We antwoorden persoonlijk, snel en zonder verplichting."
        crumbs={[{ label: "Contact" }]}
        image="/fleet/depot-dusk.jpg"
        badges={[{ label: site.phone }, { label: site.hours }]}
      />

      <Section space="loose">
        <div className="grid gap-16 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Reveal>
            <Eyebrow>Rechtstreeks</Eyebrow>
          </Reveal>
          <div className="grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            {/* Methods */}
            <ul className="border-t border-zinc-950">
              {methods.map((m, i) => {
                const value = <span className="mt-2 block text-xl font-medium tracking-tight text-zinc-950 sm:text-2xl">{m.value}</span>;
                return (
                  <Reveal as="li" key={m.label} delay={i * 60} className="border-b border-zinc-200 py-6">
                    <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{m.label}</p>
                    {m.href ? (
                      <a
                        href={m.href}
                        target={m.href.startsWith("http") ? "_blank" : undefined}
                        rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="group inline-flex items-end gap-3"
                      >
                        {value}
                        <svg className="mb-1.5 size-4 text-zinc-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg>
                      </a>
                    ) : (
                      value
                    )}
                    {m.sub && <p className="mt-1.5 text-sm text-zinc-500">{m.sub}</p>}
                  </Reveal>
                );
              })}
            </ul>

            {/* Form */}
            <Reveal delay={100}>
              <h2 className="text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl">
                Laat iets van u horen. <span className="text-zinc-400">Wij nemen contact op.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-zinc-500">
                Zoekt u een concrete prijs en planning? Vraag dan meteen een{" "}
                <Link href="/offerte" className="text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950">
                  vrijblijvende offerte
                </Link>{" "}
                aan.
              </p>
              <div className="mt-10">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section space="none">
        <SectionHeader label="Waar u ons vindt" lead={site.address.street} trail={site.address.city} className="mb-10" />
      </Section>
      <Section space="none" bleed>
        <div className="overflow-hidden rounded-[2rem] bg-zinc-100">
          <iframe
            title={`Locatie van ${site.name} op Google Maps`}
            src={mapsSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[480px] w-full border-0 grayscale"
          />
        </div>
      </Section>
    </PageShell>
  );
}
