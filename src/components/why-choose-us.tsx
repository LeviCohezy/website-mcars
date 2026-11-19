import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";

// Paperwork, insurance and transport documents: Mcars handles all of it
// (see docs/mcars-website-intake-briefing.md).
const points = ["cmr", "inspection", "pod", "insured", "noHassle"] as const;

function Check() {
  return (
    <span className="flex size-7 flex-none items-center justify-center rounded-full bg-zinc-950 text-white">
      <svg
        className="size-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 12.5l5 5 10-11" />
      </svg>
    </span>
  );
}

export default function WhyChooseUs() {
  const t = useTranslations("WhyChooseUs");
  return (
    <section
      id="waarom"
      className="relative z-20 -mx-2 min-h-[100svh] bg-white lg:sticky lg:top-0 lg:h-[100svh]"
    >
      {/* Full-bleed white section: slides over the pinned map until it covers
          it (at least one screen tall). On desktop it then stays put (sticky)
          while the sections after it (z-30 in page.tsx) slide over it. */}
      <div className="grid min-h-[100svh] items-center gap-10 px-7 py-16 sm:px-10 sm:py-20 lg:h-full lg:grid-cols-2 lg:gap-16 lg:py-12">
        {/* Left: square aerial shot of the Mcars transporter */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-200 lg:max-w-[calc(100svh-6rem)] lg:justify-self-start">
          <video
            src={asset("/good_but_make_him_drive_faster.mp4")}
            aria-hidden
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full scale-[1.35] object-cover object-[center_35%]"
          />
        </div>

        {/* Right: title and USPs, one under the other */}
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-medium tracking-widest text-zinc-400 uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl font-medium leading-[1.15] tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">
            {t.rich("title", { muted: (c) => <span className="text-zinc-400">{c}</span> })}
          </h2>

          <ul className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200 sm:mt-10">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-4 py-4 sm:py-5 lg:py-4">
                <Check />
                <div>
                  <p className="text-lg font-medium tracking-tight text-zinc-950 sm:text-xl">
                    {t(`points.${point}.title`)}
                  </p>
                  <p className="mt-1 text-base leading-relaxed text-zinc-500 lg:[@media(max-height:760px)]:hidden">
                    {t(`points.${point}.text`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="#offerte"
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-zinc-950 py-3.5 pr-7 pl-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 sm:mt-10"
          >
            <svg
              className="size-5 transition-transform duration-300 motion-safe:group-hover:rotate-90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            {t("cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
