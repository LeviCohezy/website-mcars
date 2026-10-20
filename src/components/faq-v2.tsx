"use client";

import { useEffect, useState } from "react";
import { faqGroups, faqTotal } from "@/data/faq";
import type { Faq } from "@/data/services";
import { site } from "@/lib/site";
import { Reveal } from "./scroll";
import { CollageStatement, TypeMarquee } from "./signature";
import { V2Arrow, V2Button, V2Hero } from "./v2-kit";

/*
 * FAQ 02 — "Licht & strak". Category index on the left (sticky on desktop,
 * horizontally scrolling chips on mobile), bordered accordions on the right.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export default function FaqV2() {
  const [active, setActive] = useState(faqGroups[0].id);

  // Scroll-spy: highlight the category whose block is in the upper part of the viewport.
  useEffect(() => {
    const els = faqGroups.map((g) => document.getElementById(g.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="bg-white text-zinc-950">
      <V2Hero
        crumbs={[{ href: "/", label: "Home" }, { label: "FAQ" }]}
        title="Veelgestelde vragen."
        count={pad(faqTotal)}
        intro="De meest gestelde vragen over autotransport, per onderwerp. Staat uw vraag er niet bij? We helpen u graag persoonlijk verder."
      />

      {/* Running topic band with photo pills */}
      <div className="pb-16 sm:pb-24">
        <TypeMarquee
          words={faqGroups.map((g) => g.label)}
          images={["/images/generated/planning-office.jpg", "/images/generated/strap-closeup.jpg", "/images/generated/pickup-inspection.jpg", "/fleet/germany-autobahn.jpg"]}
          speed={55}
        />
      </div>

      <section className="px-5 pb-20 sm:px-12 sm:pb-32 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_3fr] lg:gap-10">
          {/* Category index — chips rail on mobile, sticky list on desktop */}
          <nav aria-label="Onderwerpen" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <p className="hidden text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase lg:block">Onderwerpen</p>
            <ul className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-12 sm:px-12 lg:mx-0 lg:mt-5 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-zinc-200 lg:px-0 lg:pb-0">
              {faqGroups.map((g, i) => {
                const on = active === g.id;
                return (
                  <li key={g.id} className="flex-none snap-start lg:border-b lg:border-zinc-200">
                    <a
                      href={`#${g.id}`}
                      aria-current={on ? "true" : undefined}
                      className={`flex min-h-11 items-center gap-3 rounded-lg border px-4 py-2 text-sm whitespace-nowrap transition-colors lg:rounded-none lg:border-0 lg:px-0 lg:py-3.5 ${
                        on ? "border-zinc-950 bg-zinc-950 text-white lg:bg-transparent lg:text-zinc-950" : "border-zinc-200 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950"
                      }`}
                    >
                      <span className={`text-xs tabular-nums ${on ? "text-white/60 lg:text-zinc-950" : "text-zinc-400"}`}>{pad(i + 1)}</span>
                      <span className={`lg:flex-1 ${on ? "lg:font-medium" : ""}`}>{g.label}</span>
                      <span className={`hidden text-xs tabular-nums lg:inline ${on ? "text-zinc-950" : "text-zinc-400"}`}>({g.items.length})</span>
                      <span aria-hidden className={`hidden size-1.5 rounded-full bg-zinc-950 transition-opacity lg:block ${on ? "opacity-100" : "opacity-0"}`} />
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 hidden rounded-lg border border-zinc-200 p-5 lg:block">
              <p className="text-sm text-zinc-500">Staat uw vraag er niet bij?</p>
              <a href={site.phoneHref} className="mt-2 block text-lg font-medium tracking-tight hover:underline">{site.phone}</a>
              <a href={`mailto:${site.email}`} className="mt-0.5 block text-sm text-zinc-600 hover:text-zinc-950">{site.email}</a>
            </div>
          </nav>

          {/* Groups */}
          <div className="flex min-w-0 flex-col gap-16 sm:gap-20">
            {faqGroups.map((g, i) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-28">
                <Reveal className="mb-6 flex items-end justify-between gap-6 border-t border-zinc-950 pt-5">
                  <div>
                    <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">
                      <span className="text-zinc-950">{pad(i + 1)}</span> · {g.label}
                    </p>
                    <h2 id={`${g.id}-title`} className="mt-3 text-3xl leading-[1.08] font-medium tracking-[-0.025em] text-balance sm:text-4xl">
                      {g.title} <span className="text-zinc-400">{g.trail}</span>
                    </h2>
                  </div>
                  <span className="hidden flex-none text-sm text-zinc-400 tabular-nums sm:block">{g.items.length} vragen</span>
                </Reveal>
                <BorderedAccordion items={g.items} defaultOpen={i === 0 ? 0 : null} />
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* Still a question — statement + photos, contact cells underneath */}
      <section className="px-5 pb-8 sm:px-12 lg:px-16">
        <div className="mb-12 grid gap-6 border-t border-zinc-950 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">Nog een vraag?</p>
          <h2 className="max-w-3xl text-3xl leading-[1.08] font-medium tracking-[-0.025em] text-balance sm:text-4xl lg:text-5xl">
            Staat uw vraag er niet bij? <span className="text-zinc-400">Wij helpen u persoonlijk.</span>
          </h2>
        </div>
        <CollageStatement
          radius="rounded-md"
          statement="Bel, stuur een bericht of mail — u krijgt antwoord van iemand die uw transport ook effectief inplant."
          images={[
            { title: "Klantcontact", image: "/images/generated/customer-update.jpg", alt: "Een medewerker van Mcars belt een klant" },
            { title: "Depot", image: "/fleet/depot-dusk.jpg", alt: "Het depot van Mcars in de avond" },
            { title: "Overhandiging", image: "/images/generated/key-handover.jpg", alt: "Een chauffeur overhandigt de sleutels" },
          ]}
        >
          <div className="grid gap-px overflow-hidden rounded-md border border-zinc-200 bg-zinc-200">
            {[
              { k: "Bel ons", v: site.phone, href: site.phoneHref },
              { k: "WhatsApp", v: "Stuur een bericht", href: site.whatsapp },
              { k: "E-mail", v: site.email, href: `mailto:${site.email}` },
            ].map((c) => (
              <a
                key={c.k}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex min-h-16 items-center justify-between gap-6 bg-white px-5 py-4 transition-colors hover:bg-zinc-950 hover:text-white"
              >
                <span className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase group-hover:text-white/60">{c.k}</span>
                <span className="flex items-center gap-3 text-base font-medium tracking-tight break-all">
                  {c.v}
                  <V2Arrow className="size-4 flex-none" />
                </span>
              </a>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <V2Button href="/offerte">Offerte aanvragen</V2Button>
            <V2Button href="/contact" variant="outline">Contactpagina</V2Button>
          </div>
        </CollageStatement>
      </section>
    </div>
  );
}

function BorderedAccordion({ items, defaultOpen = null }: { items: Faq[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className={i > 0 ? "border-t border-zinc-200" : ""}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`flex min-h-11 w-full items-start gap-4 px-5 py-5 text-left transition-colors sm:gap-6 sm:px-6 ${isOpen ? "bg-zinc-50" : "hover:bg-zinc-50"}`}
            >
              <span className="w-6 flex-none pt-1 text-xs font-medium text-zinc-400 tabular-nums">{pad(i + 1)}</span>
              <span className="flex-1 text-lg font-medium tracking-tight">{f.q}</span>
              <span className={`flex size-7 flex-none items-center justify-center rounded-md border transition-colors ${isOpen ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 text-zinc-500"}`}>
                <svg className={`size-3.5 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="max-w-2xl px-5 pb-6 pl-[3.75rem] text-base leading-relaxed text-zinc-500 sm:pr-16 sm:pl-[4.5rem]">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
