"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cmr, cmrIntro, stappen, werkwijze, werkwijzeFaq, type WorkStep } from "@/data/process";
import { site } from "@/lib/site";
import {
  Chapter,
  ChapterIntro,
  ClipImage,
  FlowButton,
  FlowClose,
  FlowFaq,
  FlowGrid,
  FlowHero,
  FlowPage,
  ImageBridge,
  InlineImageLine,
  Rise,
  StepPath,
  toneClasses,
  useFlowTone,
  type FlowTone,
} from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * "Zo werkt het" as one film. The six steps are the spine of the page:
 *
 *   hero+form → 01 six steps → [bridge / curtain] → 02 CMR → 03 questions → close
 *
 *   01 cinema    light steps (sticky photo) → bridge → dark CMR → light FAQ curtain → dark close
 *   02 wordmark  light StepPath + status grid → paper CMR → light FAQ → dark close
 *   03 lines     dark sticky steps → paper CMR interlude → dark FAQ curtain → dark close
 */

type Version = 1 | 2 | 3;

const TONES: Record<Version, { page: FlowTone; steps: FlowTone; cmr: FlowTone; faq: FlowTone }> = {
  1: { page: "light", steps: "light", cmr: "dark", faq: "light" },
  2: { page: "light", steps: "light", cmr: "paper", faq: "light" },
  3: { page: "dark", steps: "dark", cmr: "paper", faq: "dark" },
};

/** Photos for the CMR chapter — the step photos stay with the steps. */
const CMR_IMAGES = ["/images/generated/pickup-inspection.jpg", "/images/generated/strap-closeup.jpg", "/images/generated/workshop.jpg"];

const pad = (i: number) => String(i + 1).padStart(2, "0");

