import Image from "next/image";
import Link from "next/link";
import { defaultPriceFactors, defaultSafety } from "@/data/service-details";
import type { ServicePageData } from "@/lib/service-page";
import { site } from "@/lib/site";
import {
  Bento,
  Cell,
  Chapter,
  ChapterIntro,
  ClipImage,
  Figures,
  FlowButton,
  FlowClose,
  FlowFaq,
  FlowGrid,
  FlowHero,
  FlowPage,
  ImageBridge,
  IndexRow,
  InlineImageLine,
  Rise,
  StepPath,
  type FlowTone,
} from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * Service page as one composed film — the REFERENCE implementation of the
 * flow kit. All three design versions tell the same story in the same order:
 *
 *   hero+form → 01 why → 02 situations → [bridge] → 03 route (dark) →
 *   04 price → 05 practice → 06 questions → close (dark, form again)
 *
 * The versions differ in hero composition and tone rhythm, never in story:
 *   01 cinema    light → paper → dark curtain → light → dark close
 *   02 wordmark  light / paper only, hairline Swiss rhythm, one dark close
 *   03 lines     dark throughout, one paper interlude for breath
 */

type Version = 1 | 2 | 3;

const TONES: Record<Version, { page: FlowTone; why: FlowTone; situations: FlowTone; route: FlowTone; price: FlowTone; practice: FlowTone; faq: FlowTone }> = {
  1: { page: "light", why: "light", situations: "paper", route: "dark", price: "light", practice: "light", faq: "paper" },
  2: { page: "light", why: "light", situations: "light", route: "paper", price: "light", practice: "paper", faq: "light" },
  3: { page: "dark", why: "dark", situations: "dark", route: "dark", price: "paper", practice: "dark", faq: "dark" },
};

