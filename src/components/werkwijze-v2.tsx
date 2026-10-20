import Image from "next/image";
import Link from "next/link";
import { cmr, cmrIntro, stappen, werkwijze, werkwijzeFaq } from "@/data/process";
import { site } from "@/lib/site";
import Icon from "./icon";
import { BoxedFaq } from "./route-v2";
import { Reveal } from "./scroll";
import { CollageStatement, StackedCards } from "./signature";
import { V2Arrow, V2Block, V2Button, V2Check, V2Head, V2Hero } from "./v2-kit";

/*
 * Werkwijze 02 — "Licht & strak". White Swiss grid: light hero with a (06)
 * counter, the six steps as stacking photo cards, the CMR block as an airy
 * photo collage around a statement and a boxed FAQ. Same content as Werkwijze 01 (data/process).
 */

export default function WerkwijzeV2() {
  return (
    <div className="bg-white text-zinc-950">
      {/* 1 · Hero */}
      <V2Hero
        crumbs={[{ href: "/", label: "Home" }, { label: "Hoe werkt het" }]}
        title={werkwijze.title}
        intro={werkwijze.subtitle}
        count={String(stappen.length).padStart(2, "0")}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <V2Button href="/offerte">Offerte aanvragen</V2Button>
          {werkwijze.badges.map((b) => (
            <span key={b} className="inline-flex min-h-11 items-center gap-2.5 rounded-lg border border-zinc-200 px-4 text-sm text-zinc-700">
              <V2Check /> {b}
            </span>
          ))}
        </div>
      </V2Hero>

      {/* 2 · Photo strip */}
      <div className="px-5 sm:px-12 lg:px-16">
        <div className="relative h-64 overflow-hidden rounded-xl bg-zinc-950 sm:h-96 lg:h-[30rem]">
          <Image src={werkwijze.heroImage} alt="Een transporter van Mcars onderweg" fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>

      {/* 3 · Six steps — numbered hairline timeline */}
      <V2Block>
        <V2Head index="01" label="Zo werkt het" lead="Zes heldere stappen." trail="Van offerte tot levering." />
        <StackedCards
          tone="light"
          radius="rounded-lg"
          items={stappen.map((st) => ({ title: st.title, body: `${st.status} — ${st.body}`, image: st.image, alt: st.imageAlt }))}
        />
        <Reveal className="mt-3 flex flex-col items-start justify-between gap-4 rounded-xl bg-zinc-950 p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <p className="text-lg">Klaar voor stap 01? U krijgt binnen 24 uur een persoonlijk antwoord.</p>
          <Link href="/offerte" className="inline-flex min-h-11 flex-none items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
            Offerte aanvragen <V2Arrow />
          </Link>
        </Reveal>
      </V2Block>

      {/* 4 · CMR — photo cell beside three bordered rows */}
      <V2Block className="bg-zinc-100">
        <V2Head index="02" label="Waarom deze aanpak" lead="De CMR-vrachtbrief:" trail="uw zekerheid, zwart op wit." intro={cmrIntro} />
        <CollageStatement
          tone="light"
          radius="rounded-lg"
          eyebrow="Opgemaakt bij elke ophaling"
          statement="Eén document, zwart op wit: wat, wanneer en in welke staat uw wagen werd opgehaald."
          images={[
            { title: "", image: werkwijze.bandImage, alt: werkwijze.bandImageAlt },
            { title: "", image: "/fleet/depot-wet.jpg", alt: "Transporters van Mcars op het depot in Roeselare" },
            { title: "", image: "/images/generated/workshop.jpg", alt: "Een wagen in de werkplaats" },
          ]}
        >
          <ul className="border-t border-zinc-200">
            {cmr.map((h) => (
              <li key={h.title} className="grid grid-cols-[2.75rem_1fr] gap-4 border-b border-zinc-200 py-5">
                <span className="flex size-11 items-center justify-center rounded-md border border-zinc-200">
                  <Icon name={h.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-medium tracking-tight">{h.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-zinc-500">{h.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </CollageStatement>
      </V2Block>

      {/* 5 · FAQ */}
      <V2Block>
        <V2Head index="03" label="FAQ" lead="Nog vragen?" trail="Dit horen we het vaakst." />
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Reveal className="order-last lg:order-none">
            <p className="text-sm text-zinc-500">Staat uw vraag er niet bij?</p>
            <a href={site.phoneHref} className="mt-3 block text-2xl font-medium tracking-tight hover:underline">{site.phone}</a>
            <a href={`mailto:${site.email}`} className="mt-1 block break-words text-zinc-600 hover:text-zinc-950">{site.email}</a>
            <p className="mt-4 text-sm text-zinc-400">{site.hours}</p>
          </Reveal>
          <BoxedFaq items={werkwijzeFaq} />
        </div>
      </V2Block>
    </div>
  );
}
