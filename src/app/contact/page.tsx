import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import Icon from "@/components/icon";
import type { IconKey } from "@/data/services";
import { site } from "@/lib/site";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact | Mcars",
  description:
    "Liever rechtstreeks contact? Bel, mail of app Mcars. Bekijk onze openingsuren, ons depot in Roeselare en neem vrijblijvend contact op voor uw autotransport.",
};

type Method = {
  icon: IconKey;
  label: string;
  value: string;
  sub?: string;
  href?: string;
};

const methods: Method[] = [
  {
    icon: "phone",
    label: "Telefoon",
    value: site.phone,
    sub: "Rechtstreeks een chauffeur of planner aan de lijn.",
    href: site.phoneHref,
  },
  {
    icon: "route",
    label: "WhatsApp",
    value: "Stuur ons een bericht",
    sub: "Snel een foto of vraag doorsturen? App ons gerust.",
    href: site.whatsapp,
  },
  {
    icon: "check",
    label: "E-mail",
    value: site.email,
    sub: "Uw aanvraag wordt persoonlijk beantwoord binnen 24 uur.",
    href: `mailto:${site.email}`,
  },
  {
    icon: "map",
    label: "Adres & regio",
    value: `${site.address.street}, ${site.address.city}`,
    sub: `${site.address.country} — depot & standplaats van onze vloot.`,
  },
  {
    icon: "clock",
    label: "Openingsuren",
    value: site.hours,
    sub: site.hoursNote,
  },
];

export default function ContactPage() {
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    site.address.mapsQuery
  )}&output=embed`;

  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title="Liever rechtstreeks contact?"
        subtitle="Bel, mail of app ons — of laat hieronder uw gegevens achter. We denken graag met u mee en antwoorden persoonlijk, snel en zonder verplichting."
        crumbs={[{ label: "Contact" }]}
        image="/fleet/depot-dusk.jpg"
      />

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          {/* LEFT — contact form */}
          <div>
            <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">
              Stuur een bericht
            </p>
            <h2 className="mt-3 text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl">
              <span className="text-zinc-950">Laat iets van u horen. </span>
              <span className="text-zinc-400">Wij nemen contact op.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-500">
              Vul het formulier in en we bezorgen u een persoonlijk antwoord. Zoekt u een
              concrete prijs en planning? Vraag dan meteen een{" "}
              <Link
                href="/offerte"
                className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600"
              >
                vrijblijvende offerte
              </Link>{" "}
              aan.
            </p>

            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          {/* RIGHT — contact methods */}
          <div className="flex flex-col gap-4">
            {methods.map((m) => {
              const inner = (
                <>
                  <span className="flex size-11 flex-none items-center justify-center rounded-2xl bg-white text-zinc-950 shadow-sm transition-colors group-hover:bg-zinc-950 group-hover:text-white">
                    <Icon name={m.icon} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">
                      {m.label}
                    </p>
                    <p className="mt-1 truncate text-lg font-semibold text-zinc-950">
                      {m.value}
                    </p>
                    {m.sub && (
                      <p className="mt-1 text-sm leading-relaxed text-zinc-500">{m.sub}</p>
                    )}
                  </div>
                </>
              );

              const cardClass =
                "group flex items-start gap-4 rounded-3xl bg-zinc-100 p-6 ring-1 ring-transparent transition-colors";

              return m.href ? (
                <a
                  key={m.label}
                  href={m.href}
                  target={m.href.startsWith("http") ? "_blank" : undefined}
                  rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`${cardClass} hover:bg-white hover:ring-zinc-200`}
                >
                  {inner}
                </a>
              ) : (
                <div key={m.label} className={cardClass}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="mb-6">
          <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">
            Waar u ons vindt
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl">
            {site.address.street}, {site.address.city}
          </h2>
        </div>
        <div className="overflow-hidden rounded-[2rem] ring-1 ring-zinc-200">
          <iframe
            title={`Locatie van ${site.name} op Google Maps`}
            src={mapsSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[420px] w-full border-0"
          />
        </div>
      </section>
    </PageShell>
  );
}
