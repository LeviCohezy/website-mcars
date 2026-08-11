import Image from "next/image";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { StatRow, QuoteCta } from "@/components/blocks";
import { Eyebrow, SplitHeading } from "@/components/ui";

export const metadata = {
  title: "Cases & realisaties | Mcars",
  description:
    "Een greep uit uitgevoerde transporten van Mcars: van oldtimerritten en importwagens tot niet-rijdende voertuigen en Europees bedrijfstransport. Anoniem, maar echt.",
};

type Case = {
  tag: string;
  title: string;
  body: string;
  image: string;
};

const cases: Case[] = [
  {
    tag: "Oldtimer & event",
    title: "Oldtimers naar de Sloveense kust en terug",
    body: "Voor een oldtimerrit haalden we in Antwerpen een reeks klassiekers op en brachten ze tot een hotel nabij de Kroatische grens. De wagens stonden klaar vóór de start. Na de vijfdaagse rit haalden we ze weer op en brachten ze veilig terug naar Antwerpen.",
    image: "/fleet/mountain-suvs.jpg",
  },
  {
    tag: "Dealertransport binnen België",
    title: "Acht wagens voor een handelaar, één sluitende planning",
    body: "Een handelaar uit West-Vlaanderen liet in één beweging zeven wagens ophalen in Tongeren en één in Asse. Door de adressen slim op onze route te leggen, reden we alles efficiënt in één transport tot bij de klant.",
    image: "/fleet/depot-dusk.jpg",
  },
  {
    tag: "Particulier · gesloten transport",
    title: "Een sportwagen die klaarstond na de vlucht",
    body: "Een particulier liet zijn sportwagen ophalen in Amsterdam en afleveren aan de luchthaven van Nice. Zo kon hij zorgeloos vliegen, wetende dat zijn wagen ter plaatse voor hem klaarstond bij aankomst.",
    image: "/fleet/actros-motion.jpg",
  },
  {
    tag: "Importwagen uit Duitsland",
    title: "Een buitenlands koopje veilig thuisgeleverd",
    body: "Een klant vond zijn wagen bij een Duitse verkoper. Wij haalden het voertuig rechtstreeks op, maakten de CMR op bij vertrek en leverden af tot bij de klant thuis — zonder dat die zelf de reis moest maken.",
    image: "/fleet/germany-autobahn.jpg",
  },
  {
    tag: "Niet-rijdende wagen",
    title: "Een stilstaand project van de oprit gehaald",
    body: "Een voertuig dat al een tijd stillag en niet meer startte, trokken we met de lier veilig op de laadvloer. Verrolbaar volstaat: geen draaiende motor nodig om het project op zijn nieuwe bestemming te krijgen.",
    image: "/fleet/depot-wet.jpg",
  },
  {
    tag: "Europees transport voor bedrijfsklant",
    title: "Wekelijkse ritten voor een vaste bedrijfsklant",
    body: "Voor een bedrijfsklant combineren we voertuigen op onze vaste Europese routes. Meerdere wagens per rit, één aanspreekpunt en facturatie achteraf — een terugkerende samenwerking op korte lijnen.",
    image: "/fleet/spain-skyline.jpg",
  },
];

export default function CasesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Realisaties"
        title="Uitgevoerde transporten."
        subtitle="Een greep uit ritten die we voor particulieren en bedrijven verzorgden — van klassiekers tot volledige handelaarsvoorraden. Anoniem, maar écht gereden."
        crumbs={[{ label: "Cases" }]}
        image="/fleet/city-loaded.jpg"
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* Case grid */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 max-w-2xl sm:mb-14">
          <Eyebrow className="mb-4">Cases</Eyebrow>
          <SplitHeading lead="Elke rit is anders," trail="de aanpak blijft dezelfde." />
          <p className="mt-6 text-base leading-relaxed text-zinc-500">
            Een selectie uitgevoerde transporten. Uit respect voor onze klanten
            houden we alle cases anoniem — geen namen, wel het echte verhaal.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <article
              key={c.title}
              className="group flex flex-col overflow-hidden rounded-3xl bg-zinc-100 transition-colors hover:bg-zinc-950"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.title}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 rounded-full bg-zinc-950/60 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                  {c.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-lg font-semibold text-zinc-950 transition-colors group-hover:text-white">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-300">
                  {c.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Impact strip */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="mb-8 max-w-xl">
          <Eyebrow className="mb-4">Impact</Eyebrow>
          <SplitHeading lead="Wat we dagelijks" trail="waarmaken." />
        </div>
        <StatRow
          items={[
            { value: "3000+", label: "tevreden klanten" },
            { value: "20+", label: "jaar ervaring" },
            { value: "Wekelijks", label: "in heel Frankrijk" },
          ]}
        />
      </section>

      <QuoteCta />
    </PageShell>
  );
}
