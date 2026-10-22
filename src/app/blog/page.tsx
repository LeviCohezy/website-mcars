import type { Metadata } from "next";
import Image from "next/image";
import { posts } from "@/components/blog-grid";
import { QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { Eyebrow, SectionHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Blog & kennisbank | Mcars",
  description:
    "Tips en uitleg over autotransport: kosten, import uit Duitsland, transport binnen Europa, depannage, niet-rijdende wagens en documenten.",
};

const topics = [
  "Wat kost autotransport?",
  "Auto importeren uit Duitsland",
  "Auto vervoeren van Nederland naar België",
  "Pech of ongeval: wat nu?",
  "Niet-rijdende auto transporteren",
  "Documenten bij auto-import",
  "Autotransport voor dealers",
];

export default function BlogPage() {
  const [lead, ...more] = posts;

  return (
    <PageShell>
      <PageHero
        eyebrow="Kennisbank"
        title="Kennis uit de cabine."
        subtitle="Praktische tips en heldere uitleg over autotransport, geschreven door mensen die er elke dag mee op de baan zitten."
        crumbs={[{ label: "Blog" }]}
        image="/fleet/barcelona-palms.jpg"
        badges={[{ label: "Om de twee weken nieuw" }]}
        primaryCta={{ label: "Offerte", href: "/offerte" }}
      />

      {/* Latest */}
      <Section space="loose" id="blog">
        <SectionHeader label="Laatste artikels" index={String(posts.length).padStart(2, "0")} lead="Recent geschreven," trail="door wie er elke dag rijdt." className="mb-16" />

        <Reveal>
          <a href={lead.href} className="group grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-14">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-zinc-100">
              <Image
                src={`/services/${lead.img}.jpg`}
                alt=""
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03]"
              />
            </div>
            <div className="border-t border-zinc-950 pt-6">
              <p className="flex justify-between text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">
                <span>{lead.tag}</span>
                <span className="tracking-normal normal-case">{lead.date}</span>
              </p>
              <h2 className="mt-6 text-3xl font-medium leading-[1.1] tracking-[-0.025em] text-zinc-950 sm:text-4xl">{lead.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-zinc-500">{lead.excerpt}</p>
              <span className="mt-8 inline-flex items-center gap-2 border-b border-zinc-950 pb-1 text-sm font-medium text-zinc-950">
                Lees het artikel
              </span>
            </div>
          </a>
        </Reveal>

        <ul className="mt-20 border-t border-zinc-950">
          {more.map((p, i) => (
            <Reveal as="li" key={p.href} delay={i * 60} className="border-b border-zinc-200">
              <a href={p.href} className="group grid items-center gap-5 py-6 sm:grid-cols-[8rem_1fr_auto] sm:gap-10">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100">
                  <Image src={`/services/${p.img}.jpg`} alt="" fill sizes="128px" className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">
                    {p.tag} <span className="tracking-normal normal-case">· {p.date}</span>
                  </p>
                  <h3 className="mt-2 text-xl font-medium tracking-tight text-zinc-950 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:translate-x-1 sm:text-2xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-zinc-500">{p.excerpt}</p>
                </div>
                <span className="hidden size-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors duration-300 group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white sm:flex">
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Topics */}
      <Section space="none">
        <div className="grid gap-8 border-t border-zinc-200 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Eyebrow>Binnenkort</Eyebrow>
          <div>
            <h2 className="text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl">
              Waar we over schrijven <span className="text-zinc-400">— voor particulier en handelaar.</span>
            </h2>
            <ul className="mt-10 grid border-t border-zinc-200 sm:grid-cols-2 sm:gap-x-10">
              {topics.map((t, i) => (
                <li key={t} className="flex items-baseline gap-5 border-b border-zinc-200 py-4">
                  <span className="w-6 text-xs tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-base text-zinc-800">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <QuoteCta />
    </PageShell>
  );
}
