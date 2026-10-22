import Image from "next/image";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { HighlightGrid, StatRow, QuoteCta } from "@/components/blocks";
import { Parallax, Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { Eyebrow, SectionHeader } from "@/components/ui";
import type { Highlight } from "@/data/services";

export const metadata = {
  title: "Over ons | Mcars",
  description:
    "Mcars vervoert wagens met korte lijnen en een familiale, persoonlijke aanpak. Ontdek ons verhaal sinds 2009, ons team van 8 chauffeurs en onze vloot van 9 autotransporters.",
};

const whyItems: Highlight[] = [
  {
    icon: "users",
    title: "Persoonlijk & familiaal",
    body: "Geen callcenter, geen nummers. U spreekt rechtstreeks met het team dat uw wagen ook effectief vervoert.",
  },
  {
    icon: "shield",
    title: "Betrouwbaar & verzekerd",
    body: "Elke rit met CMR-vrachtbrief en verzekerd transport. Duidelijke afspraken, correct nagekomen.",
  },
  {
    icon: "phone",
    title: "Spontaan, keep it simple",
    body: "Snel schakelen zonder gedoe. U vraagt aan, u krijgt binnen 24 uur een helder antwoord met prijs en planning.",
  },
  {
    icon: "route",
    title: "Transparant",
    body: "U weet steeds waar u aan toe bent. Geen verborgen kosten, geen verrassingen onderweg.",
  },
];

const fleet = [
  { name: "Mercedes Actros", count: "6×", note: "Kässbohrer-opbouw" },
  { name: "Scania Next Gen", count: "2×", note: "Kässbohrer-opbouw" },
  { name: "Scania Streamline", count: "1×", note: "Kässbohrer-opbouw" },
];

const countries = [
  { name: "België", flag: "/countryflags/truck-flag-belgie.png" },
  { name: "Nederland", flag: "/countryflags/truck-flag-nederland.png" },
  { name: "Frankrijk", flag: "/countryflags/truck-flag-frankrijk.png" },
  { name: "Spanje", flag: "/countryflags/truck-flag-spanje.png" },
  { name: "Duitsland", flag: "/countryflags/truck-flag-duitsland.png" },
  { name: "Italië", flag: "/countryflags/truck-flag-italie.png" },
];

const extraCountries = ["Polen", "Denemarken", "Noorwegen", "Zweden", "Finland"];

export default function OverOnsPage() {
  return (
    <PageShell>
      <PageHero
        size="full"
        eyebrow="Over ons"
        title="Autotransport met korte lijnen, sinds 2009."
        subtitle="Een familiaal transportbedrijf uit Roeselare met een persoonlijke aanpak, ±20 jaar ervaring en klanten die telkens terugkomen."
        crumbs={[{ label: "Over ons" }]}
        image="/fleet/valley-sunset.jpg"
        badges={[{ label: "Familiebedrijf" }, { label: "Roeselare, België" }]}
        primaryCta={{ label: "Offerte", href: "/offerte" }}
      />

      {/* Story */}
      <Section space="loose">
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
          <Reveal>
            <Eyebrow>Wie zijn we</Eyebrow>
          </Reveal>
          <div>
            <Reveal>
              <h2 className="max-w-4xl text-3xl font-light leading-[1.15] tracking-[-0.025em] text-balance text-zinc-950 sm:text-4xl lg:text-[3.25rem]">
                Een familiebedrijf dat autotransport door en door kent. <span className="text-zinc-400">Wie één keer met Mcars rijdt, blijft.</span>
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-8 text-base leading-relaxed text-zinc-600 sm:grid-cols-2 sm:gap-10">
              <Reveal>
                <p>
                  Mcars werd opgericht in 2009, maar het verhaal begon vroeger: oprichter Filip Maertens laadde zijn eerste auto&apos;s al in 2004. Sindsdien bouwden we bijna twintig jaar ervaring op in het veilig vervoeren van voertuigen — voor particulieren én bedrijven.
                </p>
              </Reveal>
              <Reveal delay={80}>
                <p>
                  We houden het bewust persoonlijk. Bij ons spreekt u rechtstreeks met het team, niet met een anoniem callcenter. Ervaring betekent bij ons vooral rust: we weten hoe we een oldtimer zacht laden en hoe we een strakke planning heel Europa door waarmaken.
                </p>
              </Reveal>
            </div>
            <Reveal delay={120} className="mt-14 border-t border-zinc-200 pt-8">
              <StatRow
                items={[
                  { value: "2009", label: "Opgericht" },
                  { value: "9", label: "Eigen autotransporters" },
                  { value: "8", label: "Vaste chauffeurs" },
                  { value: "20+", label: "Jaar ervaring" },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Photo pair */}
      <Section space="none" bleed>
        <div className="grid gap-2 lg:grid-cols-[1.5fr_1fr]">
          <Reveal className="relative h-[46vh] overflow-hidden rounded-[2rem] sm:h-[68vh]">
            <Parallax speed={0.06} className="absolute inset-x-0 -top-[15%] h-[130%]">
              <Image src="/fleet/dramatic-sky.jpg" alt="Mcars autotransporter onderweg" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </Parallax>
          </Reveal>
          <Reveal delay={100} className="relative h-[46vh] overflow-hidden rounded-[2rem] sm:h-[68vh]">
            <Parallax speed={0.06} className="absolute inset-x-0 -top-[15%] h-[130%]">
              <Image src="/fleet/sunset-parking.jpg" alt="De vloot van Mcars op het depot" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </Parallax>
          </Reveal>
        </div>
      </Section>

      {/* Fleet */}
      <Section space="loose">
        <SectionHeader
          label="Team & vloot"
          index="01"
          lead="Eigen vloot,"
          trail="vaste chauffeurs."
          intro="Negen eigen autotransporters, allemaal met Kässbohrer-opbouw. Acht vaste chauffeurs kennen hun vrachtwagen, hun routes en uw wagen — Nederlandstalig én Franstalig, zodat we overal vlot uit de voeten kunnen."
          className="mb-14"
        />
        <div className="grid lg:grid-cols-[1fr_3fr] lg:gap-10">
          <div className="hidden lg:block" />
          <table className="w-full border-t border-zinc-950 text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">
                <th className="py-4 font-medium">Model</th>
                <th className="hidden py-4 font-medium sm:table-cell">Opbouw</th>
                <th className="py-4 text-right font-medium">Aantal</th>
              </tr>
            </thead>
            <tbody>
              {fleet.map((f) => (
                <tr key={f.name} className="border-b border-zinc-200">
                  <td className="py-6 text-xl font-medium tracking-tight text-zinc-950 sm:text-2xl">{f.name}</td>
                  <td className="hidden py-6 text-zinc-500 sm:table-cell">{f.note}</td>
                  <td className="py-6 text-right text-3xl font-medium tracking-tight tabular-nums text-zinc-950 sm:text-4xl">{f.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Area */}
      <Section space="flush-top">
        <SectionHeader
          label="Werkgebied"
          index="02"
          lead="Elke week over heel Frankrijk,"
          trail="en verder door Europa."
          intro="Onze niche ligt op de as van België en Nederland richting Frankrijk, tot in Noord-Spanje — met vaste stops in de stockageparken. Daarnaast zijn we actief in Duitsland, Italië, Polen en tot in Scandinavië."
          className="mb-14"
        />
        <div className="grid lg:grid-cols-[1fr_3fr] lg:gap-10">
          <div className="hidden lg:block" />
          <div>
            <ul className="grid grid-cols-2 border-t border-zinc-950 sm:grid-cols-3">
              {countries.map((c, i) => (
                <Reveal as="li" key={c.name} delay={i * 50} className="flex items-center gap-4 border-b border-zinc-200 py-5 pr-4">
                  <Image src={c.flag} alt="" width={120} height={80} className="h-9 w-auto" />
                  <span className="text-lg font-medium tracking-tight text-zinc-950">{c.name}</span>
                </Reveal>
              ))}
            </ul>
            <p className="mt-6 text-sm text-zinc-500">
              Ook actief in {extraCountries.join(", ")}. Een andere bestemming? Vraag het gerust — we staan open voor nieuwe routes.
            </p>
          </div>
        </div>
      </Section>

      {/* Insured */}
      <Section space="none" bleed>
        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-6 py-16 sm:px-10 sm:py-24 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-[1fr_3fr] lg:gap-10">
            <Reveal>
              <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/60 uppercase">
                <span aria-hidden className="size-1.5 rounded-full bg-white" />
                Verzekerd transport
              </p>
            </Reveal>
            <div>
              <Reveal>
                <h2 className="max-w-3xl text-3xl font-light leading-[1.08] tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-6xl">
                  Uw wagen reist <span className="text-white/45">gedekt en gedocumenteerd.</span>
                </h2>
              </Reveal>
              <ul className="mt-14 grid gap-10 sm:grid-cols-3">
                {[
                  { t: "Verzekerd transport", b: "Elk voertuig is gedekt tijdens het volledige traject." },
                  { t: "CMR-vrachtbrief", b: "Bevestigt de ophaling en legt de staat bij vertrek vast." },
                  { t: "Intern fotobewijs", b: "Foto's als bewijsstuk bij schade — zorgvuldig en discreet bewaard." },
                ].map((it, i) => (
                  <Reveal as="li" key={it.t} delay={i * 80} className="border-t border-white/20 pt-6">
                    <span className="text-xs font-medium tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-6 text-xl font-medium tracking-tight text-white">{it.t}</p>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-white/55">{it.b}</p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Why */}
      <Section space="loose">
        <SectionHeader
          label="Waarom Mcars"
          index="03"
          lead="Vier redenen"
          trail="die klanten telkens aanhalen."
          className="mb-16"
        />
        <HighlightGrid items={whyItems} />
      </Section>

      <QuoteCta image="/fleet/sunset-field.jpg" />
    </PageShell>
  );
}
