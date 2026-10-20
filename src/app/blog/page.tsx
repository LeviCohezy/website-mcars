import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { HorizontalRail, TypeMarquee } from "@/components/signature";
import { Eyebrow, SectionHeader } from "@/components/ui";
import VariantSwitcher from "@/components/variant-switcher";
import { blogCategories, blogMetadata, formatDate, readingTime, sortedArticles } from "@/data/blog";

// Blog 01 — cinematic. Same content as /blog/v2 and /blog/v3, different design.
export const metadata: Metadata = blogMetadata;

export default function BlogPage() {
  const [lead, ...more] = sortedArticles;

  return (
    <PageShell>
      <PageHero
        eyebrow="Kennisbank"
        title="Kennis uit de cabine."
        subtitle="Praktische tips en heldere uitleg over autotransport, geschreven door mensen die er elke dag mee op de baan zitten."
        crumbs={[{ label: "Blog" }]}
        image="/fleet/barcelona-palms.jpg"
        badges={[{ label: `${sortedArticles.length} artikels` }]}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* Latest */}
      <Section space="loose" id="blog">
        <SectionHeader label="Laatste artikels" index={String(sortedArticles.length).padStart(2, "0")} lead="Recent geschreven," trail="door wie er elke dag rijdt." className="mb-16" />

        <Reveal>
          <Link href={`/blog/${lead.slug}`} className="group grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-14">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-zinc-100">
              <Image
                src={lead.image}
                alt={lead.imageAlt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03]"
              />
            </div>
            <div className="border-t border-zinc-950 pt-6">
              <p className="flex justify-between text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">
                <span>{lead.category}</span>
                <span className="tracking-normal normal-case">{formatDate(lead.date)} · {readingTime(lead)} min</span>
              </p>
              <h2 className="mt-6 text-3xl font-medium leading-[1.1] tracking-[-0.025em] text-balance text-zinc-950 sm:text-4xl">{lead.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-zinc-500">{lead.excerpt}</p>
              <span className="mt-8 inline-flex items-center gap-2 border-b border-zinc-950 pb-1 text-sm font-medium text-zinc-950">
                Lees het artikel
              </span>
            </div>
          </Link>
        </Reveal>

      </Section>

      {/* More articles — dark band, cards travel sideways while you scroll */}
      <Section space="none" bleed>
        <div className="overflow-clip rounded-[2rem] bg-zinc-950 px-5 py-16 sm:px-8 lg:px-10 lg:py-0">
          <HorizontalRail
            items={more.map((p) => ({
              title: p.title,
              body: p.excerpt,
              image: p.image,
              alt: p.imageAlt,
              href: `/blog/${p.slug}`,
              meta: `${p.category} · ${readingTime(p)} min`,
            }))}
            heading={
              <div className="flex flex-col gap-4 text-white sm:flex-row sm:items-end sm:justify-between">
                <h2 className="max-w-2xl pt-16 text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-balance sm:text-4xl lg:pt-20">
                  Meer uit de kennisbank <span className="text-white/40">— {more.length} artikels.</span>
                </h2>
                <p className="text-sm text-white/50">Scroll verder om alles te zien</p>
              </div>
            }
          />
        </div>
      </Section>

      {/* Topics — running band, then the index */}
      <Section space="loose" bleed>
        <TypeMarquee
          words={blogCategories}
          images={["/images/generated/truck-studio.jpg", "/images/generated/depot-night.jpg", "/fleet/valley-sunset.jpg", "/images/generated/workshop.jpg"]}
          speed={60}
        />
      </Section>

      <Section space="none">
        <div className="grid gap-8 border-t border-zinc-200 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Eyebrow>Onderwerpen</Eyebrow>
          <div>
            <h2 className="text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-balance text-zinc-950 sm:text-4xl">
              Waar we over schrijven <span className="text-zinc-400">— voor particulier en handelaar.</span>
            </h2>
            <ul className="mt-10 grid border-t border-zinc-200 sm:grid-cols-2 sm:gap-x-10">
              {blogCategories.map((c, i) => {
                const n = sortedArticles.filter((a) => a.category === c).length;
                return (
                  <li key={c} className="border-b border-zinc-200">
                    <div className="flex items-baseline gap-5 py-4">
                      <span className="w-6 text-xs tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 text-base text-zinc-800">{c}</span>
                      <span className="text-xs tabular-nums text-zinc-400">{n} {n === 1 ? "artikel" : "artikels"}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Section>

      <QuoteCta />
      <VariantSwitcher sectionId="blog" />
    </PageShell>
  );
}