export default function WerkwijzeFlow({ version }: { version: Version }) {
  const T = TONES[version];
  const formTone = version === 1 ? "glass" : version === 2 ? "light" : "dark";
  const onLight = version === 2;
  const proof = (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${onLight ? "text-zinc-500" : "text-white/70"}`}>
      {werkwijze.badges.map((b, i) => (
        <span key={b} className="flex items-center gap-5">
          {i > 0 && <span aria-hidden>·</span>}
          {b}
        </span>
      ))}
      <span aria-hidden>·</span>
      <span>
        <b className={`font-medium ${onLight ? "text-zinc-950" : "text-white"}`}>{site.reviews.score}/5</b> op Google
      </span>
    </div>
  );

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={version === 1 ? "cinema" : version === 2 ? "wordmark" : "lines"}
        title={werkwijze.title}
        intro={werkwijze.subtitle}
        crumbs={[{ href: "/", label: "Home" }, { label: "Zo werkt het" }]}
        image={version === 2 ? "/images/generated/truck-studio.jpg" : werkwijze.heroImage}
        imageAlt="Een transporter van Mcars onderweg"
        wordmark="STAPPEN"
        lineImages={[stappen[0].image, stappen[4].image]}
        aside={proof}
        form={<QuoteFlow tone={formTone} className="[contain:inline-size]" />}
      />

      {/* 01 — the six steps: the spine of the page */}
      <Chapter n="01" label="Zes stappen" tone={T.steps} >
        {version === 3 ? (
          <InlineImageLine parts={["Zes stappen", { image: stappen[0].image }, "van aanvraag", { image: stappen[2].image }, "tot levering."]} />
        ) : (
          <ChapterIntro
            lead="Zes heldere stappen."
            trail="Van offerte tot levering, zonder verrassingen."
            body="U weet op elk moment waar uw wagen is en wie u kan bellen. Dit is de volgorde die elk transport volgt."
          />
        )}
        <div className="mt-14 sm:mt-20">
          {version === 2 ? (
            <>
              {/* Six cards on one row: titles step down a size and hyphenate so long Dutch words fit */}
              <div lang="nl" className="lg:[&_h3]:text-xl lg:[&_h3]:hyphens-auto lg:[&_h3]:break-words">
                <StepPath steps={stappen.map((s) => ({ title: s.title, body: s.body, tag: s.status }))} />
              </div>
              <StatusGrid steps={stappen} />
            </>
          ) : (
            <StickySteps steps={stappen} />
          )}
        </div>
      </Chapter>

      {version === 1 && (
        <div>
          <ImageBridge src="/images/generated/night-motorway.jpg" alt="" from={T.steps} to={T.cmr} />
        </div>
      )}

      {/* 02 — CMR: why the paperwork protects you */}
      <Chapter n="02" label="CMR-vrachtbrief" tone={T.cmr} curtain={version === 3}>
        <ChapterIntro lead="De CMR-vrachtbrief:" trail="uw zekerheid, zwart op wit." body={cmrIntro} />
        {version === 2 ? (
          <FlowGrid className="mt-12 sm:mt-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
              <ClipImage src={werkwijze.bandImage} alt={werkwijze.bandImageAlt} parallax sizes="(min-width:1024px) 50vw, 100vw" className="aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem]" />
              <CmrList />
            </div>
          </FlowGrid>
        ) : (
          <FlowGrid className="mt-12 sm:mt-16">
            <CmrColumns />
          </FlowGrid>
        )}
      </Chapter>

      {/* 03 — questions */}
      <Chapter n="03" label="Vragen" tone={T.faq} curtain={T.faq !== T.cmr}>
        <ChapterIntro
          lead="Nog vragen?"
          trail="Dit horen we het vaakst."
          action={<FlowButton href="/faq" variant="ghost">Alle vragen</FlowButton>}
        />
        <div className="mt-12 sm:mt-16">
          <FlowFaq items={werkwijzeFaq} />
        </div>
      </Chapter>

      <FlowClose
        lead="Klaar voor stap één?"
        trail="Vraag uw offerte aan."
        form={<QuoteFlow tone="dark" className="[contain:inline-size]" />}
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

/* ------------------------------------------------------------------ */
/* Pinned storytelling: sticky photo that follows the step being read */
/* ------------------------------------------------------------------ */

function StickySteps({ steps }: { steps: WorkStep[] }) {
  const tone = useFlowTone();
  const t = toneClasses(tone);
  const dark = tone === "dark";
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter((el): el is HTMLLIElement => Boolean(el));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }
      },
      // A thin band across the middle of the viewport: whichever step crosses it is "the one being read".
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <FlowGrid>
      {/* Desktop: texts scroll past a pinned photo */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <ol>
          {steps.map((s, i) => {
            const on = active === i;
            return (
              <li
                key={s.title}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-step={i}
                className={`flex min-h-[78svh] flex-col justify-center border-t transition-opacity duration-500 ${t.line} ${on ? "opacity-100" : "opacity-35"}`}
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-[family-name:var(--font-display)] text-7xl leading-none">{pad(i)}</span>
                  <span className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.muted}`}>{s.status}</span>
                </div>
                <h3 className="mt-8 max-w-md text-4xl leading-[1.05] font-light tracking-[-0.035em] text-balance">{s.title}</h3>
                <p className={`mt-5 max-w-md text-lg leading-relaxed ${t.muted}`}>{s.body}</p>
              </li>
            );
          })}
        </ol>
        <div className="relative">
          <div className="sticky top-24 h-[calc(100svh-8rem)] min-h-[30rem]">
            <div className={`relative h-full overflow-hidden rounded-[2rem] ${dark ? "bg-white/[0.04]" : "bg-zinc-100"}`}>
              {steps.map((s, i) => (
                <div
                  key={s.image}
                  aria-hidden={active !== i}
                  className={`absolute inset-0 transition-[opacity,transform,clip-path] duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] ${
                    active === i ? "scale-100 opacity-100 [clip-path:inset(0_round_2rem)]" : "scale-[1.06] opacity-0 [clip-path:inset(6%_round_2rem)]"
                  }`}
                >
                  <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
                </div>
              ))}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-7 text-white">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-white/60 uppercase">Stap {pad(active)} / {pad(steps.length - 1)}</p>
                  <p className="mt-2 text-2xl font-light tracking-[-0.02em]">{steps[active].status}</p>
                </div>
                <ol aria-hidden className="flex gap-1.5">
                  {steps.map((s, i) => (
                    <li key={s.title} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-white" : i < active ? "w-3 bg-white/70" : "w-3 bg-white/25"}`} />
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: stacked steps, each with its own photo */}
      <ol className="space-y-14 sm:space-y-20 lg:hidden">
        {steps.map((s, i) => (
          <li key={s.title}>
            <ClipImage src={s.image} alt={s.imageAlt} sizes="100vw" className="aspect-[4/3] rounded-[1.5rem]" />
            <Rise className="mt-6">
              <div className="flex items-baseline gap-4">
                <span className="font-[family-name:var(--font-display)] text-5xl leading-none">{pad(i)}</span>
                <span className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.muted}`}>{s.status}</span>
              </div>
              <h3 className="mt-4 text-3xl leading-[1.08] font-light tracking-[-0.03em]">{s.title}</h3>
              <p className={`mt-3 text-base leading-relaxed ${t.muted}`}>{s.body}</p>
            </Rise>
          </li>
        ))}
      </ol>
    </FlowGrid>
  );
}

/** v2: the step photos as a Swiss hairline grid of "tracking" statuses. */
function StatusGrid({ steps }: { steps: WorkStep[] }) {
  const tone = useFlowTone();
  const t = toneClasses(tone);
  return (
    <FlowGrid className="mt-20 sm:mt-28">
      <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.faint}`}>Zo leest u de status van uw transport</p>
      <ol className={`mt-6 grid grid-cols-2 border-t border-l sm:grid-cols-3 ${t.line}`}>
        {steps.map((s, i) => (
          <li key={s.title} className={`border-r border-b p-3 sm:p-5 ${t.line}`}>
            <ClipImage src={s.image} alt={s.imageAlt} sizes="(min-width:640px) 30vw, 50vw" className="aspect-[4/3] rounded-[1.25rem]" />
            <p className={`mt-4 font-mono text-[11px] tracking-[0.2em] ${t.faint}`}>{pad(i)}</p>
            <p className="mt-1 text-lg font-light tracking-[-0.02em] sm:text-xl">{s.status}</p>
          </li>
        ))}
      </ol>
    </FlowGrid>
  );
}

/** CMR as three hairline columns with photo (v1 / v3). */
function CmrColumns() {
  const tone = useFlowTone();
  const t = toneClasses(tone);
  return (
    <ol className="grid gap-12 sm:gap-6 md:grid-cols-3">
      {cmr.map((h, i) => (
        <li key={h.title}>
          <Rise delay={i * 90}>
            <ClipImage src={CMR_IMAGES[i]} alt="" sizes="(min-width:768px) 30vw, 100vw" className="aspect-[4/5] rounded-[1.5rem]" />
            <div className={`mt-6 border-t pt-5 ${t.line}`}>
              <span className={`font-mono text-[11px] tracking-[0.2em] ${t.faint}`}>{pad(i)}</span>
              <h3 className="mt-3 text-2xl font-light tracking-[-0.02em]">{h.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${t.muted}`}>{h.body}</p>
            </div>
          </Rise>
        </li>
      ))}
    </ol>
  );
}

/** CMR as a hairline list beside one photo (v2). */
function CmrList() {
  const tone = useFlowTone();
  const t = toneClasses(tone);
  return (
    <ol className={`border-t ${t.line}`}>
      {cmr.map((h, i) => (
        <li key={h.title} className={`border-b ${t.line}`}>
          <Rise delay={i * 90} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 py-7">
            <span className={`pt-2 font-mono text-[11px] tracking-[0.2em] ${t.faint}`}>{pad(i)}</span>
            <div>
              <h3 className="text-2xl font-light tracking-[-0.02em]">{h.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${t.muted}`}>{h.body}</p>
            </div>
          </Rise>
        </li>
      ))}
    </ol>
  );
}
