import Image from "next/image";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { StatRow, QuoteCta } from "@/components/blocks";
import { Parallax, Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { SectionHeader } from "@/components/ui";
import { cases } from "@/data/cases";

export const metadata = {
  title: "Cases & realisaties | Mcars",
  description:
    "Een greep uit uitgevoerde transporten van Mcars: van oldtimerritten en importwagens tot niet-rijdende voertuigen en Europees bedrijfstransport. Anoniem, maar echt.",
};



export default function CasesPage() {
  const [featured, ...rest] = cases;
  return (
    <PageShell>
      <PageHero
        eyebrow="Realisaties"
        title="Uitgevoerde transporten."
        subtitle="Een greep uit ritten voor particulieren en bedrijven — van klassiekers tot volledige handelaarsvoorraden. Anoniem, maar écht gereden."
        crumbs={[{ label: "Cases" }]}
        image="/fleet/city-loaded.jpg"
        badges={[{ label: `${cases.length} cases` }, { label: "Particulier & zakelijk" }]}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      <Section space="loose">
        <SectionHeader
          label="Cases"
          index={String(cases.length).padStart(2, "0")}
          lead="Elke rit is anders,"
          trail="de aanpak blijft dezelfde."
          intro="Uit respect voor onze klanten houden we alle cases anoniem — geen namen, wel het echte verhaal."
          className="mb-16"
        />

        {/* Featured case */}
        <Reveal>
          <article className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-14">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-zinc-100">
              <Parallax speed={0.06} className="absolute inset-x-0 -top-[15%] h-[130%]">
                <Image src={featured.image} alt={featured.title} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              </Parallax>
            </div>
            <div className="border-t border-zinc-950 pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{featured.tag}</p>
                <span className="text-xs tabular-nums text-zinc-400">01</span>
              </div>
              <h2 className="mt-6 text-3xl font-medium leading-[1.1] tracking-[-0.025em] text-zinc-950 sm:text-4xl">{featured.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-zinc-500">{featured.body}</p>
            </div>
          </article>
        </Reveal>

        <div className="mt-24 grid gap-x-6 gap-y-16 md:grid-cols-2">
          {rest.map((c, i) => {
            const wide = rest.length % 2 === 1 && i === rest.length - 1;
            return (
            <Reveal key={c.title} delay={(i % 2) * 100} className={wide ? "md:col-span-2" : ""}>
              <article className="group">
                <div className={`relative overflow-hidden rounded-[2rem] bg-zinc-100 ${wide ? "aspect-[4/3] md:aspect-[21/9]" : "aspect-[4/3]"}`}>
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes={wide ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-zinc-200 pt-4">
                  <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{c.tag}</p>
                  <span className="text-xs tabular-nums text-zinc-400">{String(i + 2).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-4 text-2xl font-medium tracking-tight text-zinc-950">{c.title}</h3>
                <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-zinc-500">{c.body}</p>
              </article>
            </Reveal>
            );
          })}
        </div>
      </Section>

      <Section space="none">
        <SectionHeader label="Impact" lead="Wat we dagelijks" trail="waarmaken." className="mb-12" />
        <div className="grid lg:grid-cols-[1fr_3fr] lg:gap-10">
          <div className="hidden lg:block" />
          <StatRow
            items={[
              { value: "3000+", label: "Tevreden klanten" },
              { value: "20+", label: "Jaar ervaring" },
              { value: "Wekelijks", label: "In heel Frankrijk" },
            ]}
          />
        </div>
      </Section>

      <QuoteCta />
    </PageShell>
  );
}