export default function ServiceFlow({ data, version }: { data: ServicePageData; version: Version }) {
  const { service, process, detailImage, detailAlt, details, practiceCase, situationsImage, safetyImage, safetyAlt, faq, related } = data;
  const T = TONES[version];
  const formTone = version === 1 ? "glass" : version === 2 ? "light" : "dark";
  const priceFactors = details.priceFactors ?? defaultPriceFactors;
  const safety = details.safetyFocus ? [details.safetyFocus, ...defaultSafety.slice(0, 3)] : defaultSafety;
  const crumbs = [{ href: "/", label: "Home" }, { href: "/diensten", label: "Diensten" }, { label: service.nav }];
  const proof = (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${version === 2 ? "text-zinc-500" : "text-white/70"}`}>
      <span><b className={version === 2 ? "font-medium text-zinc-950" : "font-medium text-white"}>{site.reviews.score}/5</b> op Google</span>
      <span aria-hidden>·</span>
      <span>Antwoord binnen 24 uur</span>
      <span aria-hidden>·</span>
      <span>CMR bij elke ophaling</span>
    </div>
  );

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={version === 1 ? "cinema" : version === 2 ? "wordmark" : "lines"}
        title={service.title}
        intro={service.subtitle}
        crumbs={crumbs}
        image={version === 2 ? "/images/generated/truck-studio.jpg" : service.heroImage}
        imageAlt={`${service.nav} door Mcars`}
        wordmark={service.nav.split(" ").pop()}
        lineImages={[detailImage, situationsImage]}
        aside={proof}
        form={<QuoteFlow tone={formTone} service={service.nav} />}
      />

      {/* 01 — why: intro statement + bento of highlights around the detail photo */}
      <Chapter n="01" label="Waarom Mcars" tone={T.why}>
        <ChapterIntro lead={service.intro} />
        <div className="mt-14 sm:mt-20">
          <Bento>
            <Cell image={detailImage} alt={detailAlt} eyebrow={service.category} title={service.highlights[0]?.title} body={service.highlights[0]?.body} />
            {service.highlights.slice(1, 3).map((h) => (
              <Cell key={h.title} eyebrow="Inbegrepen" title={h.title} body={h.body} />
            ))}
            <Cell dark eyebrow="Google reviews" title={`${site.reviews.score}/5`} body={`${site.reviews.count} reviews · ${site.reviews.clients} tevreden klanten`} />
            <Cell image={safetyImage} alt={safetyAlt} eyebrow="Vloot & veiligheid" title={safety[0].title} body={safety[0].body} />
          </Bento>
        </div>
      </Chapter>

      {/* 02 — recognisable situations as an index */}
      <Chapter n="02" label="Herkenbaar?" tone={T.situations}>
        <ChapterIntro lead="Herkent u zich" trail="in een van deze situaties?" body="Dit zijn de momenten waarop klanten ons bellen. Herkent u de uwe? Dan weet u meteen wat we voor u regelen." />
        <div className="mt-12 sm:mt-16">
          <IndexRow items={details.situations.map((s) => ({ title: s.title, body: `${s.desc} ${s.body}` }))} />
        </div>
      </Chapter>

      {/* Bridge: the photo carries the eye into the dark chapter */}
      <div>
        <ImageBridge src={situationsImage} alt="" from={T.situations} to={T.route} />
      </div>

      {/* 03 — the route itself: connected steps */}
      <Chapter n="03" label="Werkwijze" tone={T.route}>
        {version === 3 ? (
          <InlineImageLine parts={["Van aanvraag", { image: "/images/generated/pickup-inspection.jpg" }, "tot levering,", { image: "/images/generated/key-handover.jpg" }, "zonder omwegen."]} />
        ) : (
          <ChapterIntro lead="Van aanvraag tot levering," trail="helder en zonder omwegen." body="U weet op elk moment wat er gebeurt en wie u kan bellen." action={<FlowButton href="/hoe-werkt-het" variant="ghost">Zo werkt het</FlowButton>} />
        )}
        <div className="mt-14 sm:mt-20">
          <StepPath steps={process.map((p) => ({ title: p.title, body: p.body }))} />
        </div>
        <div className="mt-20 sm:mt-28">
          <Figures items={[
            { value: "9", label: "Eigen transporters" },
            { value: "8", label: "Vaste chauffeurs" },
            { value: String(site.founded), label: "Sinds" },
            { value: "24u", label: "Antwoord op uw aanvraag" },
          ]} />
        </div>
      </Chapter>

      {/* 04 — price factors (no prices — client policy) */}
      <Chapter n="04" label="Wat bepaalt de prijs" tone={T.price} curtain={T.price !== T.route}>
        <ChapterIntro lead="Elke prijs is maatwerk." trail="Dit zijn de factoren die meetellen." body="We werken niet met een calculator: u krijgt binnen 24 uur een persoonlijke prijs, afgestemd op uw transport." />
        <FlowGrid className="mt-12 sm:mt-16">
          <ol className={`grid border-t sm:grid-cols-2 lg:grid-cols-3 ${T.price === "dark" ? "border-white/12" : "border-zinc-200"}`}>
            {priceFactors.map((f, i) => (
              <Rise key={f.title} delay={(i % 3) * 80} className={`border-b py-8 sm:pr-8 ${T.price === "dark" ? "border-white/12" : "border-zinc-200"}`}>
                <span className="font-mono text-[11px] tracking-[0.2em] text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-2xl font-light tracking-[-0.02em]">{f.title}</h3>
                <p className={`mt-2 max-w-sm text-sm leading-relaxed ${T.price === "dark" ? "text-white/55" : "text-zinc-500"}`}>{f.body}</p>
              </Rise>
            ))}
          </ol>
        </FlowGrid>
      </Chapter>

      {/* 05 — from practice: one case as a cinematic split */}
      {practiceCase && (
        <Chapter n="05" label="Uit de praktijk" tone={T.practice} curtain={T.practice !== T.price}>
          <FlowGrid>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
              <ClipImage src={practiceCase.image} alt={practiceCase.imageAlt} parallax sizes="(min-width:1024px) 55vw, 100vw" className="aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem]" />
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-zinc-400 uppercase">{practiceCase.tag}</p>
                <h2 className="mt-5 text-3xl leading-[1.06] font-light tracking-[-0.035em] text-balance sm:text-5xl">{practiceCase.title}</h2>
                <p className={`mt-6 text-base leading-relaxed sm:text-lg ${T.practice === "dark" ? "text-white/60" : "text-zinc-500"}`}>{practiceCase.body}</p>
                <div className="mt-8">
                  <FlowButton href={`/cases/${practiceCase.slug}`} variant="ghost">Lees de case</FlowButton>
                </div>
              </div>
            </div>
          </FlowGrid>
        </Chapter>
      )}

      {/* 06 — questions, then related as a slim photo rail */}
      <Chapter n="06" label="Vragen" tone={T.faq} curtain={T.faq !== T.practice}>
        <ChapterIntro lead="Veelgestelde vragen" trail={`over ${service.nav.toLowerCase()}.`} />
        <div className="mt-12 sm:mt-16">
          <FlowFaq items={faq} />
        </div>
        <FlowGrid className="mt-24 sm:mt-32">
          <p className="font-mono text-[11px] tracking-[0.2em] text-zinc-400 uppercase">Verder op de route</p>
          <ul className="-mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.href} className="w-[78%] flex-none snap-start sm:w-auto">
                <Link href={r.href} className="group relative block aspect-[4/5] overflow-hidden rounded-[1.25rem]">
                  <Image src={r.image} alt="" fill sizes="(min-width:1024px) 22vw, 78vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">{r.meta}</span>
                    <span className="mt-1 block text-xl font-light tracking-[-0.02em]">{r.label}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </FlowGrid>
      </Chapter>

      <FlowClose
        form={<QuoteFlow tone="dark" service={service.nav} />}
        contact={
          <dl className="grid gap-5 text-sm sm:grid-cols-2">
            <div><dt className="text-white/40">Rechtstreeks bellen</dt><dd className="mt-1"><a href={site.phoneHref} className="inline-block py-2 text-lg text-white">{site.phone}</a></dd></div>
            <div><dt className="text-white/40">Mailen</dt><dd className="mt-1"><a href={`mailto:${site.email}`} className="inline-block py-2 text-lg text-white">{site.email}</a></dd></div>
          </dl>
        }
      />
    </FlowPage>
  );
}
