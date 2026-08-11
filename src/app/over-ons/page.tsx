import Image from "next/image";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { HighlightGrid, StatRow, QuoteCta } from "@/components/blocks";
import { Eyebrow, SplitHeading, ArrowButton } from "@/components/ui";
import Icon from "@/components/icon";
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
        eyebrow="Over ons"
        title="Autotransport met korte lijnen, sinds 2009."
        subtitle="Een familiaal transportbedrijf uit Roeselare met een persoonlijke aanpak, ±20 jaar ervaring en klanten die telkens terugkomen."
        crumbs={[{ label: "Over ons" }]}
        image="/fleet/valley-sunset.jpg"
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* Wie zijn we? + ervaring */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <Eyebrow className="mb-4">Wie zijn we?</Eyebrow>
            <SplitHeading lead="Een familiebedrijf dat" trail="autotransport door en door kent." />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-500">
              <p>
                Mcars werd opgericht in 2009, maar het verhaal begon vroeger:
                oprichter Filip Maertens laadde zijn eerste auto&apos;s al in 2004.
                Sindsdien bouwden we bijna twintig jaar ervaring op in het veilig
                vervoeren van voertuigen — voor particulieren én bedrijven.
              </p>
              <p>
                We houden het bewust persoonlijk. Bij ons spreekt u rechtstreeks
                met het team, niet met een anoniem callcenter. Die familiale,
                nuchtere aanpak is precies waarom veel klanten telkens opnieuw bij
                ons aankloppen: wie één keer met Mcars rijdt, blijft.
              </p>
              <p>
                Ervaring betekent bij ons vooral rust. We weten hoe we een
                oldtimer zacht laden, hoe we een niet-rijdende wagen veilig op de
                laadvloer krijgen en hoe we een strakke planning heel Europa door
                waarmaken.
              </p>
            </div>
            <div className="mt-8">
              <ArrowButton href="/offerte">Offerte aanvragen</ArrowButton>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-zinc-100">
            <Image
              src="/fleet/dramatic-sky.jpg"
              alt="Mcars autotransporter onderweg"
              width={1200}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <StatRow
            items={[
              { value: "2009", label: "opgericht" },
              { value: "8", label: "vaste chauffeurs" },
              { value: "20+", label: "jaar ervaring" },
            ]}
          />
        </div>
      </section>

      {/* Team & vloot */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="rounded-[2rem] bg-zinc-100 p-6 sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
            <div className="relative overflow-hidden rounded-3xl">
              <Image
                src="/fleet/sunset-parking.jpg"
                alt="De vloot autotransporters van Mcars"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <Eyebrow className="mb-4">Team &amp; voertuigen</Eyebrow>
              <SplitHeading lead="Eigen vloot," trail="vaste chauffeurs." />
              <p className="mt-6 text-base leading-relaxed text-zinc-500">
                We rijden met negen eigen autotransporters, allemaal met
                Kässbohrer-opbouw. Acht vaste chauffeurs kennen hun vrachtwagen,
                hun routes en uw wagen. Nederlandstalig én Franstalig, zodat we
                overal vlot uit de voeten kunnen.
              </p>

              <ul className="mt-8 grid gap-3">
                {fleet.map((f) => (
                  <li
                    key={f.name}
                    className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-zinc-100"
                  >
                    <span className="flex size-11 flex-none items-center justify-center rounded-2xl bg-zinc-950 text-white">
                      <Icon name="truck" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-zinc-950">
                        {f.name}
                      </span>
                      <span className="block text-sm text-zinc-500">{f.note}</span>
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-zinc-950">
                      {f.count}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <StatRow
                  items={[
                    { value: "9", label: "autotransporters" },
                    { value: "8", label: "chauffeurs" },
                    { value: "NL·FR", label: "sprekende chauffeurs" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Werkgebied */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
          <div>
            <Eyebrow className="mb-4">Werkgebied</Eyebrow>
            <SplitHeading lead="Elke week over heel Frankrijk," trail="en verder door Europa." />
            <p className="mt-6 text-base leading-relaxed text-zinc-500">
              Onze niche ligt op de as van België en Nederland richting Frankrijk,
              tot in Noord-Spanje. Elke week rijden we heel Frankrijk door — met
              vaste stops in de stockageparken. Daarnaast zijn we actief in Duitsland,
              Italië, Polen en tot in Scandinavië.
            </p>
            <div className="mt-6 rounded-2xl bg-zinc-100 p-5">
              <p className="text-sm leading-relaxed text-zinc-600">
                Ook actief in: {extraCountries.join(", ")}. Een andere bestemming?
                Vraag het gerust — we staan open voor nieuwe routes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {countries.map((c) => (
              <div
                key={c.name}
                className="flex flex-col items-center gap-3 rounded-2xl bg-zinc-100 p-6 text-center"
              >
                <Image
                  src={c.flag}
                  alt={`Autotransport ${c.name}`}
                  width={120}
                  height={80}
                  className="h-14 w-auto object-contain"
                />
                <span className="text-sm font-semibold text-zinc-950">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verzekerd transport */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-8 py-14 sm:px-14 sm:py-20">
          <div aria-hidden className="dot-grid absolute inset-0 opacity-[0.12]" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
            <div>
              <p className="text-sm font-medium tracking-widest text-white/50 uppercase">
                Verzekerd transport
              </p>
              <h2 className="mt-4 text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
                Uw wagen reist{" "}
                <span className="text-zinc-500">gedekt en gedocumenteerd.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400">
                Elk transport gebeurt verzekerd. Bij ophaling maken we een
                CMR-vrachtbrief op — het document dat de ophaling bevestigt en de
                staat van het voertuig vastlegt. Waar nodig maken we intern foto&apos;s
                als bewijsstuk bij eventuele schade. Zo weet u dat alles correct en
                aantoonbaar verloopt.
              </p>
            </div>
            <ul className="grid gap-3">
              {[
                { icon: "shield" as const, t: "Verzekerd transport", b: "Elk voertuig is gedekt tijdens het volledige traject." },
                { icon: "check" as const, t: "CMR-vrachtbrief", b: "Bevestigt de ophaling en documenteert de staat bij vertrek." },
                { icon: "box" as const, t: "Intern fotobewijs", b: "Foto's dienen als bewijsstuk bij schade — zorgvuldig, niet zichtbaar voor nieuwsgierige blikken." },
              ].map((it) => (
                <li
                  key={it.t}
                  className="flex items-start gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
                >
                  <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-white text-zinc-950">
                    <Icon name={it.icon} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{it.t}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-zinc-400">{it.b}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Waarom kiezen voor ons? */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="mb-10 max-w-2xl sm:mb-14">
          <Eyebrow className="mb-4">Waarom kiezen voor ons?</Eyebrow>
          <SplitHeading lead="Wie één keer met Mcars rijdt," trail="blijft." />
          <p className="mt-6 text-base leading-relaxed text-zinc-500">
            Betrouwbaar, spontaan, transparant en persoonlijk. Vier redenen die
            onze klanten telkens opnieuw aanhalen.
          </p>
        </div>
        <HighlightGrid items={whyItems} />
      </section>

      <QuoteCta />
    </PageShell>
  );
}
