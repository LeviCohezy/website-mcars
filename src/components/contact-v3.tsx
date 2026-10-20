import Link from "next/link";
import ContactForm from "@/app/contact/contact-form";
import ContactGlyph from "@/app/contact/glyph";
import { contactMethods, contactPhotos, isExternal, mapsEmbedSrc } from "@/app/contact/methods";
import { site } from "@/lib/site";
import HeroQuoteBar from "./hero-quote-bar";
import { Reveal } from "./scroll";
import { MosaicGallery } from "./signature";
import { V3Arrow, V3Block, V3Head, V3Hero, V3Page, V3Star } from "./v3-kit";

/*
 * Contact 03 — "Donker & premium". Centred hero with the phone number as the
 * headline figure, a dark band with an inline quick-quote strip and stats,
 * oversized contact rows, the form on black, a photo mosaic of the depot
 * and a dimmed map.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export default function ContactV3() {
  return (
    <V3Page>
      <V3Hero
        short
        image={contactPhotos.hero.src}
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
        title="Liever rechtstreeks contact?"
        intro="Bel, mail of app ons — we antwoorden persoonlijk, snel en zonder verplichting."
      >
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={site.phoneHref} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
            <ContactGlyph id="telefoon" className="size-4" /> {site.phone}
          </a>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/60">
            <ContactGlyph id="whatsapp" className="size-4" /> WhatsApp
          </a>
        </div>
      </V3Hero>

      {/* Dark band — inline quick-quote strip + stats */}
      <section className="px-5 pb-16 sm:px-10 sm:pb-24 lg:px-14">
        <Reveal className="rounded-2xl border border-white/10 bg-zinc-900 p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-xl font-light tracking-[-0.02em] sm:text-2xl">Liever meteen een prijs? <span className="text-white/40">Start hier uw offerte.</span></p>
            <p className="text-sm text-white/50">Binnen 24 uur persoonlijk antwoord</p>
          </div>
          <HeroQuoteBar className="mt-6 !max-w-none" />
          <dl className="mt-8 grid grid-cols-3 border-t border-white/10">
            {[
              { v: String(site.founded), k: "actief sinds" },
              { v: site.reviews.clients, k: "klanten" },
              { v: site.reviews.score, k: "op Google", star: true },
            ].map((s, i) => (
              <div key={s.k} className={`flex flex-col-reverse pt-6 ${i > 0 ? "border-l border-white/10 pl-4 sm:pl-8" : "pr-4"}`}>
                <dt className="mt-2 flex items-center gap-1.5 text-xs text-white/50 sm:text-sm">{s.star && <V3Star />}{s.k}</dt>
                <dd className="text-3xl font-light tracking-[-0.04em] tabular-nums sm:text-5xl lg:text-6xl">{s.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Oversized contact rows */}
      <V3Block className="pt-0 sm:pt-0">
        <V3Head label="Rechtstreeks" lead="Kies wat u het" trail="beste uitkomt." />
        <ul className="border-b border-white/10">
          {contactMethods.map((m, i) => {
            const inner = (
              <>
                <span className="text-sm text-white/30 tabular-nums">{pad(i + 1)}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-xs tracking-[0.2em] text-white/50 uppercase">
                    <ContactGlyph id={m.id} className="size-4 text-white/70" /> {m.label}
                  </span>
                  <span className="mt-3 block text-2xl leading-tight font-light tracking-[-0.03em] break-words sm:text-4xl lg:text-5xl">{m.value}</span>
                  {m.sub && <span className="mt-2 block text-[0.95rem] text-white/50">{m.sub}</span>}
                </span>
                {m.href ? (
                  <span className="flex size-11 flex-none items-center justify-center rounded-full border border-white/25 transition-colors group-hover:bg-white group-hover:text-zinc-950">
                    <V3Arrow />
                  </span>
                ) : (
                  <span aria-hidden className="size-11" />
                )}
              </>
            );
            const cls = "group grid grid-cols-[2rem_1fr_auto] items-center gap-4 py-7 sm:grid-cols-[4rem_1fr_auto] sm:gap-8 sm:py-9";
            return (
              <Reveal as="li" key={m.id} className="border-t border-white/10">
                {m.href ? (
                  <a
                    href={m.href}
                    target={isExternal(m.href) ? "_blank" : undefined}
                    rel={isExternal(m.href) ? "noopener noreferrer" : undefined}
                    aria-label={m.action ? `${m.action}: ${m.value}` : undefined}
                    className={`${cls} transition-colors hover:bg-white/[0.03]`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </V3Block>

      {/* Form on black */}
      <V3Block className="bg-zinc-900">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <V3Head label="Bericht" lead="Laat iets van u horen." trail="Wij nemen contact op." />
            <Reveal className="-mt-4 max-w-md text-base leading-relaxed text-white/55">
              Vertel ons kort wat u nodig heeft. Zoekt u een concrete prijs en planning? Vraag dan meteen een{" "}
              <Link href="/offerte" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">vrijblijvende offerte</Link> aan.
            </Reveal>
          </div>
          <Reveal delay={100}>
            <ContactForm tone="dark" />
          </Reveal>
        </div>
      </V3Block>

      {/* The depot and the team, before the map */}
      <V3Block>
        <V3Head label="Ons depot" lead="Kom gerust langs" trail="in Roeselare." />
        <MosaicGallery
          tone="dark"
          images={[
            { title: "Het depot", image: contactPhotos.hero.src, alt: contactPhotos.hero.alt },
            { title: "Planning", image: contactPhotos.desk.src, alt: contactPhotos.desk.alt },
            { title: "Ons team", image: "/images/generated/team-depot.jpg", alt: "Het team van Mcars op het depot" },
            { title: "De vloot", image: "/fleet/sunset-parking.jpg", alt: "Transporters van Mcars geparkeerd bij zonsondergang" },
          ]}
          figure={{ value: String(site.founded), label: "Actief sinds", body: `${site.address.street}, ${site.address.city}` }}
        />
      </V3Block>

      {/* Map */}
      <section className="relative">
        <iframe
          title={`Locatie van ${site.name} op Google Maps`}
          src={mapsEmbedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[26rem] w-full border-0 [filter:grayscale(1)_invert(0.92)_contrast(0.9)] sm:h-[32rem]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-10">
          <div className="pointer-events-auto max-w-sm rounded-2xl border border-white/10 bg-zinc-950/85 p-6 backdrop-blur-md">
            <p className="text-xs tracking-[0.2em] text-white/50 uppercase">Depot</p>
            <p className="mt-2 text-lg font-medium tracking-tight">{site.address.street}</p>
            <p className="text-white/60">{site.address.city}, {site.address.country}</p>
            <p className="mt-4 text-sm text-white/60">{site.hours}</p>
          </div>
        </div>
      </section>
    </V3Page>
  );
}
