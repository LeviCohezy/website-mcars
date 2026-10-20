import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/app/contact/contact-form";
import ContactGlyph from "@/app/contact/glyph";
import { contactMethods, contactPhotos, isExternal, mapsEmbedSrc } from "@/app/contact/methods";
import { site } from "@/lib/site";
import { Reveal } from "./scroll";
import { V2Arrow, V2Block, V2Head, V2Hero } from "./v2-kit";

/*
 * Contact 02 — "Licht & strak". A Swiss grid of bordered contact cells (each
 * cell is one big tap target), then the message form beside the map.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export default function ContactV2() {
  return (
    <div className="bg-white text-zinc-950">
      <V2Hero
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
        title="Liever rechtstreeks contact?"
        count={pad(contactMethods.length)}
        intro="Bel, mail of app ons — of laat hieronder een bericht achter. We antwoorden persoonlijk, snel en zonder verplichting."
      />

      {/* 01 · Contact cells */}
      <section className="px-5 sm:px-12 lg:px-16">
        <ul className="grid gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
          {contactMethods.map((m, i) => {
            const inner = (
              <>
                <span className="flex items-center justify-between text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase group-hover:text-white/60">
                  <span className="flex gap-3">
                    <span className="text-zinc-950 group-hover:text-white">{pad(i + 1)}</span>
                    {m.label}
                  </span>
                  <span className="flex size-10 items-center justify-center rounded-md border border-zinc-200 text-zinc-950 group-hover:border-white/20 group-hover:text-white">
                    <ContactGlyph id={m.id} className="size-[1.125rem]" />
                  </span>
                </span>
                <span className="mt-auto block pt-12">
                  <span className="block text-2xl leading-tight font-medium tracking-tight break-words sm:text-[1.65rem]">{m.value}</span>
                  {m.sub && <span className="mt-2 block text-[0.95rem] leading-relaxed text-zinc-500 group-hover:text-white/60">{m.sub}</span>}
                  {m.action && (
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                      {m.action} <V2Arrow className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  )}
                </span>
              </>
            );
            const cls = "group flex h-full min-h-64 flex-col bg-white p-6 sm:p-8";
            return (
              <Reveal as="li" key={m.id} delay={i * 60}>
                {m.href ? (
                  <a
                    href={m.href}
                    target={isExternal(m.href) ? "_blank" : undefined}
                    rel={isExternal(m.href) ? "noopener noreferrer" : undefined}
                    className={`${cls} transition-colors hover:bg-zinc-950 hover:text-white`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </Reveal>
            );
          })}
          <Reveal as="li" delay={contactMethods.length * 60}>
            <Link href="/offerte" className="group flex h-full min-h-64 flex-col bg-zinc-950 p-6 text-white transition-colors hover:bg-zinc-800 sm:p-8">
              <span className="text-xs font-medium tracking-[0.18em] text-white/50 uppercase">
                <span className="mr-3 text-white">{pad(contactMethods.length + 1)}</span>Offerte
              </span>
              <span className="mt-auto block pt-12">
                <span className="block text-2xl leading-tight font-medium tracking-tight sm:text-[1.65rem]">Prijs en planning nodig?</span>
                <span className="mt-2 block text-[0.95rem] leading-relaxed text-white/60">Vraag een vrijblijvende offerte aan — binnen 24 uur antwoord.</span>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                  Offerte aanvragen <V2Arrow className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </Reveal>
        </ul>
      </section>

      {/* Photo strip — the people who answer */}
      <section className="mt-3 px-5 sm:px-12 lg:px-16">
        <Reveal className="relative h-64 overflow-hidden rounded-lg bg-zinc-950 sm:h-80 lg:h-[26rem]">
          <Image src={contactPhotos.desk.src} alt={contactPhotos.desk.alt} fill sizes="100vw" className="object-cover" />
          <span className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-1.5 text-xs font-medium tracking-[0.14em] text-zinc-950 uppercase">
            Rechtstreeks een planner aan de lijn
          </span>
        </Reveal>
      </section>

      {/* 02 · Form + map */}
      <V2Block>
        <V2Head index="02" label="Bericht & locatie" lead="Laat iets van u horen." trail="Of kom langs in Roeselare." />
        <div className="grid gap-3 lg:grid-cols-2">
          <Reveal className="rounded-lg border border-zinc-200 p-6 sm:p-10">
            <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">Stuur een bericht</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-zinc-500">
              Zoekt u een concrete prijs en planning? Vraag dan meteen een{" "}
              <Link href="/offerte" className="text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950">
                vrijblijvende offerte
              </Link>{" "}
              aan.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={100} className="flex flex-col overflow-hidden rounded-lg border border-zinc-200">
            <iframe
              title={`Locatie van ${site.name} op Google Maps`}
              src={mapsEmbedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="min-h-[22rem] w-full flex-1 border-0 grayscale"
            />
            <dl className="grid border-t border-zinc-200 sm:grid-cols-2">
              <div className="p-6">
                <dt className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">Depot</dt>
                <dd className="mt-2 font-medium tracking-tight">
                  {site.address.street}
                  <span className="block font-normal text-zinc-500">{site.address.city}, {site.address.country}</span>
                </dd>
              </div>
              <div className="border-t border-zinc-200 p-6 sm:border-t-0 sm:border-l">
                <dt className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">Openingsuren</dt>
                <dd className="mt-2 font-medium tracking-tight">
                  {site.hours}
                  <span className="block text-sm font-normal text-zinc-500">{site.hoursNote}</span>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </V2Block>
    </div>
  );
}
